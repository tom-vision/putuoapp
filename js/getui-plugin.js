document.addEventListener( "plusready",  function()
{
    var _BARCODE = 'gtplugin',
		B = window.plus.bridge;
    var gtplugin =
    {
    	    callNative: function(fname, args, successCallback) {
			console.log('callNative 1')
			var callbackId = this.getCallbackId(successCallback, this.errorCallback)
			console.log('callNative 2')
			if(args != null) {
				args.unshift(callbackId)
			} else {
				var args = [callbackId]
			}
			console.log('callNative 3')
			return B.exec(_BARCODE, fname, args)
		},
		getCallbackId: function(successCallback) {
			var success = typeof successCallback !== 'function' ? null : function(args) {
				successCallback(args)
			}
			return B.callbackId(success, this.errorCallback)
		},
		errorCallback: function(errorMsg) {
			console.log('Javascript callback error: ' + errorMsg)
		},
	    	PluginGtInit : function (Argus, successCallback, errorCallback )
		{
			 return this.callNative("initPush",Argus,successCallback)
		},
	    	PluginGtStop : function (Argus, successCallback, errorCallback )
		{
			 return this.callNative("stopPush",Argus,successCallback)
		},
		// GetuiCallBack
		onReceiveOnlineState : function(inputValue) {
			document.getElementById('gt_state').value = inputValue
		},
		onReceiveMessageData : function(jsonValue) {
//			alert("onReceiveMessageData:" + JSON.stringify(jsonValue));
		},
		onReceiveClientId : function(inputValue){
//			alert("onReceiveClientId: " + inputValue);
			document.getElementById('gt_ud_cid').value = inputValue
		},
		onNotificationMessageArrived : function(jsonValue){
//			alert("onNotificationMessageArrived:" + JSON.stringify(jsonValue));
		},
		onNotificationMessageClicked : function(jsonValue) {
//			alert("onNotificationMessageClicked:" + JSON.stringify(jsonValue));
		}
		// test func
	 };
	window.plus.gtplugin = gtplugin;
}, true );