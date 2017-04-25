var BASEURL = 'http://www.heeyhome.com/lpcs/home/';
var OPENIDURL = BASEURL + 'index/index'; // openid
var ORDERSTEPURL = BASEURL + 'order/order_step'; // 判断是否支付成功
var openid = ''; //o-X7mw822W0t7e9u7gqwkrxsb3-I

/*定义一个类*/
var orderWarp = {
	/* 全局变量 */
	FEEURL: BASEURL + 'dada/queryDeliverFee', // 获取默认购物车内容+配送费
	RANGEADDRESSURL: BASEURL + 'address/notover', // 获取没有超出配送范围的地址
	CONFIRMPAYURL: BASEURL + 'order/orderproduce', // 确认付款
	/**
	 * 入口方法
	 */
	init: function() {
		// 页面初始化数据
		orderWarp.initDataEvent();
		// 页面事件
		orderWarp.initEvent();

	},
	/**
	 * 数据初始化
	 */
	initDataEvent: function() {
		var self = this;
		self.getAddressContentData(); // 配送地址初始化
		self.getServiceTimeData(); // 送达时间初始化
	},
	/**
	 * 所有事件的绑定根据功能模块统一写在同一个方法里，根据业务调用
	 */
	initEvent: function() {
		var self = this;
		// 点击送达时间
		$(document).on('touchstart', '.Jsongda', function() {
				$("#time").removeClass("display");
				$("#wrap").removeClass("display");
				$("#Jcontainer").slideDown(300);
				$('#time').css('z-index', '1201');
			})
			.on('touchstart', '#wrap', function() {
				$("#Jcontainer").slideUp(300, function() {
					$("#time").addClass("display");
					$("#wrap").addClass("display");
					$('#time').css('z-index', '1030');
				});
			})
			.on('click', '#J_scroll_holder ul li', function() {
				$(this).find("i").addClass("click");
				$(this).siblings("li").find("i").removeClass("click");
				self.selectHiddenEvent($(this).data("j"), $(this).data("i"), $(this).index());
				$("#Jcontainer").slideUp(300, function() {
					$("#time").addClass("display");
					$("#wrap").addClass("display");
					$('#time').css('z-index', '1030');
				});
			})
			.on('click', '#Jleft_slide ul li', function() {
				$("#J_scroll_holder").stop().animate({
					scrollTop: 0
				}, 10);
				$(this).addClass("active").siblings("li").removeClass("active");
				$("#J_scroll_holder ul ").html(self.spliceTimeInfoEvent($(this).data("time"), $(this).data("day")));
				$("#J_scroll_holder ul li").data("j", $(this).data("time"));
				self.selectHiddenEvent($(this).data("time"), $(this).data("day"), 0)
			})
			.on('click', '.order_pay a', function() {
				self.confirmPayEvent();
			})
			.on('click', '.order_address', function() { // 选择送餐地址
				sessionStorage.setItem('addressId', $(this).attr("data-id"));
				window.location.href = 'address.html';
			});
	},
	/**
	 * 配送地址初始化
	 */
	getAddressContentData: function() {
		var self = this,
			addressObj = sessionStorage.getItem('addressObj');
		/* 获取用户地址数据 */
		if(addressObj) {
			var addressInfo = JSON.parse(addressObj);
			$('.address_name').html(addressInfo.name);
			$('.address_tel').html(addressInfo.tel);
			$('.address_room').html(addressInfo.room);
			$('.order_address').attr('data-id', addressInfo.id);
			self.getGwcContentData(addressInfo.id); // 获取默认购物车内容+配送费
		} else {
			$.ajax({
				url: orderWarp.RANGEADDRESSURL,
				type: "GET",
				async: true,
				data: {
					openid: openid
				},
				dataType: 'jsonp',
				success: function(data) {
					console.log(data);
					if(data.code == '000') {
						$('.order_address').attr('data-id', data.data[0].address_id);
						$('.address_name').html(data.data[0].name);
						$('.address_tel').html(data.data[0].phone);
						$('.address_room').html(data.data[0].address + '' + data.data[0].room);
						self.getGwcContentData(data.data[0].address_id); // 获取默认购物车内容+配送费
					} else {
						$('.address').html('请选择一个收货地址');
						$('.address').css('margin-top', '4%');
					}
				}
			});
		}
	},
	/**
	 * 获取默认购物车内容+配送费
	 */
	getGwcContentData: function(addressId) {
		var $content = $('.shop_content ul'),
			stitching = '';
		$.ajax({
			url: orderWarp.FEEURL,
			type: "GET",
			async: true,
			data: {
				openid: openid,
				address_id: addressId
			},
			dataType: 'jsonp',
			success: function(data) {
				console.log(data.data);
				if(data.data != '') {
					$.each(data.data.carts, function(i, v) {
						stitching += '<li><span class="v_name">' + v.goods_name + '</span>';
						stitching += '<span class="v_num">' + v.goods_num + '</span>';
						stitching += '<span class="v_price">￥' + v.discount_price + '</span></li>';
					});
					$content.html(stitching);
					$('.Jprice').html(data.data.fee); //配送费
					$('.order_money span').html('￥' + data.data.status.total); //总价
				}
			},
			error: function(data) {}
		});
	},
	/**
	 * 送达时间初始化
	 */
	getServiceTimeData: function() {
		var self = this,
			time = sessionStorage.getItem('time'), // 下单时间
			tIHendler = timeIntervalHendler;
		// 送达时间对象
		//			time = '16:00';
		var timeObj = {
			"今日": tIHendler.todayArrEvent(time),
			"明日": tIHendler.getHourAndMinutesArr('08:15', '20:15', 15)
		};
		$("#Jleft_slide ul").html(self.spliceDataInfoEvent(timeObj));
		$("#Jleft_slide ul li").data('time', timeObj);
		$("#J_scroll_holder ul ").html(self.spliceTimeInfoEvent(timeObj, "今日"));
		$("#J_scroll_holder ul li").data('j', timeObj);
		self.selectHiddenEvent(timeObj, "今日", 0)
	},
	/**
	 * 送达日期
	 * @param {Object} Obj 对象
	 */
	spliceDataInfoEvent: function(Obj) {
		var vrStr = '';
		$.each(Obj, function(i, v) {
			vrStr += '<li class="' + (i == '今日' ? "active" : "") + '" data-day = "' + i + '" data-time = ' + JSON.stringify(Obj) + '>' + i + '</li>';
		});
		return vrStr;
	},
	/**
	 * 送达时间
	 * @param {Object} Obj 对象
	 */
	spliceTimeInfoEvent: function(Obj, name) {
		var vrStr = '';
		$.each(Obj[name], function(i, v) {
			vrStr += '<li data-i="' + name + '"><p>' + v + '</p><i class="' + (i == 0 ? "click" : "") + '"></i></li>';
		});
		return vrStr;
	},
	/**
	 * 隐藏域设置
	 */
	selectHiddenEvent: function(Obj, name, i) {
		var hiddenObj = {
			dayName: name,
			time: Obj[name][i]
		};
		$("#JselectIt").val(JSON.stringify(hiddenObj));
		var obj = JSON.parse($("#JselectIt").val());
		console.log(obj);
		if(obj.time) {
			if(obj.time.indexOf("尽快送达") >= 0) {
				$(".Jsongda").find("span").text(obj.time);
			} else {
				$(".Jsongda").find("span").text(obj.dayName + obj.time);
			}
		}
	},
	/**
	 * 确认付款
	 */
	confirmPayEvent: function() {
		var addressId = $('.order_address').attr('data-id'); // 送达地址ID
		if(addressId) {
			var appointmentTime = $('.Jsongda span').html(), // 送达时间
				distributionCost = $('#psf').html(), // 配送费
				remarkVal = $('.order_mark textarea').val(); // 备注
			$.ajax({
				url: orderWarp.CONFIRMPAYURL,
				type: "GET",
				async: true,
				data: {
					openid: openid,
					address_id: addressId,
					appointment_time: appointmentTime,
					distribution_cost: distributionCost,
					remark: remarkVal
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
		} else {
			layer.msg('请添加地址');
		}
	}
};

timeIntervalHendler = {
	/**
	 * 时间间隔
	 * @param {Object} todayTime 下单时间
	 */
	todayArrEvent: function(todayTime) {
		var self = this,
			timeArr1 = todayTime.split(':'),
			arr = ['尽快送达 | 预计' + (parseInt(timeArr1[0]) + 1) + ':' + timeArr1[1]];
		timeArr1[1] = timeArr1[1] - timeArr1[1] % 15 + 15;
		var timeTempArr = self.getHourAndMinutesArr((parseInt(timeArr1[0]) + 1) + ':' + timeArr1[1], '20:15', 15);
		arr = arr.concat(timeTempArr);
		return arr;
	},
	/**
	 * startTime: '08:15'
	 * endTime:'20:15'
	 * minutes:15 间隔
	 */
	getHourAndMinutesArr: function(startTime, endTime, minutes) {
		var startArr = startTime.split(":");
		var endArr = endTime.split(":");
		var date = new Date();
		var year = date.getFullYear();
		var month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);
		var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
		var startDate = new Date(year, month, day, startArr[0], startArr[1], 00);
		var endDate = new Date(year, month, day, endArr[0], endArr[1], 00);
		var timeArr = [];
		timeArr.push(startTime);
		while(true) {
			startDate.setMinutes(startDate.getMinutes() + parseInt(minutes));
			var hour = startDate.getHours() < 10 ? '0' + startDate.getHours() : startDate.getHours();
			var minute = startDate.getMinutes() < 10 ? '0' + startDate.getMinutes() : startDate.getMinutes();
			if(startDate.getTime() <= endDate.getTime()) {
				timeArr.push(hour + ":" + minute);
			} else {
				break;
			}
		}
		return timeArr;
	}
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
					orderWarp.init();
				} else {
					layer.msg(data.msg);
				}
			},
			error: function(data) {}
		});
	} else {

		openid = sessionStorage.getItem('openid');
		if(openid != null) {
			orderWarp.init();
		}

	}
});