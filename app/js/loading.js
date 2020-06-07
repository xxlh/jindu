import {desiginwidth} from "./config"
import ready from "document-ready"

export let init = () => {
    ready(()=>{
        let windowResizeOrigin = window.onresize;
        let windowResize =function() {
            windowResizeOrigin();
            let documentWidth = document.documentElement.clientWidth;
        };
        windowResize();
        window.onresize=windowResize;
    })
}

export let complete = () => {
    ready(()=>{
        document.getElementById("load").style.display = 'none';
        document.getElementById("cont").style.display = 'block';
        document.getElementById("musicicon").style.display = 'block';
    })
}

export let update = (p, delay = 1) => {
    ready(()=>{
        document.getElementById("perc_txt").innerHTML = p + "%";
        // document.getElementById("loadprocess").style = `width:${p*0.0424}rem`;
        if (p >= 100 && delay > 0) {
            setTimeout(() => {
                complete();
            }, delay);
        }
    })
}

export default {
    init,
    complete,
    update
}