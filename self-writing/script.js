var json = undefined;

var speed = 50;
var time = 0;
var ele;

function getJSON(){
    fetch('/text.json')
  .then((response) => {
    return response.json()
  })
  .then((data) => {
    // Work with JSON data here
    json=data;
    main();
  })
  .catch((err) => {
    // Do something for an error here
    alert("No json file found")
  })
}

function main(){
  setTimeout(() => {    
    write(json);
  }, 500);
}

function write(array, parent){
  if (time == 0){
    ele = document.createElement('div')
    ele.classList.add('container');
    document.body.appendChild(ele);
    time++;
    for (let e = 0; e < array['elements'].length; e++) {
      write(array['elements'][e], document.body);        
    }
    }

  else{    
    let item;
    //create element
    if(array["type"] != undefined){
      item = document.createElement(array["type"]);
    }
    //set element class
    if(array["class"] != undefined){
      item.classList.add(array["class"]);
    }
    //set text
    if(array["text"] != undefined){
      for (let e = 0; e < array["text"].length; e++) {
        const text = array["text"][e];
        //write tags
        if(array["type"] == "h5" || text.startsWith("<") || text.startsWith("&")){
          setTimeout(() => {            
            item.innerHTML += text;
          }, time + speed/2);
          time += speed/2;
        }
        //write text with timeout
        else{
          for (let j = 0; j < text.length; j++) {
            const letter = text[j];
            setTimeout(() => {
              item.innerHTML += letter;
            }, speed+time);
            time+=speed;
          }
        }
      }
    }

    //add element to site
    if(array['parent']!=undefined){
      for (let u = 0; u < array['parent']; u++) {
        parent=parent.parentElement;          
      }
      parent.appendChild(item);
    }else{
      ele.appendChild(item);
    }

    //create next element
    if(array['elements'] != undefined){
      for (let e = 0; e < array['elements'].length; e++) {
        write(array['elements'][e], item);        
      }
    }    
  }
}