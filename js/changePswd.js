var changePswd;

mui.init({
	beforeback: function() {
		changePswd.opassword = '';	
		changePswd.npassword = '';	
		changePswd.nnpassword = '';	
	}
})

// 扩展API加载完毕，现在可以正常调用扩展API
function plusReady() {
	changePswd = new Vue({
		el: '#changePswd',
		data: {
			opassword: '',
			npassword: '',
			nnpassword: '',
			userInfo: _load(_get('userInfo'))
		},
		methods: {
			updateUserData: function() {
				var self = this;
	
				//修改成功插入数据
				_callAjax({
					cmd: "exec",
					sql: "update User set pswd = ? where id = ?",
					vals: _dump([self.npassword.trim(), self.userInfo.id])
				}, function(d) {
					if(d.success) {
						mui.toast("密码重置成功");
						
						self.userInfo.pswd = self.npassword.trim();
						_set('userInfo',_dump(self.userInfo));
						
						setTimeout(function() {
							mui.back();
	
						}, 1500);
					} else {
						mui.toast("密码重置失败");
					}
				});
			},
			//重置密码
			resetPassword: function() {
				var self = this;
				if('' == self.opassword.trim() || !(/^[a-zA-Z0-9]\w{5,11}$/.test(self.opassword.trim()))) return mui.toast("请输入6-12位密码");
				if('' == self.npassword.trim() || !(/^[a-zA-Z0-9]\w{5,11}$/.test(self.npassword.trim()))) return mui.toast("请输入6-12位密码");
				if('' == self.nnpassword.trim() || !(/^[a-zA-Z0-9]\w{5,11}$/.test(self.nnpassword.trim()))) return mui.toast("请输入6-12位密码");
				
				if(self.npassword.trim() != self.nnpassword.trim()) return mui.toast('两次密码输入不同');
				
				//先验证旧密码是否正确
				var userInfo = _load(_get('userInfo'));
				if(userInfo.pswd == self.opassword){
					self.updateUserData();
				}else {
					mui.toast("旧密码错误，请重新输入");
					self.opassword = '';
					
				}
				
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