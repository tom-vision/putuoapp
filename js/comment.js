var articleId = 0;
var bHaveMore = true;

var comment = new Vue({
	el: '#comment',
	data: {
		content: '',
		comments: [] //评论
	},
	methods: {
		changeLiked: function(i) {
			var self = this;
			if(userInfo.id == null) return mui.toast("请先在个人中心登录");

			i.liked = !i.liked;

			//喜欢
			if(i.like) {
				_callAjax({
					cmd: "exec",
					sql: "insert into comment_praises(userId, commentId) values(?,?)",
					vals: _dump([userInfo.id, i.id])
				}, function(d) {
					if(d.success) {
						i.count++;
					}
				});
			} else {
				//取消
				_callAjax({
					cmd: "exec",
					sql: "delete from comment_praises where commentId = ? and userId = ?",
					vals: _dump([i.id, userInfo.id])
				}, function(d) {
					if(d.success) {
						i.count--;
					}
				});
			}

		},
		//发表评论
		publish: function() {
			var self = this;

			if(userInfo.id == null) return mui.toast("请先在个人中心登录");
			if('' == self.content) return mui.toast("请填写评论内容");

			_callAjax({
				cmd: "exec",
				sql: "insert into comments(content, articleId, userId) values(?,?,?)",
				vals: _dump([self.content, articleId, userInfo.id])
			}, function(d) {
				if(d.success) {
					mui.toast("发表成功");
				}
			});
		}

	}
})

function getComments() {

	var f = 10e5;
	if(comment.comments.length) {
		f = _at(comment.comments, -1).id;
	}

	_callAjax({
		cmd: "fetch",
		sql: "select c.id, c.content, strftime('%Y-%m-%d %H:%M', c.logtime) as logtime, count(p.id) as count, u.name, u.img from comments c left outer join comment_praises p on c.id=p.commentId " +
			"left outer join User u on c.userId = u.id " +
			"where c.ifValid=1 and c.articleId = ? and c.id< ? group by c.articleId order by c.logtime desc limit 5",
		vals: _dump([articleId, f])
	}, function(d) {
		if(!d.success || !d.data) {
			bHaveMore = false;
			return;
		} else {
			d.data.forEach(function(r) {
				r.liked = false;

				//已登录状况下获取个人对，每条评论的点赞情况
				if(userInfo.id != null) {
					_callAjax({
						cmd: "fetch",
						sql: "select * from comment_praises where userId=? and commentId = ? ",
						vals: _dump([userInfo.id, r.id])
					}, function(d) {
						if(d.success && d.data){
							r.liked = true;
						}
					});
				}

				comment.comments.push(r);
			});
		}

	});
}

// 扩展API加载完毕，现在可以正常调用扩展API
function plusReady() {
	pullToRefresh();
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
	//根据id向服务器请求文章评论
	console.log("评论页newsId=" + articleId);

	getComments();

})