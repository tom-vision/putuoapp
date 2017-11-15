// 扩展API加载完毕，现在可以正常调用扩展API
function plusReady() {
	mui.init({
		beforeback: function() {
			userInfo.userInfo = ''
		}
	})
	
	var nav = new Vue({
		el: '#nav',
		data: {},
		methods: {
			//保存
			save: function() {
				var self = this;

				//修改成功插入数据
				_callAjax({
					cmd: "exec",
					sql: "update User set name = ? , img= ? where phone = ?",
					vals: _dump([userInfo.userInfo.name, userInfo.userInfo.img, userInfo.userInfo.phone])
				}, function(d) {
					if(d.success) {
						mui.toast("保存成功");
						_set('userInfo', _dump(userInfo.userInfo));
						mui.fire(plus.webview.getLaunchWebview(), 'loginBack');
						setTimeout(function() {
							mui.back();

						}, 2000);
					}
				});
			}
		}
	})

	var userInfo = new Vue({
		el: '#userInfo',
		data: {
			userInfo: '',
		},
		methods: {
			changeName: function() {
				var self = this;

				mui.prompt('请输入新的用户名', '', '', ['确认', '取消'], function(e) {
					console.log(((e.index == 0) ? "确认: " : "取消") + e.value);
					if(e.index == 0) {
						if(e.value.length<=12){
							self.userInfo.name = e.value;
						}else {
							mui.toast("用户名不要超过12个字符");
						}
					}
				}, 'div');
			},
			addImg: function(evt) {
				// 上传
				var self = this;
				uploadImage(evt, function(r) {
					self.userInfo.img = serverAddr + '/pic/head/' + r.thumb;
				});
			}
		},
		mounted: function() {
			var self = this;
		}
	})
	
	window.addEventListener('getInfo', function(event) {
		userInfo.userInfo = _load(_get('userInfo'))
	})
}

function uploadImage(evt, cb) {
	// 文件上传的文件夹
	var folderName = 'head';
	var arr = [{
		key: 'kkkk',
		width: 200
	}];
	// 上传图片
	_uploadMulityImageVueChange(folderName, evt.target.files, arr, serverAddr + '/multiupload', function(ret) {
		if(null !== ret && ret.length > 0) {
			ret.forEach(function(r) {
				cb(r);
			});
		}
	});
}


// 判断扩展API是否准备，否则监听'plusready'事件
if(window.plus) {
	plusReady();
} else {
	document.addEventListener('plusready', plusReady, false);
}