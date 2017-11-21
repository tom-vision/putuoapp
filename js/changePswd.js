mui.init({
})

// 扩展API加载完毕，现在可以正常调用扩展API
function plusReady() {
	var changePswd = new Vue({
		el: '#changePswd',
		data: {
			opassword: '',
			npassword: '',
			nnpassword: '',
		},
		methods: {
			//重置密码
			resetPassword: function() {
				var self = this;
				if('' == self.opassword.trim() || !(/^[a-zA-Z0-9]\w{5,11}$/.test(self.opassword.trim()))) return mui.toast("请输入6-12位密码");
				if('' == self.npassword.trim() || !(/^[a-zA-Z0-9]\w{5,11}$/.test(self.npassword.trim()))) return mui.toast("请输入6-12位密码");
				if('' == self.nnpassword.trim() || !(/^[a-zA-Z0-9]\w{5,11}$/.test(self.nnpassword.trim()))) return mui.toast("请输入6-12位密码");
				if(self.npassword.trim() == self.nnpassword.trim()) return mui.toast('两次密码输入不同');
			}
		}
	})
}

// 判断扩展API是否准备，否则监听'plusready'事件
if(window.plus) {
	plusReady();
} else {
	document.addEventListener('plusready', plusReady, false);
}