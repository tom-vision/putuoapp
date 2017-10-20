var isTest = true;
var serverAddr = isTest ? "http://192.168.0.110:10000":"";

var _dump = function(dict) {
    return JSON.stringify(dict);
};

var _load = function(s) {
    return JSON.parse(s);
};
var _echo = function(any){
	return any;
}
var _tell = function(d) {
	console.log(JSON.stringify(d));
}
var _genCallAjax = function(url){
	 return function(data, cb, notLoading) {
//      if (!notLoading) _loading();
        cb = cb ? cb : function() {};
        data.callback = "_echo";

        $.ajax({
            type: "get",
            url: url,
            async: true,
            data: data,
            dataType: "jsonp",
            jsonp: "jsoncallback",
            timeout: 10000,
            success: function(data) {
            	
            	d = eval(data);
            	_tell(d);
                cb(d);
            },
            error: function(xhr, type, errorThrown) {
            	console.log(xhr + type + errorThrown);
				
                plus.nativeUI.toast(errorThrown);
            }
        });
        
//      mui.ajax(url,{
//      	crossDomain:true,
//			data:data,
//			dataType:'json',//服务器返回json格式数据
//			type:'get',//HTTP请求类型
//			timeout:10000,//超时时间设置为10秒；
//			headers:{'Content-Type':'application/json'},	              
//			success:function(data){
//				//服务器返回响应，根据响应结果，分析是否登录成功；
//	
//			},
//			error:function(xhr,type,errorThrown){
//				//异常处理；
//				console.log(type);
//			}
//		});
        
 
    };
};

var _callAjax = _genCallAjax(serverAddr + "/db4web");
