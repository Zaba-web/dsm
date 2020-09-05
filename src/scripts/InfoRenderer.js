export function renderData(data, query){
    let elementsToHandle = document.getElementsByClassName(query);
    for(let i = 0; i < elementsToHandle.length; i++){
        let element = elementsToHandle[i];
        let neededProperty = element.dataset.value;
        
        let prefix = element.dataset.prefix != undefined ? element.dataset.prefix : "";
        let suffix = element.dataset.suffix != undefined ? element.dataset.suffix : "";

        element.innerHTML = prefix + data[neededProperty] + suffix;
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
            coreContainer.innerHTML = coreContainer.innerHTML + `<div class="core"><h3 class='core_number'>${i+1}:</h3><div class="load"><div class="load-value" style='width:${loadPercent}%' id="core-number-${i}"></div></div><small id='core-number-${i}-loading-precent' class='core-load-percent'>${loadPercent}</small></div>`;
        }else{
            let core = document.getElementById(`core-number-${i}`);
            core.style.width = loadPercent+"%";
            let coreLoadText = document.getElementById(`core-number-${i}-loading-precent`);
            coreLoadText.innerHTML = loadPercent;
        }
    }
}