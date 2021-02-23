//repeat requesting data from json
function init(){
    setInterval(() => {        
        try {
            fetch('/telemetry.json')
                .then(response => response.json())
                .then(data => rewrite(data));
        } catch{
            console.log('errorr reading file');
        }
    }, 33);
}

//set grapgic and text to match json file
function rewrite(telemetry){
    enginetemp(telemetry);
    tyretemp(telemetry);
    braketemp(telemetry);
}



function enginetemp(telemetry){
    let engine = document.getElementById("engine-temp");
    let enginetemp = telemetry['Engine_Temperature'];
    engine.innerHTML = enginetemp;

    if (enginetemp < 120) {
        engine.style.backgroundColor = "rgb(0, 255, 0)";
        return;
    }
    if(enginetemp > 150){
        engine.style.backgroundColor = "rgb(255, 0, 0)";
        return;
    }
    let green = (125 - enginetemp) * 255/5;
    if(enginetemp > 125){
        green = 0;
    }

    let red = 100 + (enginetemp - 120) * 155/30;
    engine.style.backgroundColor = `rgb(${red}, ${green}, 0)`;
}

function tyretemp(telemetry){
    let outmin = 88;
    let outmax = 100;
    let inmin = 85;
    let inmax = 115;
    if(telemetry['Actual_Tyre_Compound'].includes('Intermidiate')){
        outmin = 69;
        outmax = 85;
        inmin = 65;
        inmax = 87;
    }
    if(telemetry['Actual_Tyre_Compound'].includes('Wet')){
        outmin = 59;
        outmax = 75;
        inmin = 55;
        inmax = 85;
    }
    if(telemetry['Actual_Tyre_Compound'].includes('Soft')){
        outmin = 90;
        outmax = 102;
        inmin = 85;
        inmax = 115;
    }



}

//change data for each brake
function braketemp(telemetry){
    braketempchange(telemetry, "rear-left-temp-brakes", 0)
    braketempchange(telemetry, "rear-right-temp-brakes", 1)
    braketempchange(telemetry, "front-left-temp-brakes", 2)
    braketempchange(telemetry, "front-right-temp-brakes", 3)
}


function braketempchange(telemetry, tyre, tyreindex){
    let brake = document.getElementById(tyre);
    let braketemp = telemetry['Brakes_Temperature'][tyreindex];
    brake.innerHTML = braketemp;

    let min = 650;
    let max = 1100;
    
    let green = 255;
    let red = 0;

    if(braketemp < min){
        brake.parentElement.style.backgroundColor = `rgb(0, 255, 0)`;
        return;
    }
    if(braketemp > max){
        brake.parentElement.style.backgroundColor = `rgb(255, 0, 0)`;
        return;
    }


    if(braketemp > min){
        red = (braketemp - min) / (max-min)*255;
    }
    if(braketemp > min && braketemp < min+100){
        green = 255 - (braktemp - min)*2.25
    }
    if(braketemp > min+100){
        green = 0;
    }
    brake.parentElement.style.backgroundColor = `rgb(${red}, ${green}, 0)`;
}