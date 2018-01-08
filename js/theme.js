// 扩展API加载完毕，现在可以正常调用扩展API
function plusReady() {
	var theme = new Vue({
		el: '#theme',
		data: {
			cover: 'http://placeimg.com/750/300',
			desc: '我是简介我是简介我是简介我是简介我是简介我是简介我是简介我是简介我是简介我是简介',
			allNews: [{
				title: 'test',
				news: [{
					imgs: '',
					title: ''
				}]
			},{
				title: 'test',
				news: [{
					imgs: '',
					title: ''
				}]
			}]
		},
		methods: {
			gotoDetail: function(i) {
				
			}
		}
	});
}

// 判断扩展API是否准备，否则监听'plusready'事件
if(window.plus) {
	plusReady();
} else {
	document.addEventListener('plusready', plusReady, false);
}