
//start
function main(){
    setInterval(() => {
        fireRocket();
    }, 1000);

    //set text to current year
    document.getElementById('message').innerHTML = `Happy new Year ${new Date().getFullYear()}`
}


//start rocket
function fireRocket(){
    //create element
    let div = document.createElement('div');
    div.classList.add('rocket');

    //css settings of rocket
    div.style.backgroundColor = '#' + Math.random().toString(16).substr(-6);
    div.style.left = Math.floor(Math.random()*window.innerWidth-40)+40 + "px";
    div.style.top = `${window.innerHeight + div.style.height}px`;
    //max height, which rocket can fly to
    let maxheight = Math.floor(Math.random()*(window.innerHeight-500))+40;
    
    //movement of rocket
    var interval = setInterval(() => {
        //position and speed of rocket
        let top = Number(getComputedStyle(div).top.replace('px', ""));
        let speed = (top - maxheight+20)/100;
        div.style.top = `${top-speed}px`; 

        //if rocket reaches top -> explode
        if (maxheight >= top){
            clearInterval(interval);
            //set color of text
            document.getElementById('message').style.color = div.style.backgroundColor;
            explode(div);              
        }
    }, 5);

    //add rocket to body
    document.body.appendChild(div);
}


//particles are made with div with top border, with increasing div height,
//the radius extends
function explode(div){   
    //time to live for particle
    let ttl = (Math.floor(Math.random()*15)/10)+1.5;
    //number of particles
    let particles = Math.floor(Math.random()*5)+6;

    //randomize rotation of particles    
    let randomizer = Math.floor(Math.random()*360);
    //create particles
    for (let i = 0; i < particles; i++) {
        //create particle and apply css
        let particle = document.createElement('div');
        particle.classList.add('particle')
        
        particle.style.left = div.style.left;
        particle.style.top = div.style.top;
        
        
        particle.style.height = "20px";
        particle.style.borderTop= `solid 20px ${div.style.backgroundColor}`

        particle.style.transform = `rotateZ(${360/particles * i + 90 + randomizer}deg) translateY(-100%)`

        document.body.appendChild(particle);
        let height = 20;

        //particle movement
        let particleinterval = setInterval(() => {
            //height = distance from origin
            height += ttl;
            particle.style.height = `${height}px`;
            particle.style.opacity = ttl;
            ttl *= .99;

            //remove particle
            if (ttl < .01){
                clearInterval(particleinterval);
                particle.remove();
            }
        }, 10);
    }
    //delete rocket    
    div.remove();    
}