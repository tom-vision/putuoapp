var isTest = true;
var serverAddr = isTest ? "http://192.168.0.144:10000":"";

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
var _genCallAjax = function(url) {
	return function(data, cb, notLoading) {
		//      if (!notLoading) _loading();
		cb = cb ? cb : function() {};
		data.callback = "_echo";

		mui.ajax({
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

			}
		});
	};
};

var _callAjax = _genCallAjax(serverAddr + "/db4web");
