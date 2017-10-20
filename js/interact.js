//预加载页面
mui.init({
	preloadPages: [{
		url: 'release.html',
		id: 'release',
	},{
		url: 'interact-detail.html',
		id: 'interact-detail',
	}, ],
});

var interact = new Vue({
	el: '#interact',
	data: {
	},
	methods: {
		openGallery: function() {
			interactGraphic.show = true;
			$('body').addClass('no-scroll');
		},
		openInteractDetail: function() {
			openWindow('interact-detail.html', 'interact-detail');
		}
	}
})

var interactGraphic = new Vue({
	el: '#interactGraphic',
	data: {
		show: false
	},
	methods: {
		close: function() {
			this.show = false;
			$('body').removeClass('no-scroll');
		}
	}
})

$('.icon-xiangji').on('click', function() {
	openWindow('release.html', 'release');
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