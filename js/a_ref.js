var isTest = true;
var serverAddr = isTest ? "http://192.168.0.110:10000" : "";

var _set = function(k, v) {
	plus.storage.setItem(k, v); 
};
var _get = function(k) {
    return plus.storage.getItem(k); 
};

var _at = function(arr, id) {
	if(id < 0) id = arr.length + id;
	return arr[id];
};

var _dump = function(dict) {
	return JSON.stringify(dict);
};

var _load = function(s) {
	return JSON.parse(s);
};
var _echo = function(any) {
	return any;
}
var _tell = function(d) {
	console.log(JSON.stringify(d));
}

//var _genCallAjax = function(url) {
//	return function(data, cb, notLoading) {
//		if(!notLoading) _loading();
//		cb = cb ? cb : function() {};
//		$.ajax({
//			type: "GET",
//			async: true,
//			url: url,
//			dataType: "jsonp",
//			jsonp: "callback",
//			data: $.extend(data, {
//				token: 'Jh2044695'
//			}),
//			contentType: "multipart/form-data; charset=UTF-8",
//			success: function(d) {
//				_tell(d);
//				cb(d);
//				_stopLoading();
//			},
//			error: function(e) {
//				// console.log(JSON.stringify(e));
//				// _popup("服务器连接失败，请重试！");
//				_stopLoading();
//			}
//		});
//	};
//};
var _genCallAjax = function(url) {
	return function(data, cb, notLoading) {
		//      if (!notLoading) _loading();
		cb = cb ? cb : function() {};
		data.callback = "_echo";

		mui.ajax({
			type: "get",
			url: url,
			async: true,
			data: $.extend(data, { token: 'Jh2044695' }),

//			data: data,
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

			}
		});

	};
};

var _callAjax = _genCallAjax(serverAddr + "/db4web");
var _smsAjax  = _genCallAjax("http://develop.zsgd.com:7071/sms/");