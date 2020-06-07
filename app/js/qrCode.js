import QRCode from 'qrcode';

export default(domId,qingshuId) =>{
	let url = location.origin + location.pathname;
	QRCode.toDataURL(url + (url.indexOf('?')!=-1?'&':'?') + "from=qrcode&tid=" + qingshuId)
	.then(url => {
	document.getElementById(`${domId}`).src = url;
	console.log(url);
	})
	.catch(err => {
	  console.error(err)
	})
}