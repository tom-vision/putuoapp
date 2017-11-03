//预加载页面
mui.init({
	preloadPages: [{
		url: 'release.html',
		id: 'release',
	},{
		url: 'interact-detail.html',
		id: 'interact-detail',
	}, ],
});

var interact = new Vue({
	el: '#interact',
	data: {
		interact_latest: [], //最新
		interact_rebellion:[], //报料
		interact_photography:[], //摄影
		interact_food:[], //美食
		bHaveMore_latest: true,
		bHaveMore_rebellion: true,
		bHaveMore_photography: true,
		bHaveMore_food: true,
	},
	methods: {
		openGallery: function(imgs, index) {
			interactGraphic.show = true;
			interactGraphic.imgs = imgs;
			interactGraphic.index = index;
			$('body').addClass('no-scroll');
			event.stopPropagation();
		},
		openInteractDetail: function(i) {
			
			mui.fire(plus.webview.getWebviewById('interact-detail'), 'interactId', {
				id: i.id
			});
			
			openWindow('interact-detail.html', 'interact-detail');

		},
		//获取最新互动信息
		getLatest:function(){
			var self = this;
			
			var f = 10e5;
			if(self.interact_latest.length) {
				f = _at(self.interact_latest, -1).id;
			}

			_callAjax({
				cmd: "fetch",
				sql: "select F.*, count(c.id) as commentNum from (select u.name, u.img as userImg, a.id, a.content, a.img, strftime('%Y-%m-%d %H:%M', a.logtime) as logtime, count(p.id) as zan from interact a left outer join User u on a.userId = u.id left outer join interact_praises p on p.interactId = a.id where a.ifValid =1 and a.id<? group by a.id order by a.id desc limit 5) F left outer join interactComments c on c.interactId = F.id group by F.id order by F.id desc",
//				sql: "select u.name, u.img as userImg, a.id, a.content, a.img, strftime('%Y-%m-%d %H:%M', a.logtime) as logtime from interact a left outer join User u on a.userId = u.id  where a.ifValid =1 and a.id<? order by a.id desc limit 5",
				vals: _dump([f])

			}, function(d) {
				if(!d.success || !d.data) {
					self.bHaveMore_latest = false;
					mui.toast("没有更多数据了");
					return;
				} else {
					self.bHaveMore_latest = true;

					d.data.forEach(function(r) {
						var arrImg = r.img.split(';');
						r.imgs = arrImg;
						self.interact_latest.push(r);
					});
					console.log("最新互动");

				}

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
					return;
				} else {
					self.bHaveMore_rebellion = true;
		
					d.data.forEach(function(r) {
						var arrImg = r.img.split(';');
						r.imgs = arrImg;
						self.interact_rebellion.push(r);
					});
					console.log("报料");
				}
		
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
					return;
				} else {
					self.bHaveMore_photography = true;
		
					d.data.forEach(function(r) {
						var arrImg = r.img.split(';');
						r.imgs = arrImg;
						self.interact_photography.push(r);
					});
					console.log("摄影");
				}
		
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
//				sql: "select u.name, u.img as userImg, a.id, a.content, a.img, strftime('%Y-%m-%d %H:%M', a.logtime) as logtime from interact a left outer join User u on a.userId = u.id where a.ifValid =1 and a.id<? and a.linkerId = ? order by a.id desc limit 5",
				vals: _dump([f, linkerId.food])
		
			}, function(d) {
				if(!d.success || !d.data) {
					self.bHaveMore_food = false;
					mui.toast("没有更多数据了");
					return;
				} else {
					self.bHaveMore_food = true;
		
					d.data.forEach(function(r) {
						var arrImg = r.img.split(';');
						r.imgs = arrImg;
						self.interact_food.push(r);
					});
					console.log("美食");
				}
		
			});
		},
		
		//tab切换
		goLatest:function(){
			changeIndexTab('index-tab-1', $('.latest'));
		},
		goRebellion:function(){
			changeIndexTab('index-tab-2', $('.rebellion'));
		},
		goPhotography:function(){
			changeIndexTab('index-tab-3', $('.photography'));
		},
		goFood:function(){
			changeIndexTab('index-tab-4', $('.food'));
		},
	},
	mounted:function(){
		var self = this;
		
		//获取最新互动信息
		self.getLatest();
		
		//获取报料信息
		self.getRebellion();
		//获取摄影信息
		self.getPhotography();
		//获取美食信息
		self.getFood();
		
		//初始化显示最新
		$('.interact-list').hide();
		$('.index-tab-1').show();
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
	created:function(){
		var self = this;
		
		mui('.mui-slider').slider().gotoItem(self.index);
	}
})

$('.icon-xiangji').on('click', function() {
	var btnArray = [{
		title: "报料"
	}, {
		title: "摄影"
	},{
		title: "美食"
	}];
	plus.nativeUI.actionSheet({
		title: "动态类型",
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
			case 2:
				type = linkerId.food;
				break;
		}
		
		if(index != 0){
			mui.fire(plus.webview.getWebviewById('release'), 'releaseType', {
				type: type
			});
			openWindow('release.html', 'release');
		}
		
	});
});

var changeIndexTab = function(el, self) {
	console.log("顶部tab=" + el);
	$('.interact-list').hide();
	$('.' + el + '').show();
	self.addClass('active').siblings().removeClass('active');
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