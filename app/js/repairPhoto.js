import EXIF from 'exif-js';
import VConsole from 'vconsole';
// var vConsole = new VConsole();


var getPixelRatio = function(context) {  
	var backingStore = context.backingStorePixelRatio ||  
		context.webkitBackingStorePixelRatio ||  
		context.mozBackingStorePixelRatio ||  
		context.msBackingStorePixelRatio ||  
		context.oBackingStorePixelRatio ||  
		context.backingStorePixelRatio || 1;  
  
	return (window.devicePixelRatio || 1) / backingStore;  
};

class repairPhonto{}
function isNeedFixPhoto(file){
	return new Promise(function (resolve,reject) {
		EXIF.getData(file, function() {
			
			var Orientation = EXIF.getTag(this, 'Orientation');
			if(Orientation && Orientation != 1){
				//图片角度不正确
				console.log("图片角度不正确");
				let str= navigator.userAgent.toLowerCase(); 
				let ver=str.match(/cpu iphone os (.*?) like mac os/);
				if(ver && versionStringCompare(ver[1].replace(/_/g,"."),'13.4') >= 0  ){
					console.log("ios13.4以上，不需处理直接上传："+ver[1].replace(/_/g,"."));
					resolve({flag:false,Orientation:Orientation});
				}else{
					console.log("ios13.4以下，图片角度不正确："+ver[1].replace(/_/g,"."));
					resolve({flag:true,Orientation:Orientation});
				}
			}else{
				//不需处理直接上传
				console.log("不需处理直接上传：");
				resolve({flag:false,Orientation:Orientation})
			}
		});
	})
};
function file2Base64(file) {
	return new Promise(function (resolve, reject) {
	  let reader = new FileReader();
	  reader.readAsDataURL(file);
	  reader.onload = function (ev) {
		resolve(ev.target.result);
	  }
	})
};

// 压缩处理选中的方法
function best4Photo(resultBase64,Orientation,num,w){
	return new Promise(function (resolve, reject) {
	  let image = new Image();
	  image.src = resultBase64;
	//   console.log("resultBase64===="+resultBase64);
		let canvas = document.createElement("canvas");
		let ctx = canvas.getContext('2d');
		let ratio = getPixelRatio(ctx);
	  image.onload = function () {
		
		
		let imgWidth = w*ratio,
			  imgHeight = w*this.height/this.width*ratio; //获取图片宽高
		canvas.width = imgWidth;
		canvas.height = imgHeight;
		ctx.fillStyle  = '#fff';
		ctx.fillRect(0,0,canvas.width,canvas.height);
		console.log("canvas.width,canvas.height===="+canvas.width+"===="+canvas.height);
		console.log("Orientation===="+Orientation);
		if(Orientation && Orientation != 1){
		  switch(Orientation){
			case 6:     // 旋转90度
			  canvas.width = imgHeight;
			  canvas.height = imgWidth;
			  ctx.fillRect(0,0,canvas.width,canvas.height);
			  ctx.rotate(Math.PI / 2);
			  ctx.drawImage(this, 0, -imgHeight, imgWidth, imgHeight);
			  break;
			case 3:// 旋转180度
			  ctx.rotate(Math.PI);
			  ctx.drawImage(this, -imgWidth, -imgHeight, imgWidth, imgHeight);
			  break;
			case 8:     // 旋转-90度
			  canvas.width = imgHeight;
			  canvas.height = imgWidth;
			  ctx.fillRect(0,0,canvas.width,canvas.height);
			  ctx.rotate(3 * Math.PI / 2);
			  ctx.drawImage(this, -imgWidth, 0, imgWidth, imgHeight);
			  break;
		  }
		}else{
		  ctx.drawImage(this, 0, 0, imgWidth, imgHeight);
		  console.log("pic====");
		}
		setTimeout(() => {
			const result = canvas.toDataURL("image/jpeg",0.7);
			console.log("pic===="+result);
			resolve(result);
		}, 1500);
	  }
	})
};

export default  async(file,num,w)=>{
	const result=await isNeedFixPhoto(file);
	
	const resultBase64=await file2Base64(file);
	const Orientation = result.Orientation;
	const numb = num || 1;
	if(result.flag){  // 处理旋转
		return await best4Photo(resultBase64,Orientation,numb,w)
	}else{            // 不处理旋转
		return await best4Photo(resultBase64,1,numb,w)
	}
};


function versionStringCompare (preVersion='', lastVersion=''){
    var sources = preVersion.split('.');
    var dests = lastVersion.split('.');
    var maxL = Math.max(sources.length, dests.length);
    var result = 0;
    for (let i = 0; i < maxL; i++) {  
        let preValue = sources.length>i ? sources[i]:0;
        let preNum = isNaN(Number(preValue)) ? preValue.charCodeAt() : Number(preValue);
        let lastValue = dests.length>i ? dests[i]:0;
        let lastNum =  isNaN(Number(lastValue)) ? lastValue.charCodeAt() : Number(lastValue);
        if (preNum < lastNum) {
            result = -1;
            break;
        } else if (preNum > lastNum) { 
            result = 1;
            break;
        }
    }
    return result;
}