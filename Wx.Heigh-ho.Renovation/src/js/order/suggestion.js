var BASEURL = 'http://www.heeyhome.com/lpcs/home/';
var OPENIDURL = BASEURL + 'index/index'; // openid
var openid = ''; //o-X7mw822W0t7e9u7gqwkrxsb3-I

/*定义一个类*/
var suggestionWarp = {
	/* 全局变量 */
	SUGGESTIONURL: BASEURL + 'suggestion/add', // 意见反馈
	/**
	 * 入口方法
	 */
	init: function() {
		// 页面事件
		suggestionWarp.initEvent();

	},
	/**
	 * 所有事件的绑定根据功能模块统一写在同一个方法里，根据业务调用
	 */
	initEvent: function() {
		var self = this;
		// 点击送达时间
		$(document).on('click', '.suggestion_submit', function() { // 意见反馈
			var orderid = sessionStorage.getItem('orderid');
			self.submitSuggestionEvent(orderid);
		})

	},
	/**
	 * 意见反馈
	 */
	submitSuggestionEvent: function(orderid) {
		$.ajax({
			url: suggestionWarp.SUGGESTIONURL,
			type: "GET",
			async: true,
			data: {
				openid: openid,
				order_id: orderid,
				content: $('.suggestion_Wrap textarea').val()
			},
			dataType: 'jsonp',
			success: function(data) {
				if(data.code == '000') {
					layer.msg("意见反馈成功");
					setTimeout(function() {
						window.location.href = 'orderList.html';
					}, 1000);

				} else {
					layer.msg(data.msg);
				}
			},
			error: function(data) {}
		});

	}
};

//入口方法调用 代码只能从这里执行
$(function() {

	function getUrlParam(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
		var r = window.location.search.substr(1).match(reg); //匹配目标参数
		if(r != null) return unescape(r[2]);
		return null; //返回参数值
	}

	var code = getUrlParam('code');
	if(sessionStorage.getItem('openid') == null) {
		$.ajax({
			url: OPENIDURL,
			type: "GET",
			async: true,
			data: {
				code: code
			},
			dataType: 'jsonp',
			success: function(data) {
				if(data.code == '000') {
					openid = data.data.openid;
					sessionStorage.setItem('openid', data.data.openid);
					suggestionWarp.init();
				} else {
					layer.msg(data.msg);
				}
			},
			error: function(data) {}
		});
	} else {

		openid = sessionStorage.getItem('openid');
		if(openid != null) {
			suggestionWarp.init();
		}

	}
});