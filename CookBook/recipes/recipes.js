var recipes = [];
var courses = [];
var sortby = '';

//first function to get called on page load
function setup(){
    getJSON();
}

//gets called after json file is loaded
function main(){
    CreateRecipes();
    getCourses();
}

//extracts data from json file with recipes
function getJSON(){
    fetch('/recipes.json')
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            // Work with JSON data here
            recipes=data['recipes'];
            main();
        })
        .catch((err) => {
            alert("Error")
        })
}

//creates html elements from json file
function CreateRecipes(){
    recipes.forEach(item => {
        //create box for recipe
        let box = document.createElement('div');
        box.classList.add('recipe');
        box.setAttribute('name', item['name']);
        box.setAttribute('rating', item['rating']);
        box.setAttribute('cooktime', item['cooktime']);
        box.setAttribute('kcal', item['kcal']);
        box.setAttribute('views', item['views']);
        box.setAttribute('course', item['course']);
        
        //recipe image
        let image = document.createElement('img');
        image.setAttribute('src', item['image']);
        box.appendChild(image);

        //recipe name
        let name = document.createElement('a');
        name.classList.add('name');
        name.setAttribute('href', item['link']);
        name.innerHTML = item['name'];
        box.appendChild(name);

        //description box
        let descript = document.createElement('div');
        descript.classList.add('recipe-grid');
        box.appendChild(descript)

        //rating description
        let ele = document.createElement('h2');
        ele.innerHTML = `<i class="fas fa-star"></i> Rating:`;
        descript.appendChild(ele);       
        //rating value
        ele = document.createElement('h2');
        ele.innerHTML = item['rating'];
        ele.classList.add('recipe-rating');
        descript.appendChild(ele)

        //cooktime description
        ele = document.createElement('h2');
        ele.innerHTML = `<i class="far fa-clock"></i> Cooktime (min):`;
        descript.appendChild(ele);      
        //cooktime value
        ele = document.createElement('h2');
        ele.innerHTML = item['cooktime'];
        ele.classList.add('recipe-cooktime');
        descript.appendChild(ele);

        //kcal description
        ele = document.createElement('h2');
        ele.innerHTML = `<i class="fas fa-fire"></i> Kcal:`;
        descript.appendChild(ele);       
        //kcal value
        ele = document.createElement('h2');
        ele.innerHTML = item['kcal'];
        ele.classList.add('recipe-kcal');
        descript.appendChild(ele);

        //views description
        ele = document.createElement('h2');
        ele.innerHTML = `<i class="fas fa-user-alt"></i></i> Views`;
        descript.appendChild(ele);       
        //views value
        ele = document.createElement('h2');
        ele.innerHTML = item['views'];
        ele.classList.add('recipe-views');
        descript.appendChild(ele);

        //course description
        ele = document.createElement('h2');
        ele.innerHTML = `<i class="fas fa-hamburger"></i> Course`;
        descript.appendChild(ele);       
        //course value
        ele = document.createElement('h2');
        ele.innerHTML = item['course'];
        ele.classList.add('recipe-course');
        descript.appendChild(ele);

        document.querySelector('main').appendChild(box);
    });
}

//user changed selected courses
function getCourses(){
    courses = [];
    Array.from(document.getElementsByClassName('course')).forEach(item => {
        if(item.checked){
            courses.push(item.value);
        }
    })
    checkcourse();
}

//user changed sorting order
function sortchanged(item){
    //if the selected item wansn't selected before
    if (!item.classList.contains('selected')){
        Array.from(document.getElementsByClassName('sorting')).forEach(element => {
            element.classList.remove('selected');
            element.classList.remove('selected-reverse');
        });
        item.classList.add('selected');
    }
    //if selected element was selected before
    else{
        if (item.classList.contains('selected-reverse')){
            item.classList.remove('selected-reverse');
        }else{
            item.classList.add('selected-reverse');
        }
    }
    sortby = item;

    sortrecipes();
}

//sort recipes by given rule
function sortrecipes(){
    let sorter = sortby.innerHTML.replace('<h1>', "").replace('</h1>', "").trim();
    let reverse = sortby.classList.contains('selected-reverse');

    let workarray = Array.from(document.getElementsByClassName('recipe'));
    let index = 1;

    if(reverse){
        index = workarray.length +1;
    }

    //sorting
    while (workarray.length > 0){
        //setting up needed values
        let deleteelement = undefined;
        let minvalue = Infinity;
        if(sorter == "A-Z"){minvalue = "zzzzzzzzzz"}

        //sorting itself
        workarray.forEach(item => {
            //sorting by nubmers
            if(sorter != "A-Z"){
                if(Number(item.getAttribute(sorter)) < minvalue){
                    minvalue = item.getAttribute(sorter);
                    deleteelement = item;
                }
            }
            //sorting by alphabet
            else{
                if(item.getAttribute('name') < minvalue){
                    minvalue = item.getAttribute('name');
                    deleteelement = item; 
                }   
            }
        })

        //setting order
        deleteelement.style.order = index;
        //changing index
        if(!reverse){
            index++;
        }else{
            index--;
        }
        
        //remove item from temporary array
        workarray.splice(workarray.indexOf(deleteelement), 1);
    }        
}

//deletes recipes, that do not match selcted courses
function checkcourse(){
    Array.from(document.getElementsByClassName('recipe')).forEach(item => {
        if(!courses.includes(item.getAttribute('course').toLowerCase())){
            item.style.display = 'none';
        }else{
            item.style.display = 'flex';
        }
    });
}