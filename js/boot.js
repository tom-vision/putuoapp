// 判断扩展API是否准备，否则监听'plusready'事件
if(window.plus) {
	plusReady();
} else {
	document.addEventListener('plusready', plusReady, false);
}

function plusReady() {
	var boot = new Vue({
		el: '.boot',
		data: {
			link: '',
			time: 7
		},
		methods: {
			openIndex: function() {
				var indexPage = null;
                
				//获得详情页面
				if(!indexPage && !!plus.webview.getWebviewById('index')) indexPage = plus.webview.getWebviewById('index');
				
				openWindow('index.html', 'index');
			}
		},
		created: function() {
			var self = this;
			//获取启动页
			_callAjax({
				cmd: "fetch",
				sql: "select homepage from system"
			}, function(d) {
				if(d.success && d.data) {
					self.link = d.data[0].homepage;
				}
				
				var ck = setInterval(function() {
					boot.time--;
					if(boot.time == 0) {
						clearInterval(ck)
						self.openIndex();
					};
				}, 1000)
			})
		}
	})
	
	// 监听在线消息事件
    plus.push.addEventListener( "receive", function( msg ) {
    	if(plus.os.name != "iOS") return;
        if ( msg.aps ) {  // Apple APNS message
            console.log( "接收到在线APNS消息：" + JSON.stringify(msg));
        } else {
			plus.push.createMessage(msg.content, msg.payload);
        }
    }, false );
    
    
}