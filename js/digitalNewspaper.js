var swiper = new Swiper('.swiper-container', {
	onSlideChangeEnd: function(swiper){
      	alert(swiper.activeIndex)
    }
})

var menu = new Vue({
	el: '.digitalNewspaper-menu-popup',
	data: {
		show: false,
	},
	methods: {
		closeMenu: function() {
			this.show = false;
		},
		openDetail: function() {
			detail.show = true;
		}
	}
})

var detail = new Vue({
	el: '.digitalNewspaper-detail-popup',
	data: {
		show: false
	},
	methods: {
		closeDetail: function() {
			this.show = false;
		}
	}
})

var tab = new Vue({
	el: '#tab',
	data: {
		pageTitle: '要闻',
		date: ''
	},
	created: function() {
		var d = new Date();
		this.date = d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate();
	},
	methods: {
		morePage: function() {
			var picker = new mui.PopPicker();
			var self = this;
			picker.setData([{
				value: '0',
				text: '第一版：要闻'
			}, {
				value: '1',
				text: '第二版：民生'
			}, {
				value: '2',
				text: '第三版：专版'
			}]);
			picker.show(function(items) {
				var item = items[0];
				var text = item.text;
				var title = text.split('：')[1];
				var value = item.value;
				self.pageTitle = title;
				swiper.slideTo(parseInt(value), 1000, false);
				//返回 false 可以阻止选择框的关闭
				//return false;
			});
		},
		openMenu: function() {
			menu.show = true;
		},
		chooseDate: function() {
			var _self = $('.date-btn');
			var result = '';
			if(_self.picker) {
				_self.picker.show(function (rs) {
					tab.date = rs.text;
					_self.picker.dispose();
					_self.picker = null;
				});
			} else {
				var options = {type:'date',value:'2015-10-10',beginYear:'2010',endYear:'2020'};
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
					console.log(rs)
					tab.date = rs.text;
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
function plusReady() {
}

// 判断扩展API是否准备，否则监听'plusready'事件
if(window.plus) {
	plusReady();
} else {
	document.addEventListener('plusready', plusReady, false);
}