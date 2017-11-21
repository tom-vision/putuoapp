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
			link: 'http://img.zcool.cn/community/0197b658259955a84a0e282bd081d4.png',
			time: 7
		},
		methods: {
			goIndex: function() {
				openWindow('index.html', 'index');
			},
		
			
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
					console.log("**********");
					_tell(self.link);
			
				}
				
				setInterval(function() {
					boot.time--;
					if(boot.time == 0) return openWindow('index.html', 'index');
				}, 1000)
			
			})
			
			
			
			
			
		}
	})
}