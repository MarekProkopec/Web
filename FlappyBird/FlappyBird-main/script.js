var player, speed = 3, score = 0;;
const gap = 20;
var spawninterval = 4500;
var movespeed = 1;
var end = false;

/*places player in correct position
sets user input
creates obstacles in given interval
player movement*/
function init(){
    player = document.getElementById('player');
    player.style.top = `${document.body.offsetHeight/2 - document.body.offsetHeight/20}px`;
    player.style.left = "10%";

    document.body.onkeydown = function(e){
        if(e.keyCode == 32){
            click();
        }
    };
    document.body.addEventListener('click',click, true); 
    createobstacle();
    createobstaclewithdelay();

    setInterval(() => {
        player.style.top = `${Number(player.style.top.replace("px", "")) - speed}px`;
        speed -= .03;

        checktopbottom();
        player.style.transform = `rotateZ(${-speed*10    }deg)`
    }, 10);
}

function createobstaclewithdelay(){
    setTimeout(() => {
        createobstacle();
        spawninterval-=50;

        createobstaclewithdelay();
    }, spawninterval);
}

/*everything obstacle should do
creates top and bottom part of obstacle
places them randomly
removes obstacle when has reached end of screen
takes care of collision with player*/
function createobstacle(){
    let up = document.createElement("img");
    let down = document.createElement("img");

    up.classList.add('pipe');
    down.classList.add('pipe');
    up.classList.add('unselectable');
    down.classList.add('unselectable');

    up.src="images/FlappyBirdPipe.png"
    down.src="images/FlappyBirdPipe.png"

    up.style.right = `-150px`;
    down.style.right = `-150px`;

    down.style.bottom = 0;

    let r = Math.floor(Math.random()*(100-gap));
    up.style.height = `${r}%`;
    let downheight = 100 - (r + gap);
    down.style.height = `${downheight}%`;

    down.style.transform = "rotateX(180deg)";

    document.body.appendChild(up);
    document.body.appendChild(down);

    let pointadded = false;

    let interval = setInterval(() => {
        up.style.right = `${movespeed + Number(up.style.right.replace("px", ""))}px`;
        down.style.right = `${movespeed + Number(down.style.right.replace("px", ""))}px`;
        if(Number(up.style.right.replace("px", "")) > window.innerWidth + up.offsetWidth){
            clearInterval(interval);
            up.remove();
            down.remove();            
        }
        
        if(!end){
            let pipeleft = window.innerWidth - Number(up.style.right.replace("px", "")) - window.innerWidth/10;
            let piperight = pipeleft + window.innerHeight/10;
            let gaptop = (r/100)*window.innerHeight;
            let gapbottom = gaptop + (gap*(window.innerHeight/100));
    
            let playertop = Number(player.style.top.replace("px", ""));
            let playerdown = playertop + (window.innerHeight/20);
            let playerleft = window.innerWidth/10;
            let playerright = playerleft + window.innerHeight/20;
            
    
            if(playerleft > piperight && !pointadded){
                score++;
                document.getElementById('score').innerHTML = score;
                pointadded = true;
            }
    
            if(!(playertop > gaptop && playerdown < gapbottom)){ 
                if(!(playerright < pipeleft) && !(playerleft > piperight)){
                    lost();
                }
            }
        }

    }, 10);
}

//check if player hasn't flown out of playfield
function checktopbottom(){
    let playertop = Number(player.style.top.replace("px", ""))
    if(playertop < 0-(window.innerHeight/20) || playertop > window.innerHeight){
        lost();
    }
}

//player lost
function lost(){
    end = true;
    document.getElementById('score').style.display = 'none';
    document.getElementById('player').style.display = 'none';
    document.getElementById('endscore').innerHTML = score;    
    document.getElementById('lost').style.display = 'flex';    
}

function playagain(){
    location.reload();
}

function click(){
    speed += screen.height/600;
}