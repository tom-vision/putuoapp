var linkerId = {
	scrollNews: 100,
	headNews: 101,
	instantNews: 102,
	putuoNews: 103,
	videoNews: 104
};

// 用户信息
var userInfo = { id: 0 };

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




