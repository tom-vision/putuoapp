var userInfo = _load(_get('userInfo'));

var interactDetail = new Vue({
	el: '#interactDetail',
	data: {
		interactId: 0,
		interactDetail:{
			imgs:[],
		},
		comments: [],
		placeholder: '说点什么...',
		comment: '',
		haveComment: false,
		bHaveMore_comment: true,
		zan: 0   //点赞个数
	},
	methods: {
		//获取互动详情
		getDetail:function(){
			var self = this;
			
			_callAjax({
				cmd: "fetch",
				sql: "select u.name, u.img as userImg, a.id, a.content, a.img, strftime('%Y-%m-%d %H:%M', a.logtime) as logtime from interact a left outer join User u on a.userId = u.id  where a.id=?",
				vals: _dump([self.interactId])

			}, function(d) {
				if(d.success && d.data) {
					
					var r = d.data[0];
					var arrImg = r.img.split(';');
					r.imgs = arrImg;
					self.interactDetail = r;
				}

			});
		},
		//获取评论
		getComments:function(){
			var self = this;
			
			_callAjax({
				cmd: "fetch",
				sql: "select u.name, u.img as userImg, c.id, c.content, strftime('%Y-%m-%d %H:%M', c.logtime) as logtime from interactComments c left outer join User u on c.userId = u.id where c.interactId = ? order by c.id desc limit 5",
				vals:_dump([self.interactId])

			}, function(d) {
				if(d.success && d.data) {
					self.comments = d.data;
					self.bHaveMore_comment = true;
	
				}else{
					self.bHaveMore_comment = false;
				}

			});
			
		},
		//获取更多评论
		getMoreComments:function(){
			var self = this;
			
			var f = 10e5;
			if(self.comments.length) {
				f = _at(self.comments, -1).id;
			}
			
			_callAjax({
				cmd: "fetch",
				sql: "select u.name, u.img as userImg, c.id, c.content, strftime('%Y-%m-%d %H:%M', c.logtime) as logtime from interactComments c left outer join User u on c.userId = u.id  where c.interactId = ? and c.id<? order by c.id desc limit 5",
				vals: _dump([self.interactId,f])

			}, function(d) {
				if(d.success && d.data) {
					self.bHaveMore_comment = true;
					d.data.forEach(function(r) {
						self.comments.push(r);
					});
					
					console.log(_dump(self.comments));
				}else{
					self.bHaveMore_comment = false;
					mui.toast("没有更多评论了");
					return;
				}

			});
		},
		//发送
		diliver: function(){
			var self = this;
			
			if(userInfo.id == 0) return mui.toast("请先在个人中心登录");
			if(''==self.comment.trim()) return mui.toast("请填写评论内容");
			
			_callAjax({
				cmd: "exec",
				sql: "insert into interactComments(content, interactId, userId) values(?,?,?)",
				vals: _dump([self.comment.trim(), self.interactId, userInfo.id])
			}, function(d) {
				if(d.success) {
					mui.toast("评论成功");
					self.getComments();
					
					//清空输入框
					self.comment = '';
				}
			});
			
		},
		
		//获取点赞个数
		getZan:function(){
			var self = this;
			
			_callAjax({
				cmd: "fetch",
				sql: "select count(*) as total from interact_praises where interactId = ?",
				vals:_dump([self.interactId])

			}, function(d) {
				if(d.success && d.data) {
					self.zan = d.data[0].total;
	
				}
			});
		},
		
		//点赞
		clickZan:function(){
			var self = this;
			
			if(userInfo.id == 0) return mui.toast("请先在个人中心登录");
			
			_callAjax({
				cmd: "exec",
				sql: "insert into interact_praises(interactId, userId) values(?,?)",
				vals: _dump([self.interactId, userInfo.id])
			}, function(d) {
				if(d.success) {
					
					self.getZan();
		
				}
			});
		}
	},
	watch: {
		comment: function() {
			if(this.comment.length > 0) return this.haveComment = true;
			this.haveComment = false;
		}
	}
})

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

//添加interactId自定义事件监听
window.addEventListener('interactId', function(event) {
	//获得事件参数
	interactDetail.interactId = event.detail.id;
	//根据id向服务器请求文章评论
	console.log("互动id=" + interactDetail.interactId);

	interactDetail.getDetail();
	
	//清空防止加载更多
	interactDetail.comments = [];
	interactDetail.getComments();
	
	interactDetail.getZan();
})