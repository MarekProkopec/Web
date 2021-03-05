var json = '';
var sentence = ''
var sentarr = []
var prevletters = -1;
var currentletter = 0;
var starttime = 0;
var wronglist = [];

function getword(){
    
}

function init(){
    document.getElementById('input').value = '';
    fetch('sentenceoutput.json')
        .then(response => response.json())
        .then(data => {
            json = data['sentences'];
            getsentence();
        })
}

function getsentence(){
    document.getElementById('input').value = '';    

    sentence = json[Math.floor(Math.random()*json.length)];
    sentarr = sentence.split("");
    let inh1 = document.getElementById('text');
    
    wronglist = new Array(sentarr.length).fill(false);
    inh1.innerHTML = '';
    prevletters = -1;

    for (let i = 0; i < sentarr.length; i++) {
        const element = sentarr[i];
        inh1.innerHTML += `<span class="s${i}">${element}</span>`;
    }
}

function inchanged(){
    let inp = document.getElementById('input');
    let currentletter = prevletters + inp.value.length;
    
    if (currentletter == 0){
        starttime = Date.now();
    }
    correctclass(currentletter);
    if(inp.value == ""){        
        return
    }
    
    let curlet = document.querySelector(`#text .s${currentletter}`)
    
    if(curlet.innerHTML == inp.value.slice(-1)){
        curlet.classList.add('correct');
    }else{
        curlet.classList.add('wrong');
        wronglist[currentletter] = true;
    }
    
    if(inp.value.endsWith(' ')){
        if(wrongcheck()){
            prevletters = currentletter;
            inp.value = '';
        }
    }
    if(currentletter+1 == sentence.length  && wrongcheck()){
        finished();
    }
}

function wrongcheck(){
    var spans = Array.from(document.querySelectorAll(`#text span`));
    let temp = true;
    spans.forEach(element => {
        if(element.classList.contains('wrong')){
            temp = false;
            return false;
        }
    });
    if(temp){
        return true;
    }
}

function correctclass(currentletter){
    var spans = Array.from(document.querySelectorAll(`#text span`));
    for (let i = currentletter; i < spans.length; i++) {
        const item = spans[i];
        item.classList.remove('wrong');
        item.classList.remove('correct');
    }
}

function finished(){
    let time = (Date.now() - starttime)/60000;
    let sentlength = sentarr.length;

    document.querySelector('main').classList.add('fadeout');
    let endscreen = document.getElementById('endscreen');
    endscreen.style.display = 'grid';

    let wrongcount = 0;
    wronglist.forEach(item => {
        if(item == true){
            wrongcount ++;
        }
    });

    let accreport = document.getElementById('accuracyinfo');
    accreport.innerHTML = `${100 - (Math.floor(wronglist.length/wrongcount*10)/10)}%`;
    
    let speedreport = document.getElementById('speedinfo');
    speedreport.innerHTML = `${Math.floor(((sentlength/5)/time)*10)/10} WPM`;
}

function restart(){
    getsentence;
    document.getElementById('endscreen').style.display ='none';
    document.querySelector('main').classList.remove('fadeout');
    getsentence();
}