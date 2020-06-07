import wxShare from "@lib/wxShare"
let wxCont = {};
wxCont.shareLink = "http://n.sinaimg.cn/fj/lequxia/index6.html?v=89"; 
wxCont.sharePic = "http://n.sinaimg.cn/fj/lequxia/img/wxShare.jpg?9"; 
wxCont.shareTit = "爱心接力 助50位大凉山孩子实现心愿"; 
wxCont.shareDesc = "爱心接力，为大凉山的孩子们点亮心愿！";
wxCont.sharePyq = "爱心接力，为大凉山的孩子们点亮心愿！";
let wxshare =new wxShare();

// 个人信息页面微信分享
export default(inforId,name) => {
	wxCont.shareLink += ('#inforId=' + inforId);
	wxCont.shareDesc = '我为大凉山的'+ name +'点亮了心愿，一起爱心助力吧';
	wxCont.sharePyq = '我为大凉山的'+ name +'点亮了心愿，一起爱心助力吧';
	wxshare.setInfo(wxCont);
};