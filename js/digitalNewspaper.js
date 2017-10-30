var oneclass = ''; // 第一版版面
var twoclass = ''; // 第二版版面
var threeclass = ''; // 第三版版面
var fourclass = ''; // 第四版版面

var menu = new Vue({
	el: '.digitalNewspaper-menu-popup',
	data: {
		show: false,
		date:'', // 日期
		Catalog_class0: '', // 第一版版面
		Catalog_class1: '', // 第二版版面
		Catalog_class2: '', // 第三版版面
		Catalog_class3: '', // 第四版版面
		Catalog_items0: [], // 第一版的详情内容
		Catalog_items1: [], // 第二版的详情内容
		Catalog_items2: [], // 第三版的详情内容
		Catalog_items3: [], // 第四版的详情内容
	},
	created: function() {
		var self = this;
		var d = new Date();
		var mouth = d.getMonth() + 1;
		this.date = d.getFullYear() + '-' + mouth + '-' + d.getDate();
		self.getpartTwo()
		self.getpartThree();
	},
	methods: {
		closeMenu: function() {
			this.show = false;
		},
		openDetail: function(i) {
			var paperId = parseInt(i.id);
			_callAjax({
				cmd:'fetch',
				sql:'select class,title,beginTit,behindTit,text from Son where id = ?',
				vals:_dump([paperId,])
			},function(d){
				if(d.success&&d.data){
					detail.show = true;
					detail.article_class = d.data[0].class;
					detail.article_begintitle = d.data[0].beginTit;
					detail.article_title = d.data[0].title;
					detail.article_message = d.data[0].text;
				}
			});
		},
		getpartTwo:function(){
			var self = this;
			_callAjax({
				cmd:'fetch',
				sql:'select class from Dad where time = ?',
				vals:_dump([self.date,])
			},function(d){
				if(d.success&&d.data){
					self.Catalog_class0 = d.data[0].class;
					oneclass = d.data[0].class;
					self.Catalog_class1 = d.data[1].class;
					twoclass = d.data[1].class;
					self.Catalog_class2 = d.data[2].class;
					threeclass = d.data[2].class;
					self.Catalog_class3 = d.data[3].class;
					fourclass = d.data[3].class;
				}
			});
		},
		getpartThree:function(){
			var self = this;
			_callAjax({
				cmd:'fetch',
				sql:'select title,id from Son where time = ? and page = ?',
				vals:_dump([self.date,"1",])
			},function(d){
				if(d.success&&d.data){
					self.Catalog_items0 = d.data;
				}
			});
			_callAjax({
				cmd:'fetch',
				sql:'select title,id from Son where time = ? and page = ?',
				vals:_dump([self.date,"2"])
			},function(d){
				if(d.success&&d.data){
					self.Catalog_items1 = d.data;
				}
			});
			_callAjax({
				cmd:'fetch',
				sql:'select title,id from Son where time = ? and page = ?',
				vals:_dump([self.date,"3"])
			},function(d){
				if(d.success&&d.data){
					self.Catalog_items2 = d.data;
				}
			});
			_callAjax({
				cmd:'fetch',
				sql:'select title,id from Son where time = ? and page = ?',
				vals:_dump([self.date,"4"])
			},function(d){
				if(d.success&&d.data){
					self.Catalog_items3 = d.data;
				}
			});
		},
	}
})


var detail = new Vue({
	el: '.digitalNewspaper-detail-popup',
	data: {
		show: false,
		article_class: '', // 新闻所属版面
     	article_title: '', // 新闻标题
		article_begintitle: '', // 新闻前标题
		article_message: '', // 新闻详情
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
		Pic_one: '',
		Pic_two: '',
		Pic_three: '',
		Pic_four: '',
	},
	created: function() {
		var self = this;
		self.getpartOne();
	},
	methods: {
		getpartOne: function() {
			var self = this;
			var today = '';
			_callAjax({
				cmd:'fetch',
				sql:'select time from Son where date = ?',
				vals:_dump([menu.date,])
			},function(d){
				if(d.data&&d.success){
					today = d.data[0].time;
					self.Pic_one = "<img src=\"http://jrpt.zjol.com.cn/resfile/" + today + "/01/Page_b.jpg\" border=\"0\" usemap=\"#PagePicMap\">";
					self.Pic_two = "<img src=\"http://jrpt.zjol.com.cn/resfile/" + today + "/02/Page_b.jpg\" border=\"0\" usemap=\"#PagePicMap\">";
					self.Pic_three = "<img src=\"http://jrpt.zjol.com.cn/resfile/" + today + "/03/Page_b.jpg\" border=\"0\" usemap=\"#PagePicMap\">";
					self.Pic_four = "<img src=\"http://jrpt.zjol.com.cn/resfile/" + today + "/04/Page_b.jpg\" border=\"0\" usemap=\"#PagePicMap\">";
					var swiper = new Swiper('.swiper-container', {
						onSlideChangeEnd: function(swiper) {
							if(swiper.activeIndex == 0){
								tab.pageTitle = oneclass.split("：")[1];
							}else if(swiper.activeIndex == 1){
								tab.pageTitle = twoclass.split("：")[1];
							}else if(swiper.activeIndex == 2){
								tab.pageTitle = threeclass.split("：")[1];
							}else {
								tab.pageTitle = fourclass.split("：")[1];
							}
						}
					});				
				}else{
					mui.toast("没有今日的报纸信息！");
				}
			});
		},
	}
})

var tab = new Vue({
	el: '#tab',
	data: {
		pageTitle: '',
		date: '',
		week: '',
		Catalog_class0: '',
		Catalog_class1: '',
		Catalog_class2: '',
		Catalog_class3: '',
	},
	created: function() {
		var self = this;
		var d = new Date();
		var mouth = d.getMonth() + 1;
		this.date = d.getFullYear() + '-' + mouth + '-' + d.getDate();
		self.getweek();
		self.getpageTitle();
	},
	methods: {
		morePage: function() {
			var picker = new mui.PopPicker();
			var self = this;
			_callAjax({
				cmd: 'fetch',
				sql: 'select class from Dad where time = ?',
				vals: _dump([self.date, ])
			},function(d) {
				if(d.success && d.data) {
					self.Catalog_class0 = d.data[0].class;
					self.Catalog_class1 = d.data[1].class;
					self.Catalog_class2 = d.data[2].class;
					self.Catalog_class3 = d.data[3].class;
					picker.setData([{
						value: '0',
						text: self.Catalog_class0
					}, {
						value: '1',
						text: self.Catalog_class1
					}, {
						value: '2',
						text: self.Catalog_class2
					}, {
						value: '3',
						text: self.Catalog_class3
					}]);
					picker.show(function(items) {
						var item = items[0];
						var text = item.text;
						var title = text.split('：')[1];
						var value = item.value;
						self.pageTitle = title;
						var swiper = new Swiper('.swiper-container', {
							onSlideChangeEnd: function(swiper) {
							}
						});	
						swiper.slideTo(parseInt(value), 1000, false);
						//返回 false 可以阻止选择框的关闭
						//return false;
					});
				}
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
		getpageTitle:function(){
			var self = this;
			_callAjax({
				cmd: 'fetch',
				sql: 'select class from Dad where time = ?',
				vals: _dump([self.date, ])
			},function(d){
				if(d.success&&d.data){
					var str = d.data[0].class;
					str = str.split("：");
					self.pageTitle = str[1];
				}
			});
		},
		openMenu: function() {
			menu.show = true;
		},
		getNowFormatDate: function(){
			var date = new Date();
    		var seperator1 = "-";
    		var year = date.getFullYear();
    		var month = date.getMonth() + 1;
    		var strDate = date.getDate();
    		if (month >= 1 && month <= 9) {
        		month = "0" + month;
   			}
    		if (strDate >= 0 && strDate <= 9) {
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
						sql: 'select week from Son where time = ? limit 1',
						vals: _dump([rs.text, ])
					},function(d){
						if(d.data&&d.success){
							tab.week = d.data[0].week;
						}
					});
					_callAjax({
						cmd: 'fetch',
						sql: 'select class from Dad where time = ?',
						vals: _dump([rs.text, ])
					},function(d){
						if(d.data&&d.success){
							tab.date = rs.text;
							var str1 = d.data[0].class;
							tab.pageTitle = str1.split("：")[1];
							menu.Catalog_class0 = d.data[0].class;
							menu.Catalog_class1 = d.data[1].class;
							menu.Catalog_class2 = d.data[2].class;
							menu.Catalog_class3 = d.data[3].class;
							pic.Pic_one = "<img src=\"http://jrpt.zjol.com.cn/resfile/" + rs.text + "/01/Page_b.jpg\" border=\"0\" usemap=\"#PagePicMap\">";
							pic.Pic_two = "<img src=\"http://jrpt.zjol.com.cn/resfile/" + rs.text + "/02/Page_b.jpg\" border=\"0\" usemap=\"#PagePicMap\">";
							pic.Pic_three = "<img src=\"http://jrpt.zjol.com.cn/resfile/" + rs.text + "/03/Page_b.jpg\" border=\"0\" usemap=\"#PagePicMap\">";
							pic.Pic_four = "<img src=\"http://jrpt.zjol.com.cn/resfile/" + rs.text + "/04/Page_b.jpg\" border=\"0\" usemap=\"#PagePicMap\">";
							var swiper = new Swiper('.swiper-container', {
								onSlideChangeEnd: function(swiper) {
								}
							});	
							_callAjax({
								cmd: 'fetch',
								sql: 'select title,id from Son where time = ? and page = ?',
								vals: _dump([rs.text, "1", ])
							},function(d){
								if(d.data&&d.success){
									menu.Catalog_items0 = d.data
								}
							});
							_callAjax({
								cmd: 'fetch',
								sql: 'select title,id from Son where time = ? and page = ?',
								vals: _dump([rs.text, "2", ])
							},function(d){
								if(d.data&&d.success){
									menu.Catalog_items1 = d.data
								}
							});
							_callAjax({
								cmd: 'fetch',
								sql: 'select title,id from Son where time = ? and page = ?',
								vals: _dump([rs.text, "3", ])
							},function(d){
								if(d.data&&d.success){
									menu.Catalog_items2 = d.data
								}
							});
							_callAjax({
								cmd: 'fetch',
								sql: 'select title,id from Son where time = ? and page = ?',
								vals: _dump([rs.text, "4", ])
							},function(d){
								if(d.data&&d.success){
									menu.Catalog_items3 = d.data
								}
							});
						}else{
							mui.toast("没有当日的报纸信息");
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

// 扩展API加载完毕，现在可以正常调用扩展API
function plusReady() {}

// 判断扩展API是否准备，否则监听'plusready'事件
if(window.plus) {
	plusReady();
} else {
	document.addEventListener('plusready', plusReady, false);
}