var dns = new Vue({
	el: '#digitalNewspaper',
	data: {
		pages: [],		//所有页面数据 
		menus: [],		//总分类
		activePage: 0,	//当前显示第几版的报纸
		curDate: '',	//当前日期供取数据使用
		curWeek: '',	//当前周期供显示用
		curPage: '',	//当前报纸标题
		menuShow: false,
		detailShow: false,
		curArticle: {}
	},
	methods: {
		//获取报纸
		getPapers: function() {
			var self = this;
			_callAjax({
				cmd: 'fetch',
				sql: 'select div, class, date from Dad where date = (select date from Dad order by date desc limit 1)'
			}, function(d) {
				if(d.data && d.success) {
					d.data.forEach(function(p,i) {
						self.pages.push(p.div);
						self.menus.push({title: p.class.split('：')[1], menu: []});
					})
					self.curDate = d.data[0].date;
					self.getMenus();
					self.curWeek = self.getCurWeek(d.data[0].date);
					self.curPage = self.menus[0].title;
					setTimeout(function() {
						swiper = new Swiper('.swiper-container', {
							onSlideChangeEnd: function(swiper) {
								self.curPage = self.menus[swiper.activeIndex].title;
								self.activePage = swiper.activeIndex;
							}
						});
						self.areaClickFn();
					}, 500)
				}
			});
		},
		getMenus: function() {
			var self = this;

			_callAjax({
				cmd: 'fetch',
				sql: 'select id, title, page from Son where date = ?',
				vals:_dump([self.curDate])
			}, function(d) {
				var arr = [];
				if(d.data && d.success) {
					self.menus.forEach(function(menu, mi) {
						d.data.forEach(function(d, di) {
							if(mi + 1 == d.page) menu.menu.push({id: d.id, title: d.title});
						})
					})
				}
			})
		},
		areaClickFn: function() {
			var self = this;
			var _areas = document.getElementsByTagName('area');
			for(j = 0; j < _areas.length; j++) {
				(function(i) {
					_areas[i].onclick = function() {
						_callAjax({
							cmd: 'fetch',
							sql: 'select beginTit,class,title,text from Son where date = ? and page = ? and piece = ? ',
							vals: _dump([self.curDate, self.activePage + 1, _areas[i].getAttribute('data-id')])
						}, function(d) {
							if(d.data && d.success) {
								self.curArticle.title = d.data[0].title;
								self.curArticle.mainTitle = d.data[0].beginTit;
								self.curArticle.subTitle = d.data[0].behindTit;
								self.curArticle.article = d.data[0].text
								self.detailShow = true;
							}
						});
					}
				})(j);
			}
		},
		getCurWeek: function(dateString) {
			var date;
	        var dateArray = dateString.split("-");
	        date = new Date(dateArray[0], parseInt(dateArray[1] - 1), dateArray[2]);
		    return "星期" + "日一二三四五六".charAt(date.getDay());
		},
		morePage: function() {
			var picker = new mui.PopPicker();
			var self = this;
			var arr = [];
			self.menus.forEach(function(d, i) {
				arr.push({value: i, text: d.title})
			})
			picker.setData(arr);
			picker.show(function(items) {
				self.curPage = items[0].text;
				self.activePage = items[0].value;
				swiper.slideTo(items[0].value, 1000, false);
			});
		},
		chooseDate: function() {
			var self = this;
			var dateBtn = $('.date-btn');
			var options = {
				type: 'date',
				beginYear: '2010',
				endYear: '2030'
			};
			var picker = new mui.DtPicker(options);
			picker.show(function(rs) {
				_callAjax({
						cmd: 'fetch',
						sql: 'select class, div, date from Dad where date = ?',
						vals: _dump([rs.text])
					}, function(d) {
						if(d.data && d.success) {
							swiper.slideTo(0, 1, false);
							swiper.destroy();
							self.pages = [];
							self.menus = [];
							
							d.data.forEach(function(p,i) {
								self.pages.push(p.div);
								self.menus.push({title: p.class.split('：')[1], menu: []});
							})
							
							self.curDate = rs.text;
							self.curPage = d.data[0].class.split('：')[1];
							self.curWeek = self.getCurWeek(rs.text);
							self.activePage = 0;
							self.getMenus();
							
							setTimeout(function() {
								swiper = new Swiper('.swiper-container', {
									onSlideChangeEnd: function(swiper) {
										self.curPage = self.menus[swiper.activeIndex].title;
										self.activePage = swiper.activeIndex;
									}
								});
								self.areaClickFn();
							}, 500)
						}else {
							mui.toast('此日期无报纸信息');
						}
					}
				)
//				dateBtn.picker.dispose();
//				dateBtn.picker = null;
			});
		},
		openDetail: function(d) {
			var self = this;
			_callAjax({
				cmd: 'fetch',
				sql: 'select class, title, beginTit, behindTit, text from Son where id = ?',
				vals: _dump([d])
			}, function(d) {
				_tell(d.data[0].text)
				if(d.success && d.data) {
					self.curArticle.title = d.data[0].title;
					self.curArticle.mainTitle = d.data[0].beginTit;
					self.curArticle.subTitle = d.data[0].behindTit;
					self.curArticle.article = d.data[0].text
					self.detailShow = true;
				}
			});
		},
		closeDetail: function() {
			this.detailShow = false;
			this.curArticle = {};
		}
	},
	created: function() {
		var self = this;
		self.getPapers();
	},
})

// 扩展API加载完毕，现在可以正常调用扩展API
function plusReady() {
	var oldback = mui.back;
	mui.back = function() {
		if(dns.detailShow) return dns.detailShow = false;
	    if(dns.menuShow) return dns.menuShow = false;
	    oldback();
	}
}

// 判断扩展API是否准备，否则监听'plusready'事件
if(window.plus) {
	plusReady();
} else {
	document.addEventListener('plusready', plusReady, false);
}