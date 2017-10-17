//预加载页面
mui.init({
	preloadPages: [{
		url: 'forgetPassword.html',
		id: 'forget',
	},{
		url: 'register.html',
		id: 'register',
	}],
});

var login = new Vue({
	el: '#login',
	data: {
		
	},
	methods: {
		goRegister: function() {
			openWindow('register.html', 'register');
		},
		goForget: function() {
			openWindow('forgetPassword.html', 'forget');
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