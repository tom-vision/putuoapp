//预加载页面
mui.init({
	preloadPages: [{
		url: 'comment.html',
		id: 'comment',
	}],
});

var newsGraphic = new Vue({
	el: '#newsGraphic',
	data: {
		activeImg: 1
	},
	methods: {
		goComment: function() {
			openWindow('comment.html', 'comment')
		}
	}
})

document.querySelector('.mui-slider').addEventListener('slide', function(event) {
	newsGraphic.activeImg = event.detail.slideNumber + 1;
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