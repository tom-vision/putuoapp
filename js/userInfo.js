// 扩展API加载完毕，现在可以正常调用扩展API
function plusReady() {
	var userInfo = new Vue({
		el: '#userInfo',
		data: {
			userInfo: {
				id: 0,
				name: '',
				phone: '',
				pswd: '',
				img: '',
			},
		},
		methods: {
			changeName: function() {
				plus.nativeUI.prompt("新用户名: ", function(e) {
					console.log(((e.index == 0) ? "确认: " : "取消") + e.value);
				}, "", "请输入新的用户名", ["确认", "取消"]);
			},
			changeSex: function() {
				plus.nativeUI.actionSheet({
					title: "请选择您的性别",
					cancel: "取消",
					buttons: [{
						title: "男"
					}, {
						title: "女"
					}]
				}, function(e) {
					console.log("User pressed: " + e.index);
				});
			},
			changeAvatar: function() {
				plus.gallery.pick(function(path) {
					console.log(path);
				}, function(e) {
					console.log("取消选择图片");
				}, {
					filter: "image"
				});
			}
		},
		mounted: function() {
			var self = this;

		}
	})
}

// 判断扩展API是否准备，否则监听'plusready'事件
if(window.plus) {
	plusReady();
} else {
	document.addEventListener('plusready', plusReady, false);
}

////添加newId自定义事件监听
//window.addEventListener('login', function(event) {
//	
//	var userInfo = plus.storage.getItem('userInfo');
//	
//})