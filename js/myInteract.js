//预加载页面
mui.init({
	preloadPages: [{
		url: 'interact-detail.html',
		id: 'interact-detail',
	}, ],
});



// 扩展API加载完毕，现在可以正常调用扩展API
function plusReady() {
	var myInteract = new Vue({
		el: '#myInteract',
		data: {
			userInfo: _load(_get('userInfo')),
			interacts: [],
			bHaveMore: true
		},
		methods: {
	
			getMyInteract: function() {
				var self = this;
	
				var f = 10e5;
				if(self.interacts.length) {
					f = _at(self.interacts, -1).id;
				}
	
				_callAjax({
					cmd: "fetch",
					sql: "select F.*, count(c.id) as commentNum from (select u.name, u.img as userImg, a.id, a.content, a.img, strftime('%Y-%m-%d %H:%M', a.logtime) as logtime, count(p.id) as zan from interact a left outer join User u on a.userId = u.id left outer join interact_praises p on p.interactId = a.id where a.ifValid =1 and a.id<? and a.userId = ? group by a.id order by a.id desc limit 5) F left outer join interactComments c on c.interactId = F.id group by F.id order by F.id desc",
					vals: _dump([f, self.userInfo.id])
	
				}, function(d) {
					if(!d.success || !d.data) {
						self.bHaveMore = false;
						mui.toast("没有更多数据了");
						return;
					} else {
						self.bHaveMore = true;
	
						d.data.forEach(function(r) {
							var arrImg = r.img.split(';');
							r.imgs = arrImg;
							self.interact_food.push(r);
						});
						console.log("我的互动");
					}
	
				});
			},
	
			openInteractDetail: function(i) {
	
				mui.fire(plus.webview.getWebviewById('interact-detail'), 'interactId', {
					id: i.id
				});
	
				openWindow('interact-detail.html', 'interact-detail');
	
			},
			initMyInteract: function() {
				var self = this;
	
				_callAjax({
					cmd: "fetch",
					sql: "select F.*, count(c.id) as commentNum from (select u.name, u.img as userImg, a.id, a.content, a.img, strftime('%Y-%m-%d %H:%M', a.logtime) as logtime, count(p.id) as zan from interact a left outer join User u on a.userId = u.id left outer join interact_praises p on p.interactId = a.id where a.ifValid =1 and a.userId = ? group by a.id order by a.id desc limit 5) F left outer join interactComments c on c.interactId = F.id group by F.id order by F.id desc",
					vals: _dump([self.userInfo.id])
	
				}, function(d) {
					if(!d.success || !d.data) {
	
						return;
					} else {
	
						d.data.forEach(function(r) {
							var arrImg = r.img.split(';');
							r.imgs = arrImg;
							self.interacts.push(r);
						});
						console.log("我的互动");
					}
	
				});
			}
		}
	
	})
	
	//添加newId自定义事件监听
	window.addEventListener('myInteract', function(event) {
		myInteract.initMyInteract();
	})
}

// 判断扩展API是否准备，否则监听'plusready'事件
if(window.plus) {
	plusReady();
} else {
	document.addEventListener('plusready', plusReady, false);
}