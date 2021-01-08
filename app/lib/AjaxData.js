
import * as Ajax from "@lib/Ajax"
import { weiboCallbackURL, wechatCallbackURL } from "@lib/config"

class AjaxData {
	constructor(endpoint) {
		this.endpoint = endpoint;
	};

	get(interfaceName) {
		let url = this.endpoint + interfaceName;
		let currentURL = encodeURIComponent(window.location.href);

		return new Promise(function (resolve, reject) {
			Ajax.post(url, function (json) {
				console.log("getItem===="+localStorage.getItem("token"))
				if (json.err == 0) {
					resolve(json.data)
				} else if (json.err == 2001) {
					var callbackurl=encodeURIComponent(window.location.href);
					window.location.replace("https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx4b3447b9d54801f4&redirect_uri="+encodeURIComponent('https://www.appmn.cn/public/weixin/oauth2_xmtch_index.php?redirect_url='+callbackurl)+"&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect");
				} else if (json.err == 3001) {
					var callbackurl=encodeURIComponent(window.location.href);
					window.location.replace("https://api.weibo.com/oauth2/authorize?client_id=585049065&redirect_uri="+encodeURIComponent('https://www.appmn.cn/public/weibo/oauth2_wlsx_index.php?redirect_url='+callbackurl)+"&response_type=code&state=123&display=123");
				}  else if (json.err == 5001) {
					var callbackurl=encodeURIComponent(window.location.href);
					window.location.replace("https://aweme.snssdk.com/oauth/authorize/v2/?client_key=awx3g2jpc58e79uq&redirect_uri="+encodeURIComponent('https://www.appmn.cn/public/douyin/oauth2_xlxm_index.php?redirect_url='+callbackurl)+"&scope=user_info&response_type=code&state=123");
				} else {
					alert(json.msg);
					reject(json.msg)
				}
			})
		})


	}
}
export default  AjaxData;
