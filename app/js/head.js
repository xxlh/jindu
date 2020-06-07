import * as Ajax from "@lib/Ajax"
import AjaxData from "@lib/AjaxData"
import {desiginwidth, setConfig} from "./config"
import preloader from "preloader"
import ready from "document-ready"
import loading from './loading'
import VConsole from 'vconsole';

// var vConsole = new VConsole();

// 清除html缓存
if(window.location.search.indexOf('newclearCache=')==-1){
	location.href = location.href + (location.href.indexOf('?')!=-1?'&':'?') + 'newclearCache='+Math.random();
}



// REM布局


var windowResize =function() {
	var devicePixelRatio = window.devicePixelRatio;
	var documentWidth = document.documentElement.clientWidth;
	let rem = documentWidth / desiginwidth * 100;
	document.documentElement.style.fontSize=rem +"px";
	//处理特殊机型
	console.log("rem=======" + rem);
	if(window.getComputedStyle(document.getElementsByTagName("html")[0]).fontSize) {
		var size = window.getComputedStyle(document.getElementsByTagName("html")[0]).fontSize.split('p')[0];
		console.log("size=======" + size);
		if(size*1.2 < rem ) {
			document.documentElement.style.fontSize = 1.25 * rem + 'px';
			console.log("fontSize=======" + window.getComputedStyle(document.getElementsByTagName("html")[0]).fontSize)
		}
	};
}
windowResize();
window.onresize=windowResize;



let Data = new AjaxData('https://www.appmn.cn/project2020/quanzhoujindu/');
	window._initInfo = Data.get('browse.php');
	 ready(async ()=>{
		let initInfo = await window._initInfo;
		loader.load();
	})

// (function () {
// 	windowResize();
// })



// 资源预加载，更新进度条
loading.init();
let loader = preloader({
	xhrImages: false
});
loader.add(require('../images/page01.jpg'));
loader.add(require('../images/page03.jpg'));


loader.add(require('../images/upload1.png'));
loader.add(require('../images/upload.png'));
loader.add(require('../images/truntable.png'));
loader.add(require('../images/to_question_btn.png'));
loader.add(require('../images/to_poster_btn.png'));
loader.add(require('../images/title.png'));
loader.add(require('../images/start_btn.png'));
loader.add(require('../images/reupload.png'));
loader.add(require('../images/poster_btn.png'));
loader.add(require('../images/no3.png'));
loader.add(require('../images/no2.png'));
loader.add(require('../images/no1.png'));
loader.add(require('../images/no.png'));
loader.add(require('../images/infor_btn.png'));
loader.add(require('../images/infor.png'));
loader.add(require('../images/go_lottery.png'));
loader.add(require('../images/detail_btn.png'));
loader.add(require('../images/detail.png'));
loader.add(require('../images/again_btn.png'));

loader.on('progress',function(p) {
	loading.update(Math.floor(p*100), -1);
});
loader.on('complete',function(c) {
	ready(()=>{
		loading.complete();
	})
});


