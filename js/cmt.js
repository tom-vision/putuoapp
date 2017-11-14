// 扩展API加载完毕，现在可以正常调用扩展API
function plusReady() {
	var cmt = new Vue({
		el: '#cmt',
		data: {
			userInfo: _load(_get('userInfo')),
			cmts: [],
			bHaveMore: false
		},
		methods: {
			getCmts: function(){
				var self = this;
				var f = 10e5;
				if(self.cmts.length) {
					f = _at(self.cmts, -1).id;
				}
				
				_callAjax({
					cmd: "fetch",
					sql: "select u.name, u.img as UserImg, a.id, a.content, strftime('%Y-%m-%d %H:%M', a.logtime) as logtime from interactComments a left outer join User u on a.userId = u.id where a.replyTo = ? and a.id < ? order by a.id desc limit 5 ",
					vals: _dump([self.userInfo.id, f])
				}, function(d) {
					if(!d.success || !d.data) {
						self.bHaveMore = false;
						mui.toast("没有更多数据了");
						return;
					} else {
						self.bHaveMore = true;
				
						d.data.forEach(function(r) {
							self.cmts.push(r);
						});
					}
				});
			},
			initCmt: function(){
				var self = this;
				
				//获取评论
				_callAjax({
					cmd: "fetch",
					sql: "select u.name, u.img as UserImg, a.id, a.content, strftime('%Y-%m-%d %H:%M', a.logtime) as logtime from interactComments a left outer join User u on a.userId = u.id where a.replyTo = ? order by a.id desc limit 5 ",
					vals: _dump([self.userInfo.id])
				}, function(d) {
					if(d.success && d.data) {
						self.cmts = d.data;
						self.bHaveMore = true;
					} else {
				
					}
				})
			}
		}
	})
	
	//添加newId自定义事件监听
	window.addEventListener('cmt', function(event) {
		cmt.userInfo = _load(_get('userInfo'));
		cmt.initCmt();
	})
}

// 判断扩展API是否准备，否则监听'plusready'事件
if(window.plus) {
	plusReady();
} else {
	document.addEventListener('plusready', plusReady, false);
}