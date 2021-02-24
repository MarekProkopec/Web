var json = '';
var sentence = ''
var sentarr = []
var prevletters = -1;
var currentletter = 0;

function getword(){
    
}

function init(){
    document.getElementById('input').value = '';
    fetch('sentenceoutput.json')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            json = data['sentences'];
            getsentence();
        })
}

function getsentence(){
    sentence = json[Math.floor(Math.random()*json.length)];
    sentarr = sentence.split("");
    let inh1 = document.getElementById('text');

    for (let i = 0; i < sentarr.length; i++) {
        const element = sentarr[i];
        inh1.innerHTML += `<span class="s${i}">${element}</span>`;
    }
}

function inchanged(){
    let inp = document.getElementById('input');
    let currentletter = prevletters + inp.value.length;

    if(currentletter+1 == sentence.length){
        wordend();
    }

    let curlet = document.querySelector(`#text .s${currentletter}`)
    curlet.classList.remove('wrong');
    curlet.classList.remove('correct');

    if(curlet.innerHTML == inp.value.slice(-1)){
        curlet.classList.add('correct')
    }else{        
        curlet.classList.add('wrong')
    }

    if(inp.value.endsWith(' ')){
        if(wrongcheck()){
            console.log('good');
            prevletters = currentletter;
            inp.value = '';
        }
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

function wordend(){
    alert('end');
}