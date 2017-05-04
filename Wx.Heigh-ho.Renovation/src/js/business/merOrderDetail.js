var BASEURL = 'http://www.heeyhome.com/lpcs/home/';
var OPENIDURL = BASEURL + 'index/index'; // openid
var openid = ''; //

/*定义一个类*/
var mOrderDetailWarp = {
	/* 全局变量 */
	ORDERINFOURL: BASEURL + 'order/orderinfo', // 订单详情
	SUREORDERURL: BASEURL + 'seller/order_confirm', // 商家确认接单
	DADATEMPORARYURL: BASEURL + 'Dada/dadaTemporary', // 商家发布配送
	merorderDetailId: sessionStorage.getItem('merorderDetailId'),
	/**
	 * 入口方法
	 */
	init: function() {
		// 页面初始化数据
		mOrderDetailWarp.initDataEvent();
		// 页面事件
		mOrderDetailWarp.initEvent();
	},
	/**
	 * 数据初始化
	 */
	initDataEvent: function() {
		var self = this;
		self.getOrderDetailData(); // 订单详情内容初始化
	},
	/**
	 * 所有事件的绑定根据功能模块统一写在同一个方法里，根据业务调用
	 */
	initEvent: function() {
		var self = this;
		// 点击送达时间
		$(document).on('touchstart', '.JorderCh', function() { // 确认接单或发布配送

			var mOrderid = $(this).attr('data-orderid');
			var mStep = $(this).attr('data-step');
			console.log(mOrderid)
			console.log(mStep)
			self.jieDanOrPeiSongEvent(mOrderid, mStep);

		})

	},
	/**
	 * 订单详情内容初始化
	 */
	getOrderDetailData: function() {
		var $shopcontent = $('.shop_content ul');
		$.ajax({
			url: mOrderDetailWarp.ORDERINFOURL,
			type: "GET",
			async: true,
			data: {
				order_id: mOrderDetailWarp.merorderDetailId
			},
			dataType: 'jsonp',
			success: function(data) {
				if(data.code == '000') {
					console.log(data.data);
					$.each(data.data.goods, function(i, v) {
						var shopStr = '<li>';
						shopStr += '<span class="v_name">' + v.goods_name + '</span>';
						shopStr += '<span class="v_num">x ' + v.goods_num + '</span>';
						shopStr += '<span class="v_price">￥' + v.discount_price + '</span>';
						shopStr += '</li>';
						$shopcontent.append(shopStr);
					});
					$('#order_num i').html(data.data.order_id); //订单号
					$('#psf i').html(data.data.distribution_cost); //配送费
					$('#total i').html(data.data.total_amount); //总价
					$('.address_name').html(data.data.name); //配送人姓名
					$('.address_tel').html('<a  href="tel:'+data.data.phone+'">'+data.data.phone +'</a>'); //配送人电话
					
					$('.address_room').html(data.data.address + data.data.room); //配送人地址
					$('.time_right span').html(data.data.appointment_time); //预约时间
					$('#order_time b').html(data.data.order_time); //下单时间
					if(data.data.remark) {
						$('#remark').html(data.data.remark); //备注
					} else {
						$('#remark').html('无'); //备注
					}
					$(".JorderCh").html(data.data.order_step_ch);
					$(".JorderCh").attr("data-orderid",data.data.order_id);
					$(".JorderCh").attr("data-step",data.data.order_step); // 订单状态
				} else {
					layer.msg(data.msg);
				}
			},
			error: function(data) {}
		});
	},
	/**
	 * 确认接单或发布配送
	 */
	jieDanOrPeiSongEvent:function(mOrderid, mStep){
		if(mStep == "1") {
			$.ajax({
				url: mOrderDetailWarp.SUREORDERURL,
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
		} else if(mStep == "2") {
			$.ajax({
				url: mOrderDetailWarp.DADATEMPORARYURL,
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
		}
	}
};

//入口方法调用 代码只能从这里执行
$(function() {
//mOrderDetailWarp.init();
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
					mOrderDetailWarp.init();
				} else {
					layer.msg(data.msg);
				}
			},
			error: function(data) {}
		});
	} else {

		openid = sessionStorage.getItem('openid');
		if(openid != null) {
			mOrderDetailWarp.init();
		}

	}
});