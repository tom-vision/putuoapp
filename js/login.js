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

			if('' == self.phone.trim()) return mui.toast("手机号不能为空");
			if('' == self.password.trim()) return mui.toast("密码不能为空");

			_callAjax({
				cmd: "fetch",
				sql: "select * from User where phone = ? and pswd = ?",
				vals: _dump([self.phone, self.password])
			}, function(d) {
				if(d.success && d.data) {

					mui.toast("登录成功");
			
					userInfo = d.data[0];
					_set('userInfo',_dump(userInfo));
					
					console.log("userInfo=");
					console.log(_dump(userInfo));
					
					mui.fire(plus.webview.getLaunchWebview(), 'loginBack');
					
					setTimeout(function() {
						mui.back();

					}, 2000);

				} else {
					mui.toast("登录失败");
				}
			});

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