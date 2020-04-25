// const express=require("express");
// var bodyParser=require("body-parser");
//
//
// const MongoClient = require('mongodb').MongoClient;
// var url = "mongodb+srv://andreafoo11:andreafoo@cluster0-blvfe.mongodb.net/test?\
//           retryWrites=true&w=majority";
// var app = express();
// var adr = require('url');
// const path = require('path');
//
//
// //serve the home page
// app.get('/',function(req,res){
//   res.sendFile(path.join(__dirname+'/index.html'));
// });
//
//
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({
//     extended: true
// }));
//
// // app.get('/display-artist-searches', (req, res) => {
// //   MongoClient.connect(url, function(err, db) {
// //       if (err) throw err;
// //       var dbo = db.db("Music_Events");
// //       dbo.collection("Artist_search").find({} , { projection: { _id: 0, Artist: 1 } }).toArray(function(err, result) {
// //         if (err) throw err;
// //         console.log(result);
// //         res.send(result);
// //       });
// //   });
// // });
// //
// //
// // app.get('/display-genre-searches', (req, res) => {
// //   MongoClient.connect(url, function(err, db) {
// //       if (err) throw err;
// //       var dbo = db.db("Music_Events");
// //       dbo.collection("Genre_Search").find({} , { projection: { _id: 0, Genre: 1 } }).toArray(function(err, result) {
// //         if (err) throw err;
// //         console.log(result);
// //         res.send(result);
// //       });
// //   });
// // });
//
// app.get('/display-city-searches', (req, res) => {
//   MongoClient.connect(url, function(err, db) {
//       if (err) throw err;
//       var dbo = db.db("Music_Events");
//       dbo.collection("City_search").find({} , { projection: { _id: 0, City : 1 } }).toArray(function(err, result) {
//         if (err) throw err;
//         console.log(result);
//         res.send(result);
//       });
//   });
// });
//
// app.post('/submit-form', function(req,res){
//     MongoClient.connect(url, function(err, db) {
//         if (err) throw err;
//         var dbo = db.db("Music_Events");
//         // if(req.body.menu == 1) {
//         //     var currobj = { Artist : req.body.search_value };
//         //     dbo.collection("Artist_search").insertOne(currobj, function(err, res) {
//         //       if (err) throw err;
//         //       console.log("updated");
//         //       db.close();
//         //     })
//         // }
//         // else if (req.body.menu == 2) {
//         //   var currobj = { Genre : req.body.search_value };
//         //   dbo.collection("Genre_Search").insertOne(currobj, function(err, res) {
//         //     if (err) throw err;
//         //     console.log("updated");
//         //     db.close();
//         //   })
//         // }
//
//         var currobj = { City : req.body.search_value };
//         dbo.collection("City_Search").insertOne(currobj, function(err, res) {
//           if (err) throw err;
//           console.log("updated");
//           db.close();
//         })
//
//   });
// });
//
//
//
//
// app.listen(process.env.PORT || 3000, process.env.IP || '0.0.0.0' );
// /*-- use AJAX data pattern to send a request to the API, tetreive some data, and display the data
// */

var results=[]; /*object of array of objects(events)*/

    /*making arrays to store values*/
            var array_Artists = [];
            var array_Genre = [];
            var array_Date = [];
            var array_Venue = [];



function loadData() {
    var api_url =  "https://app.ticketmaster.com/discovery/v2/events.json?classificationName=music&city=";
    var api_key = "&apikey=IRf1McTms041EqaYu7WMVAtq6JuW4WQd";
    var url = api_url + getInput() + api_key;

    /*making arrays to store values
            var array_Artists = [];
            var array_Genre = [];
            var array_Date = [];
            var array_Venue = [];
    */

    /*
    var api_url =  "https://app.ticketmaster.com/discovery/v2/events.json?classificationName=music&city=";
    var city = 'new york';
    var api_key = "&apikey=IRf1McTms041EqaYu7WMVAtq6JuW4WQd";
    var url = api_url + city + api_key;
    */


    request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.onreadystatechange= function(){
        if(request.readyState == 4 && request.status == 200){
            var result = request.response;
            events = JSON.parse(result);
            /*data for names of events are an located in an array of objects called events. each object has key "name" with value artist name*/
            event_array = events["_embedded"]["events"];

            /*populating arrays*/
            event_array.forEach(function(item){
                array_Artists.push(item["name"]);
                array_Genre.push(item["classifications"]["0"]["genre"]["name"]);
                array_Venue.push(item["_embedded"]["venues"]["0"]["name"]);
                array_Date.push(item["dates"]["start"]["localDate"]);

            })


        /*creating JSON objects
         - objects are in JSON form and cannot be converted
        */


        var temp;
        for (var i = 0; i<array_Artists.length; i++) {
            temp = {"artist":array_Artists[i], "genre":array_Genre[i],"venue":array_Venue[i], "date":array_Date[i]};

            results.push(temp);
        }
        console.log(results);


        }else if (request.readyState == 4 && request.status!= 200){
            document.getElementById("data").innerHTML="Error";
        }
    }
    request.send();

    setTimeout(function(){ build_table();}, 1000);


}

for (i = 0; i<array_Artists.length; i++) {
            for (j = 0; j < array_Artists.length; j++) {
                if($('select#genre').val() == (list[i]['Genre'][j])) {
                    $('#filter').append('<b>' + "<div class='title'>" + array_Genre[i] + '</div>' + '</b></br>');
        }
    }
}

/* gets user input and passes into URL */
function getInput () {
  var input = document.formInput.city.value;
  return input;
}


/* styling for content inside the table */
function tableContent()
{
    var dataTable = document.getElementById("table");
    dataTable.style.fontFamily="Tahoma, Geneva, sans-serif";
    dataTable.style.backgroundColor="#e6e6e6";
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
            console.log(k, "k")
        if (cols.indexOf(k) === -1){
            cols.push(k);
        }
    }
}

/*creating table element*/
var table = document.createElement("table");

/*creating table row element of table*/
var tr = table.insertRow(-1);

for(var i = 0; i<cols.length; i++){
    /*creating table headers*/
    var theader = document.createElement("th");
    theader.style.fontFamily="Rockwell";
    theader.style.fontSize = "x-large";
    theader.style.textAlign = "left";
    theader.innerHTML = cols[i];

    /*appending keys(column name) to table row*/
    tr.appendChild(theader);
    console.log(theader);

}

console.log(table);
/*adding information to the table*/
for (var i = 0; i<storedData.length; i++){
    //create a new row//
    trow = table.insertRow(-1);
    for (var j = 0; j<cols.length; j++){
        var cell = trow.insertCell(-1);
        /*inserting cells at particular place*/
        cell.innerHTML=storedData[i][cols[j]] + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
    }
}

//adding table to document//
var tempTable = document.getElementById("table");
tempTable.innerHTML = "";
tempTable.appendChild(table);
console.log(table);


}
