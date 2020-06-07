window.CONFIG || (window.CONFIG={});

const desiginwidth = 750;
let nickname = window.CONFIG.nickname || "";
let _width = window.innerWidth
let _height = window.innerHeight ;



export {
	desiginwidth,
	nickname,
	_width,
	_height,
}

export let setConfig = (key, value) => {
	module.exports[key] = value;
	window.CONFIG[key] = value;
}

export let getConfig = (key) => {
	return module.exports[key];
}