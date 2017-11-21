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
			}
		},
		created: function() {
			setInterval(function() {
				boot.time --;
				if(boot.time == 0) return openWindow('index.html', 'index');
			}, 1000)
		}
	})
}