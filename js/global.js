var linkerId = {
	scrollNews: 100,
	headNews: 101,
	instantNews: 102,
	putuoNews: 103,
	putuonetNews: 106, //普陀报新闻
	videoNews: 104,
	services: 107,   //服务
	interact: 114,   //互动
	rebellion: 115,  //报料
	photography:116, //摄影
	food: 117,        //美食
	topicSort: 118,   //专题分类
	ad: 119          //广告
};

var push = false;

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

var openOutlink = function(url, title) {
	plus.webview.open(url, 'iframe', {
		'titleNView': {
			'backgroundColor': '#009cff',
			'titleText': '' + title + '',
			'titleColor': '#fff',
			autoBackButton: false,
			progress: {
				color: '#F40'
			},
			buttons: [{
				text: '关闭',
				fontSize: '16px',
				float: 'left',
				onclick: function() {
					var wb = plus.webview.getWebviewById('iframe');
					wb.close();
				}
			}]
		},
		backButtonAutoControl: 'hide'
	});
}

var share = function(type, id, content, img, ext) {
	var hrefUrl = '';
	var title = '掌上普陀';
	var imgs = ['../imgs/logo.png'];
	
	if(type == 'interact'){
		hrefUrl = serverAddr + '/ptappShare/interact.html?id='+id;
	}else if(type == 'news'){
		hrefUrl = serverAddr + '/ptappShare/news.html?id='+id;
	}else{
		hrefUrl = serverAddr + '/ptappShare/down.html?id='+id;
	}
	
	if(img != '') imgs = [img];
	if(ext == 'WXSceneTimeline') title = content;

	plus.share.getServices(function(shares) {
		shares.forEach(function(s) {
			if(s.id == 'weixin' && s.authenticated) {
				s.send(	{
					pictures: imgs,
					title: title,
					content: content,
					href: hrefUrl,
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

var adFun = function(self) {
	if(self.type == 2) {
		//专题
		mui.fire(plus.webview.getWebviewById('theme'), 'adTopicId', {
		});
		_set('adTopicId', self.url);
		
		if(plus.webview.currentWebview().id == 'index') return openWindow('views/theme.html', 'theme');
		openWindow('theme.html', 'theme');
	} else if(self.type == 1) {
		console.log(self.url)
		//链接
		openOutlink(self.url, self.title);
	} else {
		//图片
		return;
	}
}

if(window.plus) {
	plusReady();
} else {
	document.addEventListener('plusready', plusReady, false);
}

function plusReady() {
	//锁定竖屏
	plus.screen.lockOrientation("portrait-primary");
	  // 监听点击消息事件
	plus.push.addEventListener( "click", function( msg ) {
    	var newsId;
    	if(typeof(msg.payload) == 'object') {
    		//获取 apns 推送中的newsId
    		newsId = msg.payload.payload.split('newsId=')[1];
    	} else {
    		newsId = msg.payload.split('newsId=')[1];
    	}
    	_set('newsId', newsId);
    	if(newsId == '' || typeof(newsId) == 'undefined') return mui.toast('非法参数');
    	
    	if(plus.webview.currentWebview() == plus.webview.getLaunchWebview()) return push = true;
    	
        var detailPage = null;
        
		//获得详情页面
		if(!detailPage && !!plus.webview.getWebviewById('newsDetail')) detailPage = plus.webview.getWebviewById('newsDetail');
		
		//触发详情页面的newsId事件
		mui.fire(detailPage, 'newsId', {});
		
		setTimeout(function() {
			if(plus.webview.currentWebview().id == 'index') return openWindow('views/newsDetail.html', 'newsDetail');
			openWindow('newsDetail.html', 'newsDetail');
		}, 200)
	})
}
