// 扩展API加载完毕，现在可以正常调用扩展API
function plusReady() {
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
			userInfo: _load(_get('userInfo')),
		},
		methods: {
			changeName: function() {
				var self = this;

				mui.prompt('请输入新的用户名', '', '', ['确认', '取消'], function(e) {
					console.log(((e.index == 0) ? "确认: " : "取消") + e.value);
					if(e.index == 0) {

						self.userInfo.name = e.value;
						console.log(self.userInfo.name);
					}
				}, 'div');

			},
			changeAvatar: function() {
				var self = this;
				
				plus.gallery.pick(function(a) {
					plus.io.resolveLocalFileSystemURL(a, function(entry) {
						plus.io.resolveLocalFileSystemURL("_doc/", function(root) {
							root.getFile("bg.png", {}, function(file) {
								//文件已存在
								file.remove(function() {
									entry.copyTo(root, 'bg.png', function(e) {
											var e = e.fullPath + "?version=" + new Date().getTime();
											uploadHead(e); //上传图片
											self.userInfo.img = e;
										},
										function(e) {
											console.log('copy image file:' + e.message);
										});
								}, function() {
									console.log('delete image file:' + e.message);
								});
							}, function() {
								//文件不存在
								entry.copyTo(root, 'bg.png', function(e) {
									var path = e.fullPath + "?version=" + new Date().getTime();
									uploadHead(path);
									self.userInfo.img = e;
								}, function(e) {
									console.log('copy image fail:' + e.message);
								});
							});
						}, function(e) {
							console.log("get _www folder fail");
						})
					}, function(e) {
						console.log("读取拍照文件错误：" + e.message);
					});
				}, function(a) {}, {
					filter: "image"
				})
			}
		},
		mounted: function() {
			var self = this;
		}
	})
}

//上传头像图片

function uploadHead(imgPath) {
	console.log("imgPath =" + imgPath);
	var mainImage = document.getElementById("titleimg");
	mainImage.src = imgPath;
	mainImage.style.width = "64px";
	mainImage.style.height = "64px";
	var image = new Image();
	image.src = imgPath;
	image.onload = function() {
		var imgData = getBase64Image(image);
	}
}

//将图片压缩成base64

function getBase64Image(img) {
	var canvas = document.createElement("canvas");
	var width = img.width;
	var height = img.height;
	if(width > height) {
		if(width > 100) {
			height = Math.round(height *= 100 / width);
			width = 100;
		}
	} else {
		if(height > 100) {
			width = Math.round(width *= 100 / height);
			height = 100;
		}
	}
	canvas.width = width;
	canvas.height = height;
	var ctx = canvas.getContext("2d");
	ctx.drawImage(img, 0, 0, width, height);
	var dataURL = canvas.toDataURL("image/png", 0.8);
	return dataURL.replace("data:image/png;base64,", "");
}

// 判断扩展API是否准备，否则监听'plusready'事件
if(window.plus) {
	plusReady();
} else {
	document.addEventListener('plusready', plusReady, false);
}