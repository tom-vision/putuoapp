//预加载页面
mui.init({
	preloadPages: [{
		url: 'topic-list.html',
		id: 'topicList',
	}],
});

var topic = new Vue({
	el: '#topic',
	data: {
	},
	methods: {
		goTopicList: function() {
			openWindow('topic-list.html', 'topicList')
		}
	}
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