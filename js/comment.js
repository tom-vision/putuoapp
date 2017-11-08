var comment = '';

//预加载页面
mui.init({
	beforeback: function() {
		comment.comments = []
	}
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
			bHaveMore: true
		},
		beforeCreate: function(){
		},
		created: function() {
			this.userInfo = _load(_get('userInfo'));
			if(articleId == 0){
				articleId = _get('newsId');
				this.getComments();
			}
		},
		methods: {
			changeLiked: function(i) {
				_tell(i)
				var self = this;

				if(self.userInfo == '') return mui.toast("请先在个人中心登录");
	
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
	
				if(self.userInfo == '') return mui.toast("请先在个人中心登录");
				if('' == self.content) return mui.toast("请填写评论内容");
	
				_callAjax({
					cmd: "exec",
					sql: "insert into comments(content, articleId, userId) values(?,?,?)",
					vals: _dump([self.content, articleId, self.userInfo.id])
				}, function(d) {
					if(d.success) {
						mui.toast("发表成功");
						location.reload();
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
						return self.bHaveMore = false;
					} else {
						d.data.forEach(function(r) {
							r.liked = false;
							//已登录状况下获取个人对，每条评论的点赞情况
							if(self.userInfo!= '') {
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
							_tell(self.comments)
						});
					}
				});
			}
		}
	})
	
	//添加newId自定义事件监听
	window.addEventListener('newsId', function(event) {
		//获得事件参数
		articleId = _get('newsId');
		console.log(articleId);
		comment.getComments();
	})
}

// 判断扩展API是否准备，否则监听'plusready'事件
if(window.plus) {
	plusReady();
} else {
	document.addEventListener('plusready', plusReady, false);
}