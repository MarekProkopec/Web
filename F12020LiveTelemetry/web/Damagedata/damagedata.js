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
    //tyres
    let frontleftdamage = document.getElementById('front-left-damage');
    let frontrightdamage = document.getElementById('front-right-damage');
    let rearleftdamage = document.getElementById('rear-left-damage');
    let rearrightdamage = document.getElementById('rear-right-damage');

    changestyle("Tyre_FL_Damage", frontleftdamage, telemetry);
    changestyle("Tyre_FR_Damage", frontrightdamage, telemetry);
    changestyle("Tyre_RL_Damage", rearleftdamage, telemetry);
    changestyle("Tyre_RR_Damage", rearrightdamage, telemetry);
    
    //front wing
    let frontLeftWingDamage = document.getElementById('front-left-wing-damage');
    let frontrightWingdamage = document.getElementById('front-right-wing-damage');
    
    changestyle("Front_Left_Wing_Damage", frontLeftWingDamage, telemetry);
    changestyle("Front_Right_Wing_Damage", frontrightWingdamage, telemetry);

    //rear wing
    let rearWingdamage = document.getElementById('rear-wing-damage');
    changestyle("Rear_Wing_Damage", rearWingdamage, telemetry);
    
    //engine
    let engineDamage = document.getElementById('engine-damage');
    let gearBoxDamage = document.getElementById('gearbox-damage');
    changestyle("Engine_Damage", engineDamage, telemetry);
    changestyle("Gearbox_Damage", gearBoxDamage, telemetry);
}


function changestyle(jsonargument, element, telemetry){
    let damage = telemetry[jsonargument]
    element.innerHTML = damage;
    element.style.backgroundColor = `rgb(${damage*2.25},${225 - damage*2.25},0)`;

}