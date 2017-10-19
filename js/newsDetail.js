//预加载页面
mui.init({
	preloadPages: [{
		url: 'comment.html',
		id: 'comment',
	}]
});

var newsDetail = new Vue({
	el: '#detail',
	data: {
		like: false
	},
	methods: {
		changeLike: function() {
			this.like = !this.like
		}
	}
})

var hotComment = new Vue({
	el: '#comment',
	data: {
	},
	methods: {
		goComment: function() {
			openWindow('comment.html', 'comment');
		}
	}
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
  	console.log(id);
  	
});