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
	 * 	butLeftOrTop || butRightOrBottom :{String}
	 * @params {Function} callback
	 */
	roll: function(name, params, callback, callback2) {
		let _name = $(name);
		let rollBox = $(params.rollBox), 					//父级盒子
			rollSonBox = $(params.rollSonBox), 	//子级盒子
			butLeftOrTop = $(params.butOne), 				//点击按钮
			butRightOrBottom = $(params.butTwo), 			//点击按钮
			singleW_H = $(rollSonBox[0]).width(), 			//单个盒子的宽度或者高度  默认为宽度
			scrollNum = 0, 									//设置偏移度
			w_h = 0,										//设置父级盒子的宽或者高
			margin = !!params.margin ? params.margin:false,	//用于控制盒子移动的方向
			direction = !!params.direction ? params.direction:'Left',
			endNum = !!params.endNum ? Number(params.endNum):0,		//结束显示几个子盒子，默认为1
			loop = !!params.loop ? params.loop:false;		//是否开启自动循环，默认关闭
		if(!!margin){
			margin = {num:0};
		}
		//获取所有子标签的宽度,设置父级的宽度
		for(var i = 0, len = rollSonBox.length; i < len; i++) {
			$(rollSonBox[i]).attr('index',i+1);
			if(!!margin){
				margin['num'] = Number(!!margin['num'] ? margin['num']:0) + Number($(rollSonBox[i]).css('margin' + direction).replace('px', ''));
			}
			if(direction == 'Left' || direction == 'Right'){
				w_h += $(rollSonBox[i]).width();
			}else{
				w_h += $(rollSonBox[i]).height();
			}
		}
		//设置父级盒子的宽或者高
		w_h = w_h + (!!margin ? margin['num']:0);
		//获取单个盒子的宽或者高 and 设置 偏移方向 ,默认为左
		let scrollLeft = scrollNum + 'px,0,0';
		if(direction == 'Left' || direction == 'Right'){
			singleW_H = Number($(rollSonBox[0]).width()) + Number($(rollSonBox[1]).css('margin' + direction).replace('px', ''));
			rollBox.css({'width':w_h});
		}else{
			singleW_H = Number($(rollSonBox[0]).height()) + Number($(rollSonBox[1]).css('margin' + direction).replace('px', ''));
			scrollLeft = '0,'+scrollNum+'px,0';
			rollBox.css({'height':w_h});
		}
		
		//设置父级盒子宽度和偏移度CSS
		rollBox.css({
			'transition-duration': '0ms',
			'transform': 'translate3d('+ scrollLeft +')'
		});

		//点击事件1
		butLeftOrTop.on('click', function() {
			if(scrollNum >= 0) return false;
			boxScroll(singleW_H)
		})
		//点击事件2
		butRightOrBottom.on('click', function() {
			if(~scrollNum+1 >= (w_h - endNum * singleW_H)) return false;
			boxScroll(-Number(singleW_H))
		})
		
		/**
		 * 设置盒子偏移运动
		 * @param {Number} num		传入偏移量
		 */
		function boxScroll(num) {
			scrollNum = scrollNum + num;
			let leftOrTop = '0,'+scrollNum+'px,0';
			if(direction == 'Left' || direction == 'Right'){
				leftOrTop = scrollNum + 'px,0,0';
			}
			rollBox.css({
				'transition-duration': '300ms',
				'transform': 'translate3d('+ leftOrTop +')'
			});
			if(typeof(callback2) === 'function') return callback2({num:(function(){
				let num = (~(scrollNum / singleW_H) + 1) +1;
				return num;
			})()},params);
		}
		/**
		 * 设置自动循环
		 */
		var	timer;
		function loopAuto() {
			if(!!loop){
				timer = setTimeout(function(){
					if(~scrollNum+1 >= (w_h - endNum * singleW_H)){
						clearTimeout(timer);
						scrollNum = singleW_H;
						boxScroll(0);
					};
					loopAuto();
					boxScroll(-Number(singleW_H));
				}, loop.num * 1000)
			}
		}
		loopAuto();
		//鼠标移入移除事件 ,如果开启自动播放时才启用该事件
		if(!!loop){
			rollBox.on({
				mouseover: function(){
					clearTimeout(timer);
				},
				mouseout: function(){
					loopAuto();
				}
			})
		}
		//回调函数，返回设定的参数
		if(typeof(callback) === 'function') return callback(params);
	}
};