//预加载页面
mui.init({
	preloadPages: [{
		url: 'views/search.html',
		id: 'search',
	}, {
		url: 'views/topic.html',
		id: 'topic'
	}, {
		url: 'views/newsDetail.html',
		id: 'newsDetail'
	}, {
		url: 'views/newsGraphic.html',
		id: 'newsGraphic'
	}, {
		url: 'views/digitalNewsPaper.html',
		id: 'digitalNewsPaper'
	}, {
		url: 'views/suggest.html',
		id: 'suggest'
	}, {
		url: 'views/login.html',
		id: 'login'
	}, {
		url: 'views/userInfo.html',
		id: 'userInfo'
	}],
});

var index = new Vue({
	el: '#index',
	data: {
		activeSlideText: '我是标题我是标题我是标题我是标题我是标题我是标题我是标题我是标题',
		frameHeight: '300px'
	},
	created: function() {
		this.frameHeight = window.outerHeight - 150 + 'px';
	},
	methods: {
		goTopic: function() {
			openWindow('views/topic.html', 'topic');
		},
		goNews: function(i) {
			changeTab('news', $('.go-news'));
			news.activeSort = i;
		},
		goNewsDetail: function() {
			openWindow('views/newsDetail.html', 'newsDetail');
		},
		goLife: function() {
			changeIndexTab('index-tab-3', $('.go-life'));
		},
		goVod: function() {
			changeIndexTab('index-tab-4', $('.go-vod'));
		},
		goNewsGraphic: function() {
			openWindow('views/newsGraphic.html', 'newsGraphic');
		},
		goHotNews: function() {
			changeIndexTab('index-tab-1', $('.go-hotnews'));
		},
		goLive: function() {
			changeIndexTab('index-tab-2', $('.go-live'));
		},
		goPaper: function() {
			openWindow('views/digitalNewsPaper.html', 'digitalNewsPaper')
		}
	}
})

var news = new Vue({
	el: '#news',
	data: {
		newsSorts: ['即时新闻', '普陀新闻', '视频新闻'],
		activeSort: 0
	},
	beforeCreate: function() {
	},
	methods: {
		changeSort: function(i) {
			this.activeSort = i
		}
	}
})

var ucenter = new Vue({
	el: '#ucenter',
	data: {
		isLogin: true
	},
	beforeCreate: function() {
	},
	methods: {
		goSuggest: function(i) {
			openWindow('views/suggest.html', 'suggest')
		},
		goLogin: function() {
			// 判断是否已登陆
			if(!this.isLogin) return openWindow('views/login.html', 'login')
			openWindow('views/userInfo.html', 'userInfo')
		}
	}
})

// banner滚动时更换标题
document.querySelector('.mui-slider').addEventListener('slide', function(event) {
	index.activeSlideText = event.detail.slideNumber + 1 + '我是标题我是标题我是标题我是标题我是标题我是标题我是标题我是标题';
})

var changeTab = function(el, self) {
	$('.main').hide();
	$('#'+el+'').show();
	self.addClass('active').siblings().removeClass('active');
}

var changeIndexTab = function(el, self) {
	$('.index-tab').hide();
	$('.'+el+'').show();
	self.addClass('active').siblings().removeClass('active');
}

//跳转至搜索页
$('.go-search').on('click', function() {
	openWindow('views/search.html', 'search');
})

//跳转至首页tab
$('.go-index').on('click', function() {
	changeTab('index', $(this))
})

//跳转至新闻tab
$('.go-news').on('click', function() {
	changeTab('news', $(this))
})

//跳转至个人中心
$('.go-ucenter').on('click', function() {
	changeTab('ucenter', $(this))
})

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