;
(function($) {
	'use strict';
	var win = window;
	var doc = document;
	var $win = $(win);
	var $doc = $(doc);
	var BASEURL = 'http://www.heeyhome.com/lpcs/home/';
	var OPENIDURL = BASEURL + 'index/index'; // openid
	$.fn.common = function() {
		return new MyCommon();
	};

	var MyCommon = function() {
		var me = this;
		me.init();
	};

	// 初始化
	MyCommon.prototype.init = function() {
		var me = this;
		var code = getUrlParam('code');
		var openid = '';
		$.ajax({
			url: OPENIDURL,
			type: "POST",
			async: true,
			data: {
				code: code
			},
			dataType: 'jsonp',
			success: function(data) {
				if(data.code == '000') {
					openid = data.data.openid;
					//					sessionStorage.setItem('openid', data.data.openid);
				} else {
					layer.msg(data.msg);
				}
			},
			error: function(data) {}
		});
		//		openid = 'o-X7mw822W0t7e9u7gqwkrxsb3-I'; //o-X7mw822W0t7e9u7gqwkrxsb3-I
		return openid;
	};

	function getUrlParam(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
		var r = window.location.search.substr(1).match(reg); //匹配目标参数
		if(r != null) return unescape(r[2]);
		return null; //返回参数值
	}

})(window.Zepto || window.jQuery);