var circle = true;

function main(){
    circle = Math.random() < 0.5;
    setup();
}

function move(target){
    if(target.innerHTML == ""){
        if(circle){
            target.innerHTML = '<i class="far fa-circle" aria-hidden="true"></i>';
        }else{
            target.innerHTML = '<i class="far fa-times" aria-hidden="true"></i>';
        }
        target.setAttribute("onclick", '');
        circle = !circle;        
        // check();
        if (circle){document.getElementById("player").innerHTML = "O"}
        else{document.getElementById("player").innerHTML = "X"}

        if (check() != undefined){end()}
    }
}

function check(){
    if (rowcheck()!= false){return rowcheck()};
    if (columncheck()!= false){return columncheck()};
    if (crosscheck()!= false){return crosscheck()};
    if (allcheck()!= false){return allcheck()};
}

function rowcheck(){
    squares= document.getElementsByClassName("square");
    for (i = 0; i < 3; i++) {
        var y = i*3;
        if(squares[y].innerHTML == squares[y+1].innerHTML && squares[y+1].innerHTML == squares[y+2].innerHTML && squares[y].innerHTML != ""){
            return squares[y].innerHTML;
        }
    }
    return false;
}
function columncheck(){
    squares= document.getElementsByClassName("square");
    for (i = 0; i < 3; i++) {
        if(squares[i].innerHTML == squares[i+3].innerHTML && squares[i+3].innerHTML == squares[i+6].innerHTML && squares[i].innerHTML != ""){
            return squares[i].innerHTML;
        }
    }
    return false;
}
function crosscheck(){
    if(squares[0].innerHTML == squares[4].innerHTML && squares[4].innerHTML == squares[8].innerHTML && squares[0].innerHTML != ""){
        return squares[4].innerHTML;
    }
    if(squares[2].innerHTML == squares[4].innerHTML && squares[4].innerHTML == squares[6].innerHTML && squares[0].innerHTML != ""){
        return squares[4].innerHTML;
    }
    return false;
}
function allcheck(){
    var squares= document.getElementsByClassName("square");
    for (let index = 0; index < squares.length; index++) {
        const item = squares[index];
        var msg = ""
        // if(item.innerHTML != ""){
        //     console.log(item.innerHTML);
        // }else{
        //     console.log("empty");
        // }
        if (item.innerHTML == ""){return false;}
    }
    return "Nobody";
}

function setup(){
    if (circle){document.getElementById("player").innerHTML = "O"}
    else{document.getElementById("player").innerHTML = "X"}
    
    squares = document.getElementsByClassName("square");
    for (let i = 0; i < squares.length; i++) {
        const item = squares[i];
        item.setAttribute("onclick", 'move(event.target);');
    }
}

function end(){
    var winner = check();
    var rescreen = document.getElementById("restart");
    if (winner.includes("circle")){document.getElementById("winmsg").innerHTML = "O WON!";}
    else if (winner.includes("times")){document.getElementById("winmsg").innerHTML = "X WON!";}
    else{document.getElementById("winmsg").innerHTML = "NOBODY WON!";}
    rescreen.style.display = "flex";
}