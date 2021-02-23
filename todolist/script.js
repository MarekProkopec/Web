var list =[], localdata;

// event listener for enter key input
// gets local data
function init(){
    document.getElementById('input').addEventListener("keydown", function(event){
        if(event.keyCode == 13){
            add();
        }
    }); 

    localdata = getlocal();    
    localdata.forEach(element => {
        createlistitem(element);
    });
}

//create list item
function add(){
    let text = document.getElementById("input").value;
    createlistitem(text);
}

//create item to be added to list with passed text
function createlistitem(text){
    if(text==""){
        return;
    }
    document.getElementById("input").value = "";
    
    div = document.createElement("div");
    div.className="list-item";
    div.setAttribute("clicked", 'false');

    h1 = document.createElement('h1');
    h1.className = "list-item-text"
    h1.innerHTML = text;
    
    btn = document.createElement('button');
    btn.className="list-item-tick";
    btn.innerHTML = '<i class="far fa-check-circle"></i>'
    btn.setAttribute("onclick", 'itemTick();');

    var main = document.getElementById('main');
    main.appendChild(div); 
    div.appendChild(h1);
    div.appendChild(btn);
    // document.body.appendChild(div); 
    list.push(div);

    index();
    savelocal();
}

//remove item from list
function remove(){
    let wasselected = false;
    while (true){
        wasselected = false;
        for (let i = 0; i < list.length; i++) {
            const item = list[i];
            if (item.getAttribute('clicked') == "true"){
                wasselected = true;
                item.remove();
                list.splice(i, 1);
                break;
            }
        }
        if(!wasselected){
            break;
        };
    }
    savelocal();
}

//set correct index for each item in list
function index(){
    for (let i = 0; i < list.length; i++) {
        const item = list[i];
        item.setAttribute("index", i);
    }
}

//changes tick to signalize, it is ticked
function itemTick(){
    let div =  event.target.parentElement.parentElement;
    let clicked = div.getAttribute('clicked');

    if (clicked == 'true'){        
        div.setAttribute('clicked', 'false');
        event.target.style.color = "black";
    }else{
        div.setAttribute('clicked', 'true');
        event.target.style.color = "green";
    }
}


//save data to local storage
function savelocal(){
    localStorage.clear();
    let data = '';
    list.forEach(element => {
        data += element.querySelector("h1").innerHTML+":"
    });
    if(data.endsWith(":")){
        data = data.slice(0, -1);
    }
    localStorage.setItem('todolistdata', data);    
}

//get data from local storage
function getlocal(){
    return localStorage.getItem('todolistdata').split(":");
}