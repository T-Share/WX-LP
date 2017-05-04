var BASEURL = 'http://www.heeyhome.com/lpcs/home/';
var OPENIDURL = BASEURL + 'index/index'; // openid
var openid = ''; //o-X7mw822W0t7e9u7gqwkrxsb3-I

/*定义一个类*/
var editAddressWarp = {
	/* 全局变量 */
	ADDRESSINFOURL: BASEURL + 'address/addressinfo', // 获取编辑地址信息
	ADDADDRESSURL: BASEURL + 'address/add', // 新增地址
	EDITADDRESSURL: BASEURL + 'address/edit', // 编辑地址
	DELETEADDRESSURL: BASEURL + 'address/del', // 删除地址
	PHONEREG: /^(((13[0-9]{1})|(14[0-9]{1})|(17[0]{1})|(15[0-3]{1})|(15[5-9]{1})|(18[0-9]{1}))+\d{8})$/, // 验证手机号正则表达式
	TYPE: sessionStorage.getItem('type'),
	ADDRESSID: sessionStorage.getItem('editAddressId'),
	/**
	 * 入口方法
	 */
	init: function() {
		// 页面初始化数据
		editAddressWarp.initDataEvent();
		// 页面事件
		editAddressWarp.initEvent();

	},
	/**
	 * 数据初始化
	 */
	initDataEvent: function() {
		var self = this;
		self.getAddressConData(); // 地址信息初始化
	},
	/**
	 * 所有事件的绑定根据功能模块统一写在同一个方法里，根据业务调用
	 */
	initEvent: function() {
		var self = this;

		$(document).on('click', '.sex', function() { // 获取性别，性别切换
			var $sex = $('.sex'),
				$this = $(this);
			$sex.prop('checked', false);
			$this.prop('checked', true);
			$sex.prev().removeClass('em_choose');
			$this.prev().addClass('em_choose');
		}).on('touchstart', '.area', function() { // 跳转到地图页面，跳转的同时保存当前页面其他信息到session dataInfo
			var obj = {};
			obj.name = $('.enter_name').val();
			obj.phone = $('.contact_tel').val();
			obj.room = $('.room_input').val();
			obj.sex = $("input[name='sex']:checked").val();
			sessionStorage.setItem('dataInfo', JSON.stringify(obj));
			console.log(obj);
			window.location.href = 'txmap.html';
		}).on('click', '.add_button', function() { // 添加地址或编辑地址点击事件
			self.addressBtnEvent();
		}).on('click', '.delete', function() { // 删除地址点击事件
			self.deleteAddressEvent();
		})
	},
	/**
	 * 地址信息初始化
	 */
	getAddressConData: function() {
		// 根据TYPE值的不同来判断是编辑地址还是添加地址
		var self = this,
			$orderTitle = $('.order_span'),
			$deleteIcon = $('.right_i');
		if(editAddressWarp.TYPE == 'add') {
			$orderTitle.html('添加收货地址');
			$deleteIcon.removeClass('delete');
			self.getAddAddressInfoData(); // 获取添加地址信息

		} else if(editAddressWarp.TYPE == 'edit') {
			$orderTitle.html('编辑收货地址');
			$deleteIcon.addClass('delete');
			self.getEditAddressInfoData(); // 获取编辑地址信息
			//				addressEv.editAddress();
			//				addressEv.deleteAddress();
		}
	},
	/**
	 * 获取添加地址信息
	 */
	getAddAddressInfoData: function() {
		var self = this;
		var $label = $('.contact_name label');
		var dataInfo = sessionStorage.getItem('dataInfo');
		sessionStorage.removeItem('dataInfo'); // 页面刷新或者得到session数据立马删除
		if(dataInfo != '' && dataInfo != null && dataInfo != undefined) { // 如果是从地图页面返回到当前地址详情页 ，那么直接从session中获取保存的地址信息
			var addressInfoNew = JSON.parse(dataInfo);
			var obj = sessionStorage.addressInfoObj;
			sessionStorage.removeItem('addressInfoObj'); // 页面刷新或者得到session数据立马删除
			self.initAddressDataStrEvent(addressInfoNew, $label, obj);

		}
	},
	/**
	 * 获取编辑地址信息
	 */
	getEditAddressInfoData: function() {
		var self = this;
		var $label = $('.contact_name label');

		var dataInfo = sessionStorage.getItem('dataInfo');
		sessionStorage.removeItem('dataInfo'); // 页面刷新或者得到session数据立马删除
		if(dataInfo != '' && dataInfo != null && dataInfo != undefined) { // 如果是从地图页面返回到当前地址详情页 ，那么直接从session中获取保存的地址信息
			var addressInfoNew = JSON.parse(dataInfo);
			var obj = sessionStorage.addressInfoObj;
			sessionStorage.removeItem('addressInfoObj'); // 页面刷新或者得到session数据立马删除
			self.initAddressDataStrEvent(addressInfoNew, $label, obj);

		} else { // 从地址列表页面点击编辑进来
			//				var addressId = sessionStorage.getItem('editAddressId');
			$.ajax({
				url: editAddressWarp.ADDRESSINFOURL,
				type: "GET",
				async: true,
				data: {
					address_id: editAddressWarp.ADDRESSID
				},
				dataType: 'jsonp',
				success: function(data) {
					console.log(data)
					if(data.code == '000') {
						console.log(data.data);
						self.initAddressDataStrEvent(data.data, $label, null);
					} else {
						layer.msg(data.msg);
					}
				},
				error: function(data) {}
			});
		}

	},
	/**
	 * 地址信息数据拼接
	 * @param obj 用户信息对象
	 * @param labelEm 元素
	 * @param addObj 地址信息对象
	 */
	initAddressDataStrEvent: function(Obj, labelEm, addObj) {
		$('.enter_name').val(Obj.name);
		$('.contact_tel').val(Obj.phone);
		$('.room_input').val(Obj.room);
		labelEm.find('em').removeClass('em_choose');
		labelEm.find('input').removeAttr('checked');
		if(Obj.sex == '2') {
			$('#women').prop('checked', 'checked');
			$('#women').prev().addClass('em_choose');
		} else {
			$('#man').prop('checked', 'checked');
			$('#man').prev().addClass('em_choose');
		}

		if(addObj != null && addObj != undefined && addObj != "") {
			var valObj = JSON.parse(addObj);
			if(valObj.poiname != null && valObj.poiname != "") {
				if(valObj.poiname == '我的位置') {
					$('.Jtxmap').html(valObj.poiaddress);
					$('.Jtxmap').attr('lat', valObj.latlng.lat); //维度
					$('.Jtxmap').attr('lng', valObj.latlng.lng); //经度
					$('.Jaddress').val(valObj.cityname + valObj.poiaddress);
				} else {
					$('.Jtxmap').html(valObj.poiname);
					$('.Jtxmap').attr('lat', valObj.latlng.lat); //维度
					$('.Jtxmap').attr('lng', valObj.latlng.lng); //经度
					$('.Jaddress').val(valObj.poiaddress);
				}
			}
		} else {
			$('.area').html(Obj.area);
			$('.area').attr('lat', Obj.receiver_lat); //维度
			$('.area').attr('lng', Obj.receiver_lng); //经度
			$('.address_input').val(Obj.address);
		}

	},
	/**
	 * 保存点击事件
	 */
	addressBtnEvent: function() {
		var $name = $('.enter_name').val(); //姓名
		var $tel = $('.contact_tel').val(); //电话
		var $area = $('.area').html(); //小区/大厦/学校
		var $lat = $('.area').attr('lat'); //小区/大厦/学校纬度
		var $lng = $('.area').attr('lng'); //小区/大厦/学校经度
		var $address_input = $('.address_input').val(); //详细地址
		var $room_input = $('.room_input').val(); //门牌号
		if($name == '' || $name == null) {
			layer.msg('请输入姓名');
			return false;
		} else if($tel == '' || $tel == null) {
			layer.msg('请输入手机号');
			return false;
		} else if(!editAddressWarp.PHONEREG.test($tel)) {
			layer.msg('手机号码格式不正确');
			return false;
		} else if($area == '' || $area == null) {
			layer.msg('请输入小区');
			return false;
		} else if($address_input == '' || $address_input == null) {
			layer.msg('请输入详细地址');
			return false;
		} else if($room_input == '' || $room_input == null) {
			layer.msg('请输入门牌号');
			return false;
		} else {
			if(editAddressWarp.TYPE == 'add') {
				$.ajax({
					url: editAddressWarp.ADDADDRESSURL,
					type: "GET",
					async: true,
					data: {
						openid: openid,
						name: $name,
						sex: $("input[name='sex']:checked").val(),
						phone: $tel,
						area: $area,
						address: $address_input,
						room: $room_input,
						receiver_lat: $lat,
						receiver_lng: $lng
					},
					dataType: 'jsonp',
					success: function(data) {
						if(data.code == '000') {
							window.location.href = 'address.html';
						} else {
							layer.msg(data.msg);
						}
					},
					error: function(data) {}
				});
			} else if(editAddressWarp.TYPE == 'edit') {
				$.ajax({
					url: editAddressWarp.EDITADDRESSURL,
					type: "GET",
					async: true,
					data: {
						address_id: editAddressWarp.ADDRESSID,
						name: $name,
						sex: $("input[name='sex']:checked").val(),
						phone: $tel,
						area: $area,
						address: $address_input,
						room: $room_input,
						receiver_lat: $lat,
						receiver_lng: $lng
					},
					dataType: 'jsonp',
					success: function(data) {
						if(data.code == '000') {
							window.location.href = 'address.html';
						} else {
							layer.msg(data.msg);
						}
					},
					error: function(data) {}
				});
			}
		}
	},
	/**
	 * 删除地址
	 */
	deleteAddressEvent: function() {
		$.ajax({
			url: editAddressWarp.DELETEADDRESSURL,
			type: "GET",
			async: true,
			data: {
				address_id: editAddressWarp.ADDRESSID
			},
			dataType: 'jsonp',
			success: function(data) {
				if(data.code == '000') {
					window.location.href = 'address.html';
				} else {
					layer.msg(data.msg);
				}
			},
			error: function(data, a, b) {}
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
					editAddressWarp.init();
				} else {
					layer.msg(data.msg);
				}
			},
			error: function(data) {}
		});
	} else {

		openid = sessionStorage.getItem('openid');
		if(openid != null) {
			editAddressWarp.init();
		}

	}
});