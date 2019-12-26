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
		if(rollSonBox.length > endNum){
			loopAuto();
		}
		
		//鼠标移入移除事件 ,如果开启自动播放时才启用该事件
		if(!!loop){
			rollBox.on({
				mouseover: function(){
					clearTimeout(timer);
				},
				mouseout: function(){
					if(rollSonBox.length > endNum){
						loopAuto();
					}
				}
			})
		}
		//回调函数，返回设定的参数
		if(typeof(callback) === 'function') return callback(params);
	},
	/**
	 * 页面请求数据
	 * @param {Object} data
	 */
	data: function(data){
		const dataUrl = "http://api.hpd81.com/page/source?page=";
		let dataInfo = null;
		$.ajax({
			type:"get",
			url: dataUrl + (data == 'theProduct' ? 'product':data),
			async:false,
			dataType: "json",
			success:function(data){
				dataInfo = data;
				return dataInfo;
			},
			error: function(e){
				console.log(`%c ${JSON.stringify(e)}`,`color:red`)
			}
		});
		return dataInfo;
	},
	/**
	 * 页面渲染请求数据
	 * @param {Object} pageName
	 */
	render: function(pageName, callback){
		let self = this,
			data = self.data(pageName);
		console.log(data);
		//修改footer
		let footerData = data.data.contact;
		switch (pageName){
			case 'index':
				self.equipment(data);
				self.business(data);
				self.indexVideo(data);
				self.indexPage(data);
				break;
			case 'theProduct':
				self.theProduct(data);
				break;
			case 'product':
				self.product(data);
				break;
			case 'cooperation':
				self.cooperation(data);
				break;
			case 'culture':
				self.culture(data);
				break;
			case 'relation':
				self.relation(data);
				break;
			default:
				self.details(data);
				break;
		}
		self.footerDom(footerData);
		if(typeof(callback) === 'function') return callback(data);
	},
	footerDom: function(data){
		let dataInfo = data,
			footerData = [],
			title = {'address':'地址','phone':'TEL','email':'邮箱'};
		for(let i in dataInfo){
			if(i == 'address' || i == 'email' || i == 'phone'){
				footerData.push({
					name:i,
					title:title[i],
					data:dataInfo[i]
				})
			}
		}
		$('.footer ul').find('li').eq(0).html(footerData[1].title + "："+footerData[1].data);
		$('.footer ul').find('li').eq(1).html(footerData[0].title + "："+footerData[0].data);
		$('.footer ul').find('li').eq(2).html(footerData[2].title + "："+footerData[2].data);
	},
	indexPage: function(list){
		//首页获取产品数据
		let self = this,
			data = self.data('product'),
			dataInfo = data.data,
			list_ = list.data;
		console.log(list_);
		//智能轻武器模拟射击系统
		let productContList = $('.product-cont-list>li'),
			one = productContList.eq(0),
			two = productContList.eq(1),
			three = productContList.eq(2),
			four = productContList.eq(3),
			five = productContList.eq(4),
			six = productContList.eq(5),
			seven = productContList.eq(6),
			eight = productContList.eq(7);
		//智能轻武器模拟射击系统
		let oneImgs = self.sortNumber(dataInfo.imgs[3].imgs),
			oneLi = '';
		for(let i in oneImgs){
			oneLi += `<li><img src=".${oneImgs[i].url}"><div class="new-pro-popup"><p>${oneImgs[i].title}</p><p>${oneImgs[i].content}</p></div></li>`;
		}
		one.find('.small-title').html(`${dataInfo.imgs[3].title}<span>${dataInfo.imgs[3].sub_title}</span>`);
		one.find('.new-product').html(oneLi);
		//电子狩猎射击系统
		let dzsl = list_.contents[6],
			dzslImgs = self.sortNumber(dzsl.imgs);
		
		two.find('.small-title').html(`${dzsl.title}<span>${dzsl.sub_title}</span>`);
		two.find('.pro-p').text(`${dzsl.content}`);
		two.find('.pro-two-img').html(`<img src=".${dzslImgs[0].url}"><img src=".${dzslImgs[1].url}">`);
		//多变靶标射击系统
		let dbbb = list_.contents[5],
			dbbbImgs = self.sortNumber(dbbb.imgs);
		three.find('.small-title').html(`${dbbb.title}<span>${dbbb.sub_title}</span>`);
		three.find('.pro-three dl dt').html(`<img src=".${dbbbImgs[0].url}">`);
		three.find('.pro-three dl dd').html(`<p>${dbbb.content}</p><img src=".${dbbbImgs[1].url}">`);
		//智能光电飞碟射击系统
		let zngd = list_.contents[4],
			zngdImgs = self.sortNumber(zngd.imgs);
		four.find('.small-title').html(`${zngd.title}<span>${zngd.sub_title}</span>`);
		four.find('.pro-p').text(`${zngd.content}`);
		four.find('.pro-four-img').html(`<img src=".${zngdImgs[0].url}"><img src=".${zngdImgs[1].url}">`);
		//快速射击模拟系统
		let ksmn = list_.contents[0],
			ksmnImgs = self.sortNumber(ksmn.imgs);
		five.find('.small-title').html(`${ksmn.title}<span>${ksmn.sub_title}</span>`);
		five.find('.pro-p').text(`${ksmn.content}`);
		five.find('.pro-five-img').html(`<img src=".${ksmnImgs[0].url}"><img src=".${ksmnImgs[1].url}"><img src=".${ksmnImgs[2].url}">`);
		//实弹模拟射击系统
		let sdmn = list_.contents[3],
			sdmnImgs = self.sortNumber(sdmn.imgs),
			fontTxt = '',
			fontList = self.txtReplace(sdmn.content);
		for(var a in fontList){
			fontTxt += `<font>${fontList[a]}</font>`;
		}
		six.find('.small-title').html(`${sdmn.title}<span>${sdmn.sub_title}</span>`);
		six.find('.pro-six').html(`<img src=".${sdmnImgs[0].url}"><p>${fontTxt}</p>`);
		six.find('.pro-six-img').html(`<img src=".${sdmnImgs[1].url}">`);
		//影像互动射击系统
		let yxhd = list_.contents[1],
			yxhdImgs = self.sortNumber(yxhd.imgs);
		seven.find('.small-title').html(`${yxhd.title}<span>${yxhd.sub_title}</span>`);
		seven.find('.pro-p').text(`${yxhd.content}`);
		seven.find('.pro-seven-img').html(`<img src=".${yxhdImgs[0].url}"><img src=".${yxhdImgs[1].url}">`);
		//战术射击模拟系统
		let zsmn = list_.contents[2],
			zsmnImgs = self.sortNumber(zsmn.imgs);
		eight.find('.small-title').html(`${zsmn.title}<span>${zsmn.sub_title}</span>`);
		eight.find('.pro-eight').html(`<img src=".${zsmnImgs[0].url}"><p>${zsmn.content}</p>`);
		eight.find('.pro-eight-img').html(`<img src=".${zsmnImgs[1].url}">`);
		setTimeout(function(){
			self.roll('.product-cont',{
				rollBox:'.product-cont-list',
				rollSonBox: '.product-cont-list>li',
				endNum: 1,
				loop: {
					num: 3
				},
				butOne: '.position .pro-l',
				butTwo: '.position .pro-r'
			},null,function(obj,params){
				if(obj.num >= 2){
					$(params.rollSonBox).eq(0).css({'visibility':'hidden'});
				}else{ 
					$(params.rollSonBox).eq(0).css({'visibility':'inherit'});
				}
			});
		},500)
	},
	indexVideo: function(data){
		let mp4Url = 'http://api.hpd81.com';
		let dataInfo = data.data.activities[0],
			self = this,
			firstDom = $('.video-box');
		
		firstDom.find('.small-title').html(`${dataInfo.title}<span>${dataInfo.sub_title}</span>`);
		//video
		let videoList = self.sortNumber(dataInfo.imgs),
			videoUl = firstDom.find('.video-list-c'),
			videoLi = '';
		
		for(let i in videoList){
			let time = self.timeYear(videoList[i].created);
			videoLi += `<li${i == 0 ? " class='ck'":""} data-url=".${videoList[i].url}">
							<span>${time[2]}/${time[1]}<i>${time[0]}</i></span>
							<p>${videoList[i].content}</p>
						</li>`;
		}
		videoUl.find('ul').html(videoLi);
		firstDom.find('.video video').attr('src',mp4Url+videoList[0].url);
		setTimeout(function(){
			self.roll('.video-list-c',{
				rollBox:'.video-list-c ul',
				rollSonBox: '.video-list-c ul li',
				margin:true,
				direction: 'Bottom',
				loop: {
					num: 4
				},
				endNum: 2,
				butOne: '.carousel-video-list .top',
				butTwo: '.carousel-video-list .bottom'
			},function(params){
				let li = $(params.rollSonBox);
				for(let i=0,len=li.length;i<len;i++){
					$(li[i]).on('click',function(){
						$(this).parent().find('li').removeClass('ck');
						$(this).addClass('ck');
						firstDom.find('.video video').attr('src',mp4Url+$(this).attr('data-url'));
					})
				}
			});
		},500)
	},
	/**
	 * 设备应用轮播版块
	 * @param {Object} data
	 */
	equipment: function(data){
		let dataInfo = data.data.imgs[0]; //设备应用数据
		let firstBox = $('.equipment');
			ulDom = firstBox.find('.roll-ul'),
			li = '';
		for(let i in dataInfo.imgs){
			li += '<li><img src=".'+dataInfo.imgs[i].url+'" alt="'+dataInfo.imgs[i].content+'"><p>'+dataInfo.imgs[i].content+'</p></li>';
		}
		ulDom.html(li);
		//修改大标题
		firstBox.find('.small-title').html(dataInfo['content'] + `<span>${dataInfo['sub_title']}</span>`);
		this.roll('.roll',{
			rollBox:'.roll-ul',
			rollSonBox: '.roll-ul li',
			margin:true,
			direction: 'Left',
			endNum: 3,
			loop: {
				num: 3
			},
			butOne: '.roll .l',
			butTwo: '.roll .r'
		}, function(params){
			let li = $(params.rollSonBox);
			for(let i=0,len=li.length;i<len;i++){
				$(li[i]).on('click',function(){
					window.open('./details.html')
				})
			}
		});
	},
	/**
	 * index 业务范围
	 * @param {Object} data
	 */
	business: function(data){
		let dataInfo = data.data.contents[8],
			self = this;
		
		let firstBox = $('.manifesto'),
			text_ = self.txtReplace(dataInfo['content']),
			p = '',
			title = '';
		for(let i in text_){
			p += `<p>${text_[i]}</p>`;
		}
		title = `<h3 class="small-title">${dataInfo['title']}<span>${dataInfo['sub_title']}</span></h3>`;
		firstBox.find('.type-area').html(title + p);
	},
	/**
	 * relation
	 * @param {Object} data
	 */
	relation: function(data){
		let dataInfo = data.data.contact,
			firstDom = $('.relation-bj');
		let footerData = [],
			title = {'address':'地址','phone':'TEL','email':'邮箱'};
		for(let i in dataInfo){
			if(i == 'address' || i == 'email' || i == 'phone'){
				footerData.push({
					name:i,
					title:title[i],
					data:dataInfo[i]
				})
			}
		}
		firstDom.find('ul li').eq(0).html(`<img src=".${dataInfo['wechat']}">`);
		firstDom.find('ul li').eq(1).html(`微信公众号`);
		firstDom.find('ul li').eq(2).html(`${footerData[1].title}：${footerData[1].data}`);
		firstDom.find('ul li').eq(3).html(`${footerData[0].title}：${footerData[0].data}`);
		firstDom.find('ul li').eq(4).html(`${footerData[2].title}：${footerData[2].data}`);
	},
	/**
	 * culture
	 */
	culture: function(data){
		let dataInfo = data.data.contents[0],
			self = this,
			text_ = self.txtReplace(dataInfo['content']),
			firstDom = $('.culture-wh'),
			p = '';
		for(let i in text_){
			p += `<p>${text_[i]}</p>`;
		}
		firstDom.html(`<img src=".${dataInfo.imgs[0].url}" alt="北京中军创恒科技有限公司-公司简介banner"><div><h3 class="small-title">${dataInfo['title']}<span>${dataInfo['sub_title']}</span></h3>${p}</div>`);
	},
	/**
	 * cooperation
	 */
	cooperation: function(data){
		let dataInfo = data.data.imgs[0],
			firstDom = $('.cooperation-ul'),
			li = '',
			self = this,
			dataList = self.sortNumber(dataInfo['imgs']);
		for(let i in dataList){
			li += `<li><img src=".${dataList[i].url}"><p>${dataList[i].content}</p></li>`;
		}
		firstDom.find('.small-title').html(dataInfo['title']);
		firstDom.find('ul').html(li);
	},
	/**
	 * product
	 */
	product: function(data){
		let dataInfo = data.data,
			self = this;
		
		self.proOne(dataInfo);
		self.proTwo(dataInfo.contents);
		self.proThree(dataInfo.contents);
	},
	//实弹模拟射击系统
	proOne: function(data){
		let dataInfo = data,
			contents = dataInfo.contents,
			firstOneDom = $('.pro-one'),
			p = '',
			self = this,
			text_ = self.txtReplace(contents[9].content);
		for(let i in text_){
			p += `<p>${text_[i]}</p>`;
		}
		firstOneDom.find('ul li').eq(0).html(`<img src=".${contents[10].imgs[0].url}">`);
		firstOneDom.find('ul li').eq(1).html(`<h3>${contents[10].title}</h3><p>${contents[10].content}</p>`);
		firstOneDom.find('ul li').eq(2).html(`<h3>${contents[9].title}</h3>${p}`);
		firstOneDom.find('ul li').eq(3).html(`<img src=".${contents[9].imgs[0].url}">`);
	},
	proTwo: function(data){
		let dataInfo = data,
			firstOneDom = $('.pro-box-one');
		firstOneDom.find('ul>li').eq(0).html(`<h3 class="small-title">${dataInfo[8].title}<span>${dataInfo[8].sub_title}</span></h3><ol><li><img src=".${dataInfo[8].imgs[0].url}"></li><li><p>${dataInfo[8].content}</p></li></ol>`);
		
		firstOneDom.find('ul>li').eq(1).html(`<h3 class="small-title">${dataInfo[7].title}<span>${dataInfo[7].sub_title}</span></h3><ol><li><p>${dataInfo[7].content}</p></li><li><img src=".${dataInfo[7].imgs[0].url}"></li></ol>`);
		
		firstOneDom.find('ul>li').eq(2).html(`<h3 class="small-title">${dataInfo[6].title}<span>${dataInfo[6].sub_title}</span></h3><ol><li><img src=".${dataInfo[6].imgs[0].url}"></li><li><p>${dataInfo[6].content}</p></li></ol>`);
	},
	proThree: function(data){
		let dataInfo = data,
			firstOneDom = $('.pro-box-two');
		firstOneDom.find('ul>li').eq(0).html(`<h3 class="small-title">${dataInfo[5].title}<span>${dataInfo[5].sub_title}</span></h3><ol><li><img src=".${dataInfo[5].imgs[1].url}"></li><li><img src=".${dataInfo[5].imgs[0].url}"></li><li><p>${dataInfo[5].content}</p></li></ol>`);
		
		firstOneDom.find('ul>li').eq(1).html(`<h3 class="small-title">${dataInfo[4].title}<span>${dataInfo[4].sub_title}</span></h3><ol><li><p>${dataInfo[4].content}</p></li><li><img src=".${dataInfo[4].imgs[0].url}"></li></ol>`);
		
		firstOneDom.find('ul>li').eq(2).html(`<h3 class="small-title">${dataInfo[3].title}<span>${dataInfo[3].sub_title}</span></h3><ol><li><img src=".${dataInfo[3].imgs[1].url}"></li><li><img src=".${dataInfo[3].imgs[0].url}"></li><li><p>${dataInfo[3].content}</p></li></ol>`);
	},
	/**
	 * theProduct
	 * @param {Object} data
	 */
	theProduct: function(data){
		let dataInfo = data.data,
			self = this,
			theOneBox = $('.theOneBox'),
			theTwoBox = $('.theTwoBox'),
			theThreeBox = $('.theThreeBox'),
			theFourBox = $('.theFourBox'),
			theFiveBox = $('.theFiveBox');
		console.log(dataInfo);
		//最新产品
		theOneBox.find('.product-cont .small-title').html(`${dataInfo.imgs[3].title}<span>${dataInfo.imgs[3].sub_title}</span>`);
		let oneImgs = self.sortNumber(dataInfo.imgs[3].imgs),
			oneLi = '';
		for(let i in oneImgs){
			oneLi += `<li><img src=".${oneImgs[i].url}"><div class="new-pro-popup"><p>${oneImgs[i].title}</p><p>${oneImgs[i].content}</p></div></li>`;
		}
		theOneBox.find('.product-cont ul').html(oneLi);
		//产品简介
		let twoData = [dataInfo.contents[12],dataInfo.contents[11]],
			twoDl = '';
		for(let j in twoData){
			twoDl += `<dl class="transmitter">
						<dt><img src=".${twoData[j].imgs[0].url}"></dt>
						<dd>
							<div class="dk-tit"><span>${twoData[j].title}</span></div>
							<p>${twoData[j].content}</p>
						</dd>
					</dl>`;
		}
		theTwoBox.find('.product-cont').html(`<h3 class="small-title">激光发射器<span>Laser transmitter</span></h3>${twoDl}`);
		//智能传输组
		let threeImgs = self.sortNumber(dataInfo.imgs[0].imgs),
			threeLi = '',
			threeUlData = [dataInfo.contents[1],dataInfo.contents[0]],
			threeUlLi = '';
		for(let g in threeImgs){
			threeLi += `<dl><dt><img src=".${threeImgs[g].url}"></dt><dd>${threeImgs[g].content}</dd></dl>`;
		}
		for(let a in threeUlData){
			threeUlLi += `<li>
							<div class="dk-tit"><span>${threeUlData[a].title}</span></div>
							<p>${threeUlData[a].content}</p>
						</li>`;
		}
		theThreeBox.find('.small-title').html(`${dataInfo.imgs[0].title}<span>${dataInfo.imgs[0].sub_title}</span>`);
		theThreeBox.find('.noopsyche>div').html(threeLi);
		theThreeBox.find('.noopsyche>ul').html(threeUlLi);
		//云端数据
		let fourDl = '',
			fourImgs = self.sortNumber(dataInfo.imgs[2].imgs),
			fourLi = '';
		theFourBox.find('.transmitter').html(`<dt><img src=".${dataInfo.contents[2].imgs[0].url}"></dt><dd><div class="dk-tit"><span>${dataInfo.contents[2].title}</span></div><p>${dataInfo.contents[2].content}</p></dd>`);
		theFourBox.find('.grade h4').text(dataInfo.imgs[2].title);
		for(let b in fourImgs){
			fourLi += `<li><img src=".${fourImgs[b].url}"></li>`;
		}
		theFourBox.find('.grade ul').html(fourLi);
		//便携箱组
		let fiveImg = self.sortNumber(dataInfo.imgs[1].imgs),
			fiveDl = '';
		for(let c in fiveImg){
			fiveDl += `<dl>
							<dt><img src=".${fiveImg[c].url}"><p>${fiveImg[c].title}</p></dt>
							<dd>${fiveImg[c].content}</dd>
						</dl>`;
		}
		theFiveBox.find('.small-title').html(`${dataInfo.imgs[1].title}<span>${dataInfo.imgs[1].sub_title}</span>`);
		theFiveBox.find('.product-cont>div').eq(0).html(fiveDl);
		theFiveBox.find('.product-cont>p').text(dataInfo.imgs[1].content);
		theFiveBox.find('.product-cont>h4 b').text(dataInfo.contact.phone);
	},
	/**
	 * details
	 */
	details: function(data){
		let mp4Url = 'http://api.hpd81.com';
		let dataInfo = data.data.contents[0],
			self = this,
			videoData = self.data('index'),
			videoUrl = videoData.data.activities[0].imgs[0].url,
			firstDom = $('.content'),
			ul = firstDom.find('.del-list ul'),
			li = '';
		
		firstDom.find('.det-video video').attr('src',mp4Url + videoUrl).attr('autoplay','');
		let text_ = self.txtReplace(dataInfo.content),
			imgs = self.sortNumber(dataInfo.imgs);
		
		ul.find('li').eq(0).text(text_[0]);
		ul.find('li').eq(1).text(text_[1]);
		ul.find('li').eq(2).html(`<img src=".${imgs[0].url}"><img src=".${imgs[1].url}">`);
		ul.find('li').eq(3).text(text_[2]);
		ul.find('li').eq(4).html(`<img src=".${imgs[2].url}"><img src=".${imgs[3].url}">`);
		ul.find('li').eq(5).text(text_[3]);
		ul.find('li').eq(6).text(text_[4]);
		ul.find('li').eq(7).html(`<img src=".${imgs[4].url}"><img src=".${imgs[5].url}">`);
		ul.find('li').eq(8).text(text_[5]);
	},
	/**
	 * 正则匹配换行,分割为数组
	 */
	txtReplace: function(txt){
		let _text = txt.replace(/[\r\n]/g,"//").split('//');
		return _text;
	},
	/**
	 * 排序
	 * @param {Object} data		传入的数据
	 * @param {Number} num		排序方式 1升序，2降序
	 */
	sortNumber: function(data, num){
		let dataInfo = data,
			n = num;
		function s(a, b){
			if(n == 2){
				return b.id - a.id;
			}
			return a.id - b.id;
		}
		let arr = dataInfo.sort(s);
		return arr;
	},
	/**
	 * 时间戳转换为年月日
	 * @param {Number} num
	 */
	timeYear: function(num){
		let myDate = new Date(Number(num) * 1000),
			y = myDate.getFullYear(),
			m = myDate.getMonth() + 1,
			d = myDate.getDate(),
			arr = [y,m,d];
		return arr;
	}
};