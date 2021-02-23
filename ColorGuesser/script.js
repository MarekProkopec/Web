var colortabs, currentcolor, selected, animation = false;

function init(){
    colortabs = Array.from(document.getElementsByClassName('color'));
    createcolors();
}

function createcolors(){
    currentcolor = getRandomColor();

    colortabs.forEach(element => {
        color = getRandomColor();

        while (color == currentcolor){
            color = getRandomColor();
        }

        element.style.backgroundColor = color;
    });

    selected = colortabs[Math.floor(Math.random()*colortabs.length)]
    selected.style.backgroundColor = currentcolor;

    document.getElementById('colorvalue').innerHTML = currentcolor.toUpperCase();
}

function clicked(el){
    if(!animation){
        if(el == selected){
            answeranimation('correct');
        }else{
            answeranimation('wrong');
        }
    }
}

function answeranimation(answer){
    animation = true;
    let display = document.getElementById(answer)
    display.style.display = 'flex';
    setTimeout(() => {
        display.style.display = 'none';
        createcolors();
        animation = false;
    }, 2500);
}

function getRandomColor(){
    return `rgb(${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)})`;
}