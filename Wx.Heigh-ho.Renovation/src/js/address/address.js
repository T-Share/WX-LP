var BASEURL = 'http://www.heeyhome.com/lpcs/home/';
var OPENIDURL = BASEURL + 'index/index'; // openid
var openid = ''; //o-X7mw822W0t7e9u7gqwkrxsb3-I

/*定义一个类*/
var addressWarp = {
	/* 全局变量 */
	ADDRESSLISTURL: BASEURL + 'address/index', // 地址列表
	/**
	 * 入口方法
	 */
	init: function() {
		// 页面初始化数据
		addressWarp.initDataEvent();
		// 页面事件
		addressWarp.initEvent();

	},
	/**
	 * 数据初始化
	 */
	initDataEvent: function() {
		var self = this;
		self.getAddressListData(); // 用户地址列表数据初始化
		self.initSessionData(); // 初始化session里面的数据
	},
	/**
	 * 所有事件的绑定根据功能模块统一写在同一个方法里，根据业务调用
	 */
	initEvent: function() {
		var self = this;
		// 点击送达时间
		$(document).on('click', '.address_detail input', function() {
				self.switchAddressManageEvent($(this)); // 地址点击切换
			})
			.on('click', '.manage_address', function() {
				self.editAddressEvent($(this)); // 编辑地址
			})
			.on('click', '#add_address', function() {
				self.addAddressEvent($(this)); // 新增地址
			});
	},
	/**
	 * 用户地址列表数据初始化
	 */
	getAddressListData: function() {
		$.ajax({
			url: addressWarp.ADDRESSLISTURL,
			type: "GET",
			async: true,
			data: {
				openid: openid
			},
			dataType: 'jsonp',
			success: function(data) {
				console.log(data);
				if(data.code == '000') {
					var $content = $('.rangeAddress'),
						$content1 = $('.overAddress'),
						stitching = '';
					$.each(data.data, function(i, v) {
						stitching = '<div class="address_wrap"><div id="address_top">';
						stitching += '<div class="' + (v.over == '0' ? 'address_detail' : 'address_detailOver') + ' clearfix">';
						stitching += '<label data-id="' + v.address_id + '"><em class="fl"></em>';
						stitching += '<input class="fl" title="" type="radio" name="address">';
						stitching += '<div class="address fl"><p>';
						stitching += '<span class="address_name">' + v.name + '</span> ';
						stitching += '<span class="address_tel">' + v.phone + '</span></p>';
						stitching += '<p class="address_room">' + v.address + '' + v.room + '</p></div></label></div>';
						stitching += '<div data-type="edit" class="manage_address">';
						stitching += '<em></em></div></div></div>';

						if(v.over == '0') { // 判断是否超出配送范围 1：超出配送范围 0：未超出 
							$content.append(stitching);
						} else {
							$content1.append(stitching);
						}
					});
					/* 默认高亮 */
					var addressId = sessionStorage.getItem('addressId');
					var $label = $('.address_detail label');
					for(var i = 0; i < $label.length; i++) {
						if(addressId == $label.eq(i).attr('data-id')) {
							$label.eq(i).find('em').addClass('choose');
							$label.eq(i).find('input').attr('checked', 'checked');
						}
					}
					//						addressEv.editAddressEvent();
				} else {
					var $addressWrap = $('.addressWrap');
					$addressWrap.html('没有收货地址<br/>点击下方按钮新增');
					$addressWrap.addClass('no_address');
				}
			},
			error: function(data) {}
		});
	},
	/**
	 * 地址点击切换
	 */
	switchAddressManageEvent: function(_this) {
		var addressObj = {};
		addressObj.name = _this.parent().find('.address_name').html();
		addressObj.tel = _this.parent().find('.address_tel').html();
		addressObj.room = _this.parent().find('.address_room').html();
		addressObj.id = _this.parent().attr('data-id');
		sessionStorage.setItem('addressObj', JSON.stringify(addressObj)); //把选中的地址存到session里
		window.location.href = 'order.html';
	},
	/**
	 * 编辑地址
	 */
	editAddressEvent: function(_this) {
		sessionStorage.setItem('type', _this.attr('data-type'));
		sessionStorage.setItem('editAddressId', _this.prev().find('label').attr('data-id'));
		window.location.href = 'add_address.html';
	},
	/**
	 * 新增地址
	 */
	addAddressEvent: function(_this) {
		sessionStorage.setItem('type', _this.attr('data-type'));
		window.location.href = 'add_address.html';
	},
	/**
	 * 初始化session数据
	 */
	initSessionData: function() {
		sessionStorage.removeItem("dataInfo"); // 删除保存在session中的信息
		sessionStorage.removeItem("addressInfoObj"); // 删除保存在session中的信息
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
					addressWarp.init();
				} else {
					layer.msg(data.msg);
				}
			},
			error: function(data) {}
		});
	} else {

		openid = sessionStorage.getItem('openid');
		if(openid != null) {
			addressWarp.init();
		}

	}
});