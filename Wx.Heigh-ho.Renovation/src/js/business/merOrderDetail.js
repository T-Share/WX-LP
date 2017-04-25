var BASEURL = 'http://www.heeyhome.com/lpcs/home/';
var OPENIDURL = BASEURL + 'index/index'; // openid
var openid = ''; //o-X7mw822W0t7e9u7gqwkrxsb3-I

/*定义一个类*/
var mOrderDetailWarp = {
	/* 全局变量 */
	ORDERINFOURL: BASEURL + 'order/orderinfo', // 订单详情
	merorderDetailId: sessionStorage.getItem('merorderDetailId'),
	/**
	 * 入口方法
	 */
	init: function() {
		// 页面初始化数据
		mOrderDetailWarp.initDataEvent();
	},
	/**
	 * 数据初始化
	 */
	initDataEvent: function() {
		var self = this;
		self.getOrderDetailData(); // 订单详情内容初始化
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
					$('.address_tel').html(data.data.phone); //配送人电话
					$('.address_room').html(data.data.address + data.data.room); //配送人地址
					$('.time_right span').html(data.data.appointment_time); //预约时间
					$('#order_time b').html(data.data.order_time); //下单时间
					if(data.data.remark) {
						$('#remark').html(data.data.remark); //备注
					} else {
						$('#remark').html('无'); //备注
					}
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