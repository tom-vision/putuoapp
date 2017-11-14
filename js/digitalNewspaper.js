var oneclass = ''; // 第一版版面
var twoclass = ''; // 第二版版面
var threeclass = ''; // 第三版版面
var fourclass = ''; // 第四版版面
var easyoneclass = ''; // 第一版版面名称
var easytwoclass = ''; // 第二版版面名称
var easythreeclass = ''; // 第三版版面名称
var easyfourclass = ''; // 第四版版面名称
activepage = 1; // 活跃版面

var menu = new Vue({
	el: '.digitalNewspaper-menu-popup',
	data: {
		show: false,
		date: '', // 日期
		menu_class1: '', // 第一版版面
		menu_class2: '', // 第二版版面
		menu_class3: '', // 第三版版面
		menu_class4: '', // 第四版版面
		menu_items0: [], // 第一版的详情内容
		menu_items1: [], // 第二版的详情内容
		menu_items2: [], // 第三版的详情内容
		menu_items3: [], // 第四版的详情内容
	},
	created: function() {
		var self = this;
		this.date = self.getNowFormatDate();
		self.getpartTwo();
		self.getpartThree();
	},
	methods: {
		getNowFormatDate: function() {
			var self = this;
			var date = new Date();
			var seperator1 = "-";
			var year = date.getFullYear();
			var month = date.getMonth() + 1;
			var strDate = date.getDate();
			if(month >= 1 && month <= 9) {
				month = "0" + month;
			}
			if(strDate >= 0 && strDate <= 9) {
				strDate = "0" + strDate;
			}
			var currentdate = year + seperator1 + month + seperator1 + strDate;
			return currentdate;
		},
		closeMenu: function() {
			this.show = false;
		},
		openDetail: function(i) {
			var paperId = parseInt(i.id);
			_callAjax({
				cmd: 'fetch',
				sql: 'select class,title,beginTit,behindTit,text from Son where id = ?',
				vals: _dump([paperId, ])
			}, function(d) {
				if(d.success && d.data) {
					detail.show = true;
					detail.detail_class = d.data[0].class;
					detail.detail_begintitle = d.data[0].beginTit;
					detail.detail_title = d.data[0].title;
					detail.detail_message = d.data[0].text;
				}
			});
		},
		getpartTwo: function() {
			var self = this;
			_callAjax({
				cmd: 'fetch',
				sql: 'select class from Dad where date = ?',
				vals: _dump([self.date, ])
			}, function(d) {
				if(d.success && d.data) {
					self.menu_class1 = d.data[0].class;
					oneclass = d.data[0].class;
					self.menu_class2 = d.data[1].class;
					twoclass = d.data[1].class;
					self.menu_class3 = d.data[2].class;
					threeclass = d.data[2].class;
					self.menu_class4 = d.data[3].class;
					fourclass = d.data[3].class;
				}
			});
		},
		getpartThree: function() {
			var self = this;
			_callAjax({
				cmd: 'fetch',
				sql: 'select title,id from Son where date = ? and page = ?',
				vals: _dump([self.date, 1, ])
			}, function(d) {
				if(d.success && d.data) {
					self.menu_items0 = d.data;
				}
			});
			_callAjax({
				cmd: 'fetch',
				sql: 'select title,id from Son where date = ? and page = ?',
				vals: _dump([self.date, 2, ])
			}, function(d) {
				if(d.success && d.data) {
					self.menu_items1 = d.data;
				}
			});
			_callAjax({
				cmd: 'fetch',
				sql: 'select title,id from Son where date = ? and page = ?',
				vals: _dump([self.date, 3, ])
			}, function(d) {
				if(d.success && d.data) {
					self.menu_items2 = d.data;
				}
			});
			_callAjax({
				cmd: 'fetch',
				sql: 'select title,id from Son where date = ? and page = ?',
				vals: _dump([self.date, 4, ])
			}, function(d) {
				if(d.success && d.data) {
					self.menu_items3 = d.data;
				}
			});
		},
	}
})

var detail = new Vue({
	el: '.digitalNewspaper-detail-popup',
	data: {
		show: false,
		detail_class: '', // 新闻所属版面
		detail_title: '', // 新闻标题
		detail_begintitle: '', // 新闻前标题
		detail_message: '', // 新闻详情
	},
	methods: {
		closeDetail: function() {
			this.show = false;
		},
	}
})

var pic = new Vue({
	el: '#digitalNewspaper',
	data: {
		date: '',
		Pic_one: '',
		Pic_two: '',
		Pic_three: '',
		Pic_four: '',
	},
	created: function() {
		var self = this;
		self.date = self.getNowFormatDate();
		self.getpartOne();
	},
	methods: {
		getpartOne: function() {
			var self = this;
			_callAjax({
				cmd: 'fetch',
				sql: 'select div from Dad where date = ?',
				vals: _dump([self.date, ])
			}, function(d) {
				if(d.data && d.success) {
					self.Pic_one = d.data[0].div;
					self.Pic_two = d.data[1].div;
					self.Pic_three = d.data[2].div;
					self.Pic_four = d.data[3].div;
				} else {
				}
			});
		},
		getNowFormatDate: function() {
			var self = this;
			var date = new Date();
			var seperator1 = "-";
			var year = date.getFullYear();
			var month = date.getMonth() + 1;
			var strDate = date.getDate();
			if(month >= 1 && month <= 9) {
				month = "0" + month;
			}
			if(strDate >= 0 && strDate <= 9) {
				strDate = "0" + strDate;
			}
			var currentdate = year + seperator1 + month + seperator1 + strDate;
			return currentdate;
		},
	}
})

var tab = new Vue({
	el: '#tab',
	data: {
		pageTitle: '',
		date: '',
		week: '',
		tab_class: '',
	},
	created: function() {
		var self = this;
		self.date = self.getNowFormatDate();
		self.getweek();
		self.getpageTitle();
	},
	methods: {
		getNowFormatDate: function() {
			var self = this;
			var date = new Date();
			var seperator1 = "-";
			var year = date.getFullYear();
			var month = date.getMonth() + 1;
			var strDate = date.getDate();
			if(month >= 1 && month <= 9) {
				month = "0" + month;
			}
			if(strDate >= 0 && strDate <= 9) {
				strDate = "0" + strDate;
			}
			var currentdate = year + seperator1 + month + seperator1 + strDate;
			return currentdate;
		},
		morePage: function() {
			var picker = new mui.PopPicker();
			var self = this;
			picker.setData([{
				value: '0',
				text: oneclass
			}, {
				value: '1',
				text: twoclass
			}, {
				value: '2',
				text: threeclass
			}, {
				value: '3',
				text: fourclass
			}]);
			picker.show(function(items) {
				var item = items[0];
				var text = item.text;
				var title = text.split('：')[1];
				var value = item.value;
				self.pageTitle = title;
				if(item.value == '0') {
					activepage = 1;
				} else if(item.value == '1') {
					activepage = 2;
				} else if(item.value == '2') {
					activepage = 3;
				} else {
					activepage = 4;
				}
				var swiper = new Swiper('.swiper-container', {
					onSlideChangeEnd: function(swiper) {}
				});
				swiper.slideTo(parseInt(value), 1000, false);
				//返回 false 可以阻止选择框的关闭
				//return false;
			});
		},
		getweek: function() {
			var self = this;
			var w = new Date().getDay();
			if(w == 0) {
				self.week = "星期日";
			} else if(w == 1) {
				self.week = "星期一";
			} else if(w == 2) {
				self.week = "星期二";
			} else if(w == 3) {
				self.week = "星期三";
			} else if(w == 4) {
				self.week = "星期四";
			} else if(w == 5) {
				self.week = "星期五";
			} else if(w == 6) {
				self.week = "星期六";
			}
		},
		getpageTitle: function() {
			var self = this;
			_callAjax({
				cmd: 'fetch',
				sql: 'select class from Dad where date = ?',
				vals: _dump([self.date, ])
			}, function(d) {
				if(d.success && d.data) {
					var str = d.data[0].class;
					str = str.split("：");
					self.pageTitle = str[1];
				}
			});
		},
		openMenu: function() {
			menu.show = true;
		},
		getNowFormatDate: function() {
			var date = new Date();
			var seperator1 = "-";
			var year = date.getFullYear();
			var month = date.getMonth() + 1;
			var strDate = date.getDate();
			if(month >= 1 && month <= 9) {
				month = "0" + month;
			}
			if(strDate >= 0 && strDate <= 9) {
				strDate = "0" + strDate;
			}
			var currentdate = year + seperator1 + month + seperator1 + strDate;
			return currentdate;
		},
		chooseDate: function() {
			var self = this;
			var _self = $('.date-btn');
			var result = '';
			if(_self.picker) {
				_self.picker.show(function(rs) {
					tab.date = rs.text;
					_self.picker.dispose();
					_self.picker = null;
				});
			} else {
				var options = {
					type: 'date',
					value: self.get,
					beginYear: '2010',
					endYear: '2030'
				};
				var id = _self.attr('id');
				_self.picker = new mui.DtPicker(options);
				_self.picker.show(function(rs) {
					/*
					 * rs.value 拼合后的 value
					 * rs.text 拼合后的 text
					 * rs.y 年，可以通过 rs.y.vaue 和 rs.y.text 获取值和文本
					 * rs.m 月，用法同年
					 * rs.d 日，用法同年
					 */
					_callAjax({
						cmd: 'fetch',
						sql: 'select class,div from Dad where date = ?',
						vals: _dump([rs.text, ])
					}, function(d) {
						if(d.data && d.success) {
							tab.date = rs.text;
							var arys1 = new Array();
							arys1 = rs.text.split('-');
							var ssdate = new Date(arys1[0], parseInt(arys1[1] - 1), arys1[2]);
							var week1 = String(ssdate.getDay()).replace("0", "日").replace("1", "一").replace("2", "二").replace("3", "三").replace("4", "四").replace("5", "五").replace("6", "六"); //就是你要的星期几
							tab.week = "星期" + week1;
							var str1 = d.data[0].class;
							var str2 = d.data[1].class;
							var str3 = d.data[2].class;
							var str4 = d.data[3].class;
							if(swiper.activeIndex == 0) {
								tab.pageTitle = str1.split("：")[1];
							} else if(swiper.activeIndex == 1) {
								tab.pageTitle = str2.split("：")[1];
							} else if(swiper.activeIndex == 2) {
								tab.pageTitle = str3.split("：")[1];
							} else {
								tab.pageTitle = str4.split("：")[1];
							}
							oneclass = d.data[0].class;
							twoclass = d.data[1].class;
							threeclass = d.data[2].class;
							fourclass = d.data[3].class;
							pic.Pic_one = d.data[0].div;
							pic.Pic_two = d.data[1].div;
							pic.Pic_three = d.data[2].div;
							pic.Pic_four = d.data[3].div;
							setTimeout(function() {
								var _areas = document.getElementsByTagName('area');
								for(j = 0; j < _areas.length; j++) {
									(function(i) {
										_areas[i].onclick = function() {
											detail.show = true;
											var piece = parseInt(_areas[i].getAttribute('data-id'));
											_callAjax({
												cmd: 'fetch',
												sql: 'select beginTit,class,title,text from Son where date = ? and page = ? and piece = ? ',
												vals: _dump([rs.text, activepage, piece, ])
											}, function(d) {
												if(d.data && d.success) {
													detail.detail_class = d.data[0].class;
													detail.detail_begintitle = d.data[0].beginTit;
													detail.detail_title = d.data[0].title;
													detail.detail_message = d.data[0].text;
												}
											});
										}
									})(j);
								}
							}, 1000);
							_callAjax({
								cmd: 'fetch',
								sql: 'select title,id from Son where date = ? and page = ?',
								vals: _dump([rs.text, "1", ])
							}, function(d) {
								if(d.data && d.success) {
									menu.menu_items0 = d.data;
								}
							});
							_callAjax({
								cmd: 'fetch',
								sql: 'select title,id from Son where date = ? and page = ?',
								vals: _dump([rs.text, "2", ])
							}, function(d) {
								if(d.data && d.success) {
									menu.menu_items1 = d.data;
								}
							});
							_callAjax({
								cmd: 'fetch',
								sql: 'select title,id from Son where date = ? and page = ?',
								vals: _dump([rs.text, "3", ])
							}, function(d) {
								if(d.data && d.success) {
									menu.menu_items2 = d.data;
								}
							});
							_callAjax({
								cmd: 'fetch',
								sql: 'select title,id from Son where date = ? and page = ?',
								vals: _dump([rs.text, "4", ])
							}, function(d) {
								if(d.data && d.success) {
									menu.menu_items3 = d.data;
								}
							});
						} else {
						}
					});
					/* 
					 * 返回 false 可以阻止选择框的关闭
					 * return false;
					 */
					/*
					 * 释放组件资源，释放后将将不能再操作组件
					 * 通常情况下，不需要示放组件，new DtPicker(options) 后，可以一直使用。
					 * 当前示例，因为内容较多，如不进行资原释放，在某些设备上会较慢。
					 * 所以每次用完便立即调用 dispose 进行释放，下次用时再创建新实例。
					 */
					_self.picker.dispose();
					_self.picker = null;
				});
			}
		}
	}
})

setTimeout(function() {
	var _areas = document.getElementsByTagName('area');
	for(j = 0; j < _areas.length; j++) {
		(function(i) {
			_areas[i].onclick = function() {
				detail.show = true;
				var piece = parseInt(_areas[i].getAttribute('data-id'));
				var page = activepage;
				_callAjax({
					cmd: 'fetch',
					sql: 'select beginTit,class,title,text from Son where date = ? and page = ? and piece = ? ',
					vals: _dump([pic.date, page, piece, ])
				}, function(d) {
					if(d.data && d.success) {
						detail.detail_class = d.data[0].class;
						detail.detail_begintitle = d.data[0].beginTit;
						detail.detail_title = d.data[0].title;
						detail.detail_message = d.data[0].text;
					}
				});
			}
		})(j);
	}
}, 1000);

var swiper = new Swiper('.swiper-container', {
	onSlideChangeEnd: function(swiper) {
		if(swiper.activeIndex == 0) {
			tab.pageTitle = oneclass.split("：")[1];
			activepage = 1;
		} else if(swiper.activeIndex == 1) {
			tab.pageTitle = twoclass.split("：")[1];
			activepage = 2;
		} else if(swiper.activeIndex == 2) {
			tab.pageTitle = threeclass.split("：")[1];
			activepage = 3;
		} else {
			tab.pageTitle = fourclass.split("：")[1];
			activepage = 4;
		}

	}
});

// 扩展API加载完毕，现在可以正常调用扩展API
function plusReady() {
	// 报纸返回
	var oldback = mui.back;
	mui.back = function() {
	    if(detail.show) {
	    	detail.show = false;
	    	$('body').removeClass('no-scroll');
	    	return false;
	    }
	    if(menu.show){
	    	menu.show = false;
	    	$('body').removeClass('no-scroll');
	    	return false;
	    }
	    oldback();
	}
}

// 判断扩展API是否准备，否则监听'plusready'事件
if(window.plus) {
	plusReady();
} else {
	document.addEventListener('plusready', plusReady, false);
}