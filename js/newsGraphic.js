var swiper;
var newsGraphic;
//预加载页面
mui.init({
	preloadPages: [{
		url: 'comment.html',
		id: 'comment',
	}],
});

// 扩展API加载完毕，现在可以正常调用扩展API
function plusReady() {
	
	//获得事件参数
  	var id = _get('newsId');
  	
  	_callAjax({
		cmd: "fetch",
		sql: "select id, img, title, brief  from articles where id = " + id
	}, function(d) {
		if(d.success && d.data){
			var r = d.data[0];
			var imgs = r.img.split(",");
			r.imgs = imgs;
			newsGraphic.newsData = r;
			newsGraphic.activeImg = r.imgs[0];
			setTimeout(function(){
				swiper = new Swiper('.swiper-container', {
					onSlideChangeEnd: function(swiper) {
						// 为了下载存放的变量
						newsGraphic.activeImg = newsGraphic.newsData.imgs[swiper.activeIndex];
						newsGraphic.activeImgIndex = swiper.activeIndex + 1
					},
				});
			}, 500)
		}
	});
	
	newsGraphic = new Vue({
		el: '#newsGraphic',
		data: {
			newsData: {
				title:'',
				content:'',
				imgs: []
			}, 
			activeImgIndex: 1,
			activeImg: ''
		},
		methods: {
			goComment: function() {
				mui.fire(plus.webview.getWebviewById('comment'), 'newsId', {
				});
				openWindow('comment.html', 'comment')
			},
			saveImg: function() {
				mui.toast("下载开始");

				var dtask = plus.downloader.createDownload(this.activeImg, {}, function ( d, status ) {
					// 下载完成
					if (status == 200) { 
						plus.gallery.save(d.filename, function () {
							mui.toast("图片已保存到手机相册");
						});
					}else {
						mui.toast("下载失败");
					}  
				});
				dtask.start(); 
			}
		},
	})
}

// 判断扩展API是否准备，否则监听'plusready'事件
if(window.plus) {
	plusReady();
} else {
	document.addEventListener('plusready', plusReady, false);
}