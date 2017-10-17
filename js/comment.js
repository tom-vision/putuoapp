var comment = new Vue({
	el: '#comment',
	data: {
		content: '',
		liked: false
	},
	methods: {
		changeLiked: function() {
			this.liked = !this.liked
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