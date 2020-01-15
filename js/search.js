// 扩展API加载完毕，现在可以正常调用扩展API
function plusReady() {
	var search = new Vue({
		el: '#search',
		data: {
			keyWord: '',
			searchResult: [],
			illegal: []
		},
		methods: {
			search: function() {
				var self = this;
				
				const check = self.illegal.some(k => self.keyWord.indexOf(k) >= 0)
				if(check) return mui.toast("关键词含非法字符");
				if(self.keyWord == '') return mui.toast("请输入关键字搜索");
				plus.nativeUI.showWaiting();
				_callAjax({
					cmd: "fetch",
					sql: "select * from articles where ifValid=1 and title like '%"+ self.keyWord +"%'"
				}, function(d) {
					plus.nativeUI.closeWaiting()
					if(!d.success || !d.data){
						mui.toast("抱歉，没有找到相关新闻");
					}else{
						self.searchResult = d.data;
					}
				});
			},
			gotoDetail: function(i) {
				var detailPage = null;
				//获得详情页面
				if(!detailPage) {
					detailPage = plus.webview.getWebviewById('newsDetail');
				}
				//触发详情页面的newsId事件
				mui.fire(detailPage, 'newsId', {
				});
				_set('newsId', i.id);
				
				setTimeout(function(){
					openWindow('newsDetail.html', 'newsDetail');
				}, 200)
			}
		},
		created: function() {
			this.illegal = JSON.parse(_get('illegal')).map(i => i.content)
		}
	});
}

// 判断扩展API是否准备，否则监听'plusready'事件
if(window.plus) {
	plusReady();
} else {
	document.addEventListener('plusready', plusReady, false);
}