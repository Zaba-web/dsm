import { ipcRenderer } from 'electron';
import { renderData, renderCoreLoading } from "./scripts/InfoRenderer.js";


let systemInfomration = require("systeminformation");
let fileSystem = require("fs");

window.onload = ()=>{

    let config = JSON.parse(fileSystem.readFileSync(__dirname+"\\config.json"));
    let style = document.getElementsByTagName('style')[0];
    style.innerHTML = `*,*::after,*::before{color:${config.color} !important;border-color:${config.color} !important;} .load-value{background:${config.color} !important;}`;

    let mainContainer = document.getElementById("main-wrapper");
    ipcRenderer.send("adjust-window-size",{width:mainContainer.offsetWidth, height:mainContainer.offsetHeight});

    ipcRenderer.send("get-displays-count");

    ipcRenderer.on("display-count", function(e,arg){
        console.log(arg);
    });

    // setInterval(()=>{
    //     ipcRenderer.send("set-window-position",null);
    // },10000);



    systemInfomration.cpu().then(cpuData => renderData(cpuData,"cpu-sysinfo static"));
    
    setInterval(()=>{
        systemInfomration.currentLoad().then(coreLoading => renderCoreLoading(coreLoading));
    },500);
    
}
