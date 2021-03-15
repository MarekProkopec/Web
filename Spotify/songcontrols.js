var playing = false;
var playpercent = 0;
var songsjson = undefined;
var songelements = [];
var currentaudio = undefined;
var audioduration = 0;
var volume = 20;
var prevsong = undefined;
var backwardsplayed = 0;
var lmb = false;
var repeat = false;

//called on load of page
function init(){
    getsongsdata();
    setaudiobar();
    lmb = false;

    setInterval(() => {
        updatetimeline();
    }, 50);
}

//user clicked pause button
function playbuttonclicked(){
    if(currentaudio != undefined){
        playing = !playing;
        playbuttonstate();
    }
}

//changes pause button state based on if song is playing or not
function playbuttonstate(){
    playbutton = document.querySelector('.controls > .controls-top > .play')
    if(playing){
        currentaudio.play();
        playbutton.innerHTML = `<i class="fas fa-pause"></i>`
    }else{
        currentaudio.pause();
        playbutton.innerHTML = `<i class="fas fa-play"></i>`
    }
}

//called every 50ms, takes care of all updating elements
function updatetimeline(){
    if(currentaudio != undefined){
        if (playing != !currentaudio.paused){
            playing = !currentaudio.paused;
            playbuttonstate();
        }
        let playtime = currentaudio.currentTime;
        playpercent = playtime/(audioduration/100);

        let dot = document.querySelector('div.controls-timeline div.timeline .timeindicator');
        let timeline = document.querySelector('div.controls-timeline div.timeline span');
        let currenttimeel = document.getElementById('songplaytime');

        currentaudio.volume = volume/100;
        
        dot.style.left = `${playpercent}%`;
        timeline.style.width = `${playpercent}%`;
        currenttimeel.innerHTML = `${Math.floor(playtime/60)}:${zfill(Math.floor(playtime%60),2)}`;
    }
}

//extracts data from json file and adds them to page
function getsongsdata(){
    fetch('/songdata.json')
        .then(response => response.json())
        .then(data => {
            songsjson = data['songs'];
            addallsongs();
        });

}

//adds all songs located in songsjson
function addallsongs(){
    for (let i = 0; i < songsjson.length; i++) {
        const song = songsjson[i];
        addsong(song['author'], song['songname'], song['imgpath'], song['audiopath'])
    }
    if(songelements.length < 30){
        addallsongs();
    }
}

//adds song DOM element
function addsong(author, songname, imgpath, soundpath){
    let path = document.querySelector('.songs-section > .songs-section-flex');
    
    let songdiv = document.createElement('div');
    songdiv.classList.add('song');
    
    let songimg = document.createElement('img');
    songimg.setAttribute('src', imgpath);
    songdiv.appendChild(songimg);
    
    let textdiv = document.createElement('div');
    textdiv.classList.add('song-text');
    songdiv.appendChild(textdiv);
    
    let authorname = document.createElement('h1');
    authorname.innerHTML = author;
    textdiv.appendChild(authorname);

    let songnametext = document.createElement('h2');
    songnametext.innerHTML = songname;
    textdiv.appendChild(songnametext);

    let audio = document.createElement('audio');
    audio.setAttribute('src', soundpath);
    songdiv.appendChild(audio);

    path.appendChild(songdiv);

    songdiv.addEventListener('click', function(){setnewsong(this)});
    songelements.push(songdiv);
}

//change currently playing song
function setnewsong(songel){
    if(currentaudio != undefined){
        prevsong = currentaudio.parentElement;
        currentaudio.currentTime = 0;
        currentaudio.pause();
    }
    currentaudio = songel.querySelector('audio');
    audioduration = currentaudio.duration;

    currentaudio.addEventListener("ended", function() 
    {
        if(!repeat){
            picknewrandomsong();
        }else{
            setnewsong(currentaudio.parentElement);
        }
    });
    
    let nowplay = document.querySelector('footer .currently-playing');
    let footerimage = nowplay.querySelector('img')
    footerimage.setAttribute('src', songel.querySelector('img').getAttribute('src'));

    let songname = nowplay.querySelector('h1');
    songname.innerHTML = songel.querySelector('h1').innerHTML;

    let authorname = nowplay.querySelector('h2');
    authorname.innerHTML = songel.querySelector('h2').innerHTML;

    let songduration = document.getElementById('songduration');
    songduration.innerHTML = `${Math.floor(audioduration/60)}:${zfill(Math.floor(audioduration%60),2)}`
    currentaudio.play();
    playing = true;
    document.querySelector('.controls-top > .play').innerHTML = `<i class="fas fa-pause"></i>`;
}

//changed time of song based on user input on timeline
function timelineclicked(event, element){
    if(currentaudio != undefined){
        playpercent = event.layerX/(element.clientWidth/100);    
        currentaudio.currentTime = (audioduration/100) * playpercent
    }
}

//chagnes volume based on user input on volume slider
function volumechanged(event, element){
    volume = event.layerX/(element.clientWidth/100);    
    setaudiobar();
}

//sets correct width and position os volume inidcator
function setaudiobar(){
    document.querySelector('.right-controls > .volume > span').style.width = `${volume}%`;
    document.querySelector('.right-controls > .volume > .timeindicator').style.left = `${volume}%`;
}

function picknewrandomsong(){
    let newsong;
    do{
        newsong = songelements[Math.floor(Math.random()*songelements.length)];
    }while(currentaudio == newsong.querySelector('audio'));
    setnewsong(newsong);
}

function skipbuttonclicked(){
    picknewrandomsong();
}

function prevbuttonclicked(){
    if (prevsong != undefined){
        setnewsong(prevsong);
    }
}

function mouseup(event){
    if(event.button == 0){
        lmb = false;
    }
}

function mousedown(event){
    if(event.button == 0){
        lmb = true;
    }
}

function repeatclicked(){
    let repeatbut = document.querySelector('.controls > .controls-top .repeat');
    repeat = !repeat;
    if(repeat){
        repeatbut.style.color = "rgba(29,185,84,255)";
    }else{
        repeatbut.style.color = '';
    }
}

//adds leading zeros to passed number, returns string
function zfill(num, places){
    ans = String(num)
    while(ans.length < places){
        ans = "0"+ans;
    }
    return ans;
}