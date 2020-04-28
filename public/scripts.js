var results=[]; /*object of array of objects(events)*/

/*making arrays to store values*/
var array_Artists = [];
var array_Genre = [];
var array_Date = [];
var array_Venue = [];
/*creating table element*/
var table = document.createElement("table");



function loadData(city_to_search) {
    document.getElementById("current").innerHTML = "Music events in " + city_to_search + ":"; 
    var api_url =  "https://app.ticketmaster.com/discovery/v2/events.json?classificationName=music&city=";
    var api_key = "&apikey=IRf1McTms041EqaYu7WMVAtq6JuW4WQd";
    var url = api_url + city_to_search + api_key;

    request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.onreadystatechange= function(){
        if(request.readyState == 4 && request.status == 200){
            var result = request.response;
            data = JSON.parse(result);
            /*data for names of events are an located in an array of objects called events. each object has key "name" with value artist name*/
            if(typeof data["_embedded"] == 'undefined'){
                alert('Please enter a valid city');
            } else{
                event_array = data["_embedded"]["events"];
                /*populating arrays*/
                event_array.forEach(function(item){
                    array_Artists.push(item["name"]);
                    array_Genre.push(item["classifications"]["0"]["genre"]["name"]);
                    array_Venue.push(item["_embedded"]["venues"]["0"]["name"]);
                    array_Date.push(item["dates"]["start"]["localDate"]);
                    })

                 /*creating JSON objects*/

                for (var i = 0; i<array_Artists.length; i++) {
                    temp = {"artist":array_Artists[i], "genre":array_Genre[i],"venue":array_Venue[i], "date":array_Date[i]};

                    results.push(temp);
                }
                /*console.log(results);*/
            }


        }else if (request.readyState == 4 && request.status!= 200){
            document.getElementById("data").innerHTML="Error";
        }
    }
    request.send();
    setTimeout(function(){
        build_table();
        genre_dropdown();
    }, 1000);
}




/* styling for content inside the table */
function tableContent()
{
    var dataTable = document.getElementById("table");
    dataTable.style.fontFamily="Tahoma, Geneva, sans-serif";
   /* dataTable.style.backgroundColor="#e6e6e6";*/
    dataTable.style.fontSize="medium";
    // dataTable.style.bordercolor="red";
    
}



/*building table*/
function build_table(){
    var storedData = results;
    var cols = [];
    /*pushing all keys to an array to make headers*/
    for(var i=0; i<storedData.length; i++){
        for(var k in storedData[i]){
            if (cols.indexOf(k) === -1){
                cols.push(k);
            }
        }
    }

    /*creating table row element of table*/
    var tr = table.insertRow(-1);

    for(var i = 0; i<cols.length; i++){
        /*creating table headers*/
        var theader = document.createElement("th");
        theader.style.fontFamily="Rockwell";
        theader.style.fontSize = "0.75cm";
        theader.style.color = "#5F9EA0"
        theader.style.textAlign = "left";
        theader.style.padding = "5px 15px 0px 10px";
        theader.style.borderStyle = "solid";
        theader.innerHTML = cols[i];

        /*appending keys(column name) to table row*/
        tr.appendChild(theader);

    }

    var x = [];
    /*adding information to the table*/
    for (var i = 0; i<storedData.length; i++){
        //create a new row//
        trow = table.insertRow(-1);
        for (var j = 0; j<cols.length; j++){
            var cell = trow.insertCell(-1);
            /*inserting cells at particular place*/
            cell.innerHTML=storedData[i][cols[j]];
            cell.style.padding = "7px 15px 7px 10px";
            cell.style.borderStyle = "solid";
            cell.style.borderColor = "#b3b3b3";
        }
    }
    
    //adding table to document//
    var tempTable = document.getElementById("table");
    tempTable.innerHTML = "";
    tempTable.appendChild(table); 

}

/*building dropdown list for filtering by genre*/
function genre_dropdown(){
    /*getting distinct genres*/ 
    let unique_genres = array_Genre.filter((item, i, ar) => ar.indexOf(item) === i);
    
    /*making dropdown*/   
    var select = document.getElementById("select"); 
    for(var i=0; i<unique_genres.length; i++){
        var option = document.createElement("OPTION"), 
            text = document.createTextNode(unique_genres[i]); 
        option.appendChild(text); 
        select.insertBefore(option, select.lastChild); 
    } 
}

function filter_genre(){
    /*get option chosen*/ 
    selectElement = document.querySelector('#select'); 
    selected = selectElement.value; 
    console.log(selected); 
    tr = table.getElementsByTagName("tr"); 

    
    /*loop through all table rows and hide those that don't match query*/ 
    for(i=0; i<tr.length; i++){
        td = tr[i].getElementsByTagName("td")[1]; 
        
        /*if all is selected, show everything*/ 
        if(selected=="All"){
            tr[i].style.display="";    
        }else if (td){
            txtValue=td.textContent || td.innerText; 
            if (txtValue.indexOf(selected)>-1){
                tr[i].style.display = ""; 
            }else{
                tr[i].style.display = "none"; 
            }
        }
    }
    

}
