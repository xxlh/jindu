
import {desiginwidth, setConfig} from "./config"



class winContainer{
	constructor(){
		this.ratio = desiginwidth / document.documentElement.clientWidth;
	}

	getHeight() {
		return document.documentElement.clientHeight * this.ratio;
	}
}
export default winContainer;