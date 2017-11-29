//预加载页面
mui.init({
	
});

var topic = new Vue({
	el: '#topic',
	data: {
		topicNews: []
	},
	methods: {
		//跳转到某个具体专题节目列表
		gotoTopicList: function(i) {
			mui.openWindow({
				url: 'topic-list.html',
				id: 'topicList',
				extras: {
					i: i.id,
					title: i.name
				}
			})
		}
	},
	mounted: function() {
		var self = this;
		
		//获取专题节目
		_callAjax({
			cmd: "fetch",
			sql: "select * from linkers where refId = "+linkerId.topicSort

		}, function(d) {
			if(d.success && d.data) {
				self.topicNews = d.data;
			}
		});
	}
})

// 扩展API加载完毕，现在可以正常调用扩展API
function plusReady() {
//	pullToRefresh();
}

// 判断扩展API是否准备，否则监听'plusready'事件
if(window.plus) {
	plusReady();
} else {
	document.addEventListener('plusready', plusReady, false);
}