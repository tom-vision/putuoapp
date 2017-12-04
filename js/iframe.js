// 扩展API加载完毕，现在可以正常调用扩展API
function plusReady() {
	pullToRefresh();
	var web = plus.webview.currentWebview();
	$('.mui-title').text(web.title);
	$('.full-iframe').attr('src', web.url);

	$('.back').on('click', function() {
		var ws = plus.webview.currentWebview();
		plus.webview.close(ws);
	})
}

// 判断扩展API是否准备，否则监听'plusready'事件
if(window.plus) {
	plusReady();
} else {
	document.addEventListener('plusready', plusReady, false);
}