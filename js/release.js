// 扩展API加载完毕，现在可以正常调用扩展API
function plusReady() {
	var userInfo = _load(_get('userInfo'));

	var release = new Vue({
		el: '#release',
		data: {
			imgs: [],
			showAdd: true,
			content: '',
			releaseType: '', //动态类型
		},
		methods: {
			removeImg: function(e) {
				var self = this;
				plus.nativeUI.confirm("确认删除已上传的图片?", function(e){
					if(e.index == 0) {
						self.imgs.splice(-1, 1);
						mui.toast('删除成功');
					}
				});
			},
			addImg: function(evt) {
				// 上传
				var self = this;
				plus.nativeUI.showWaiting('上传中...')
				uploadImage(evt, function(r) {
					plus.nativeUI.closeWaiting();
					self.imgs.push(serverAddr+'/pic/interact/'+r.thumb);
				});
			},
		},
		watch: {
			imgs: function() {
				if(this.imgs.length == 3) {
					this.showAdd = false;
				} else {
					this.showAdd = true;
				}
			}
		},
		mounted: function() {
			var self = this;
//			var cameraEnable = _get('camera');
//
//			if(cameraEnable != 1){
//				mui.confirm('是否授权使用相机，用以互动上传照片', '', ['确定', '取消'], function(e) {
//					if(e.index == 0) {
//						_set('camera', '1');
//					} else {
//						_set('camera', '0');
//						mui.back();
//					}
//				})
//			}			
		}
	});
	
	var head = new Vue({
		el: '#header',
		data: {
			interactCtrl: false,  //互动审核开关
		},
		methods: {
			diliver: function() {
				var self = this;
				
				userInfo = _load(_get('userInfo'));
				if(userInfo == null || userInfo == ''){
					mui.toast("请先在个人中心登录");
					openWindow('login.html', 'login');
					return ;
				} 
				if('' == release.releaseType) return mui.toast("动态类型为空");
				if('' == release.content && release.imgs.length == 0) return mui.toast("不说点什么？");
				
				var img = '';
	
				release.imgs.forEach(function(r) {
					if('' == img) {
						img = r;
					} else {
						img = img + ';' + r;
					}
				});
	
				var ifValid = self.interactCtrl ? -1 : 1;
				console.log("ifValid="+ifValid);
				
				_callAjax({
					cmd: "exec",
					sql: "insert into interact(userId, content, img, linkerId, ifValid) values(?,?,?,?,?)",
					vals: _dump([userInfo.id, release.content, img, release.releaseType, ifValid])
				}, function(d) {
					if(d.success) {
						self.interactCtrl ? mui.toast('您的互动将在审核后显示') : mui.toast("发布成功");
						//清空数据
						release.imgs = [];
						release.content = '';
						
						setTimeout(function() {
							mui.fire(plus.webview.getWebviewById('interact'), 'releaseBack');
							mui.back();
						}, 500);
					}
				});
			},
			//获取互动审核开关
			getInteractCtrl: function() {
				var self = this;
				console.log("1111");
				
				//互动审核开关
				_callAjax({
					cmd: "fetch",
					sql: "select interactCtrl from system"
				}, function(d) {
					if(d.success && d.data) {
						_tell(d.data);
						self.interactCtrl = d.data[0].interactCtrl == 1 ? true : false;
					}
				});
			}
		},
		mounted: function(){
			var self = this;
			
			self.getInteractCtrl();
		}
	
	})
	
	function uploadImage(evt, cb){
		// 文件上传的文件夹
		var folderName = 'interact';
		var arr = [{
			key: 'kkkk',
			width: 750
		}];
		// 上传图片
		_uploadMulityImageVueChange(folderName, evt.target.files, arr, serverAddr+'/multiupload', function(ret) {
			if(null !== ret && ret.length > 0) {
				ret.forEach(function(r) {
					cb(r);
				});
			}
		});
	}
	
	userInfo = _load(_get('userInfo'));
	//获得事件参数
	release.releaseType = plus.webview.currentWebview().type;
	head.getInteractCtrl();
}

// 判断扩展API是否准备，否则监听'plusready'事件
if(window.plus) {
	plusReady();
} else {
	document.addEventListener('plusready', plusReady, false);
}
