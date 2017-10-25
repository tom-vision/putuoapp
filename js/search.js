var search = new Vue({
	el: '#search',
	data: {
		keyWord: '',
		searchResult: []
	},
	methods: {
		search: function() {
			var self = this;

			console.log(self.keyWord);
			if(''==self.keyWord) return mui.toast("请输入关键字搜索");
			
			_callAjax({
				cmd: "fetch",
				sql: "select * from articles where ifValid=1 and title like '%"+ self.keyWord +"%'"
			}, function(d) {
				if(!d.success || !d.data){
					mui.toast("抱歉，没有找到相关新闻");
				}else{

					self.searchResult = d.data;
				}
			});
		}
	}
});

//跳转到文章详情
function gotoDetail(i) {
	var detailPage = null;
	//获得详情页面
	if(!detailPage) {
		detailPage = plus.webview.getWebviewById('newsDetail');
	}
	//触发详情页面的newsId事件
	mui.fire(detailPage, 'newsId', {
		id: i.id
	});

	openWindow('views/newsDetail.html', 'newsDetail');
};

// 扩展API加载完毕，现在可以正常调用扩展API
function plusReady() {
//	pullToRefresh();
}

// 判断扩展API是否准备，否则监听'plusready'事件
if(window.plus) {
	plusReady();
} else {
	document.addEventListener('plusready', plusReady, false);
}