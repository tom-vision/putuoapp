// 扩展API加载完毕，现在可以正常调用扩展API
function plusReady() {
	var topicId = 0;
	
	var theme = new Vue({
		el: '#theme',
		data: {
			cover: '', //专题封面
			desc: '', //专题简介
			allNews: []
		},
		methods: {
			// 跳转到新闻详情
			gotoDetail: function(i) {
				if(i.url != '#' && i.url.length > 1) {
					openOutlink(i.url, i.title);
				} else {
					_set('newsId', i.newsId);
					setTimeout(function() {
						openWindow('newsDetail.html', 'newsDetail');
					}, 200)
				}
			},
			// 获取专题信息
			getTopicInfo: function(){
				var self = this;
				
				_callAjax({
					cmd:"fetch",
					sql:"select img, brief from linkers where id = ?",
					vals:_dump([topicId])
				},function(d){
					if(d.success && d.data){
						self.cover = d.data[0].img;
						self.desc = d.data[0].brief;
					}
				})
			},
			// 获取专题下分类列表和新闻
			getAllNews: function(){
				var self = this;
				
				_callAjax({
					cmd:"fetch",
					sql:"select l.id, l.name as sortName, a.id as newsId, a.title, a.img, a.url, strftime('%Y-%m-%d %H:%M', a.newsdate) as newsdate from linkers l left outer join articles a on l.id = a.linkerId where l.refId = ? and l.ifValid = 1 and a.ifValid = 1 group by a.id order by l.id desc, a.newsdate desc",
					vals: _dump([topicId])
				},function(d){
					if(d.success && d.data){
						d.data.forEach(function(r){		
							var sort = '';
							if(self.allNews.length){
								sort = _at(self.allNews, -1).sortName;
							}
							if(sort == r.sortName){
								var sortNews = _at(self.allNews, -1);

								var arrImg = r.img.split(',');
								r.imgs = arrImg;
								sortNews.news.push(r);
							}else {	
								var sortNews = {sortName:'', news:[]};
								
								sortNews.sortName = r.sortName;
								sortNews.news = [];
								var arrImg = r.img.split(',');
								r.imgs = arrImg;
								sortNews.news.push(r);
								self.allNews.push(sortNews);
							}
							
						})
						
					}
					
				})
			},
			init: function(){
				var self = this;
				
				topicId = _get('adTopicId');
				self.allNews = [];
				self.getAllNews();
				self.getTopicInfo();
			}
		},
		mounted: function(){
			var self = this;
			
			self.init();
		}
	});
	
	//添加adTopicId自定义事件监听
	window.addEventListener('adTopicId', function(event) {
		theme.init();
	});
}

// 判断扩展API是否准备，否则监听'plusready'事件
if(window.plus) {
	plusReady();
} else {
	document.addEventListener('plusready', plusReady, false);
}