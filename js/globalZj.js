"use strice";
/**
 * 中军创恒 全局js
 * *注意：必须在jq之后引用
 */
var zj = {
	_init: false,
	/**
	 * @param {String} name
	 * @param {Object} params 用于控制滑动的属性
	 * 	rollBox:{String}
	 * 	rollSonBox:{String}
	 * 	margin:{Object}
	 * 	endNum:{Number}
	 * 	loop:{Object}
	 * 	butL || butR :{Object}
	 */
	roll: function(name, params) {
		let _name = $(name);
		let boxWidth = 0,
			rollBox = $(params.rollBox), //父级盒子
			rollSonBox = rollBox.find(params.rollSonBox), //子级盒子
			butL = $(params.butL), //左侧点击按钮
			butR = $(params.butR), //右侧点击按钮
			singleWidth = $(rollSonBox[0]).width(), //单个盒子的宽度
			scrollNum = 0; //设置偏移度

		//获取所有子标签的宽度,设置父级的宽度
		for(var i = 0, len = rollSonBox.length; i < len; i++) {
			if(!!params.margin) {
				boxWidth += $(rollSonBox[i]).width() + Number($(rollSonBox[i]).css('margin' + params.margin.direction).replace('px', ''));
			} else {
				boxWidth += $(rollSonBox[i]).width();
			}
		}
		//设置父级盒子宽度和偏移度
		rollBox.css({
			'width': boxWidth,
			'transition-duration': '0ms',
			'transform': 'translate3d(' + scrollNum + 'px, 0px, 0px)'
		});

		//左侧点击事件
		butR.on('click', function() {
			if(scrollNum <= -boxWidth) return false;
			if(!!params.margin) {
				scrollNum = scrollNum - (singleWidth + Number($(rollSonBox[1]).css('margin' + params.margin.direction).replace('px', '')));
			} else {
				scrollNum = scrollNum - singleWidth;
			}
			if(!!params.endNum) {
				let endNumberWidth = params.endNum * (singleWidth + (!!params.margin ? Number($(rollSonBox[1]).css('margin' + params.margin.direction).replace('px', '')) : 1)) - Number($(rollSonBox[1]).css('margin' + params.margin.direction).replace('px', ''));
				if(scrollNum <= -(boxWidth - endNumberWidth)) {
					scrollNum = -(boxWidth - endNumberWidth);
				};
			}
			boxScroll(scrollNum);
		})
		//右侧点击事件
		butL.on('click', function() {
			if(scrollNum >= 0) return false;
			if(!!params.margin) {
				scrollNum = scrollNum + (singleWidth + Number($(rollSonBox[1]).css('margin' + params.margin.direction).replace('px', '')));
			} else {
				scrollNum = scrollNum + singleWidth;
			}
			scrollNum = scrollNum > 0 ? 0 : scrollNum;
			boxScroll(scrollNum);
		})
		//循环滚动
		if(!!params.loop) {
			loopAuto(true)
		}

		/**
		 * 设置盒子偏移运动
		 * @param {Number} num		传入偏移量
		 */
		function boxScroll(num) {
			rollBox.css({
				'transition-duration': '300ms',
				'transform': 'translate3d(' + num + 'px, 0px, 0px)'
			});
		}
		/**
		 * 设置自动循环
		 */
		let setScrollNumber = true;

		function loopAuto(type) {
			if(!!type) {
				let timer = setInterval(function() {
					if(!setScrollNumber) {
						clearInterval(timer);
						scrollNum = 0;
						rollBox.css({
							'transition-duration': '0ms',
							'transform': 'translate3d(' + scrollNum + 'px, 0px, 0px)'
						});
						setTimeout(function() {
							setScrollNumber = true;
							loopAuto(true)
						}, 1500)
						return false;
					}
					if(!!params.margin) {
						scrollNum = scrollNum - (singleWidth + Number($(rollSonBox[1]).css('margin' + params.margin.direction).replace('px', '')));
					} else {
						scrollNum = scrollNum - singleWidth;
					}
					if(!!params.endNum) {
						let endNumberWidth = params.endNum * (singleWidth + (!!params.margin ? Number($(rollSonBox[1]).css('margin' + params.margin.direction).replace('px', '')) : 1)) - Number($(rollSonBox[1]).css('margin' + params.margin.direction).replace('px', ''));
						if(scrollNum <= -(boxWidth - endNumberWidth)) {
							scrollNum = -(boxWidth - endNumberWidth);
							setScrollNumber = false;
						};
					}
					boxScroll(scrollNum);
				}, params.loop.num * 1000)
			}

		}
	},
	topRoll: function(name, params, callback) {
		let topBoxName = $(name);
		let rollBox = $(params.rollBox), //父级盒子
			rollSonBox = rollBox.find(params.rollSonBox), //子级盒子
			singleHeight = $(rollSonBox[0]).height(), //单个盒子的宽度
			butL = $(params.butL), //点击按钮
			butR = $(params.butR), //点击按钮
			scrollNum = 0, //设置偏移度
			boxHeight = 0;

		//获取所有子标签的宽度,设置父级的宽度
		for(var i = 0, len = rollSonBox.length; i < len; i++) {
			if(!!params.margin) {
				boxHeight += $(rollSonBox[i]).height() + Number($(rollSonBox[i]).css('margin' + params.margin.direction).replace('px', ''));
			} else {
				boxHeight += $(rollSonBox[i]).height();
			}
			$(rollSonBox[i]).on('click', function() {
				$(this).parent().find('li').removeClass('ck');
				$(this).addClass('ck')
			})
		}

		rollBox.css({
			'transition-duration': '0ms',
			'transform': 'translate3d(0px, ' + scrollNum + 'px, 0px)'
		});

		butL.on('click', function() {
			if(scrollNum <= ~boxHeight) return false;
			if(!!params.margin) {
				scrollNum = scrollNum - (singleHeight + Number($(rollSonBox[1]).css('margin' + params.margin.direction).replace('px', '')));
			} else {
				scrollNum = scrollNum - singleHeight;
			}
			if(!!params.endNum) {
				let endNumberHeight = params.endNum * (singleHeight + (!!params.margin ? Number($(rollSonBox[1]).css('margin' + params.margin.direction).replace('px', '')) : 1)) - Number($(rollSonBox[1]).css('margin' + params.margin.direction).replace('px', ''));
				if(scrollNum <= -(boxHeight - endNumberHeight)) {
					scrollNum = -(boxHeight - endNumberHeight);
				};
			}
			boxScroll(scrollNum);
		})
		butR.on('click', function() {
			if(scrollNum >= 0) return false;
			if(!!params.margin) {
				scrollNum = scrollNum + (singleHeight + Number($(rollSonBox[1]).css('margin' + params.margin.direction).replace('px', '')));
			} else {
				scrollNum = scrollNum + singleHeight;
			}
			if(!!params.endNum) {
				let endNumberHeight = params.endNum * (singleHeight + (!!params.margin ? Number($(rollSonBox[1]).css('margin' + params.margin.direction).replace('px', '')) : 1)) - Number($(rollSonBox[1]).css('margin' + params.margin.direction).replace('px', ''));
				if(scrollNum <= -(boxHeight - endNumberHeight)) {
					scrollNum = -(boxHeight - endNumberHeight);
				};
			}
			boxScroll(scrollNum);
		})

		/**
		 * 设置盒子偏移运动
		 * @param {Number} num		传入偏移量
		 */
		function boxScroll(num) {
			rollBox.css({
				'transition-duration': '300ms',
				'transform': 'translate3d(0px, ' + num + 'px, 0px)'
			});
		}
	},
	/**
	 * 顶部header 固定
	 * @param {Object} name
	 */
	fixation: function(name){
		let headerHeight = $(name).height();
		window.onload = function(){
			if($(window).scrollTop() > headerHeight){
				$(name).addClass('header-fixation');
			}
			if($(window).scrollTop() < 20){
				$(name).removeClass('header-fixation');
			}
		};
		$(window).scroll(function(){
			let topHeight = $(window).scrollTop();
			if(topHeight > headerHeight){
				$(name).addClass('header-fixation');
			}
			if(topHeight < 20){
				$(name).removeClass('header-fixation');
			}
		})
	}
};