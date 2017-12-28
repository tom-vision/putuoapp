// 判断扩展API是否准备，否则监听'plusready'事件
if(window.plus) {
	plusReady();
} else {
	document.addEventListener('plusready', plusReady, false);
}

function plusReady() {
	mui.init({
		preloadPages: [{
			url: 'index.html',
			id: 'index'
		},]
	})
	
	var boot = new Vue({
		el: '.boot',
		data: {
			link: '',
			time: 7
		},
		methods: {
			openIndex: function() {
				var indexPage = null;
                
				//获得详情页面
				if(!indexPage && !!plus.webview.getWebviewById('index')) indexPage = plus.webview.getWebviewById('index');
				
				if(push) {
					mui.fire(indexPage, 'pushOpenDetail', {});
				}
				
				setTimeout(function() {
					openWindow('index.html', 'index');
				}, 200)
			}
		},
		created: function() {
			var self = this;
			//获取启动页
			_callAjax({
				cmd: "fetch",
				sql: "select homepage from system"
			}, function(d) {
				if(d.success && d.data) {
					self.link = d.data[0].homepage;
				}
				
				setInterval(function() {
					boot.time--;
					if(boot.time == 0) {
						self.openIndex();
					};
				}, 1000)
			})
		}
	})
}