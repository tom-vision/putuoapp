//预加载页面
mui.init({
	preloadPages: [{
		url: 'comment.html',
		id: 'comment',
	}]
});

var articleId = 0;

var newsDetail = new Vue({
	el: '#detail',
	data: {
		newsData: {}, //内容
		like: false,
		likeNum: 0 //点赞数
	},
	methods: {
		changeLike: function() {
			var self = this;

			if(userInfo.id != 0) {
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

			}else{
				mui.toast("请先在个人中心登录");
			}

		}
	},

})

var hotComment = new Vue({
	el: '#comment',
	data: {
		comments: []
	},
	methods: {
		goComment: function() {
			
			var detailPage = null;
			//获得评论页面
			if(!detailPage) {
				detailPage = plus.webview.getWebviewById('comment');
			}
			//触发评论页面的newsId事件
			mui.fire(detailPage, 'newsId', {
				id: articleId
			});
			openWindow('comment.html', 'comment');
		}
	}
})

// 通过系统组件分享 
function shareSystem(){
	plus.share.sendWithSystem({content:'分享内容',href:'http://www.dcloud.io/'}, function(){
		console.log('分享成功');
	}, function(e){
		console.log('分享失败：'+JSON.stringify(e));
	});
}

// 扩展API加载完毕，现在可以正常调用扩展API
function plusReady() {
//	pullToRefresh();
}

// 判断扩展API是否准备，否则监听'plusready'事件
if(window.plus) {
	plusReady();
} else {
	document.addEventListener('plusready', plusReady, false);
}

//添加newId自定义事件监听
window.addEventListener('newsId', function(event) {
	//获得事件参数
	articleId = event.detail.id;
	//根据id向服务器请求新闻详情
	console.log("详情页articleId=" + articleId);

	_callAjax({
		cmd: "fetch",
		sql: "select * from articles where id = " + articleId

	}, function(d) {
		if(d.success && d.data) {

			newsDetail.newsData = d.data[0];
		}
	});

	//获取文章点赞数
	_callAjax({
		cmd: "fetch",
		sql: "select count(*) as total from article_praises where articleId = " + articleId

	}, function(d) {
		if(d.success && d.data) {

			newsDetail.likeNum = d.data[0].total;
			console.log("喜欢数：" + newsDetail.likeNum);
		}
	});

	//本人是否点赞
	if(userInfo.id != 0) {
		_callAjax({
			cmd: "fetch",
			sql: "select * from article_praises where articleId = " + articleId + " and userId = " + userInfo.id

		}, function(d) {
			if(d.success && d.data) {

				newsDetail.like = true;
				console.log("本人点赞: " + newsDetail.like);
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
			console.log("热门评论：" + hotComment.comments.length)
		}
	});

});