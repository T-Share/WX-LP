var BASEURL = 'http://www.heeyhome.com/lpcs/home/';
var OPENIDURL = BASEURL + 'index/index'; // openid
var ORDERSTEPURL = BASEURL + 'order/order_step'; // 判断是否支付成功
var openid = ''; //o-X7mw822W0t7e9u7gqwkrxsb3-I

/*定义一个类*/
var orderListWarp = {
	/* 全局变量 */
	ORDERLISTURL: BASEURL + 'order/orderlist', // 订单列表
	ORDERCANCELURL: BASEURL + 'order/ordercancel', // 取消订单
	ORDERPAYURL: BASEURL + 'order/order_continue', // 付款
	ORDERDELURL: BASEURL + 'order/order_del', // 删除订单
	AGAINORDERURL: BASEURL + 'order/orderagain', // 再来一单
	/**
	 * 入口方法
	 */
	init: function() {
		// 页面初始化数据
		orderListWarp.initDataEvent();
		// 页面事件
		orderListWarp.initEvent();

	},
	/**
	 * 数据初始化
	 */
	initDataEvent: function() {
		var self = this;
		self.getInitData(); // 订单列表内容初始化
		//			self.getOrderListInfoData(); // 订单列表内容初始化
		self.swiperDelEvent();
	},
	/**
	 * 所有事件的绑定根据功能模块统一写在同一个方法里，根据业务调用
	 */
	initEvent: function() {
		var self = this;
		// 点击送达时间
		$(document).on('click', '.suggestion', function() { // 意见反馈

			var orderid = $(this).parents('.orderList').attr('order_id');
			sessionStorage.setItem('orderid', orderid);
			window.location.href = 'suggestion.html';

		}).on('click', '.orderList_left', function() { // 点击订单列表跳详情页面

			var orderDetailId = $(this).parents('.orderList').attr('order_id');
			sessionStorage.setItem('orderDetailId', orderDetailId);
			window.location.href = 'orderDetail.html';

		}).on('click', '.again', function() { // 再来一单
			var againOrderid = $(this).parents('.orderList').attr('order_id');
			self.againOrderEvent(againOrderid);

		}).on('click', '.cancel_order', function() { // 取消订单按钮点击事件
			var cancelOrderid = $(this).parents('.orderList').attr('order_id');
			self.cancelOrderEvent(cancelOrderid);

		}).on('click', '.orderList_pay', function() { // 去付款
			var payOrderid = $(this).parents('.orderList').attr('order_id');
			self.gotoPayEvent(payOrderid);

		}).on('click', '.del_btn', function() { // 删除订单
			var orderid = $(this).parent().attr('order_id');
			self.delOrderEvent(orderid);
		})

	},
	getInitData: function() {
		var self = this;
		$.ajax({
			url: orderListWarp.ORDERLISTURL,
			type: "GET",
			async: true,
			data: {
				openid: openid
			},
			dataType: 'jsonp',
			success: function(data) {
				if(data.code == "000") {
					self.getOrderListInfoData();
				} else {
					$('.orderList_wrap').html("<div style='padding-top: 20rem;text-align: center;font-size: 1.5rem;'>当前您还没有订单</div>");
				}
			},
		});
	},
	/**
	 * 订单列表内容初始化
	 */
	getOrderListInfoData: function() {
		var self = this;
		var $content = $('.orderList_wrap');
		var index;
		var counter = 0;
		// 每页展示4个
		var num = 8;
		var pageStart = 0,
			pageEnd = 0;
		$('#order_container').dropload({
			scrollArea: window,
			loadDownFn: function(me) {
				$.ajax({
					url: orderListWarp.ORDERLISTURL,
					type: "GET",
					async: true,
					data: {
						openid: openid
					},
					dataType: 'jsonp',
					beforeSend: function() { // 向服务器发送请求前执行一些动作
						if(counter == 0) {
							index = layer.load(0, { shade: false });
						}

					},
					success: function(data) {
						console.log(data)

						var stitching = '';
						counter++;
						pageEnd = num * counter;
						pageStart = pageEnd - num;
						console.log(pageEnd)
						console.log(pageStart)
						for(var i = pageStart; i < pageEnd; i++) {
							stitching += '<div order_id="' + data.data[i].order_id + '" class="orderList">';
							stitching += '<div class="orderListWrap">';
							stitching += '<div class="orderList_left" style="cursor: pointer">';
							stitching += '<h5><span class="name">' + data.data[i].name + '&nbsp;&nbsp;</span><span class="phone">' + data.data[i].phone + '</span></h5>';
							stitching += '<p>下单时间：<span>' + data.data[i].order_time + '</span></p>';
							stitching += '<p>购买数量：<span>' + data.data[i].goods_num + '</span></p>';
							stitching += '<p>消费金额：<span>' + data.data[i].total_amount + '</span></p>';
							stitching += '</div>';
							stitching += '<div class="orderList_right">';
							stitching += '<p>' + data.data[i].order_step_ch + '</p>';
							if(data.data[i].order_step == '0') { //待支付
								stitching += '<span>剩余<i></i></span>';
								stitching += '<a class="order_right cancel_order" href="javascript:;">取消订单</a>';
								stitching += '<a class="order orderList_pay" href="javascript:;">去付款</a>';
								self.countdownEvent(data.data[i].order_time, data.data[i].order_id);
							} else if(data.data[i].order_step == '1') { //待接单
								stitching += '<a class="order_right" href="javascript:;">联系商家</a>';
								stitching += '<a class="order again" href="javascript:;">再来一单</a>';
							} else if(data.data[i].order_step == '2') { //待配送
								stitching += '<a class="order again" href="javascript:;">再来一单</a>';
							} else if(data.data[i].order_step == '3') { //已完成
								if(data.data[i].is_suggest == '0') { //没有反馈过
									stitching += '<a class="order_right suggestion" href="javascript:;">意见反馈</a>';
									stitching += '<a class="order again" href="javascript:;">再来一单</a>';
								} else { //有反馈过
									stitching += '<a class="order again" href="javascript:;">再来一单</a>';
								}
							} else if(data.data[i].order_step == '4') { //已取消
								if(data.data[i].is_suggest == '0') {
									stitching += '<a class="order_right suggestion" href="javascript:;">意见反馈</a>';
									stitching += '<a class="order again" href="javascript:;">再来一单</a>';
								} else {
									stitching += '<a class="order again" href="javascript:;">再来一单</a>';
								}
							} else if(data.data[i].order_step == '5') { //配送中
								stitching += '<a class="order again" href="javascript:;">再来一单</a>';
							}
							stitching += '</div>';
							stitching += '</div>';
							stitching += '<div class="del_btn">删除</div>';
							stitching += '</div>';
							if((i + 1) >= data.data.length) {
								// 锁定
								me.lock();
								// 无数据
								me.noData();
								break;
							}
						}

						// 为了测试，延迟1秒加载
						setTimeout(function() {
							$content.append(stitching);
							var block_height = parseInt($('.orderList').outerHeight());
							var $delBtn = $('.del_btn');
							$delBtn.css('line-height', block_height + 'px');
							// 每次数据加载完，必须重置
							me.resetload();
						}, 1000);

					},
					complete: function() { // 向服务器发送请求成功后执行一些动作
						setTimeout(function() {
							layer.close(index);
						}, 1000);

					},
					error: function(xhr, type) {
						alert('Ajax error!');
						// 即使加载出错，也得重置
						me.resetload();
					}
				});
			},
			threshold: 50
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
					self.cancelOrderEvent(cancelOrderid);
				}
				if(minute <= 9) minute = '0' + minute;
				if(second <= 9) second = '0' + second;
				$('.orderList[order_id=' + cancelOrderid + '] .orderList_right span i').html(minute + ':' + second);
				intDiff--;
			}, 1000);
		}

		$(function() {
			timer(intDiff);
		});
	},
	/**
	 * 取消订单接口
	 */
	cancelOrderEvent: function(orderid) {
		$.ajax({
			url: orderListWarp.ORDERCANCELURL,
			type: "GET",
			async: true,
			data: {
				order_id: orderid
			},
			dataType: 'jsonp',
			success: function(data) {
				if(data.code == '000') {
					location.reload();
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
	/**
	 * 删除订单
	 */
	delOrderEvent: function(orderid) {
		console.log(orderid)
		$.ajax({
			url: orderListWarp.ORDERDELURL,
			type: "GET",
			async: true,
			data: {
				order_id: orderid
			},
			dataType: 'jsonp',
			success: function(data) {
				if(data.code == '000') {
					location.reload();
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
	againOrderEvent: function(againOrderid) {
		$.ajax({
			url: orderListWarp.AGAINORDERURL,
			type: "GET",
			async: true,
			data: {
				order_id: againOrderid
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
	 * 左滑出现删除按钮
	 */
	swiperDelEvent: function() {
		function ad(target) {
			var obj = target && target.parentNode;
			return obj && (obj.className == 'orderList' ? obj : ad(obj));
		}

		var initX; //触摸位置X
		var initY; //触摸位置Y
		var moveX; //滑动时的位置X
		var moveY; //滑动时的位置Y
		var X = 0; //移动距离X
		var Y = 0; //移动距离Y
		var flagX = 0; //是否是左右滑动 0为初始，1为左右，2为上下，在move中设置，在end中归零
		var objX = 0; //目标对象位置

		window.addEventListener('touchstart', function(event) {
			// event.preventDefault();
			// var obj = event.target.parentNode;
			var obj = ad(event.target);
			if(obj) {
				// $('.orderList').css('WebkitTransform', 'translateX(0px)');
				// .style.WebkitTransform = "translateX(" + 0 + "px)";
				initX = event.targetTouches[0].pageX;
				initY = event.targetTouches[0].pageY;
				objX = (obj.style.WebkitTransform.replace(/translateX\(/g, "").replace(/px\)/g, "")) * 1;
			}
			if(objX == 0) {
				window.addEventListener('touchmove', function(event) {
					// 判断滑动方向，X轴阻止默认事件，Y轴跳出使用浏览器默认
					if(flagX == 0) {
						setScrollX(event);
						return;
					} else if(flagX == 1) {
						event.preventDefault();
					} else {
						return;
					}
					var obj = ad(event.target);
					if(obj) {
						moveX = event.targetTouches[0].pageX;
						X = moveX - initX;
						if(X > 0) {
							obj.style.WebkitTransform = "translateX(" + 0 + "px)";
						} else if(X < 0) {
							var l = Math.abs(X);
							obj.style.WebkitTransform = "translateX(" + -l + "px)";
							if(l > 60) {
								l = 60;
								obj.style.WebkitTransform = "translateX(" + -l + "px)";
							}
						}
					}
				});
			} else if(objX < 0) {
				window.addEventListener('touchmove', function(event) {
					// 判断滑动方向，X轴阻止默认事件，Y轴跳出使用浏览器默认
					if(flagX == 0) {
						setScrollX(event);
						return;
					} else if(flagX == 1) {
						event.preventDefault();
					} else {
						return;
					}
					// var obj = event.target.parentNode;
					var obj = ad(event.target);
					if(obj) {
						moveX = event.targetTouches[0].pageX;
						X = moveX - initX;
						if(X > 0) {
							var r = -60 + Math.abs(X);
							obj.style.WebkitTransform = "translateX(" + r + "px)";
							if(r > 0) {
								r = 0;
								obj.style.WebkitTransform = "translateX(" + r + "px)";
							}
						} else { //向左滑动
							obj.style.WebkitTransform = "translateX(" + -60 + "px)";
						}
					}
				});
			}
		});
		window.addEventListener('touchend', function(event) {
			var obj = ad(event.target);
			if(obj) {
				objX = (obj.style.WebkitTransform.replace(/translateX\(/g, "").replace(/px\)/g, "")) * 1;
				if(objX > -30) {
					obj.style.WebkitTransform = "translateX(" + 0 + "px)";
				} else {
					obj.style.WebkitTransform = "translateX(" + -60 + "px)";
				}
			}
			flagX = 0;
		});
		//设置滑动方向
		function setScrollX(event) {
			moveX = event.targetTouches[0].pageX;
			moveY = event.targetTouches[0].pageY;
			X = moveX - initX;
			Y = moveY - initY;

			if(Math.abs(X) > Math.abs(Y)) {
				flagX = 1;
			} else {
				flagX = 2;
			}
			return flagX;
		}
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
					orderListWarp.init();
				} else {
					layer.msg(data.msg);
				}
			},
			error: function(data) {}
		});
	} else {

		openid = sessionStorage.getItem('openid');
		if(openid != null) {
			orderListWarp.init();
		}

	}
});