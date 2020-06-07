import $ from "jquery";
import imagesLoaded from "imagesloaded"
import Waterfall from "@lib/waterfall"
import * as Ajax from "@lib/Ajax"
import  swal from "sweetalert"



let $waterfall = null;

let search = "";

let init = () => {
	console.log(search);
	if($waterfall) $waterfall.waterfall("reset");
	let documentWidth = document.documentElement.clientWidth;
	$waterfall = $(".page03 .qingshu-list ul").waterfall({
		container: ".page03 .qingshu-list",
		itemCls: 'qingshu',
		colWidth: 0.38* documentWidth ,  
		gutterWidth: 0.08* documentWidth ,
		gutterHeight: 0.04* documentWidth ,
		// checkImagesLoaded: true,
		// maxPage: 20,
		// isAutoPrefill: false,
		fitWidth: false,
		align: 'left',
		minCol: 2,
		maxCol: 2,
		fitWidth: false,
		bufferPixel:-100,
		path: function(page) {
			$('.vote-btn').unbind();
			$('.qingshu .pic').unbind();
			return 'https://www.appmn.cn/project2020/xiamenqingshu/show_list.php?p=' + page + '&k=' + search;
		},
		callbacks:{
			loadingFinished: function($loading, isBeyondMaxPage) {
				vote();
				bigPic();
			},
			dataLoaded: function(data,$loading){
				if(data.data.list && !data.data.list.length) {
					$loading.fadeOut();
					$waterfall.waterfall('pause')
				};
			},
		}
	});

	$(".page03 .search input").blur(e => {
		if (search == $(".page03 .search input").val()) return;
		search = $(".page03 .search input").val();
		$waterfall.waterfall('reset');
	})
	$(".page03 .search input").keypress(e => {
		if(e.keyCode != 13) return;
		if (search == $(".page03 .search input").val()) return;
		search = $(".page03 .search input").val();
		$waterfall.waterfall('reset');
	})

	
}

let setsearch = (s) => {
	search = s;
	console.log(search);
	// $waterfall.waterfall('reset');
	// console.log($waterfall);
};


function vote(){
	$('.vote-btn').click(function(){
		let _that = $(this);
		let data = {};
		data.tid = $(this).attr("data-id");
		let voteState = $(this).attr("data-state");
		// if(voteState){
			Ajax.post("https://www.appmn.cn/project2020/xiamenqingshu/vote.php",data, (json) => {
				if (json.err == 0) { 
					var voteNum = parseInt(_that.parents("li:eq(0)").children("div:eq(1)").children("p:eq(1)").find("i:eq(0)").html());
					_that.parents("li:eq(0)").children("div:eq(1)").children("p:eq(1)").find("i:eq(0)").html(voteNum+1);
					_that.css("background-image",`url(${require('../images/love2.png')})`);
					swal(json.msg);
				}else{
					swal(json.msg);
				}
			})
		// }else{
		// 	swal('您今天已投票过了，明天再来吧！')
		// }	
	})
}
function bigPic(){
	$('.qingshu .pic').click(function(){
		$(".pic-box .content img").attr("src",$(this).attr("data-img"));
		$('.pic-box').show();
	})
}



 
export default {
	$waterfall,
	init,
	search,
	setsearch
}