var newsDetail;
//预加载页面
mui.init({
	preloadPages: [{
		url: 'comment.html',
		id: 'comment',
	}],
	beforeback: function() {
		// 页面返回前关闭所有视频播放
		$('video').each(function() {
			$(this)[0].pause();
		})
		$('body').animate({scrollTop:0})
		newsDetail.newsData = {}
	}
});

// 扩展API加载完毕，现在可以正常调用扩展API
function plusReady() {
	var articleId = 0;
	var userInfo = _load(_get('userInfo'));
	
	newsDetail = new Vue({
		el: '#detail',
		data: {
			newsData: {}, //内容
			like: false,
			likeNum: 0, //点赞数
			showread: 0
		},
		methods: {
			//阅读量+1
			addReadCnt: function(){
				var self = this;
				
				var count = parseInt(self.newsData.readcnt) + 1;
				console.log(self.newsData.readcnt);
				console.log("count="+count);
				_callAjax({
					cmd: "exec",
					sql: "update articles set readcnt = ? where id = ?",
					vals: _dump([count, articleId])
				}, function(d) {
					
				})
			},
			changeLike: function() {
				var self = this;
				userInfo = _load(_get('userInfo'));
				
				if(userInfo == '' || userInfo == null){
					mui.toast("请先在个人中心登录");
					openWindow('login.html', 'login');
					return;
				}else{
					self.like = !self.like;
					//喜欢
					if(self.like) {
						_callAjax({
							cmd: "exec",
							sql: "insert into article_praises(userId, articleId) values(?,?)",
							vals: _dump([userInfo.id, articleId])
						}, function(d) {
							if(d.success){
								self.likeNum ++;
							}
						});
					}else {
						//取消
						_callAjax({
							cmd: "exec",
							sql: "delete from article_praises where articleId = ? and userId = ?",
							vals: _dump([articleId, userInfo.id])
						}, function(d) {
							if(d.success){
								self.likeNum --;
							}
						});
					}
				}
			},
			shareSystem: function(type, i, e) {
				share(type, i.id, i.title, i.img , e)
			}
		},
	})
	
	var ad = new Vue({
		el: '.inner-ad',
		data: {
			firstAd: {} //广告
		},
		methods: {
			gotoFirstAd: function(){
				$('video').each(function() {
					$(this)[0].pause();
				})
				
				adFun(this.firstAd);
			}
		},
		created: function (){
			var self = this;
			
			//获取广告
			_callAjax({
				cmd: "fetch",
				sql: "select id, title, img, url, reference as type, ifValid from articles where linkerId = 119 order by id desc limit 3"
			}, function(d) {
				if(d.success && d.data) {
					self.firstAd = d.data[d.data.length-1];
					console.log("广告"+_dump(self.firstAd));
				}
			});
		}
	})
	
	var hotComment = new Vue({
		el: '#comment',
		data: {
			comments: [],
			allCommentsLength: ''
		},
		methods: {
			goComment: function() {
				$('video').each(function() {
					$(this)[0].pause();
				})
				var detailPage = null;
				//获得评论页面
				if(!detailPage) {
					detailPage = plus.webview.getWebviewById('comment');
				}
				//触发评论页面的newsId事件
				mui.fire(detailPage, 'newsId', {});
				openWindow('comment.html', 'comment');
			}
		}
	})
	
	var getInfo = function() {
		//获得事件参数
		articleId = _get('newsId');
		
		//根据id向服务器请求新闻详情
		userInfo = _load(_get('userInfo'));
		
		_callAjax({
			cmd: "fetch",
			sql: "select id, title, content, img, url, linkerId, reporter, newsdate, brief, readcnt from articles where ifValid = 1 and id = " + articleId
		}, function(d) {
			if(d.success && d.data) {
				if(d.data.length == 0) return mui.back();
				newsDetail.newsData = d.data[0];

				//视频加poster
				var poster = d.data[0].content;
				poster = poster.replace(/controls=""/,  'controls poster="' + d.data[0].img + '"');

				newsDetail.newsData.content = poster;

				//文章阅读量+1
				newsDetail.addReadCnt();
			}
		});
	
		//获取文章点赞数
		_callAjax({
			cmd: "fetch",
			sql: "select count(*) as total from article_praises where articleId = " + articleId
		}, function(d) {
			if(d.success && d.data) {
				newsDetail.likeNum = d.data[0].total;
			}
		});
	
		//本人是否点赞
		if(userInfo != null) {
			_callAjax({
				cmd: "fetch",
				sql: "select * from article_praises where articleId = " + articleId + " and userId = " + userInfo.id
			}, function(d) {
				if(d.success && d.data) {
					newsDetail.like = true;
				}else{
					newsDetail.like = false;
				}
			});
		}
	
		//获取文章热门评论
		hotComment.comments = [];
		
		_callAjax({
			cmd: "fetch",
			sql: "select c.content, strftime('%Y-%m-%d %H:%M', c.logtime) as logtime, count(p.id) as count, u.name, u.img from comments c left outer join comment_praises p on c.id=p.commentId " +
				"left outer join User u on c.userId = u.id " +
				"where c.ifValid=1 and c.articleId = ? group by c.articleId order by count desc",
			vals: _dump([articleId])
		}, function(d) {
			if(d.success && d.data) {
				hotComment.comments = d.data;
			}
		});
		
		//获取全部评论
		_callAjax({
			cmd: "fetch",
			sql: "select count(id) as count from comments " +
				"where ifValid = 1 and articleId = ?",
			vals: _dump([articleId])
		}, function(d) {
			if(d.success && d.data) {
				hotComment.allCommentsLength = d.data[0].count;
			}
		});
		
		//阅读开关
		_callAjax({
			cmd: "fetch",
			sql: "select showreadcnt from system"
		}, function(d) {
			if(d.success && d.data) {
				newsDetail.showread = d.data[0].showreadcnt;
			}
		});
		
	}
	
	//添加newId自定义事件监听
	window.addEventListener('newsId', function(event) {
		getInfo();
	});
	
	var cw = plus.webview.currentWebview();
	if(!cw.preload) return getInfo();
	
	getInfo();
}

// 判断扩展API是否准备，否则监听'plusready'事件
if(window.plus) {
	plusReady();
} else {
	document.addEventListener('plusready', plusReady, false);
}