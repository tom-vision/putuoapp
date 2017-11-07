//预加载页面
mui.init({
	preloadPages: [{
		url: 'forgetPassword.html',
		id: 'forget',
	}, {
		url: 'register.html',
		id: 'register',
	}],

	
});

// 扩展API加载完毕，现在可以正常调用扩展API
function plusReady() {
	var login = new Vue({
		el: '#login',
		data: {
			phone: '',
			password: '',
		},
		methods: {
			goRegister: function() {
				openWindow('register.html', 'register');
			},
			goForget: function() {
				openWindow('forgetPassword.html', 'forget');
			},
			//登录
			login: function() {
				var self = this;
	
				console.log(self.password);
				if('' == self.phone.trim() || !(/^1(3|4|5|7|8)\d{9}$/.test(self.phone.trim()))) return mui.toast("请输入正确的手机号");
				if('' == self.password.trim() || !(/^[a-zA-Z0-9]\w{5,11}$/.test(self.password.trim()))) return mui.toast("请输入正确的密码");
	
				_callAjax({
					cmd: "fetch",
					sql: "select * from User where phone = ?",
					vals: _dump([self.phone, self.password])
				}, function(d) {
					if(d.success && d.data) {
						if(d.data[0].pswd!= self.password.trim()) return mui.toast('密码输入错误');
						mui.toast("登录成功");
				
						userInfo = d.data[0];
						_set('userInfo',_dump(userInfo));
						
						mui.fire(plus.webview.getLaunchWebview(), 'loginBack');
						
						setTimeout(function() {
							mui.back();
						}, 1500);
					} else {
						mui.toast("手机号未注册");
					}
				});
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