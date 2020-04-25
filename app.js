const express=require("express");
var bodyParser=require("body-parser");


const MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://andreafoo11:andreafoo@cluster0-blvfe.mongodb.net/test?\
          retryWrites=true&w=majority";
var app = express();
var adr = require('url');
const path = require('path');


app.use(express.static(path.join(__dirname, '/')));
//serve the home page
app.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/public/index.html'));
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

function css (request, response) {
  if (request.url.indexOf(".css") !== -1){
    var file = fs.readFileSync(`.${request.url}`, {'encoding' : 'utf8'});
    response.writeHead(200, {'Content-Type' : 'text/css'});
    response.write(file);
    response.end();
  }
}

// app.get('/display-artist-searches', (req, res) => {
//   MongoClient.connect(url, function(err, db) {
//       if (err) throw err;
//       var dbo = db.db("Music_Events");
//       dbo.collection("Artist_search").find({} , { projection: { _id: 0, Artist: 1 } }).toArray(function(err, result) {
//         if (err) throw err;
//         console.log(result);
//         res.send(result);
//       });
//   });
// });
//
//
// app.get('/display-genre-searches', (req, res) => {
//   MongoClient.connect(url, function(err, db) {
//       if (err) throw err;
//       var dbo = db.db("Music_Events");
//       dbo.collection("Genre_Search").find({} , { projection: { _id: 0, Genre: 1 } }).toArray(function(err, result) {
//         if (err) throw err;
//         console.log(result);
//         res.send(result);
//       });
//   });
// });

app.get('/display-city-searches', (req, res) => {
  MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("Music_Events");
      dbo.collection("City_search").find({} , { projection: { _id: 0, City : 1 } }).toArray(function(err, result) {
        if (err) throw err;
        console.log(result);
        res.send(result);
      });
  });
});

app.post('/submit-form', function(req,res){
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("Music_Events");
        // if(req.body.menu == 1) {
        //     var currobj = { Artist : req.body.search_value };
        //     dbo.collection("Artist_search").insertOne(currobj, function(err, res) {
        //       if (err) throw err;
        //       console.log("updated");
        //       db.close();
        //     })
        // }
        // else if (req.body.menu == 2) {
        //   var currobj = { Genre : req.body.search_value };
        //   dbo.collection("Genre_Search").insertOne(currobj, function(err, res) {
        //     if (err) throw err;
        //     console.log("updated");
        //     db.close();
        //   })
        // }

        var currobj = { City : req.body.search_value };
        dbo.collection("City_Search").insertOne(currobj, function(err, res) {
          if (err) throw err;
          console.log("updated");
          db.close();
        })

  });
});

app.listen(process.env.PORT || 3000, process.env.IP || '0.0.0.0' );
