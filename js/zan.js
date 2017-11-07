// 扩展API加载完毕，现在可以正常调用扩展API
function plusReady() {
	var zan = new Vue({
		el: '#zan',
		data: {
			userInfo: _load(_get('userInfo')),
			praises: [],
		},
		methods: {
		},
		mounted: function(){
			var self = this;
			
			_callAjax({
				cmd: "fetch",
				sql: "select p.id, strftime('%Y-%m-%d %H:%M', p.logtime) as logtime, u.img, u.name, c.content from comment_praises p left outer join User u on p.userId=u.id " + 
				" left outer join comments c on c.userId = ? where p.commentId = c.id ",
				vals: _dump([self.userInfo.id])
			}, function(d) {
				if(d.success && d.data) {
					self.praises = d.data;
				} else {
//					mui.toast("抱歉，您还没有收到赞");
				}
			})
		}
	})
}

// 判断扩展API是否准备，否则监听'plusready'事件
if(window.plus) {
	plusReady();
} else {
	document.addEventListener('plusready', plusReady, false);
}