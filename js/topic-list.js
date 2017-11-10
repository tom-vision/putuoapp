//预加载页面
mui.init({
	preloadPages: [{
		url: 'views/newsDetail.html',
		id: 'newsDetail'
	}],
});

var topicId = 0;

var topicTitle = new Vue({
	el: '#topicTitle',
	data: {
		title: '',
	}
})

// 扩展API加载完毕，现在可以正常调用扩展API
function plusReady() {
	var topic = new Vue({
		el: '#topic-list',
		data: {
			topics: [],
			bHaveMore: false
		},
		methods: {
			//跳转到文章详情
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
	
				setTimeout(function(){
					openWindow('views/newsDetail.html', 'newsDetail');
				},200)
			},
			getTopic: function() {
				var f = 10e5;
				if(topic.topics.length) {
					f = _at(topic.topics, -1).id;
				}
			
				_callAjax({
					cmd: "fetch",
					sql: "select * from articles where ifValid=1 and linkerId = ? and id<? order by id desc limit 2",
					vals: _dump([topicId, f])
				}, function(d) {
					if(!d.success || !d.data) {
						topic.bHaveMore = false;
						mui.toast("没有更多数据了");
						return;
					} else {
						topic.bHaveMore = true;
						
						d.data.forEach(function(r) {
							topic.topics.push(r);
						})
					}
				});
			}
		},
	});
	
	var web = plus.webview.currentWebview();
	topicTitle.title = web.title;
	topicId = web.i;
	
	topic.topics = [];
	topic.getTopic();
}

// 判断扩展API是否准备，否则监听'plusready'事件
if(window.plus) {
	plusReady();
} else {
	document.addEventListener('plusready', plusReady, false);
}