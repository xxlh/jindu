import $ from "jquery";
import axios from "axios"
import rotateCashout from "@lib/jQueryRotate.2.2"
import  swal from "sweetalert"
import * as Ajax from "@lib/Ajax"

let turnTable = () => {
	$("#rotate_go").rotate({ bind:{click:function(){

		if($('#rotate_bg').data('rotating') == 1){
			return false;
		}
		rotateFunc(0,150,'nishizhuma',"false");
		axios({
			withCredentials: true ,
			url: 'https://www.appmn.cn/project2020/quanzhoujindu/lottery.php',
			method: 'post',
		}).then((json)=>{
			if(json.data.err==0){
				let prizeLevel = json.data.data.prize_level; 
				let prize_i = json.data.data.prize_i; 
				let isComplete = json.data.data.isInfo;
				let name = json.data.data.prize_name;
				if(name=="警察卡通熊"){
					rotateFunc(1,330,name,isComplete,prizeLevel);
				}else if(name=="玻璃水杯"){
					rotateFunc(2,90,name,isComplete,prizeLevel);
				}else if(name=="折叠双肩包"){
					rotateFunc(3,270,name,isComplete,prizeLevel);
				}else if(name=="经典三折雨伞"){
					rotateFunc(4,30,name,isComplete,prizeLevel);
				}else if(name=="大白小夜灯"){
					rotateFunc(5,210,name,isComplete,prizeLevel);
				}else{
					rotateFunc(0,150,name,isComplete,prizeLevel);
				}

		
			}else{
				alert(json.data.msg);
				return false;
			}
		})
	}}
	});	

	$(".again-btn").click(()=>{
		$(".prize-box").hide();
	})

	$(".infor-box .submit").click(()=>{
		if($(".name").val() == ""){
	        swal("请输入姓名");
	        return false;
	    }
	    if($(".tel").val() == ""){
	        swal("请输入电话号码");
	        return false;
	    }
	    
	    var regMobile= /^0?1[3|4|5|7|8][0-9]\d{8}$/;
	    var mflag = regMobile.test($(".tel").val());
	    if (!mflag) {
	        swal("号码有误！");
	        return false;
	    }
        
	    var data = {};
	    data.username = $(".name").val();
		data.userphone =parseInt( $(".tel").val());
		Ajax.post('https://www.appmn.cn/project2020/quanzhoujindu/signup.php',data,function(json){
			if(json.err == 0){
				$(".infor-box").hide();
				swal("提交成功~");
			}else{
				swal(json.msg)
			}
		})
	})
}

function rotateFunc(awards,angle,text,isComplete,prizeLevel){ 
	$('#rotate_bg').stopRotate();
	$('#rotate_bg').data('rotating', 1);
	$("#rotate_bg").rotate({
		angle:0, 
		duration: 5000, 
		animateTo: angle+1440,
		callback:function(){
			$(`.prize-box .winner .pic`).hide();
			if(awards>0){
				$(".prize-box .loser").hide();
				$(".prize-box .winner").show();
				if(isComplete == 1){
					$(".infor-btn").hide();
					$(".again-btn").show();
				}else{
					$(".again-btn").hide();
					$(".infor-btn").show();
				}
				$(`.prize-box .p${parseInt(prizeLevel)}`).show();
			}else if(awards==0){
				$(".prize-box .loser").show();
				$(".prize-box .winner").hide();
				
			}
			$(".prize-box").show();
			$('#rotate_bg').removeData('rotating')
		}
	}); 
};
export default {
	turnTable
}