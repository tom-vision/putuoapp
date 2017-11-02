var userInfo = _load(_get('userInfo'));
console.log(_get('userInfo'));

var release = new Vue({
	el: '#release',
	data: {
		imgs: [],
		showAdd: true,
		content: '',
		releaseType: '', //动态类型
	},
	methods: {
//		addImg: function(index) {
//			var self = this;
//
//			var imgName = 'interact' + '-' + index + '.png';
//			console.log(imgName);
//
//			plus.gallery.pick(function(a) {
//
//				plus.io.resolveLocalFileSystemURL(a, function(entry) {
//
//					plus.io.resolveLocalFileSystemURL("_doc/", function(root) {
//
//						root.getFile(imgName, {}, function(file) {
//
//							//文件已存在
//
//							file.remove(function() {
//
//								console.log("file remove success");
//
//								entry.copyTo(root, imgName, function(e) {
//
//										var path = e.fullPath + "?version=" + new Date().getTime();
//
//										root.getFile(imgName, {}, function(file) {
//											
//											console.log(file.name);
//											uploadImage(file);
//										})
//
//										console.log('111' + path);
//										self.imgs.splice(index, 1, path);
//
//
//									},
//
//									function(e) {
//
//										console.log('copy image file:' + e.message);
//
//									});
//
//							}, function() {
//
//								console.log('delete image file:' + e.message);
//
//							});
//
//						}, function() {
//
//							//文件不存在
//
//							entry.copyTo(root, imgName, function(e) {
//
//								var path = e.fullPath + "?version=" + new Date().getTime();
//								
//								//上传图片
//								root.getFile(imgName, {}, function(file) {
//									
//									uploadImage(file);
//								})
//
//								self.imgs.push(path);
//								console.log(_dump(self.imgs));
//
//							}, function(e) {
//
//								console.log('copy image fail:' + e.message);
//
//							});
//
//						});
//
//					}, function(e) {
//
//						console.log("get _www folder fail");
//
//					})
//
//				}, function(e) {
//
//					console.log("读取拍照文件错误：" + e.message);
//
//				});
//
//			}, function(a) {}, {
//
//				filter: "image"
//
//			})
//		},
		removeImg: function(e) {
			var self = this;
			console.log("移除图片");
			self.imgs.splice(-1, 1);
			e.srcElement.remove();

		},
		
		addImg: function(evt) {
			// 上传
			var self = this;
			uploadImage(evt, function(r) {

				console.log(_dump(r));
				self.imgs.push(serverAddr+r.image);
				
			});
		},

	},
	watch: {
		imgs: function() {
			console.log(this.imgs.length);
			if(this.imgs.length == 3) {
				this.showAdd = false;
			} else {
				this.showAdd = true;
			}
		}
	}
});

var head = new Vue({
	el: '#header',
	data: {

	},
	methods: {
		diliver: function() {
			
			if(userInfo.id == null || userInfo.id ==0) return mui.toast("请先在个人中心登录");
			if('' == release.releaseType) return mui.toast("动态类型为空");
			if('' == release.content && release.imgs.length == 0) return mui.toast("不说点什么？");

			//上传图片到服务器
//			uploadImage(release.imgs);			
			return;
			
			var img = '';

			release.imgs.forEach(function(r) {
				if('' == img) {
					img = r;
				} else {
					img = img + ';' + r;
				}
			});

			console.log(img);

			_callAjax({
				cmd: "exec",
				sql: "insert into interact(userId, content, img, linkerId) values(?,?,?,?)",
				vals: _dump([userInfo.id, release.content, img, release.releaseType])
			}, function(d) {
				if(d.success) {

					mui.toast("发布成功");
					//清空数据
					release.imgs = [];
					release.content = '';
					
					setTimeout(function() {
						mui.back();
					
					}, 2000);
				}
			});
		}
	}

})

function uploadImage(evt, cb){
	// 文件上传的文件夹
	var folderName = 'interact';
//	QingZhou.showPreloader('上传中...');
	var arr = [{
		key: 'kkkk'
	}];
	// 上传图片
	_uploadMulityImageVueChange(folderName, evt.target.files, arr, serverAddr+'/multiupload', function(ret) {
		if(null !== ret && ret.length > 0) {
			ret.forEach(function(r) {
				cb(r);
			});
		}
//		QingZhou.hidePreloader();
	});
}

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

//添加releaseType自定义事件监听
window.addEventListener('releaseType', function(event) {
	userInfo = _load(_get('userInfo'));
	//获得事件参数
	release.releaseType = event.detail.type;

	console.log(release.releaseType);

})