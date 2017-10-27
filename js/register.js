var register = new Vue({
	el: '#register',
	data: {
		phone: '',
		captcha: '',
		password: '',
		captcha_session: ''
	},
	methods: {

		//获取验证码
		getCaptcha: function() {
			console.log("获取验证码");
			var self = this;

			if('' == self.phone.trim()) return mui.toast("手机号不能为空");

			var captcha_session = '';
			for(var i = 0; i < 6; i++) {
				captcha_session += Math.floor(Math.random() * 10);
			}
			console.log(captcha_session);
			console.log(self.phone.trim());
			window.sessionStorage.setItem(self.phone.trim(), captcha_session);

			_smsAjax({
				cmd: "raw",
				text: "【新蓝广科】您的验证码" + captcha_session + " ，请及时查收。",
				phone: self.phone.trim()
			}, function(d) {

			});

		},

		insertUserData: function() {
			var self = this;

			//注册成功插入数据
			_callAjax({
				cmd: "exec",
				sql: "insert into User(name, pswd, phone) values(?,?,?)",
				vals: _dump([self.phone.trim(), self.password.trim(), self.phone.trim()])
			}, function(d) {
				if(d.success && d.data) {

					mui.toast("注册成功");

					_callAjax({
						cmd: "fetch",
						sql: "select * from User where phone = ? and pswd = ?",
						vals: _dump([self.phone.trim(), self.password.trim()])
					}, function(d) {
						if(d.success && d.data) {

							userInfo = d.data[0];
							_set('userInfo', _dump(userInfo));
							console.log(_dump(userInfo));

							mui.fire(plus.webview.getLaunchWebview(), 'loginBack');

							setTimeout(function() {
								var webview = plus.webview.getLaunchWebview();
								webview.show();

							}, 2000);
						}
					});

				} else {
					mui.toast("注册失败");
				}
			});
		},
		//注册
		register: function() {
			var self = this;

			if('' == self.phone.trim()) return mui.toast("手机号不能为空");
			if('' == self.password.trim()) return mui.toast("密码不能为空");
			if('' == self.captcha.trim()) return mui.toast("请输入验证码");

			//校验手机号是否已注册
			_callAjax({
				cmd: "fetch",
				sql: "select * from User where phone = ?",
				vals: _dump([self.phone.trim()])
			}, function(d) {
				if(d.success && d.data) {
					mui.toast("该手机号已注册过");

				} else {
					//验证码校验
					var captcha_session = window.sessionStorage.getItem(self.phone.trim());
					if(captcha_session != self.captcha) {

						document.getElementById('captcha').focus();
						mui.toast("验证码不正确");

					} else {
						self.insertUserData();
					}

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