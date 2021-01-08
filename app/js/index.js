import "../css/swiper.min.css";
import "../css/public.css";
import "../css/index.css";
import $ from "jquery";
import Swiper from "swiper";
import  swal from "sweetalert"
import * as Ajax from "@lib/Ajax"
import axios from "axios"
import getParams from "./getParams"
import wxShare from "@lib/wxShare"
import * as browser from  'judgebrowser'

import App from "./html2Canvas"
import repairPhoto from "./repairPhoto";
import qrCode from "./qrCode";
import rotateCashout from "@lib/jQueryRotate.2.2"
import turnTable from "./turnTable"
// import VConsole from 'vconsole';
// var vConsole = new VConsole();

// init Swiper
(function($) {
    "use strict";
    $.fn.swiper = function (params) {
        var firstInstance;
        this.each(function (i) {
            var that = $(this);
            var s = new Swiper(that[0], params);
            if (!i) firstInstance = s;
            that.data('swiper', s);
        });
        return firstInstance;
	};
	
})($)

$.ajaxSetup({
	crossDomain: true,
	xhrFields: {
		withCredentials: true
	}
});

let app =new App();
let param = getParams();
let tabsSwiper ="";
var wx = {};

//微信分享文案设置
wx.shareLink =location.origin + location.pathname; 
wx.sharePic = "http://n.sinaimg.cn/fj/jindu/img/wxshare.png?9"; 
wx.shareDesc = `“健康人生 绿色无毒”，禁毒知识问答，通关赢好礼！`;
wx.sharePyq = `“健康人生 绿色无毒”，禁毒知识问答，通关赢好礼！`;
wx.shareTit = "626国际禁毒日|泉州鲤城禁毒知识有奖答题";
wx.success = function(){
	let data = {};
	data.chancetype = 'weixinshare';
	Ajax.post('https://www.appmn.cn/project2020/quanzhoujindu/getchance.php',data,function(json){})
}  
let wxshare =new wxShare();
wxshare.setInfo(wx);
let tid = 0;


import Hammer from "hammerjs"
var reqAnimationFrame = (function () {
	return window[Hammer.prefixed(window, 'requestAnimationFrame')] || function (callback) {
		window.setTimeout(callback, 1000 / 60);
	};
})();

var nextAnimation = function(carSelector, c, callback) {
	$(carSelector).addClass(c);
	$(carSelector).unbind("webkitAnimationEnd").bind("webkitAnimationEnd", callback);
	$(carSelector).unbind("animationend").bind("animationend", callback);
};

$(function(){
	if (param.from == "question") {
		$(".page01").hide();
		$(".page03").show();
	}
	
	var ticking = false;
	var transform;   //图像效果
	var timer;
	var initAngle = 0;  //旋转角度
	var initScale = 1;  //放大倍数

	var el = document.querySelector("#imgid");
	var START_X = Math.round((window.innerWidth - el.width) / 2);
	var START_Y = Math.round((window.innerHeight - el.height) / 2);

	var mc = new Hammer.Manager(el);   //用管理器  可以同时触发旋转 拖拽  移动
	mc.add(new Hammer.Pan({ threshold: 0, pointers: 0 }));  
	mc.add(new Hammer.Rotate({ threshold: 0 })).recognizeWith(mc.get('pan'));
	mc.add(new Hammer.Pinch({ threshold: 0 })).recognizeWith([mc.get('pan'), mc.get('rotate')]);
		
	//结束时做一些处理
	mc.on("hammer.input", function(ev) {
		if(ev.isFinal) {
		console.log(START_X+"  "+transform.translate.x  +"   "+ev.deltaX);
		START_X = transform.translate.x ;
		START_Y = transform.translate.y ;
		}
		
	});
	mc.on("panstart panmove", onPan);
	mc.on("rotatestart rotatemove rotateend", onRotate);
	mc.on("pinchstart pinchmove", onPinch);
	/**
	第二次进入拖拽时  delta位移重置
	移动时 初始位置startxy不动。delta增加
	*/
	function onPan(ev){
		if(!ev.isFinal) {
		//  el.className = '';
			console.log(START_X   +"  "+  START_Y +" |  "+ev.deltaX   +"  "+  ev.deltaY);		
				transform.translate = {
					x: START_X + ev.deltaX,
					y: START_Y + ev.deltaY
				};
				requestElementUpdate();
		}	   
	}

	function onPinch(ev){
		if(ev.type == 'pinchstart') {
			initScale = transform.scale || 1;
		}
		// el.className = '';
		transform.scale = initScale * ev.scale;
		requestElementUpdate();	
	}

	//旋转相关
	var  preAngle =0 ;
	var  tempAngleFlag=0;
	var  deltaAngle = 0;	
	var  startRotateAngle = 0;

	function onRotate(ev) {
		//点下第二个触控点时触发
		if(ev.type == 'rotatestart') {			    
				startRotateAngle =  ev.rotation ;			 
				tempAngleFlag = 0 ;
		}	
		if(ev.type == 'rotatemove'){
			if(tempAngleFlag == 0){
				preAngle = startRotateAngle;
				tempAngleFlag ++;
			}else{				
				deltaAngle = ev.rotation - preAngle;
				// el.className = '';
				transform.rz = 1;  //非0  垂直xy轴
				transform.angle =initAngle + deltaAngle;									
				requestElementUpdate();	
			}
		}
		//旋转结束  记录当前图片角度	
		if(ev.type =='rotateend'){
			initAngle = transform.angle;
		}	
	}
	function updateElementTransform() {
		var value = [
			'translate3d(' + transform.translate.x + 'px, ' + transform.translate.y + 'px, 0)',
			'scale(' + transform.scale + ', ' + transform.scale + ')',
			'rotate3d('+ transform.rx +','+ transform.ry +','+ transform.rz +','+  transform.angle + 'deg)'
		];

		value = value.join(" ");
		el.style.webkitTransform = value;  /*为Chrome/Safari*/
		el.style.mozTransform = value; /*为Firefox*/
		el.style.transform = value; /*IE Opera?*/
		ticking = false;
	}
	function requestElementUpdate() {
		if(!ticking) {
			reqAnimationFrame(updateElementTransform);
			ticking = true;
		}
	}
	/**
	初始化设置
	*/
	function resetElement() {
		// el.className = 'animate';
		transform = {
			translate: { x: START_X, y: START_Y },
			scale: 1,
			angle: 0,
			rx: 0,
			ry: 0,
			rz: 0
		};
		requestElementUpdate();
	}

	getMusic();

	$('#reupload').on('change', function() {
		$(".page02 .btn").hide();
		$(".reupload-btn").show();
		$(".poster").show();
		var file = $(this)[0].files[0];
		if(!file) {//undefined
			return;
		}
		$("#show").empty();
		$("#show").hide();
		$("#save-tip").hide();
		$("#tips p").html("图片上传中~");
		$("#tips").show();
		$("#poster").show();
		$("#reset").hide();
		repairPhoto(file,1,750).then((result)=>{
			$("#imgid").attr("src",result);
			START_X = 0 ;
			START_Y =0;
			resetElement();
			$("#tips").hide();
		});
		
	});

	$('#upload').on('change', async function() {
		let initInfo = await window._initInfo;
		$(".page02  .qs").val("");
		$(".nickname").html(initInfo.nickname);
		$(".page02 .psum").html(`我是第${initInfo.psum}参与`);
		$(".page02").show();
		var file = $(this)[0].files[0];
		if(!file) {//undefined
			return;
		}
		$("#show").empty();
		$("#show").hide();
		$("#tips p").html("图片上传中~");
		$("#tips").show();
		$("#poster").show();
		repairPhoto(file,1,750).then((result)=>{
			$("#imgid").attr("src",result);
			START_X = 0 ;
			START_Y =0;
			resetElement();
			$("#tips").hide();
		});
	});
	
	$(".poster").click(function(){
		$("#tips p").html("海报生成中...");
		$("#tips").show();
		$(".qrcode").show();
		$(".psum").show();
		$(".page02 .btn").hide();
		app.setListener();
		let data = {};
		data.chancetype = 'poster';
		Ajax.post('https://www.appmn.cn/project2020/quanzhoujindu/getchance.php',data,function(json){});
		
	})

	turnTable.turnTable();

	$(".detail_btn").click(function(){
		$(".page04").show();
		nextAnimation(".page04","slideInUp",function(){
			$(".page04").removeClass("slideInUp");
		})
	});
	$(".page04 .close").click(function(){
		nextAnimation(".page04","slideOutDown",function(){
			$(".page04").hide();
			$(".page04").removeClass("slideOutDown");
		})
	});
	
	initSwiper();
	$(".tabs a").on('touchstart mousedown',function(e){
		e.preventDefault()
		$(".tabs .active").removeClass('active');
		$(this).addClass('active');
		tabsSwiper.slideTo($(this).index());
	});
	
	$(".prize-box .again").click(function(){
			$(".prize-box").hide();
	});
	$(".prize-box .infor-btn").click(function(){
		$(".infor-box").show();
		$(".prize-box").hide();
	});

	$(".to-lottery").click(function(){
		$(".page03").show();
	});
	
	$(".to-poster").click(function(){
		$(".page01").hide();
		$(".upload-btn").show();
		$(".poster").show()
		$(".page02").show();
	});
	
	$(".to-qusetion").click(function(){
		window.location.href="https://h5.ebdan.net/ls/SKowesnf";
	});

})

function initSwiper(){
	tabsSwiper = new Swiper('.tabs-swiper',{
		speed:500,
		direction : "horizontal",
		loop : false,
		initialSlide : 0,
		noSwiping : true,
		noSwipingClass : "swiper-no-swiping",
		useCSS3Transforms : true,
		observer: true,//修改swiper自己或子元素时，自动初始化swiper
		observeParents: true,//修改swiper的父元素时，自动初始化swiper
		on:{
			transitionStart: function(){
				$(".tabs .active").removeClass('active');
				$(".tabs a").eq(this.activeIndex).addClass('active');
				if(this.activeIndex==1){
					let html ="" ;
					Ajax.post('https://www.appmn.cn/project2020/quanzhoujindu/signup.php',function(json){
					if(json.err=0){
						if(json.data.list.length==0){
							$(".desc").show();
							return false;
						}
						$(".desc").hide();
						json.data.list.map((item)=>
							html += `<li >
										<div class="list leve">${item.leve}</div>
										<div class="list prize">${item.prizename}一份</div>
									</li>`
							)
						$(".prize-list").append(html);
					}else{
						swal(json.msg)
					}
				})
				}
			},
		}
	});
}


 //用户完成输入时，点击输入完成，收回软键盘的一瞬间，触发此事件--------失去焦点
 window.addEventListener('focusout', function () {
	this.focus = false;
	setTimeout(function () {
		if(this.focus==false){
			window.scrollTo(0,0);
		};
	},30)
});

window.addEventListener('focusin', function (){
	this.focus = true;
});

//点击输入框获得焦点，此时用户开始/正在输入
function getMusic(){
	var audio = document.getElementById("music");
	audio.play();
	document.addEventListener("WeixinJSBridgeReady", function () { 
        audio.play(); 
    }, false); 
	let playOnce = ()=>{
		audio.play();
		document.removeEventListener("touchstart", playOnce);
	}
	document.addEventListener("touchstart", playOnce);
	playCotrol();
}
//点击播放/暂停
function playCotrol(){
	var audio = document.getElementById("music");
	$(".playBtn").click(function(){
		if($(".playBtn").hasClass("playState")){
			$(".playBtn").removeClass("playState");
			$(".playBtn i").removeClass("playMusic");
			audio.pause();
		}else{
			$(".playBtn").addClass("playState");
			$(".playBtn i").addClass("playMusic");
			audio.play();
		}
	})
}