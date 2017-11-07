// 扩展API加载完毕，现在可以正常调用扩展API
function plusReady() {
	var zan = new Vue({
		el: '#zan',
		data: {
			userInfo: _load(_get('userInfo')),
			praises: [],
			bHaveMore: true
		},
		methods: {
			
			getPraises: function(){
				var self = this;
				
				var f = 10e5;
				if(self.praises.length) {
					f = _at(self.praises, -1).id;
				}
				
				_callAjax({
					cmd: "fetch",
					sql: "select p.id, strftime('%Y-%m-%d %H:%M', p.logtime) as logtime, u.img, u.name, c.content from comment_praises p left outer join User u on p.userId=u.id " +
						" left outer join comments c on c.userId = ? where p.commentId = c.id and p.id<? order by p.id desc limit 10",
					vals: _dump([f,self.userInfo.id])
				}, function(d) {
					if(d.success && d.data) {
						self.bHaveMore = true;
						
						d.data.forEach(function(r) {
							self.praises.push(r);
						});
					} else {
						self.bHaveMore = false;
						mui.toast("没有更多数据了");
					}
				})
			},
			initZan: function(){
				var self = this;
				
				_callAjax({
					cmd: "fetch",
					sql: "select p.id, strftime('%Y-%m-%d %H:%M', p.logtime) as logtime, u.img, u.name, c.content from comment_praises p left outer join User u on p.userId=u.id " +
						" left outer join comments c on c.userId = ? where p.commentId = c.id ",
					vals: _dump([self.userInfo.id])
				}, function(d) {
					if(d.success && d.data) {
						self.bHaveMore = true;
						self.praises = d.data;
						console.log(self.praises);
					} else {
						self.bHaveMore = false;
						//					mui.toast("抱歉，您还没有收到赞");
					}
				})
			}
		},
		
	})
	
	//添加newId自定义事件监听
	window.addEventListener('zan', function(event) {
		zan.initZan();
	})
}


// 判断扩展API是否准备，否则监听'plusready'事件
if(window.plus) {
	plusReady();
} else {
	document.addEventListener('plusready', plusReady, false);
}