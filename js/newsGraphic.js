//预加载页面
mui.init({
	preloadPages: [{
		url: 'comment.html',
		id: 'comment',
	}],
});

// 扩展API加载完毕，现在可以正常调用扩展API
function plusReady() {
	
	var newsGraphic = new Vue({
		el: '#newsGraphic',
		data: {
			newsData: {
				title:'',
				content:'',
				imgs: ['']
			}, 
			activeImgIndex: 1,
			activeImg: ''
		},
		methods: {
			goComment: function() {
				openWindow('comment.html', 'comment')
			},
			saveImg: function() {
				mui.toast("下载开始");

				var dtask = plus.downloader.createDownload(this.activeImg, {}, function ( d, status ) {
					// 下载完成
					if ( status == 200 ) { 
						plus.gallery.save(d.filename, function () {
							mui.toast("图片已保存到手机相册");
						});
					} else {
						mui.toast("下载失败");
					}  
				});
				dtask.start(); 
				
			}
		},
	})
	
	//添加newId自定义事件监听
	window.addEventListener('newsId',function(event){
	  	//获得事件参数
	  	var id = event.detail.id;
	  	console.log(id)
	  	//根据id向服务器请求新闻详情
	  	console.log("newsId="+id);
	  	
	  	_callAjax({
			cmd: "fetch",
			sql: "select * from articles where id = " + id
	
		}, function(d) {
			if(d.success && d.data){
				var r = d.data[0];
				var imgs = r.img.split(",");
				r.imgs = imgs;
				newsGraphic.newsData = r;
				newsGraphic.activeImg = r.imgs[0];
				setTimeout(function(){
					var swiper = new Swiper('.swiper-container', {
						onSlideChangeEnd: function(swiper) {
							newsGraphic.activeImg = newsGraphic.newsData.imgs[swiper.activeIndex];
							newsGraphic.activeImgIndex = swiper.activeIndex + 1
						}
					});
				}, 500)
			}
		});
	});
}

// 判断扩展API是否准备，否则监听'plusready'事件
if(window.plus) {
	plusReady();
} else {
	document.addEventListener('plusready', plusReady, false);
}