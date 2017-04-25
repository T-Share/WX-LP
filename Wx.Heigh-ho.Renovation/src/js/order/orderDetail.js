var BASEURL = 'http://www.heeyhome.com/lpcs/home/';
var OPENIDURL = BASEURL + 'index/index'; // openid
var ORDERSTEPURL = BASEURL + 'order/order_step'; // 判断是否支付成功
var openid = ''; //o-X7mw822W0t7e9u7gqwkrxsb3-I

/*定义一个类*/
var orderDetailWarp = {
	/* 全局变量 */
	ORDERINFOURL: BASEURL + 'order/orderinfo', // 订单详情
	ORDERCANCELURL: BASEURL + 'order/ordercancel', // 取消订单
	AGAINORDERURL: BASEURL + 'order/orderagain', // 再来一单
	ORDERPAYURL: BASEURL + 'order/order_continue', // 付款
	ORDERDETAILID: sessionStorage.getItem('orderDetailId'),
	MSG1: '支付成功！',
	MSG2: '等待商家接单...',
	MSG3: '已接单！',
	MSG4: '等待商家配送...',
	MSG5: '订单已完成！',
	MSG6: '待支付！',
	MSG7: '<span></span>后订单将自动取消',
	MSG8: '订单已取消！',
	MSG9: '订单正在配送中，请耐心等待...',
	/**
	 * 入口方法
	 */
	init: function() {
		// 页面初始化数据
		orderDetailWarp.initDataEvent();
		// 页面事件
		orderDetailWarp.initEvent();

	},
	/**
	 * 数据初始化
	 */
	initDataEvent: function() {
		var self = this;
		self.getOrderDetailInfoData(); // 订单详情内容初始化
	},
	/**
	 * 所有事件的绑定根据功能模块统一写在同一个方法里，根据业务调用
	 */
	initEvent: function() {
		var self = this;
		// 点击送达时间
		$(document).on('touchstart', '.detail_pay', function() { //去付款
			self.gotoPayEvent(orderDetailWarp.ORDERDETAILID);
		}).on('touchstart', '.cancel_order', function() { //取消订单
			self.cancelOrderEvent(orderDetailWarp.ORDERDETAILID);
		}).on('touchstart', '#order_again', function() { //再来一单
			self.againOrderEvent(orderDetailWarp.ORDERDETAILID);
		})

	},
	/**
	 * 订单详情内容初始化
	 */
	getOrderDetailInfoData: function() {
		var self = this;
		var $shopcontent = $('.shop_content ul');
		$.ajax({
			url: orderDetailWarp.ORDERINFOURL,
			type: "GET",
			async: true,
			data: {
				order_id: orderDetailWarp.ORDERDETAILID
			},
			dataType: 'jsonp',
			success: function(data) {
				if(data.code == '000') {
					console.log(data);
					$.each(data.data.goods, function(i, v) {
						var shopStr = '<li>';
						shopStr += '<span class="v_name">' + v.goods_name + '</span>';
						shopStr += '<span class="v_num">x ' + v.goods_num + '</span>';
						shopStr += '<span class="v_price">￥' + v.discount_price + '</span>';
						shopStr += '</li>';
						$shopcontent.append(shopStr);
					});
					$('#psf i').html(data.data.distribution_cost); //配送费
					$('#total i').html(data.data.total_amount); //总额
					$('.order_num .list_right').html(data.data.order_id); //订单编号
					$('.order_time .list_right').html(data.data.order_time); //订单时间
					$('.goods_num .list_right').html(data.data.goods_num); //商品数量
					$('.send_address .list_right').html(data.data.address + data.data.room); //配送地址
					if(data.data.remark) {
						$('#remark').html(data.data.remark); //备注
					} else {
						$('#remark').html('无'); //备注
					}
					if(data.data.order_step == '0') { //0:待支付
						$('.status_top b').html(orderDetailWarp.MSG6);
						$('.status_top span').html(orderDetailWarp.MSG7);
						$('#order_detail').css('display', 'flex');
						self.countdownEvent(orderDetailWarp.ORDERDETAILID, data.data.order_time);
						$('.order_step').show();
						$('.step_content .content1').html('待支付').removeClass('active');
						$('.step_content .content2').html('待接单').removeClass('active');
						$('.step_content .content3').html('待送达').removeClass('active');
					} else if(data.data.order_step == '1') { //1：已支付待接单
						$('.status_top i').css('display', 'inline-block');
						$('.status_top b').html(orderDetailWarp.MSG1);
						$('.status_top span').html(orderDetailWarp.MSG2);
						$('#order_again').show();
						$('.order_step').show();
						$('.step_content .content1').html('已支付').addClass('active');
						$('.step_content .content2').html('待接单').removeClass('active');
						$('.step_content .content3').html('待送达').removeClass('active');
					} else if(data.data.order_step == '2') { //2：待配送
						$('.status_top b').html(orderDetailWarp.MSG3);
						$('.status_top span').html(orderDetailWarp.MSG4);
						$('#order_again').show();
						$('.order_step').show();
						$('.step_content .content1').html('已支付').addClass('active');
						$('.step_content .content2').html('已接单').addClass('active');
						$('.step_content .content3').html('待送达').removeClass('active');
					} else if(data.data.order_step == '3') { //3：已完成
						$('.status_top b').html(orderDetailWarp.MSG5);
						$('#order_again').show();
						$('.order_step').show();
						$('.step_content .content1').html('已支付').addClass('active');
						$('.step_content .content2').html('已接单').addClass('active');
						$('.step_content .content3').html('已送达').addClass('active');
					} else if(data.data.order_step == '4') { //4：已取消
						$('.status_top b').html(orderDetailWarp.MSG8);
						$('#order_again').show();
					} else if(data.data.order_step == '5') { //5：配送中
						$('.status_top b').html(orderDetailWarp.MSG9);
						$('#order_again').show();
					}
				} else {
					layer.msg(data.msg);
				}
			}
		});
	},
	/**
	 * 倒计时
	 */
	countdownEvent: function(orderDetailId, orderTime) {
		var self = this;
		var myDate = new Date();
		var dateArr = orderTime.split(' ')[0].split('-');
		var timeArr = orderTime.split(' ')[1].split(':');
		var orderTimeDate = new Date(dateArr[0], dateArr[1] - 1, dateArr[2], timeArr[0], timeArr[1], timeArr[2]); //转换成date类型
		var time_difference = myDate.getTime() - orderTimeDate.getTime(); //现在时间毫秒值-下单时间毫秒值
		var intDiff = parseInt(900 - time_difference / 1000); //倒计时总秒数量
		function timer(intDiff) {
			window.setInterval(function() {
				var day = 0,
					hour = 0,
					minute = 0,
					second = 0; //时间默认值
				if(intDiff > 0) {
					day = Math.floor(intDiff / (60 * 60 * 24));
					hour = Math.floor(intDiff / (60 * 60)) - (day * 24);
					minute = Math.floor(intDiff / 60) - (day * 24 * 60) - (hour * 60);
					second = Math.floor(intDiff) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
				} else {
					self.cancelOrderEvent(orderDetailId);
				}
				if(minute <= 9) minute = '0' + minute;
				if(second <= 9) second = '0' + second;
				$('.status_top span span').html(minute + '分' + second + '秒');
				intDiff--;
			}, 1000);
		}

		$(function() {
			timer(intDiff);
		});
	},
	/**
	 * 取消订单
	 */
	cancelOrderEvent: function(order_id) {
		$.ajax({
			url: orderDetailWarp.ORDERCANCELURL,
			type: "GET",
			async: true,
			data: {
				order_id: order_id
			},
			dataType: 'jsonp',
			success: function(data) {
				if(data.code == '000') {
					window.location.href = 'orderList.html';
				} else {
					layer.msg(data.msg);
				}
			},
			error: function(data) {}
		});
	},
	/**
	 * 再来一单
	 */
	againOrderEvent: function(order_id) {
		$.ajax({
			url: orderDetailWarp.AGAINORDERURL,
			type: "GET",
			async: true,
			data: {
				order_id: order_id
			},
			dataType: 'jsonp',
			success: function(data) {
				if(data.code == '000') {
					window.location.href = '../../index.html';
				} else {
					layer.msg(data.msg);
				}
			},
			error: function(data) {}
		});
	},
	/**
	 * 去付款
	 */
	gotoPayEvent: function(order_id) {
		$.ajax({
			url: orderDetailWarp.ORDERPAYURL,
			type: "GET",
			async: true,
			data: {
				order_id: order_id
			},
			dataType: 'jsonp',
			success: function(data) {
				if(data.code == '000') {
					var parsedata = JSON.parse(data.data.jsApiParameters);
					var orderid = data.data.order_id;
					WXPayHendler.callpay(parsedata, orderid);
				} else {
					layer.msg(data.msg);
				}
			},
			error: function(data) {}
		});
	},

};

/**
 * 微信支付
 */
WXPayHendler = {
	callpay: function(jsStr, orderid) {
		var self = this;
		if(typeof WeixinJSBridge == "undefined") {
			if(document.addEventListener) {
				document.addEventListener('WeixinJSBridgeReady', jsApiCall, false);
			} else if(document.attachEvent) {
				document.attachEvent('WeixinJSBridgeReady', jsApiCall);
				document.attachEvent('onWeixinJSBridgeReady', jsApiCall);
			}
		} else {
			self.jsApiCall(jsStr, orderid);
		}
	},
	/**
	 * 调用微信JS api 支付
	 */
	jsApiCall: function(jsStr, orderid) {
		WeixinJSBridge.invoke(
			'getBrandWCPayRequest', {
				"appId": jsStr.appId,
				"nonceStr": jsStr.nonceStr,
				"package": jsStr.package,
				"paySign": jsStr.paySign,
				"signType": jsStr.signType,
				"timeStamp": jsStr.timeStamp
			},
			function(res) {
				WeixinJSBridge.log(res.err_msg);
				if(res.err_msg == 'get_brand_wcpay_request:cancel') {
					layer.alert("您已取消了此次支付");
					window.location.href = 'orderList.html';
					return;
				} else if(res.err_msg == 'get_brand_wcpay_request:fail') {
					layer.alert("支付失败");
					window.location.href = 'orderList.html';
					return;
				} else if(res.err_msg == 'get_brand_wcpay_request:ok') {
					$.ajax({
						url: ORDERSTEPURL,
						type: "GET",
						async: true,
						data: {
							order_id: orderid
						},
						dataType: 'jsonp',
						success: function(data) {
							if(data.code == '000') {
								sessionStorage.setItem('orderDetailId', orderid);
								window.location.href = 'orderDetail.html';
							}
						},
						error: function(data) {}
					});

				} else {
					layer.alert("未知错误" + res.error_msg);
					window.location.href = 'orderList.html';
					return;
				}
			}
		);
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
					orderDetailWarp.init();
				} else {
					layer.msg(data.msg);
				}
			},
			error: function(data) {}
		});
	} else {

		openid = sessionStorage.getItem('openid');
		if(openid != null) {
			orderDetailWarp.init();
		}

	}
});