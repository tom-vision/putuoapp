var register = new Vue({
	el: '#register',
	data: {
		phone: '',
		captcha: '',
		password: '',
		captcha_session: '',
		getSmsState: '获取验证码'
	},
	methods: {
		//获取验证码
		getCaptcha: function() {
			var self = this;
			
			if(self.getSmsState != '获取验证码') return mui.toast('请稍候重新获取');

			if('' == self.phone.trim() || !(/^1(3|4|5|7|8)\d{9}$/.test(self.phone.trim()))) return mui.toast("请输入正确的手机号码");

			//校验手机号是否已注册
			_callAjax({
				cmd: "fetch",
				sql: "select * from User where phone = ?",
				vals: _dump([self.phone.trim()])
			}, function(d) {
				if(d.success && d.data) {
					return mui.toast("该手机号已注册过");
				} else {
					// 生成验证码
					var captcha_session = '';
					for(var i = 0; i < 6; i++) {
						captcha_session += Math.floor(Math.random() * 10);
					}
					window.sessionStorage.setItem(self.phone.trim(), captcha_session);
					// 发送验证码
					_smsAjax({
						cmd: "raw",
						text: "【新蓝广科】您的验证码" + captcha_session + " ，请及时查收。",
						phone: self.phone.trim()
					}, function(d) {
						var t = 60;
						var timeOut = setInterval(function(){
							t--;
							self.getSmsState = t + '秒';
							if(t == 0) {
								self.getSmsState = '获取验证码';
								clearInterval(timeOut);	
							}
						}, 1000)
					});
				}
			});
		},
		insertUserData: function() {
			var self = this;
			var name = self.phone.trim().replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
			//注册成功插入数据
			_callAjax({
				cmd: "exec",
				sql: "insert into User(name, pswd, phone) values(?,?,?)",
				vals: _dump([name, self.password.trim(), self.phone.trim()])
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
			var captcha_session = window.sessionStorage.getItem(self.phone.trim());
			
			if('' == self.phone.trim() || !(/^1(3|4|5|7|8)\d{9}$/.test(self.phone.trim()))) return mui.toast("请输入正确的手机号");
			if('' == self.password.trim() || !(/^[a-zA-Z0-9]\w{5,11}$/.test(self.password.trim()))) return mui.toast("请输入6-12位密码");
			if('' == self.captcha.trim() || !(/^\d{6}$/.test(self.captcha.trim())) || captcha_session != self.captcha) return mui.toast("验证码错误");
			self.insertUserData();
		},
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