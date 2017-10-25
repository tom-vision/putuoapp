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
	}, {
		url: 'views/interact.html',
		id: 'interact'
	}],
});

var index = new Vue({
	el: '#index',
	data: {
		activeSlideText: '',
		frameHeight: '300px',
		scrollNews: [], //滚动新闻
		headNews: [], //头条
		instantNews: [], //即时新闻
		putuoNews: [], //普陀新闻
		videoNews: [], //视频新闻
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
		},
		//跳转到文章详情
		gotoDetail: function(i){
			
		},
		//查看更多即时新闻
		gotoInstantNews: function(){
			
		},
	},
	mounted: function(){
		//获取新闻数据
		var self = this;
		self.scrollNews = [{'title':'风雨中，我们一起坚守 ——来自我区各地防汛救灾工作一线的报道','img':'http://img2.zjolcdn.com/pic/003/001/803/00300180326_cac32f05.jpg','content':'大雨倾盆，狂风肆虐……昨天凌晨3点40分，区气象台发布暴雨橙色预警信号，受南海台风“卡努”外围环流和冷空气共同影响，我区普降大雨。区气象部门数据显示，10月14日8时至10月16日下午4时，东港南岙雨量达到540毫米，位列全省最高，展茅雨量428毫米，位列全省第二。面对来势汹汹的雨情汛情，全区各地广大干部群众全力投入，严阵以待，切实做好防汛救灾工作，努力把灾害带来的损失降到最低。'},
						{'title':'防汛拧紧发条 救灾争分夺秒','img':'http://img2.zjolcdn.com/pic/003/001/803/00300180319_a8953918.jpg','content':'暴雨如注，水位高涨，连日来的强降水，致使普陀多地出现险情，全区上下打响防汛抢险攻坚战。昨天上午8时，区防指启动防汛三级应急响应。'},
						{'title':'村社法律顾问走村入企','img':'http://img2.zjolcdn.com/pic/003/001/803/00300180323_880740e7.jpg','content':'近日，展茅司法所组织开展村(社区)法律顾问集中走村入企法律服务活动，对各村(社区)和相关企业送去法律体检、法律咨询、法律援助、人民调解等一系列法律服务。'}
						];
		self.headNews = [{'title':'温暖：坚决打赢救灾硬仗 严防次生灾害发生','img':'','content':'15日起我市普降暴雨，其中局部大暴雨，展茅一带汛情严峻。昨天上午，市委副书记、新区党工委副书记、市长温暖赴展茅检查指导防汛救灾工作。他强调，各地各部门要充分认识这次灾情的严重性，众志成城，不畏艰险，采取有力举措，坚决打赢救灾硬仗，严防次生灾害发生，尽快恢复受灾区域正常生产生活。副市长姜建明，区委副书记、区长潘晓辉，副区长杨海滨等陪同检查。'}];
		self.instantNews = [{'title':'我区社会各界收听收看十九大开幕盛况','img':['http://img2.zjolcdn.com/pic/003/001/819/00300181996_032a6c38.jpg'],'content':'今天，我区多条公交线路已恢复运营，岛际交通部分航班恢复正常。'},
							{'title':'我区部分公交航班恢复运营','img':['http://img2.zjolcdn.com/pic/003/001/811/00300181115_bcaeda35.jpg'],'content':'今天，我区多条公交线路已恢复运营，岛际交通部分航班恢复正常。'},
							{'title':'区卫计部门开展灾后防疫消杀工作','img':['http://img2.zjolcdn.com/pic/003/001/819/00300181995_c6c3e069.jpg'],'content':'今天，我区多条公交线路已恢复运营，岛际交通部分航班恢复正常。'},
							{'title':'我区社会各界收听收看十九大开幕盛况','img':['http://img2.zjolcdn.com/pic/003/001/820/00300182039_4c1a9d96.jpg','http://img2.zjolcdn.com/pic/003/001/820/00300182040_988566f2.jpg','http://img2.zjolcdn.com/pic/003/001/819/00300181965_7dc34932.jpg'],'content':'今天，我区多条公交线路已恢复运营，岛际交通部分航班恢复正常。'}];
		self.putuoNews = [{'title':'我区社会各界收听收看十九大开幕盛况','img':['http://img2.zjolcdn.com/pic/003/001/819/00300181996_032a6c38.jpg'],'content':'今天，我区多条公交线路已恢复运营，岛际交通部分航班恢复正常。'},
							{'title':'我区部分公交航班恢复运营','img':['http://img2.zjolcdn.com/pic/003/001/811/00300181115_bcaeda35.jpg'],'content':'今天，我区多条公交线路已恢复运营，岛际交通部分航班恢复正常。'},
							{'title':'区卫计部门开展灾后防疫消杀工作','img':['http://img2.zjolcdn.com/pic/003/001/819/00300181995_c6c3e069.jpg'],'content':'今天，我区多条公交线路已恢复运营，岛际交通部分航班恢复正常。'}
						 ];
		self.videoNews = [{'title':'东港城市河道：以最美的“素颜”喜迎十九大','img':'http://1251569943.vod2.myqcloud.com/4ab5ad14vodtransgzp1251569943/38d1b1b79031868223375796919/snapshot/1508236176_3272203678.100_54400.jpg','url':'http://1251569943.vod2.myqcloud.com/4ab5ad14vodtransgzp1251569943/38d1b1b79031868223375796919/v.f20.mp4'},
							{'title':'板桥路积水退去 市民恢复正常生活','img':'http://1251569943.vod2.myqcloud.com/4ab5ad14vodtransgzp1251569943/38d1a5979031868223375796667/snapshot/1508235990_176719669.100_7100.jpg','url':'http://1251569943.vod2.myqcloud.com/4ab5ad14vodtransgzp1251569943/38d1a5979031868223375796667/v.f20.mp4'},
							{'title':'东港城市河道：以最美的“素颜”喜迎十九大','img':'http://1251569943.vod2.myqcloud.com/4ab5ad14vodtransgzp1251569943/38d1b1b79031868223375796919/snapshot/1508236176_3272203678.100_54400.jpg','url':'http://1251569943.vod2.myqcloud.com/4ab5ad14vodtransgzp1251569943/38d1b1b79031868223375796919/v.f20.mp4'},
							{'title':'板桥路积水退去 市民恢复正常生活','img':'http://1251569943.vod2.myqcloud.com/4ab5ad14vodtransgzp1251569943/38d1a5979031868223375796667/snapshot/1508235990_176719669.100_7100.jpg','url':'http://1251569943.vod2.myqcloud.com/4ab5ad14vodtransgzp1251569943/38d1a5979031868223375796667/v.f20.mp4'}
							];
		
		self.activeSlideText = self.scrollNews[0].title;
	}
})

//测试分支合并
//选项卡
var news = new Vue({
	el: '#news',
	data: {
		newsSorts: ['即时新闻', '普陀新闻', '视频新闻'],
		activeSort: 0,
		
	},
	beforeCreate: function() {
	},
	methods: {
		changeSort: function(i) {
			this.activeSort = i
		}
	},
	
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

//合并
// banner滚动时更换标题
document.querySelector('.mui-slider').addEventListener('slide', function(event) {
	
	index.activeSlideText = index.scrollNews[event.detail.slideNumber].title;
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

//跳转至互动
$('.go-interact').on('click', function() {
	openWindow('views/interact.html', 'interact');

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