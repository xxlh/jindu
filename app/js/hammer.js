import Hammer from "hammerjs"

var reqAnimationFrame = (function () {
	return window[Hammer.prefixed(window, 'requestAnimationFrame')] || function (callback) {
		window.setTimeout(callback, 1000 / 60);
	};
})();

class Hammer{
   constructor(o){
		   this.containerSelector = o.containerId;
		
		// init
		this.el = document.querySelector(this.containerSelector);
		this.START_X = Math.round((window.innerWidth - this.el.offsetWidth) / 2);
		this.START_Y = Math.round((window.innerHeight - this.el.offsetHeight) / 2);

		this.ticking = false;
		this.transform;   //图像效果
		this.timer;
		this.initAngle = 0;  //旋转角度
		this.initScale = 1;  //放大倍数

		this.mc = new Hammer.Manager(this.el);   //用管理器  可以同时触发旋转 拖拽  移动

		/**
		ev.srcEvent.type  touchstart  touchend touchmove
		ev.deltaX  手势移动位移变量  
		*/
		this.mc.add(new Hammer.Pan({ threshold: 0, pointers: 0 }));  
		this.mc.add(new Hammer.Rotate({ threshold: 0 })).recognizeWith(this.mc.get('pan'));
		this.mc.add(new Hammer.Pinch({ threshold: 0 })).recognizeWith([this.mc.get('pan'), this.mc.get('rotate')]);
		//结束时做一些处理
		this.mc.on("hammer.input", function(ev) {
			if(ev.isFinal) {
			// console.log(START_X+"  "+transform.translate.x  +"   "+ev.deltaX);
			this.START_X = this.transform.translate.x ;
			this.START_Y = this.transform.translate.y ;
			}
		});
		this.mc.on("panstart panmove", onPan);
		this.mc.on("rotatestart rotatemove rotateend", onRotate);
		this.mc.on("pinchstart pinchmove", onPinch);
   }
   init(){

   }
   resetElement() {
	this.el.className = 'animate';
	 this.transform = {
		translate: { x: START_X, y: START_Y },
		scale: 1,
		angle: 0,
		rx: 0,
		ry: 0,
		rz: 0
	};
	requestElementUpdate();
	}
}


// var el = document.querySelector(".qrcode2");
// var START_X = Math.round((window.innerWidth - this.el.offsetWidth) / 2);
// var START_Y = Math.round((window.innerHeight - this.el.offsetHeight) / 2);


// var ticking = false;
// var transform;   //图像效果
// var timer;
// var initAngle = 0;  //旋转角度
// var initScale = 1;  //放大倍数

// var mc = new Hammer.Manager(this.el);   //用管理器  可以同时触发旋转 拖拽  移动

// /**
// ev.srcEvent.type  touchstart  touchend touchmove
// ev.deltaX  手势移动位移变量  
// */
// mc.add(new Hammer.Pan({ threshold: 0, pointers: 0 }));  
// mc.add(new Hammer.Rotate({ threshold: 0 })).recognizeWith(mc.get('pan'));
// mc.add(new Hammer.Pinch({ threshold: 0 })).recognizeWith([mc.get('pan'), mc.get('rotate')]);
// //结束时做一些处理
// mc.on("hammer.input", function(ev) {
// 	if(ev.isFinal) {
// 	console.log(START_X+"  "+transform.translate.x  +"   "+ev.deltaX);
// 	START_X = transform.translate.x ;
// 	START_Y = transform.translate.y ;
// 	}
// });
// mc.on("panstart panmove", onPan);
// mc.on("rotatestart rotatemove rotateend", onRotate);
// mc.on("pinchstart pinchmove", onPinch);
/**
第二次进入拖拽时  delta位移重置
移动时 初始位置startxy不动。delta增加
*/
function onPan(ev){
	if(!ev.isFinal) {
	 el.className = '';
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
	el.className = '';
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
			el.className = '';
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
	el.className = 'animate';
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

