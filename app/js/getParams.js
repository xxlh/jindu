export default() =>{
	var target;
	target = location.href;
	
	var i = target.indexOf('?');
	if(i == -1) return {};
	var u = target.substring(i + 1), p = new RegExp('([_a-z][_a-z0-9]*)=([^&]*)','ig'), m, r = {};
	while((m = p.exec(u)) != null){
		r[m[1]] = m[2];
	}
	return r;
}