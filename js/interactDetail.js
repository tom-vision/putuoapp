var interactDetail = new Vue({
	el: '#interactDetail',
	data: {
		placeholder: '说点什么...',
		comment: '',
		haveComment: false
	},
	methods: {
		
	},
	watch: {
		comment: function() {
			if(this.comment.length > 0) return this.haveComment = true;
			this.haveComment = false;
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