var linkerId = {
	scrollNews: 100,
	headNews: 101,
	instantNews: 102,
	putuoNews: 103,
	videoNews: 104,
	services: 107,   //服务
	interact: 114,   //互动
	rebellion: 115,  //报料
	photography:116, //摄影
	food: 117,        //美食
	topicSort: 118,   //专题分类
	ad: 119          //广告
};

//版本号
//var curVersion = "0.0.5";

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

var share = function(type, id, content, ext) {
	console.log("type="+type);
	
	var hrefUrl = '';
	if(type == 'interact'){
		hrefUrl = serverAddr + '/ptappShare/interact.html?id='+id;
	}else if(type == 'news'){
		hrefUrl = serverAddr + '/ptappShare/news.html?id='+id;
	}else{
		hrefUrl = serverAddr + '/ptappShare/down.html?id='+id;
	}
	
	plus.share.getServices(function(shares) {
		shares.forEach(function(s) {
			if(s.id == 'weixin' && s.authenticated) {
				s.send(	{
					thumbs: ['../imgs/logo.png'],
					pictures: ['../imgs/logo.png'],
					title: '掌上普陀',
					content: content,//'我正在使用掌上普陀你也一起来加入吧',
					href: hrefUrl, //'http://hyv.wifizs.cn/putuo/ptappShare/down.html',
					extra: {
						scene: ext
					}
				}, function() {
					mui.toast("分享到\"" + s.description + "\"成功！ ");
				}, function(e) {
					mui.toast("分享到\"" + s.description + "\"失败: " + e.code);
				});
			}
		})
	}, function(e) {
	    mui.toast("获取分享服务列表失败：" + e.message);
	});
}