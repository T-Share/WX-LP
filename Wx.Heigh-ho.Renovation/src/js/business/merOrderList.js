var BASEURL = 'http://www.heeyhome.com/lpcs/home/';
var OPENIDURL = BASEURL + 'index/index'; // openid
var openid = ''; //o-X7mw822W0t7e9u7gqwkrxsb3-I

/*定义一个类*/
var mOrderListWarp = {
	/* 全局变量 */
	ORDERLISTURL: BASEURL + 'seller/orderlist', // 商家订单列表
	SUREORDERURL: BASEURL + 'seller/order_confirm', // 商家确认接单
	/**
	 * 入口方法
	 */
	init: function() {
		// 页面初始化数据
		mOrderListWarp.initDataEvent();
		// 页面事件
		mOrderListWarp.initEvent();

	},
	/**
	 * 数据初始化
	 */
	initDataEvent: function() {
		var self = this;
		self.getInitData(); // 订单列表内容初始化
	},
	/**
	 * 所有事件的绑定根据功能模块统一写在同一个方法里，根据业务调用
	 */
	initEvent: function() {
		var self = this;
		// 点击送达时间
		$(document).on('touchstart', '.order', function() { // 确认下单

			var mOrderid = $(this).closest(".orderList").attr('order_id');
			self.sureOrderEvent(mOrderid, $(this));

		}).on('click', '.orderList_left', function() { // 点击订单列表跳详情页面

			var merorderDetailId = $(this).parents('.orderList').attr('order_id');
			sessionStorage.setItem('merorderDetailId', merorderDetailId);
			window.location.href = 'merOrderDetail.html';
		})

	},
	getInitData: function() {
		var self = this;
		$.ajax({
			url: mOrderListWarp.ORDERLISTURL,
			type: "GET",
			async: true,
			dataType: 'jsonp',
			success: function(data) {
				console.log(data)
				if(data.code == "000") {
					self.getMOrderListInfoData();
				} else {
					$('.orderList_wrap').html("<div style='padding-top: 20rem;text-align: center;font-size: 1.5rem;'>当前还没有用户下单</div>");
				}
			}
		});
	},
	/**
	 * 订单列表内容初始化
	 */
	getMOrderListInfoData: function() {
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
					url: mOrderListWarp.ORDERLISTURL,
					type: "GET",
					async: true,
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
							if(data.data[i].order_step == '1') { //待接单
								stitching += '<a class="order" data-orderStep = "1" href="javascript:;">确认接单</a>';
							} else if(data.data[i].order_step == '2') { //待配送
								stitching += '<a class="order" data-orderStep = "2" href="javascript:;">发布配送</a>';
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
	 * 确认下单
	 */
	sureOrderEvent: function(mOrderid, _this) {
		if(_this.data('orderstep') == "1") {
			$.ajax({
				url: mOrderListWarp.SUREORDERURL,
				type: "GET",
				async: true,
				data: {
					order_id: mOrderid
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
		} else if(_this.data('orderstep') == "2") {
			console.log("请等到商家配送")
		}

	},
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
					mOrderListWarp.init();
				} else {
					layer.msg(data.msg);
				}
			},
			error: function(data) {}
		});
	} else {

		openid = sessionStorage.getItem('openid');
		if(openid != null) {
			mOrderListWarp.init();
		}

	}
});