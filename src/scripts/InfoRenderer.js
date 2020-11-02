const byteInGB = 1073741824;

export function renderData(data, query){
    let elementsToHandle = document.getElementsByClassName(query);
    for(let i = 0; i < elementsToHandle.length; i++){
        let element = elementsToHandle[i];
        let neededProperty = element.dataset.value;

        let prefix = element.dataset.prefix != undefined ? element.dataset.prefix : "";
        let suffix = element.dataset.suffix != undefined ? element.dataset.suffix : "";
        let value = data[neededProperty];

        if(element.dataset.sublevel != undefined){
            element.innerHTML = prefix + value[0][element.dataset.sublevel] + suffix;
        }else{
            element.innerHTML = prefix + value + suffix;
        }

    }
}

export function renderCoreLoading(data){
    let firstTime;
    let coresLoad = data.cpus;
    let coreContainer = document.getElementById("cores-container");
    
    if(coreContainer.innerHTML == ""){
        firstTime = true;
    }else{
        firstTime = false;
    }

    for(let i = 0; i < coresLoad.length; i++){
        let loadPercent = coresLoad[i].load.toFixed(2);
        if(firstTime){
            coreContainer.innerHTML = coreContainer.innerHTML + `<div class="core"><h3 class='core_number'>${i+1}:</h3><div class="load" style='width:160px'><div class="load-value" style='width:${loadPercent}%' id="core-number-${i}"></div></div><div class='core-load-percent' style='width:27px'><small id='core-number-${i}-loading-precent'>${loadPercent}</small></div></div>`;
        }else{
            let core = document.getElementById(`core-number-${i}`);
            core.style.width = loadPercent+"%";
            let coreLoadText = document.getElementById(`core-number-${i}-loading-precent`);
            coreLoadText.innerHTML = loadPercent;
        }
    }
}

export function renderDisplayCount(count, ipc){
    if(count > 1){
        let displayCountContainer = document.getElementById("display-selecter");
        for(let i = 0; i < count; i++){
            displayCountContainer.innerHTML = displayCountContainer.innerHTML + `<span class='display h3-like subtitle' title='Pin to the ${i+1} display' data-number='${i}'>[D${i+1}]</span>`;
        }
        let displayElements = document.getElementsByClassName("display");
        for (let i = 0; i < displayElements.length; i++) {
            displayElements[i].addEventListener('click', function(e){
                ipc.send("change-display",e.target.dataset.number);
            });
        }
    }
}

export function handleMemoryData(memData, query){
    let formatedMemoryData = {};

    let size = 0;

    for(let i = 0; i<memData.length; i++){
        size+= memData[i].size;
    }

    size = size / byteInGB;

    formatedMemoryData.size = size;
    formatedMemoryData.type = memData[0].type;
    formatedMemoryData.voltageConfigured = memData[0].voltageConfigured;
    formatedMemoryData.clockSpeed = memData[0].clockSpeed;

    if(formatedMemoryData.type == "Unknown")
        formatedMemoryData.type = "DDR";

    renderData(formatedMemoryData, query);
}

export function getMemoryUsage(data, query){
    let totalMemory = data.total / byteInGB;
    let usedMemory = data.used / byteInGB;
    let freeMemory = totalMemory - usedMemory;

    let textMemoryData = {
        free: freeMemory.toFixed(2),
        total: Math.ceil(totalMemory)
    }

    let usagePercent = (usedMemory*100)/totalMemory;
    let ramUsageElement = document.getElementById("ram-usage");
    ramUsageElement.style.width = Math.floor(usagePercent)+"%";

    renderData(textMemoryData, query);
}
