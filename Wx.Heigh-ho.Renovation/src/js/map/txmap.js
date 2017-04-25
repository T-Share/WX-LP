var MERCHANT_ADDRESS_OBJ = { lng: 120.749575, lat: 31.298587 }; // 商家地址经度，纬度(斜塘农贸市场)
var MAX_DISTANCE = 5000; // 单位米
var txmapEvent = {

	init: function() {
		var self = this;
		self.getPositionEvent(); //得到位置
	},
	getPositionEvent: function() {
		var self = this;
		var differNum = 0;
		window.addEventListener('message', function(event) {
			// 接收位置信息，用户选择确认位置点后选点组件会触发该事件，回传用户的位置信息
			var loc = event.data;
			if(loc && loc.module == 'locationPicker') { //防止其他应用也会向该页面post信息，需判断module是否为'locationPicker'
				var userAddressObj = { // 用户地址经度，纬度
					lng: loc.latlng.lng, //纬度
					lat: loc.latlng.lat //经度
				};
				differNum = self.getDistance(userAddressObj, MERCHANT_ADDRESS_OBJ);
				//				alert(differNum);
				if(differNum > MAX_DISTANCE) { // 超出配送范围
					$("#ReminderBox").removeClass("display");
					document.getElementById('ReminderBox').addEventListener('touchmove', function(e) {
						e.preventDefault();
					}, false);
					self.clickCancelEvent(loc);
				}else {
					sessionStorage.addressInfoObj=JSON.stringify(loc); 
					window.location.href = "add_address.html";
				}
			}
		}, false);

	},
	clickCancelEvent: function(obj) {
		$(document).on("click", ".Jcancel", function() {
			$("#ReminderBox").addClass("display");
		});
		
		$(document).on("click", ".Jsave", function() {
			$("#ReminderBox").addClass("display");
			sessionStorage.addressInfoObj=JSON.stringify(obj); 
			window.location.href = "add_address.html";
		});

	},
	sessionValue:function(){
		
	},
	//计算地图坐标距离
	fD: function(a, b, c) {
		var self = this;
		for(; a > c;)
			a -= c - b;
		for(; a < b;)
			a += c - b;
		return a;
	},
	jD: function(a, b, c) {
		var self = this;
		b != null && (a = Math.max(a, b));
		c != null && (a = Math.min(a, c));
		return a;
	},
	yk: function(a) {
		var self = this;
		return Math.PI * a / 180
	},
	Ce: function(a, b, c, d) {
		var self = this;
		var dO = 6370996.81;
		return dO * Math.acos(Math.sin(c) * Math.sin(d) + Math.cos(c) * Math.cos(d) * Math.cos(b - a));
	},
	getDistance: function(a, b) {
		var self = this;
		if(!a || !b)
			return 0;
		a.lng = self.fD(a.lng, -180, 180);
		a.lat = self.jD(a.lat, -74, 74);
		b.lng = self.fD(b.lng, -180, 180);
		b.lat = self.jD(b.lat, -74, 74);
		return self.Ce(self.yk(a.lng), self.yk(b.lng), self.yk(a.lat), self.yk(b.lat));
	}
};

$(function() {
	txmapEvent.init();
});