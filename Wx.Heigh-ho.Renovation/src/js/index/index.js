var BASEURL = 'http://www.heeyhome.com/lpcs/home/';
var OPENIDURL = BASEURL + 'index/index'; // openid
//var openid = 'o-X7mw822W0t7e9u7gqwkrxsb3-I'; //o-X7mw822W0t7e9u7gqwkrxsb3-I
var openid = '';
/*定义一个类*/
var indexWarp = {
	/* 全局变量 */
	CATELISTURL: BASEURL + 'category/catelist', // 头部商品分类列表
	TODAYREURL: BASEURL + 'goodslist/todayrecommend', // 今日推荐列表
	GOODLISTURL: BASEURL + 'goodslist/goodslist', // 商品列表
	GWCINFOURL: BASEURL + 'cart/index', // 获取默认购物车内容
	ADDCARTURL: BASEURL + 'cart/add', // 加入购物车
	DELCARTURL: BASEURL + 'cart/del', // 删除购物车
	EMPTYCARTURL: BASEURL + 'cart/emptycart', // 清空购物车
	/**
	 * 入口方法
	 */
	init: function() {
		// 页面初始化数据
		indexWarp.initDataEvent();
		// 页面事件
		indexWarp.initEvent();
		// 动态获取宽高度
		indexWarp.bgHeightEvent();
	},
	/**
	 * 数据初始化
	 */
	initDataEvent: function() {
		var self = this;
		self.getCatelistData(); // 商品分类数据初始化
		self.getTodayRecommendData(); // 今日推荐列表数据初始化
		self.getGwcData();
		self.initSessionData(); // 初始化session里面的数据
	},
	/**
	 * 所有事件的绑定根据功能模块统一写在同一个方法里，根据业务调用
	 */
	initEvent: function() {
		var self = this;
		$(document).on('click', '.other_cate', function() {
				var cate_id = $(this).attr('cate_id');
				$(this).addClass("swiper_active").siblings().removeClass("swiper_active");
				self.getGoodsListEvent(cate_id);
			})
			.on('click', '.left_slide li', function(e) {
				self.initFloorNavEvent(e, $(this));
			})
			.on('click', '#today_recommend', function(e) {
				var divTop = $('.content_li').eq(0).offset().top
				$(this).addClass("swiper_active").siblings().removeClass("swiper_active");
				$("html,body").stop().animate({
					scrollTop: divTop
				}, 10);
				self.getTodayRecommendData(); //点击今日推荐
			})
			.on('touchmove', '.detail_wrap', function(e) {
				self.getContentChange();
			})
			.on('touchstart', '.gwc', function(e) {
				var $li = $('.gwcDetail_content li');
				if($li.length != '0') {
					console.log(1)
					if($('#gec_detail').is(':hidden')) {
						$('#gec_detail').show();
						$('#wrap').removeClass('display');
						$('.right_content').css('position', 'fixed');
					} else {
						$('#gec_detail').hide();
						$('#wrap').addClass('display');
						$('.right_content').css('position', 'inherit');
					}
				}
			})
			.on('click', '.plus', function(e) {
				self.addCartEvent($(this)); // 加入购物车
			})
			.on('click', '.reduce', function(e) {
				self.delCartEvent($(this)); // 删除购物车
			})
			.on('touchstart', '.top_right', function(e) {
				self.emptyCartEvent(); // 清空购物车
			})
			.on('touchstart', '#wrap', function(e) {
				$('#gec_detail').hide();
				$('#wrap').addClass('display');
				$('.right_content').css('position', 'inherit');
			})
			.on('click', '.gwc_submit .active_a', function(e) {
				self.goToPayEvent();
			});
	},
	/**
	 * 动态获取宽高度
	 */
	bgHeightEvent: function() {
		var block_height = parseInt($('.title').height()),
			block_width = parseInt($('.left_img img').width());
		$('.title').css('line-height', block_height + 'px');
		$('.left_img').css('height', block_width + 'px');
	},
	/**
	 * 头部商品分类数据初始化
	 */
	getCatelistData: function() {
		$.ajax({
			url: indexWarp.CATELISTURL,
			type: "GET",
			async: true,
			dataType: 'jsonp',
			success: function(data) {
				console.log(data.data);
				var $swiper = $(' .swiper-wrapper'),
					cateConStr = '';
				$.each(data.data, function(i, v) {
					cateConStr += '<div class="swiper-slide other_cate" cate_id="' + v.cate_id + '">' + v.cate_name + '</div>';
				});
				$swiper.append(cateConStr);
				titleScrollHendler.titleScroll('swiper-container', 'swiper-slide', 'swiper_active');
			}
		});
	},
	/**
	 * 今日推荐列表数据初始化
	 */
	getTodayRecommendData: function() {
		$.ajax({
			url: indexWarp.TODAYREURL,
			type: "GET",
			async: true,
			data: {
				openid: openid
			},
			dataType: 'jsonp',
			success: function(data) {
				console.log(data.data);
				$('.detail_describe').text('今日推荐（' + data.data.length + '）')
				var $leftSlide = $('.left_slide ul'),
					$detailWrap = $('#detail_wrap'),
					todayConStr = '';
				$leftSlide.html('<li class="active"><a href="javascript:;" tab="999" >今日推荐</a></li>');
				todayConStr = '<div class=" content_li" id="999" ><ul >';
				$.each(data.data, function(i, v) {
					todayConStr += '<li data-id="' + v.goods_id + '">';
					todayConStr += '<div class="left_img">';
					todayConStr += '<img src="http://www.heeyhome.com/lpcs/' + v.goods_img + '">';
					todayConStr += '</div>';
					todayConStr += '<div class="left_describe">';
					todayConStr += '<header>' + v.goods_name + '</header>';
					todayConStr += '<p>月销<i>' + (v.sales || 0) + '</i>笔</p>';
					todayConStr += '<strong>￥<i>' + v.price + '</i>/<b>' + v.unit + '</b></strong>';
					todayConStr += '</div>';
					todayConStr += '<div class="right_add">';
					if(v.goods_num > 0) {
						todayConStr += '<a class="reduce fl" href="javascript:;">';
						todayConStr += '<img src="css/img/reduce.png">';
						todayConStr += '</a>';
						todayConStr += '<span class="num fl">' + v.goods_num + '</span>';
					}
					todayConStr += '<a class="plus fr" href="javascript:;">';
					todayConStr += '<img src="css/img/plus.png">';
					todayConStr += '</a></div></li>';
				});
				todayConStr += '</ul></div>';
				$detailWrap.html(todayConStr);
			}
		});
	},
	/**
	 * 根据ID获取商品列表
	 */
	getGoodsListEvent: function(cateId) {
		$.ajax({
			url: indexWarp.GOODLISTURL,
			type: "GET",
			async: true,
			data: {
				cate_id: cateId,
				openid: openid
			},
			dataType: 'jsonp',
			success: function(data) {
				console.log(data.data);
				var $leftSlide = $('.left_slide ul'),
					$detailWrap = $('#detail_wrap'),
					divTop = $('.content_li').eq(0).offset().top;
				$leftSlide.empty();
				$detailWrap.empty();
				$("html,body").stop().animate({
					scrollTop: divTop
				}, 10);
				$.each(data.data, function(m, n) {
					var leftContent = '<li><a href="javascript:;" tab="' + n.cate_id + '">' + n.cate_name + '</a></li>';
					$leftSlide.append(leftContent);
					var goodsContent = '<div class="content_li" id="' + n.cate_id + '"><ul>';
					$.each(n.goods, function(i, v) {
						goodsContent += '<li data-id="' + v.goods_id + '">';
						goodsContent += '<div class="left_img">';
						goodsContent += '<img src="http://www.heeyhome.com/lpcs/' + v.goods_img + '">';
						goodsContent += '</div>';
						goodsContent += '<div class="left_describe">';
						goodsContent += '<header>' + v.goods_name + '</header>';
						goodsContent += '<p>月销<i>' + (v.sales || 0) + '</i>笔</p>';
						if(v.tag == '2') {
							goodsContent += '<strong>￥<i>' + v.discount_price + '</i>/<b>' + v.unit + '</b></strong>';
							goodsContent += '<strong class="line_through">￥<i>' + v.price + '</i>/<b>' + v.unit + '</b></strong>';
						} else {
							goodsContent += '<strong>￥<i>' + v.price + '</i>/<b>' + v.unit + '</b></strong>';
						}
						goodsContent += '</div>';
						goodsContent += '<div class="right_add">';
						if(v.goods_num > 0) {
							goodsContent += '<a class="reduce fl" href="javascript:;" cate_id="' + cateId + '">';
							goodsContent += '<img src="css/img/reduce.png">';
							goodsContent += '</a>';
							goodsContent += '<span class="num fl">' + v.goods_num + '</span>';
						}
						goodsContent += '<a class="plus fr" href="javascript:;" cate_id="' + cateId + '">';
						goodsContent += '<img src="css/img/plus.png">';
						goodsContent += '</a></div></li>';
					});
					goodsContent += '</ul></div>';
					$detailWrap.append(goodsContent);
				});
				$('.left_slide li').eq(0).addClass('active');
				describeConHendler.getDescribeData();
			}
		});
	},
	/**
	 * 购物车内容初始化
	 */
	getGwcData: function() {
		var self = this;
		$.ajax({
			url: indexWarp.GWCINFOURL,
			type: "GET",
			async: true,
			data: {
				openid: openid
			},
			dataType: 'jsonp',
			success: function(data) {
				console.log(data.data);
				if(data.data != '') {
					self.gwcContentEvent(data.data.carts); // 购物车内容拼接
					if(data.data.status.amount > 0) {
						$('.icon').show(); //显示数字
						$('.icon').html(data.data.status.quantity); //显示数字
						$('#gwc i').addClass('active_i'); //购物车变亮
						$('#gwc span').addClass('active_span'); //文字
						$('#gwc span em').show(); //￥
						$('#gwc span b').html(data.data.status.amount); //￥
						self.changePayEvent(data.data.status.amount);
					}
				} else {
					$('.gwcDetail_content ul').empty();
					$('.icon').hide(); //隐藏数字
					$('#gwc i').removeClass('active_i'); //购物车变暗
					$('#gwc span').removeClass('active_span'); //文字
					$('#gwc b').html('购物车是空的'); //文字
					$('#gwc span em').hide(); //￥
					$('.gwc_submit a').html('还差￥<i>30</i>元起送'); //￥
				}
			}
		});
	},
	initFloorNavEvent: function(e, _this) {
		var items = $('.content_li'),
			x = _this.index(),
			divTop = items.eq(x).offset().top;
		$('.left_slide li').removeClass('active');
		_this.addClass('active');
		describeConHendler.getDescribeData();
		e.stopPropagation();

		$("html,body").stop().animate({
			scrollTop: divTop
		}, 10);
	},
	getContentChange: function() {
		var items = $('.content_li');
		var scrollTop = $(document).scrollTop();
		var oTabUl = $('.left_slide');
		var curId = '';
		describeConHendler.getDescribeData();

		items.each(function() {
			var m = $(this); //定义变量，获取当前类
			var itemsTop = m.offset().top; //定义变量，获取当前类的top偏移量
			if(scrollTop > itemsTop - 100) {
				curId = m.attr("id");
			} else {
				return false;
			}
		});

		//给相应的楼层设置cur,取消其他楼层的cur
		var curLink = oTabUl.find("a");
		if(curId && curLink.attr("tab") != curId) {
			curLink.parent().removeClass("active");
			oTabUl.find("[tab= '" + curId + "']").parent().addClass("active");
		}
	},
	/**
	 * 加入购物车
	 */
	addCartEvent: function(_this) {
		var self = this,
			goods_id = _this.parents('li').attr('data-id'),
			cate_id = _this.attr('cate_id');
		self.gotoGwcEvent(event, _this);
		$.ajax({
			url: indexWarp.ADDCARTURL,
			type: "GET",
			async: true,
			data: {
				openid: openid,
				goods_id: goods_id
			},
			dataType: 'jsonp',
			success: function(data) {
				console.log(data.data);
				var cartData = data.data.carts;
				if(cate_id != undefined && cate_id != '' && cate_id != null) {
					self.getGoodsListEvent(cate_id);
				} else {
					self.getTodayRecommendData();
				}
				self.getGwcData();
			},
			error: function(data) {}
		});
	},
	/**
	 * 加入购物车飞入事件
	 */
	gotoGwcEvent: function(event, plus) {
		var offset = $(".gwc").offset(),
			img = plus.parents('li').find('.left_img img').attr('src'),
			flyer = $('<img class="u-flyer" src="' + img + '" style="width:40px;height: 40px;">');
		flyer.fly({
			start: {
				left: event.pageX,
				top: event.pageY - $(document).scrollTop()
			},
			end: {
				left: offset.left + 10,
				top: offset.top + 10,
				width: 0,
				height: 0
			},
			onEnd: function() {
				// var gwc_num = $('.icon').text();
				// gwc_num++;
				// $('.icon').text(gwc_num);
				// this.destory();
			}
		});
	},
	/**
	 * 购物车内容拼接
	 */
	gwcContentEvent: function(cartData) {
		var $content = $('.gwcDetail_content ul'),
			stitching = '';
		$.each(cartData, function(i, v) {
			stitching += '<li data-id="' + v.goods_id + '"> <span class="name">' + v.goods_name + '</span>';
			stitching += '<span class="money">￥<i class="money_i">' + v.discount_price + '</i>/<i>' + v.unit + '</i></span>';
			stitching += '<span class="operate">';
			stitching += '<a class="reduce" href="javascript:;">';
			stitching += '<img src="css/img/reduce.png">';
			stitching += '</a>';
			stitching += '<span class="num">' + v.goods_num + '</span>';
			stitching += '<a class="plus" href="javascript:;">';
			stitching += '<img src="css/img/plus.png">';
			stitching += '</a>';
			stitching += '</span>';
			stitching += '</li>';

		});
		$content.empty().html(stitching);

	},
	/**
	 * 结算按钮变化
	 */
	changePayEvent: function($sum) {
		var $submita = $('.gwc_submit a');
		if($sum >= 30) {
			$submita.html('去结算');
			$submita.addClass('active_a');
		} else {
			$submita.html('还差￥<i>30</i>元起送');
			$submita.find('i').html((30 - $sum).toFixed(2)); //计算保留2位小数!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
			$submita.removeClass('active_a');
		}
	},
	/**
	 * 删除购物车
	 */
	delCartEvent: function(_this) {
		var self = this,
			goods_id = _this.parents('li').attr('data-id'),
			cate_id = _this.attr('cate_id');
		console.log(goods_id);
		$.ajax({
			url: indexWarp.DELCARTURL,
			type: "GET",
			async: true,
			data: {
				openid: openid,
				goods_id: goods_id
			},
			dataType: 'jsonp',
			success: function(data) {
				console.log(data.data);
				var cartData = data.data.carts;
				if(cate_id != undefined && cate_id != '' && cate_id != null) {
					self.getGoodsListEvent(cate_id);
				} else {
					self.getTodayRecommendData();
				}
				self.getGwcData();
				console.log(data.data.carts)
				if(data.data.carts.length == '0') {
					$('#gec_detail').hide();
					$('#wrap').addClass("display");
					$('.right_content').css('position', 'inherit');
				}
			},
			error: function(data) {}
		});
	},
	/**
	 * 清空购物车
	 */
	emptyCartEvent: function() {
		layer.open({
			content: '清空购物车？',
			btn: ['清空', '取消'],
			yes: function(index) {
				$.ajax({
					url: indexWarp.EMPTYCARTURL,
					type: "GET",
					async: true,
					data: {
						openid: openid
					},
					dataType: 'jsonp',
					success: function(data) {
						console.log(data.data);
						location.reload();
					},
					error: function(data) {}
				});
				layer.close(index);
			}
		});
	},
	/**
	 * 去结算
	 */
	goToPayEvent: function() {

		var myDate = new Date();
		//获取当前日
		var h = myDate.getHours(); //获取当前小时数(0-23)
		var m = myDate.getMinutes(); //获取当前分钟数(0-59)

		var now = (h < 10 ? '0' + h : h) + ':' + (m < 10 ? '0' + m : m)
		sessionStorage.setItem('time', now);
		$('#wrap').addClass("display");
		$('#gec_detail').hide();
		window.location.href = 'view/v_user/order.html';
	},
	/**
	 * 初始化session数据
	 */
	initSessionData: function() {
		sessionStorage.removeItem("addressObj"); // 删除保存在session中的送餐地址信息
	}
};

titleScrollHendler = {
	/**
	 * tab滑动
	 */
	titleScroll: function(el1, el2, style) {
		var self = this;
		$(document).ready(function() {
			var mySwiper = new Swiper('.' + el1, {
				slidesPerView: 4, //'auto'
				observer: true, //修改swiper自己或子元素时，自动初始化swiper
				observeParents: true, //修改swiper的父元素时，自动初始化swiper
			});
			$('.' + el2).eq(0).addClass(style);
		});
	},
};

describeConHendler = {
	/**
	 * 获取细节内容
	 */
	getDescribeData: function() {
		var $active = $('.left_slide li[class="active"]').find('a');
		var $a = $active.html();
		var $tab = $active.attr('tab');
		var $len = $('#' + $tab + ' li').length;
		$('.detail_describe').html($a + '（' + $len + '）');
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
					indexWarp.init();
				} else {
					layer.msg(data.msg);
				}
			},
			error: function(data) {}
		});
	} else {

		openid = sessionStorage.getItem('openid');
		if(openid != null) {
			indexWarp.init();
		}

	}
});