var iframe = new Vue({
	el: '#iframe',
	data: {
	},
	created: function() {
		window.addEventListener('getInfo', function(d) {
			$('.mui-title').text(d.detail.title);
			$('.full-iframe').attr('src', d.detail.url);
		})
	},
	methods: {
	}
})

//mui.back = function(){
//	console.log("back");
//	window.history.go(-1);
//}

// 扩展API加载完毕，现在可以正常调用扩展API
function plusReady() {
}

// 判断扩展API是否准备，否则监听'plusready'事件
if(window.plus) {
	plusReady();
} else {
	document.addEventListener('plusready', plusReady, false);
}

