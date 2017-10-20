var linkerId = {
	
};

var pullToRefresh = function() {
	var ws = plus.webview.currentWebview();
	// 下拉刷新事件
	ws.setPullToRefresh({
		support: true,
		style: 'circle',
		color: '#009cff',
		offset: '45px'
	}, function() {
		window.location.reload();
		ws.endPullToRefresh();
	});
}

var openWindow = function(u, i, s) {
	mui.openWindow({
		url: u,
		id: i,
		show: {
			aniShow: 'pop-in'
		},
	})
}




