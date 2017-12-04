var comment = '';

//预加载页面
mui.init({
	beforeback: function() {
		comment.comments = []
	},
});

// 扩展API加载完毕，现在可以正常调用扩展API
function plusReady() {
	var articleId = 0;
	
	comment = new Vue({
		el: '#comment',
		data: {
			content: '',
			comments: [], //评论
			userInfo: '',
			bHaveMore: true,
			cmtCtrl: false
		},
		created: function() {
			if(articleId == 0){
				articleId = _get('newsId');
				this.getComments();
			}
		},
		methods: {
			changeLiked: function(i) {
				_tell(i)
				var self = this;
				self.userInfo = _load(_get('userInfo'));
				if(self.userInfo == '' || self.userInfo == null) {
					mui.toast("请先在个人中心登录");
					
					openWindow('login.html', 'login');
					
					return;
				} 
	
				i.liked = !i.liked;
	
				//喜欢
				if(i.liked) {
					_callAjax({
						cmd: "exec",
						sql: "insert into comment_praises(userId, commentId) values(?,?)",
						vals: _dump([self.userInfo.id, i.id])
					}, function(d) {
						if(d.success) {
							i.zan++;
						}
					});
				} else {
					//取消
					_callAjax({
						cmd: "exec",
						sql: "delete from comment_praises where commentId = ? and userId = ?",
						vals: _dump([i.id, self.userInfo.id])
					}, function(d) {
						if(d.success) {
							i.zan--;
						}
					});
				}
			},
			//发表评论
			publish: function() {
				var self = this;
				self.userInfo = _load(_get('userInfo'));
				if(self.userInfo == '' || self.userInfo == null) {
					mui.toast("请先在个人中心登录");
					return openWindow('login.html', 'login');
				}
				if('' == self.content) return mui.toast("请填写评论内容");
								
				var illegalWords = _load(_get('illegal'));
				if(!!illegalWords) {
					for (var i=0; i<illegalWords.length; i++) {
						var word = illegalWords[i].content;
						self.content = self.content.replaceAll(word,'**');
					}
				}
				
				var ifValid = self.cmtCtrl? -1: 1;
				
				_callAjax({
					cmd: "exec",
					sql: "insert into comments(content, articleId, userId, ifValid) values(?,?,?,?)",
					vals: _dump([self.content, articleId, self.userInfo.id, ifValid])
				}, function(d) {
					if(d.success) {
						self.cmtCtrl ? mui.toast('您的评论将在审核后显示') : mui.toast("发表成功");
						setTimeout(function() {
							location.reload();	
						}, 500)
					}
				});
			},
			getComments: function() {
				var self = this;
				var f = 10e5;
				if(self.comments.length) {
					f = _at(self.comments, -1).id;
				}
				_callAjax({
					cmd: "fetch",
					sql: "select c.id, c.content, strftime('%Y-%m-%d %H:%M', c.logtime) as logtime, count(p.id) as zan, u.name, u.img from comments c left outer join User u on c.userId = u.id left outer join comment_praises p on c.id=p.commentId where c.ifValid=1 and c.articleId = ? and c.id < ? group by c.id order by c.logtime desc limit 5",
					vals: _dump([articleId, f])
				}, function(d) {
					if(!d.success || !d.data) {
						mui.toast('评论已全部加载完毕');
						return self.bHaveMore = false;
					} else {
						d.data.forEach(function(r) {
							r.liked = false;
							//已登录状况下获取个人对，每条评论的点赞情况
							if(self.userInfo!= null) {
								_callAjax({
									cmd: "fetch",
									sql: "select * from comment_praises where userId=? and commentId = ? ",
									vals: _dump([self.userInfo.id, r.id])
								}, function(d) {
									if(d.success && d.data){
										r.liked = true;
									}
								});
							}
							self.comments.push(r);
						});
					}
				});
			},
			
			getCmtCtrl:function(){
				var self = this;
				
				//评论审核开关
				_callAjax({
					cmd: "fetch",
					sql: "select cmtctrl from system"
				}, function(d) {
					if(d.success && d.data) {
						self.cmtCtrl = d.data[0].cmtctrl==1? true: false;
					}
				});
			}

		}
	})
	
	//添加newId自定义事件监听
	window.addEventListener('newsId', function(event) {
		//获得事件参数
		articleId = _get('newsId');
		comment.userInfo = _load(_get('userInfo'));
		comment.getComments();
		comment.getCmtCtrl();
		
//		var dragger = new DragLoader(document.getElementsByClassName('main')[0], {    
//	        dragDownThreshold:60,/*向下滑动区域*/    
//	        dragUpThreshold:100,/*向上滑动区域*/    
//	        dragDownRegionCls: 'DownRefresh',/*向下滑动样式*/    
//	        dragUpRegionCls: 'UpRefresh',/*向上滑动样式*/    
//	        disableDragDown: true,    
//	  
//	        /*[主要code]向上滑动时的状态显示*/    
//	        dragUpHelper: function(status) {    
//	            if (status == 'default') {    
//	                $('.up-refresh-text').html('<span class="up-refresh-ico"></span>上拉有惊喜');    
//	            } else if (status == 'prepare') {    
//	                $('.up-refresh-text').html('<span class="up-refresh-ico"></span>赶紧松开');    
//	            } else if (status == 'load') {    
//	                $('.up-refresh-text').html('<span class="loading-img"></span>挤挤挤...');    
//	            }    
//	        }
//	    });  
//	    
//      dragger.on('dragUpLoad', function() {
//      	comment.getComments();
//	        dragger.reset();   
//	    }); 
	})
}

// 判断扩展API是否准备，否则监听'plusready'事件
if(window.plus) {
	plusReady();
} else {
	document.addEventListener('plusready', plusReady, false);
}