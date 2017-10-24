//预加载页面
mui.init({
	preloadPages: [{
		url: 'comment.html',
		id: 'comment',
	}],
});

var newsGraphic = new Vue({
	el: '#newsGraphic',
	data: {
		newsData: {
			title:'',
			content:'',
			imgs: ['']
		}, //内容
		activeImg: 1
	},
	methods: {
		goComment: function() {
			openWindow('comment.html', 'comment')
		}
	},

})

document.querySelector('.mui-slider').addEventListener('slide', function(event) {
	newsGraphic.activeImg = event.detail.slideNumber + 1;
})

// 扩展API加载完毕，现在可以正常调用扩展API
function plusReady() {
	pullToRefresh();
}

// 判断扩展API是否准备，否则监听'plusready'事件
if(window.plus) {
	plusReady();
} else {
	document.addEventListener('plusready', plusReady, false);
}

//添加newId自定义事件监听
window.addEventListener('newsId',function(event){
  	//获得事件参数
  	var id = event.detail.id;
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
			}
		});
});