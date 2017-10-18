var release = new Vue({
	el: '#release',
	data: {
		imgs: [],
		showAdd: true
	},
	methods: {
		addImg: function() {
			plus.gallery.pick(function(path) {
				console.log(path);
			}, function(e) {
				console.log("取消选择图片");
			}, {
				filter: "image"
			});
		},
		removeImg: function(e) {
			e.srcElement.remove();
		}
	},
	watch: {
		imgs: function() {
			if(this.imgs.length == 3) return this.showAdd = false;
		}
	}
})

// 扩展API加载完毕，现在可以正常调用扩展API
function plusReady() {
}

// 判断扩展API是否准备，否则监听'plusready'事件
if(window.plus) {
	plusReady();
} else {
	document.addEventListener('plusready', plusReady, false);
}