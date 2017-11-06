//预加载页面
mui.init({
	preloadPages: [{
		url: 'views/search.html',
		id: 'search',
	}, {
		url: 'views/topic.html',
		id: 'topic'
	}, {
		url: 'views/topic-list.html',
		id: 'topicList'
	}, {
		url: 'views/newsDetail.html',
		id: 'newsDetail'
	}, {
		url: 'views/newsGraphic.html',
		id: 'newsGraphic'
	}, {
		url: 'views/digitalNewspaper.html',
		id: 'digitalNewsPaper'
	}, {
		url: 'views/iframe.html',
		id: 'iframe'
	}, {
		url: 'views/login.html',
		id: 'login'
	}, {
		url: 'views/userInfo.html',
		id: 'userInfo'
	}, {
		url: 'views/interact.html',
		id: 'interact'
	}, {
		url: 'views/zan.html',
		id: 'zan'
	}, {
		url: 'views/cmt.html',
		id: 'cmt'
	}, {
		url: 'views/myInteract.html',
		id: 'myInteract'
	}],
});

// 判断扩展API是否准备，否则监听'plusready'事件
if(window.plus) {
	plusReady();
} else {
	document.addEventListener('plusready', plusReady, false);
}

var changeTab = function(el, self) {
	$('.main').hide();
	$('#' + el + '').show();
	self.addClass('active').siblings().removeClass('active');
}

var changeIndexTab = function(el, self) {
	$('.index-tab').hide();
	$('.' + el + '').show();
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

// banner滚动时更换标题
document.querySelector('.mui-slider').addEventListener('slide', function(event) {
	index.activeSlideText = index.scrollNews[event.detail.slideNumber].title;
})

// 扩展API加载完毕，现在可以正常调用扩展API 
function plusReady() {
	pullToRefresh();
	
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
			topicNews: [], //专题节目
			bHaveMore_headvideo: true, //顶部tab视频加载更多
			services: [], //服务
			zhiboUrl: 'http://app.zsputuo.com/zb/',
		},
		created: function() {
			this.frameHeight = window.outerHeight - 150 + 'px';
		},
		methods: {
			//跳转到专题分类页面
			goTopic: function() {
				openWindow('views/topic.html', 'topic');
			},
			goNews: function(i) {
				changeTab('news', $('.go-news'));
				news.activeSort = i;
			},
			gotoDetail: function(i) {
				var detailPage = null;
				//获得详情页面
				if(!detailPage) {
					detailPage = plus.webview.getWebviewById('newsDetail');
				}
				//触发详情页面的newsId事件
				mui.fire(detailPage, 'newsId', {
					id: i.id
				});
	
				openWindow('views/newsDetail.html', 'newsDetail');
			},
			goLife: function() {
				changeIndexTab('index-tab-3', $('.go-life'));
			},
			goVod: function() {
				changeIndexTab('index-tab-4', $('.go-vod'));
			},
			goNewsGraphic: function(i) {
				var detailPage = null;
				//获得详情页面
				if(!detailPage) {
					detailPage = plus.webview.getWebviewById('newsGraphic');
				}
				//触发详情页面的newsId事件
				mui.fire(detailPage, 'newsId', {
					id: i.id
				});
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
			//查看更多即时新闻
			gotoInstantNews: function() {
	
			},
			//跳转到某个具体专题节目列表
			gotoTopicList: function(i) {
				var detailPage = null;
				//获得主题页面
				if(!detailPage) {
					detailPage = plus.webview.getWebviewById('topicList');
					console.log(detailPage)
				}
				//触发详情页面的newsId事件
				mui.fire(detailPage, 'topicId', {
					id: i.id,
					title: i.name
				});
	
				openWindow('views/topic-list.html', 'topicList');
			},
	
			//顶部tab加载更多视频
			getVideoNews: function() {
				var self = this;
	
				var f = 10e5;
				if(self.videoNews.length) {
					f = _at(self.videoNews, -1).id;
				}
				
				plus.nativeUI.toast( "加载中...");
				
				_callAjax({
					cmd: "fetch",
					sql: "select * from articles where ifValid =1 and id<? and linkerId = ? order by id desc limit 5",
					vals: _dump([f, linkerId.videoNews])
				}, function(d) {
					plus.nativeUI.closeToast();
					if(!d.success || !d.data) {
						self.bHaveMore_headvideo = false;
						mui.toast("没有更多数据了");
						return;
					} else {
						self.bHaveMore_headvideo = true;
	
						d.data.forEach(function(r) {
							var arrImg = r.img.split(',');
							r.imgs = arrImg;
							self.videoNews.push(r);
						});
					}
				});
			},
	
			//跳转到服务链接
			gotoService: function(s) {
				var self = this;
	
				openWindow('views/iframe.html', 'iframe');
				mui.fire(plus.webview.getWebviewById('iframe'), 'getInfo', {
					title: s.name,
					url: s.url
				})
			}
		},
	
		mounted: function() {
			//获取新闻数据
			var self = this;
	
			//获取服务
			_callAjax({
				cmd: "fetch",
				sql: "select * from linkers where refId=?",
				vals: _dump([linkerId.services])
			}, function(d) {
				if(d.success && d.data) {
					d.data.forEach(function(r) {
						var dicService = {
							title: r.name,
							service: []
						};
	
						_callAjax({
							cmd: "fetch",
							sql: "select * from linkers where refId=?",
							vals: _dump([r.id])
						}, function(d) {
							if(d.success && d.data) {
								dicService.service = d.data;
								self.services.push(dicService);
								console.log(_dump(self.services))
							}
						});
					});
				}
			});
	
			//获取新闻
			_callAjax({
				cmd: "multiFetch",
				multi: _dump([{
						key: "scrollNews",
						sql: "select * from articles where ifValid =1 and linkerId = " + linkerId.scrollNews + " order by id desc limit 5"
					},
					{
						key: "headNews",
						sql: "select * from articles where ifValid =1 and linkerId = " + linkerId.headNews + " order by id desc limit 2"
					},
					{
						key: "instantNews",
						sql: "select * from articles where ifValid =1 and linkerId = " + linkerId.instantNews + " order by id desc limit 10"
					},
					{
						key: "putuoNews",
						sql: "select * from articles where ifValid =1 and linkerId = " + linkerId.putuoNews + " order by id desc limit 10"
					},
					{
						key: "videoNews",
						sql: "select * from articles where ifValid =1 and linkerId = " + linkerId.videoNews + " order by id desc limit 10"
					}
				])
			}, function(d) {
				if(d.success && d.data && d.data.scrollNews) {
					d.data.scrollNews.forEach(function(r) {
						var arrImg = r.img.split(',');
						r.imgs = arrImg;
						self.scrollNews.push(r);
					});
	
					self.activeSlideText = self.scrollNews[0].title;
	
				}
				if(d.success && d.data && d.data.headNews) {
					d.data.headNews.forEach(function(r) {
						var arrImg = r.img.split(',');
						r.imgs = arrImg;
						self.headNews.push(r);
					});
	
				}
				if(d.success && d.data && d.data.instantNews) {
					d.data.instantNews.forEach(function(r) {
						var arrImg = r.img.split(',');
						r.imgs = arrImg;
						self.instantNews.push(r);
					});
	
				}
				if(d.success && d.data && d.data.putuoNews) {
					d.data.putuoNews.forEach(function(r) {
						var arrImg = r.img.split(',');
						r.imgs = arrImg;
						self.putuoNews.push(r);
					});
				}
				if(d.success && d.data && d.data.videoNews) {
					d.data.videoNews.forEach(function(r) {
						var arrImg = r.img.split(',');
						r.imgs = arrImg;
						self.videoNews.push(r);
					});
				}
			});
	
			//获取专题节目
			_callAjax({
				cmd: "fetch",
				sql: "select * from linkers where linkerType = 'theme'"
			}, function(d) {
				if(d.success && d.data) {
					self.topicNews = d.data;
				}
			});
		}
	})
	
	//添加登录返回refresh自定义事件监听
	window.addEventListener('loginBack', function(event) {
		var userInfo = _load(_get('userInfo'));
	
		if(userInfo.id != null) {
			ucenter.isLogin = true;
			ucenter.userInfo = userInfo;
		} else {
			ucenter.isLogin = false;
		}
	})
	
	//新闻选项卡
	var news = new Vue({
		el: '#news',
		data: {
			newsSorts: ['即时新闻', '普陀新闻', '视频新闻'],
			activeSort: 0,
			instantNews: [],
			putuoNews: [],
			videoNews: [],
			bHaveMore_instant: true,
			bHaveMore_putuo: true,
			bHaveMore_video: true
		},
		beforeCreate: function() {},
		methods: {
			changeSort: function(i) {
				this.activeSort = i
			},
			gotoDetail: function(i) {
				var detailPage = null;
				//获得详情页面
				if(!detailPage) {
					detailPage = plus.webview.getWebviewById('newsDetail');
				}
	
				//触发详情页面的newsId事件
				mui.fire(detailPage, 'newsId', {
					id: i.id
				});
	
				openWindow('views/newsDetail.html', 'newsDetail');
			},
			goNewsGraphic: function(i) {
				var detailPage = null;
				//获得详情页面
				if(!detailPage) {
					detailPage = plus.webview.getWebviewById('newsGraphic');
				}
				//触发详情页面的newsId事件
				mui.fire(detailPage, 'newsId', {
					id: i.id
				});
				openWindow('views/newsGraphic.html', 'newsGraphic');
			},
			//获取即时新闻
			getInstantNews: function() {
				var self = this;
	
				var f = 10e5;
				if(self.instantNews.length) {
					f = _at(self.instantNews, -1).id;
				}
				plus.nativeUI.toast( "加载中...");
				//获取即时新闻
				_callAjax({
					cmd: "fetch",
					sql: "select * from articles where ifValid =1 and id<? and linkerId = ? order by id desc limit 10",
					vals: _dump([f, linkerId.instantNews])
				}, function(d) {
					plus.nativeUI.closeToast();
					if(!d.success || !d.data) {
						self.bHaveMore_instant = false;
						mui.toast("没有更多数据了");
						return;
					} else {
						self.bHaveMore_instant = true;
	
						d.data.forEach(function(r) {
							var arrImg = r.img.split(',');
							r.imgs = arrImg;
							self.instantNews.push(r);
						});
					}
				});
			},
	
			getPutuoNews: function() {
				var self = this;
	
				var f = 10e5;
				if(self.putuoNews.length) {
					f = _at(self.putuoNews, -1).id;
				}
				plus.nativeUI.toast( "加载中...");
	
				//获取普陀新闻
				_callAjax({
					cmd: "fetch",
					sql: "select * from articles where ifValid =1 and id<? and linkerId = ? order by id desc limit 10",
					vals: _dump([f, linkerId.putuoNews])
	
				}, function(d) {
					plus.nativeUI.closeToast();
					if(!d.success || !d.data) {
						self.bHaveMore_putuo = false;
						mui.toast("没有更多数据了");
						return;
					} else {
						self.bHaveMore_putuo = true;
	
						d.data.forEach(function(r) {
							var arrImg = r.img.split(',');
							r.imgs = arrImg;
							self.putuoNews.push(r);
						});
					}
				});
			},
	
			//获取视频新闻
			getVideoNews: function() {
				var self = this;
	
				var f = 10e5;
				if(self.videoNews.length) {
					f = _at(self.videoNews, -1).id;
				}
				plus.nativeUI.toast( "加载中...");
	
				_callAjax({
					cmd: "fetch",
					sql: "select * from articles where ifValid =1 and id<? and linkerId = ? order by id desc limit 10",
					vals: _dump([f, linkerId.videoNews])
	
				}, function(d) {
					plus.nativeUI.closeToast();
					if(!d.success || !d.data) {
						self.bHaveMore_video = false;
						mui.toast("没有更多数据了");
						return;
					} else {
						self.bHaveMore_video = true;
	
						d.data.forEach(function(r) {
							var arrImg = r.img.split(',');
							r.imgs = arrImg;
							self.videoNews.push(r);
						});
					}
				});
			}
		},
		mounted: function() {
			var self = this;
			self.getInstantNews();
			self.getPutuoNews();
			self.getVideoNews();
		}
	})
	
	
	var ucenter = new Vue({
		el: '#ucenter',
		data: {
			userInfo: '',
			isLogin: false,
		},
		beforeCreate: function() {
			this.userInfo = _load(_get('userInfo'));
		},
		methods: {
			goSuggest: function(i) {
				openWindow('views/iframe.html', 'iframe');
				mui.fire(plus.webview.getWebviewById('iframe'), 'getInfo', {
					title: '意见反馈',
					url: 'http://www.baidu.com/'
				})
			},
			goLogin: function() {
				// 判断是否已登录
				if(!this.isLogin) return openWindow('views/login.html', 'login');
				openWindow('views/userInfo.html', 'userInfo');
			},
			goZan: function() {
				if(!this.isLogin) return mui.toast("请先登录");
				openWindow('views/zan.html', 'zan');
			},
			goCmt: function() {
				if(!this.isLogin) return mui.toast("请先登录");
				openWindow('views/cmt.html', 'cmt');
			},
			goMyInteract: function() {
				if(!this.isLogin) return mui.toast("请先登录");
				openWindow('views/myInteract.html', 'myInteract');
			},
			logout: function() {
				var self = this;
	
				self.isLogin = false;
				self.userInfo = {};
				_set('userInfo', _dump(self.userInfo));
				mui.toast('退出成功');
			}
		},
		mounted: function() {
			var self = this;
	
			//获取个人信息
			if(self.userInfo.id != null) {
				_callAjax({
					cmd: "fetch",
					sql: "select * from User where phone = ? and pswd = ?",
					vals: _dump([self.userInfo.phone, self.userInfo.pswd])
				}, function(d) {
					if(d.success && d.data) {
	
						self.isLogin = true;
						self.userInfo = d.data[0];
						_set('userInfo', _dump(self.userInfo));
	
					} else {
						self.isLogin = false;
						self.userInfo = {};
						_set('userInfo', _dump(self.userInfo));
					}
				});
			}
		}
	})
	
}
