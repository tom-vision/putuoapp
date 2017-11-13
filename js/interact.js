//预加载页面
mui.init({
	preloadPages: [{
		url: 'release.html',
		id: 'release',
	}, {
		url: 'interact-detail.html',
		id: 'interact-detail',
	}, ],
});

// 扩展API加载完毕，现在可以正常调用扩展API
function plusReady() {
	pullToRefresh();
	
	// 相册显示时监听物理返回按键，若已经显示则优先关闭相册
	var oldback = mui.back;
	mui.back = function() {
	    if(interactGraphic.show) {
	    	interactGraphic.show = false;
	    	$('body').removeClass('no-scroll');
	    	return false;
	    }
	    oldback();
	}
	
	window.addEventListener('releaseBack', function(event) {
		location.reload();
	})

	var interact = new Vue({
		el: '#interact',
		data: {
			interact_current: [], //当前tabbar数据
			interact_latest: [], //最新
			interact_rebellion: [], //报料
			interact_photography: [], //摄影
			interact_food: [], //美食
			bHaveMore_latest: true,
			bHaveMore_rebellion: true,
			bHaveMore_photography: true,
			bHaveMore_food: true,
			bHaveMore_current: true,
			currentIndex: 0
		},
		methods: {
			openGallery: function(imgs, index) {
				interactGraphic.show = true;
				interactGraphic.imgs = imgs;
				$('body').addClass('no-scroll');
				setTimeout(function(){
					var swiper = new Swiper('.swiper-container');
					swiper.slideTo(index, 500, false);
				}, 800)
			},
			openInteractDetail: function(i) {
				mui.fire(plus.webview.getWebviewById('interact-detail'), 'interactId', {
					id: i.id
				});

				setTimeout(function(){
					openWindow('interact-detail.html', 'interact-detail');
				},200)
			},
			//获取当前tab更多信息
			getCurrent: function() {
				var self = this;
				switch(self.currentIndex) {
					//最新
					case 0:{
						self.getLatest();
						break;
					}
					//报料
					case 1:{
						self.getRebellion();
						break;
					}
					//摄影
					case 2:{
						self.getPhotography();
						break;
					}
					//美食
					case 3:{
						self.getFood();
						break;
					}
				}
			},
			//获取最新互动信息
			getLatest: function() {
				var self = this;

				var f = 10e5;
				if(self.interact_latest.length) {
					f = _at(self.interact_latest, -1).id;
				}

				_callAjax({
					cmd: "fetch",
					sql: "select F.*, count(c.id) as commentNum from (select u.name, u.img as userImg, a.id, a.content, a.img, strftime('%Y-%m-%d %H:%M', a.logtime) as logtime, count(p.id) as zan from interact a left outer join User u on a.userId = u.id left outer join interact_praises p on p.interactId = a.id where a.ifValid =1 and a.id<? group by a.id order by a.id desc limit 5) F left outer join interactComments c on c.interactId = F.id group by F.id order by F.id desc",
					vals: _dump([f])
				}, function(d) {
					if(!d.success || !d.data) {
						self.bHaveMore_latest = false;
						mui.toast("没有更多数据了");
					} else {
						self.bHaveMore_latest = true;

						d.data.forEach(function(r) {
							var arrImg = r.img.split(';');
							r.imgs = arrImg;
							self.interact_latest.push(r);
						});
					}
					self.goLatest();
				});
			},
			//获取报料信息
			getRebellion: function() {
				var self = this;

				var f = 10e5;
				if(self.interact_rebellion.length) {
					f = _at(self.interact_rebellion, -1).id;
				}

				_callAjax({
					cmd: "fetch",
					sql: "select F.*, count(c.id) as commentNum from (select u.name, u.img as userImg, a.id, a.content, a.img, strftime('%Y-%m-%d %H:%M', a.logtime) as logtime, count(p.id) as zan from interact a left outer join User u on a.userId = u.id left outer join interact_praises p on p.interactId = a.id where a.ifValid =1 and a.id<? and a.linkerId = ? group by a.id order by a.id desc limit 5) F left outer join interactComments c on c.interactId = F.id group by F.id order by F.id desc",
					vals: _dump([f, linkerId.rebellion])
				}, function(d) {
					if(!d.success || !d.data) {
						self.bHaveMore_rebellion = false;
						mui.toast("没有更多数据了");
					} else {
						self.bHaveMore_rebellion = true;

						d.data.forEach(function(r) {
							var arrImg = r.img.split(';');
							r.imgs = arrImg;
							self.interact_rebellion.push(r);
						});
					}
					self.goRebellion();
				});
			},
			//获取摄影信息
			getPhotography: function() {
				var self = this;

				var f = 10e5;
				if(self.interact_photography.length) {
					f = _at(self.interact_photography, -1).id;
				}

				_callAjax({
					cmd: "fetch",
					sql: "select F.*, count(c.id) as commentNum from (select u.name, u.img as userImg, a.id, a.content, a.img, strftime('%Y-%m-%d %H:%M', a.logtime) as logtime, count(p.id) as zan from interact a left outer join User u on a.userId = u.id left outer join interact_praises p on p.interactId = a.id where a.ifValid =1 and a.id<? and a.linkerId = ? group by a.id order by a.id desc limit 5) F left outer join interactComments c on c.interactId = F.id group by F.id order by F.id desc",
					vals: _dump([f, linkerId.photography])
				}, function(d) {
					if(!d.success || !d.data) {
						self.bHaveMore_photography = false;
						mui.toast("没有更多数据了");
					} else {
						self.bHaveMore_photography = true;

						d.data.forEach(function(r) {
							var arrImg = r.img.split(';');
							r.imgs = arrImg;
							self.interact_photography.push(r);
						});
					}
					self.goPhotography();
				});
			},
			//获取美食信息
			getFood: function() {
				var self = this;

				var f = 10e5;
				if(self.interact_food.length) {
					f = _at(self.interact_food, -1).id;
				}

				_callAjax({
					cmd: "fetch",
					sql: "select F.*, count(c.id) as commentNum from (select u.name, u.img as userImg, a.id, a.content, a.img, strftime('%Y-%m-%d %H:%M', a.logtime) as logtime, count(p.id) as zan from interact a left outer join User u on a.userId = u.id left outer join interact_praises p on p.interactId = a.id where a.ifValid =1 and a.id<? and a.linkerId = ? group by a.id order by a.id desc limit 5) F left outer join interactComments c on c.interactId = F.id group by F.id order by F.id desc",
					vals: _dump([f, linkerId.food])
				}, function(d) {
					if(!d.success || !d.data) {
						self.bHaveMore_food = false;
						mui.toast("没有更多数据了");
					} else {
						self.bHaveMore_food = true;

						d.data.forEach(function(r) {
							var arrImg = r.img.split(';');
							r.imgs = arrImg;
							self.interact_food.push(r);
						});
					}
					self.goFood();
				});
			},
			//tab切换
			goLatest: function() {
				var self = this;
				self.interact_current = self.interact_latest;
				self.bHaveMore_current = self.bHaveMore_latest;
				self.currentIndex = 0;
			},
			goRebellion: function() {
				var self = this;
				self.interact_current = self.interact_rebellion;
				self.bHaveMore_current = self.bHaveMore_rebellion;
				self.currentIndex = 1;
			},
			goPhotography: function() {
				var self = this;
				self.interact_current = self.interact_photography;
				self.bHaveMore_current = self.bHaveMore_photography;
				self.currentIndex = 2;
			},
			goFood: function() {
				var self = this;
				self.interact_current = self.interact_food;
				self.bHaveMore_current = self.bHaveMore_food;
				self.currentIndex = 3;
			},
		},
		watch: {
			currentIndex: function() {
				$('body').animate({scrollTop:0},500)
			}
		},
		mounted: function() {
			var self = this;

			//获取最新互动信息
			self.getLatest();
			//获取报料信息
			self.getRebellion();
			//获取摄影信息
			self.getPhotography();
			//获取美食信息
			self.getFood();

			setTimeout(function() {
				self.goLatest();
			}, 1500);
		}
	})

	var interactGraphic = new Vue({
		el: '#interactGraphic',
		data: {
			show: false,
			imgs: [],
			index: 0
		},
		methods: {
			close: function() {
				this.show = false;
				$('body').removeClass('no-scroll');
			}
		},
	})

	$('.icon-xiangji').on('click', function() {
		var btnArray = [{
			title: "报料"
		}, {
			title: "摄影"
		}, {
			title: "美食"
		}];
		plus.nativeUI.actionSheet({
			title: "发布到",
			cancel: "取消",
			buttons: btnArray
		}, function(e) {
			var index = e.index;
			var type = linkerId.rebellion;
			switch(index) {
				//取消
				case 0:
					break;
					//报料
				case 1:
					type = linkerId.rebellion;
					break;
					//摄影
				case 2:
					type = linkerId.photography;
					break;
					//美食
				case 3:
					type = linkerId.food;
					break;
			}
			if(index != 0) {
				mui.fire(plus.webview.getWebviewById('release'), 'releaseType', {
					type: type
				});
				openWindow('release.html', 'release');
			}

		});
	});

	var changeIndexTab = function(self) {
		self.addClass('active').siblings().removeClass('active');
	}
}

// 判断扩展API是否准备，否则监听'plusready'事件
if(window.plus) {
	plusReady();
} else {
	document.addEventListener('plusready', plusReady, false);
}