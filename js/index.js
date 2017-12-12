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
	setTimeout(function(){
		openWindow('views/search.html', 'search');
	},200)
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
	setTimeout(function(){
		openWindow('views/interact.html', 'interact');
	},200)
})

//跳转至个人中心
$('.go-ucenter').on('click', function() {
	changeTab('ucenter', $(this))
})

// 扩展API加载完毕，现在可以正常调用扩展API 
function plusReady() {
	pullToRefresh();
	
	//预加载页面
	mui.init({
		preloadPages: [{
			url: 'views/newsDetail.html',
			id: 'newsDetail'
		}, {
			url: 'views/digitalNewspaper.html',
			id: 'digitalNewsPaper'
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
	
	var topicPage = mui.preload({
	    url: 'views/topic.html',
	    id: 'topic',
	});
	
	var searchPage = mui.preload({
	    url: 'views/search.html',
	    id: 'search',
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
			topicNews: [], //专题节目
			bHaveMore_headvideo: true, //顶部tab视频加载更多
			services: [], //服务
			zhiboUrl: 'http://app.zsputuo.com/zb/',
			firstAd: {},  //首页广告
			secondAd: {},
			instantTopNews: [], //即时新闻置顶
			putuoTopNews: [], //普陀新闻置顶
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
				if(i.url != '#' && i.url.length > 1){
					mui.openWindow({
						url: 'views/iframe.html',
						id: 'iframe',
						extras: {
							title: i.title,
							url: i.url
						},
					})
				}else {
					var detailPage = null;
					//获得详情页面
					if(!detailPage) {
						detailPage = plus.webview.getWebviewById('newsDetail');
					}
					//触发详情页面的newsId事件
					mui.fire(detailPage, 'newsId', {});
					
					_set('newsId', i.id);
					
					setTimeout(function() {
						openWindow('views/newsDetail.html', 'newsDetail');
					}, 200)
				}
				
			},
			goLife: function() {
				changeIndexTab('index-tab-3', $('.go-life'));
			},
			goVod: function() {
				changeIndexTab('index-tab-4', $('.go-vod'));
			},
			//跳转到广告页面
			gotoFirstAd: function(){
				mui.openWindow({
					url: 'views/iframe.html',
					id: 'iframe',
					extras: {
						title: this.firstAd.title,
						url: this.firstAd.url
					},
				})
			},
			gotoSecondAd: function() {
				mui.openWindow({
					url: 'views/iframe.html',
					id: 'iframe',
					extras: {
						title: this.secondAd.title,
						url: this.secondAd.url
					},
				})
			},
			goNewsGraphic: function(i) {
				var detailPage = null;
				//获得详情页面
				if(!detailPage) {
					detailPage = plus.webview.getWebviewById('newsGraphic');
				}
				//触发详情页面的newsId事件
				mui.fire(detailPage, 'newsId', {
				});
				_set('newsId',i.id);

				setTimeout(function(){
					openWindow('views/newsGraphic.html', 'newsGraphic');
				},200)
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
				mui.openWindow({
					url: 'views/topic-list.html',
					id: 'topicList',
					extras: {
						i: i.id,
						title: i.name
					},
				})
			},
			//顶部tab加载更多视频
			getVideoNews: function() {
				var self = this;
	
				var f = 10e5;
				if(self.videoNews.length) {
					f = _at(self.videoNews, -1).id;
				}
				
				_callAjax({
					cmd: "fetch",
					sql: "select * from articles where ifValid =1 and id<? and linkerId = ? order by id desc limit 5",
					vals: _dump([f, linkerId.videoNews])
				}, function(d) {
					if(!d.success || !d.data) {
						self.bHaveMore_headvideo = false;
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
//				plus.webview.close('iframe');
//				mui.openWindow({
//					url: 'views/iframe.html',
//					id: 'iframe',
//					extras: {
//						title: s.name,
//						url: s.url
//					},
//				})

				plus.webview.open(s.url, 'iframe', {
					'titleNView': {
						'backgroundColor': '#009cff',
						'titleText': '' + s.name + '',
						'titleColor': '#fff',
						autoBackButton: false,
						progress: {
							color: '#F40'
						},
						buttons: [{
							text: '返回',
							float: 'left',
							onclick: function() {
								var wb = plus.webview.getWebviewById('iframe');
								wb.close();
							}
						}]
					},
					backButtonAutoControl: 'hide'
				});
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
							}
						});
					});
				}
			});
			
			//获取置顶的即时新闻
			_callAjax({
				cmd: "fetch",
				sql: "select id, title, img, content, linkerId, brief, reporter, url, readcnt, newsdate, subtitle, strftime('%Y-%m-%d %H:%M', logtime) as logtime from articles where ifValid =1 and linkerId = " + linkerId.instantNews + " and reference like '%2%'" + " order by id desc limit 1"
			}, function(d) {
				var sqlInstant = '';
				if(d.success && d.data) {
					d.data.forEach(function(r) {
						var arrImg = r.img.split(',');
						r.imgs = arrImg;
						self.instantTopNews.push(r);
					});	
					
					sqlInstant = "select id, title, img, content, linkerId, brief, reporter, url, readcnt, newsdate, subtitle, strftime('%Y-%m-%d %H:%M', logtime) as logtime from articles where ifValid =1 and id <> " + d.data[0].id + " and linkerId = " + linkerId.instantNews + " order by id desc limit 4";
				}else {
					sqlInstant = "select id, title, img, content, linkerId, brief, reporter, url, readcnt, newsdate, subtitle, strftime('%Y-%m-%d %H:%M', logtime) as logtime from articles where ifValid =1 and linkerId = " + linkerId.instantNews + " order by id desc limit 5";
				}
				
				//获取除置顶外的即时新闻
				_callAjax({
					cmd: "fetch",
					sql: sqlInstant
				}, function(d) {
					d.data.forEach(function(r) {
						var arrImg = r.img.split(',');
						r.imgs = arrImg;
						self.instantNews.push(r);
					});
				});
			});
			
			//获取置顶的普陀新闻
			_callAjax({
				cmd: "fetch",
				sql: "select id, title, img, content, linkerId, brief, reporter, url, readcnt, newsdate, subtitle, strftime('%Y-%m-%d %H:%M', logtime) as logtime from articles where ifValid =1 and linkerId = " + linkerId.putuoNews + " and reference like '%2%'" + " order by id desc limit 1"
			}, function(d) {
				var sqlPutuo = '';
				if(d.success && d.data) {
					d.data.forEach(function(r) {
						var arrImg = r.img.split(',');
						r.imgs = arrImg;
						self.putuoTopNews.push(r);
					});	
					
					sqlPutuo = "select id, title, img, content, linkerId, brief, reporter, url, readcnt, newsdate, subtitle, strftime('%Y-%m-%d %H:%M', logtime) as logtime from articles where ifValid =1 and id <> " + d.data[0].id + " and linkerId = " + linkerId.putuoNews + " order by id desc limit 4";
				}else {
					sqlPutuo = "select id, title, img, content, linkerId, brief, reporter, url, readcnt, newsdate, subtitle, strftime('%Y-%m-%d %H:%M', logtime) as logtime from articles where ifValid =1 and linkerId = " + linkerId.putuoNews + " order by id desc limit 5";
				}
				
				//获取除置顶外的即时新闻
				_callAjax({
					cmd: "fetch",
					sql: sqlPutuo
				}, function(d) {
					d.data.forEach(function(r) {
						var arrImg = r.img.split(',');
						r.imgs = arrImg;
						self.putuoNews.push(r);
					});
				});
			});
	
			//获取新闻  reference包含0：滚动 1：头条
			_callAjax({
				cmd: "multiFetch",
				multi: _dump([{
						key: "scrollNews",
						sql: "select id, title, img, content, linkerId, brief, reporter, url, readcnt, newsdate, subtitle, strftime('%Y-%m-%d %H:%M', logtime) as logtime from articles where ifValid =1 and linkerId = " + linkerId.putuoNews + " and reference like '%0%'" + " order by id desc limit 5"
					},
					{
						key: "headNews",
						sql: "select id, title, img, content, linkerId, brief, reporter, url, readcnt, newsdate, subtitle, strftime('%Y-%m-%d %H:%M', logtime) as logtime from articles where ifValid =1 and linkerId = " + linkerId.putuoNews + " and reference like '%1%'" + " order by id desc limit 1"
					},
					{
						key: "videoNews",
						sql: "select id, title, img, content, linkerId, brief, reporter, url, readcnt, newsdate, subtitle, strftime('%Y-%m-%d %H:%M', logtime) as logtime from articles where ifValid =1 and linkerId = " + linkerId.videoNews + " order by id desc limit 10"
					}
				])
			}, function(d) {
				if(d.success && d.data && d.data.scrollNews) {
					d.data.scrollNews.forEach(function(r, i) {
						var arrImg = r.img.split(',');
						r.imgs = arrImg;
						self.scrollNews.push(r);
					});
	
					self.activeSlideText = self.scrollNews[0].title;
					setTimeout(function(){
						var swiper = new Swiper('.index-swiper', {
							pagination: '.swiper-pagination',
							onSlideChangeEnd: function(swiper){
						      	self.activeSlideText = self.scrollNews[swiper.activeIndex].title
							}
						});
					}, 500)
				}
				if(d.success && d.data && d.data.headNews) {
					d.data.headNews.forEach(function(r) {
						var arrImg = r.img.split(',');
						r.imgs = arrImg;
						self.headNews.push(r);
					});
				}
//				if(d.success && d.data && d.data.instantNews) {
//					d.data.instantNews.forEach(function(r) {
//						var arrImg = r.img.split(',');
//						r.imgs = arrImg;
//						self.instantNews.push(r);
//					});
//				}
//				if(d.success && d.data && d.data.putuoNews) {
//					d.data.putuoNews.forEach(function(r) {
//						var arrImg = r.img.split(',');
//						r.imgs = arrImg;
//						self.putuoNews.push(r);
//					});
//				}
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
				sql: "select * from linkers where refId = "+linkerId.topicSort
			}, function(d) {
				if(d.success && d.data) {
					self.topicNews = d.data;
				}
			});
			
			//获取广告
			_callAjax({
				cmd: "fetch",
				sql: "select id, title, img, url, ifValid from articles where linkerId = 119 order by id desc limit 2"
			}, function(d) {
				if(d.success && d.data) {
					self.firstAd = d.data[0];
					self.secondAd = d.data[1];
				}
			});
			
			//获取非法字，存storage
			_callAjax({
				cmd: "fetch",
				sql: "select id, content from illegalWords where ifValid = 1"
			}, function(d) {
				
				if(d.success && d.data) {
					var illegalWords = d.data;
					_set('illegal',_dump(illegalWords));
				}
			});
			
		}
	})
	
	//添加登录返回refresh自定义事件监听
	window.addEventListener('loginBack', function(event) {
		var userInfo = _load(_get('userInfo'));
	
		_tell(userInfo);
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
				if(i.url != '#' && i.url.length > 1){
					mui.openWindow({
						url: 'views/iframe.html',
						id: 'iframe',
						extras: {
							title: i.title,
							url: i.url
						},
					})
				}else {
					var detailPage = null;
					//获得详情页面
					if(!detailPage) {
						detailPage = plus.webview.getWebviewById('newsDetail');
					}
					
					//触发详情页面的newsId事件
					mui.fire(detailPage, 'newsId', {});
					_set('newsId', i.id);
					setTimeout(function() {
						openWindow('views/newsDetail.html', 'newsDetail');
					}, 200)
				}
				
			},
			goNewsGraphic: function(i) {
				mui.openWindow({
					url: 'views/newsGraphic.html',
					id: 'newsGraphic',
				})
				_set('newsId', i.id);
			},
			//获取即时新闻
			getInstantNews: function() {
				var self = this;
	
				var f = 10e5;
				if(self.instantNews.length) {
					f = _at(self.instantNews, -1).id;
				}
				//获取即时新闻
				_callAjax({
					cmd: "fetch",
					sql: "select * from articles where ifValid =1 and id<? and linkerId = ? order by id desc limit 10",
					vals: _dump([f, linkerId.instantNews])
				}, function(d) {
					if(!d.success || !d.data) {
						self.bHaveMore_instant = false;
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
	
				//获取普陀新闻
				_callAjax({
					cmd: "fetch",
					sql: "select * from articles where ifValid =1 and id<? and linkerId = ? order by id desc limit 10",
					vals: _dump([f, linkerId.putuoNews])
	
				}, function(d) {
					if(!d.success || !d.data) {
						self.bHaveMore_putuo = false;
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
	
				_callAjax({
					cmd: "fetch",
					sql: "select * from articles where ifValid =1 and id<? and linkerId = ? order by id desc limit 10",
					vals: _dump([f, linkerId.videoNews])
	
				}, function(d) {
					if(!d.success || !d.data) {
						self.bHaveMore_video = false;
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
			userInfo: {},
			isLogin: false,
			isNew: false,
			androidUpdate: false
		},
		methods: {
			goSuggest: function(i) {
				mui.openWindow({
					url: 'views/iframe.html',
					id: 'iframe',
					extras: {
						title: '意见反馈',
						url: 'http://develop.wifizs.cn/dist/channel/activity/form/views/ptappform.html?formId=22'
					},
				})
			},
			goLogin: function() {
				// 判断是否已登录
				if(!this.isLogin) return openWindow('views/login.html', 'login');
				mui.fire(plus.webview.getWebviewById('userInfo'), 'getInfo', {})
				setTimeout(function(){
					openWindow('views/userInfo.html', 'userInfo');
				},200)
			},
			goZan: function() {
				if(!this.isLogin) return mui.toast("请先登录");
				var detailPage = null;
				if(!detailPage) {
					detailPage = plus.webview.getWebviewById('zan');
				}
				mui.fire(detailPage, 'zan', {});
				
				setTimeout(function(){
					openWindow('views/zan.html', 'zan');
				},200)
			},
			goCmt: function() {
				if(!this.isLogin) return mui.toast("请先登录");
				var detailPage = null;
				if(!detailPage) {
					detailPage = plus.webview.getWebviewById('cmt');
				}
				mui.fire(detailPage, 'cmt', {});

				setTimeout(function(){
					openWindow('views/cmt.html', 'cmt');
				},200)
			},
			goMyInteract: function() {
				if(!this.isLogin) return mui.toast("请先登录");
				var detailPage = null;
				if(!detailPage) {
					detailPage = plus.webview.getWebviewById('myInteract');
				}
				mui.fire(detailPage, 'myInteract', {});
				
				setTimeout(function(){
					openWindow('views/myInteract.html', 'myInteract');
				},200)
			},
			logout: function() {
				var self = this;
	
				self.isLogin = false;
				self.userInfo = {};
				plus.storage.removeItem('userInfo');
				mui.toast('退出成功');
			},
			clearCache: function() {
				plus.cache.clear(function() {
					mui.toast('已清理');
				})
			},
			// 检查新版本
			checkNewVersion: function(){
				var self = this;
				
				var dicVersion = _load(_get('version'));
				var curVersion = plus.runtime.version;

				if(curVersion < dicVersion.version){
					mui.confirm('发现新版本v' + dicVersion.version + '，是否更新?', '', ['更新', '取消'], function(e) {
						if(e.index == 0) {
							mui.toast('请使用浏览器打开');
							
							plus.runtime.openURL(dicVersion.downloadUrl, function(){
								mui.toast('浏览器调用失败，请前往应用中心更新');
							});
						}
					})
				}else{
					mui.toast("已是最新版本");
				}
			}
		},
		mounted: function() {
			var self = this;
			self.userInfo = _load(_get('userInfo'));
			
			//获取个人信息
			if(self.userInfo != null) {
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
						mui.toast('非法的用户信息');
						self.isLogin = false;
						self.userInfo = {};
						plus.storage.removeItem('userInfo');
					}
				});
			}
			
			//获取版本号
			_callAjax({
				cmd: "fetch",
				sql: "select * from system"
			}, function(d) {
				if(d.success && d.data) {
					var dicVersion = d.data[0];
					
					_set('version', _dump(dicVersion));
					
					var curVersion = plus.runtime.version;
					
					if(curVersion < dicVersion.version) {
						self.isNew = true;
					}else{
						self.isNew = false;
					}
				}
			});
		}
	})
	
	if ('Android' == plus.os.name) {
		ucenter.androidUpdate = true;
		var first = null;
		mui.back = function() {
			if (!first) {
				first = new Date().getTime();
				mui.toast('再按一次退出应用');
				setTimeout(function() {
					first = null;
				}, 1000);
			} else {
				if (new Date().getTime() - first < 1000) {
					plus.runtime.quit();
				}
			}
		}
	}
}