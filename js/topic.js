//预加载页面
mui.init({
	preloadPages: [{
		url: 'topic-list.html',
		id: 'topic-list',
	}],
});

var topic = new Vue({
	el: '#topic',
	data: {
		topicNews: []
	},
	methods: {
		//跳转到某个具体专题节目列表
		gotoTopicList: function(i) {
			var detailPage = null;
			//获得主题页面
			if(!detailPage) {
				detailPage = plus.webview.getWebviewById('topic-list');
			}
			//触发详情页面的newsId事件
			mui.fire(detailPage, 'topicId', {
				id: i.id,
				title: i.name
			});
			
			openWindow('views/topic-list.html', 'topic-list');
		}
	},
	mounted: function() {
		var self = this;
		
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