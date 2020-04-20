var express=require("express"); 
var bodyParser=require("body-parser"); 

  
const MongoClient = require('mongodb').MongoClient; 
var url = "mongodb+srv://andreafoo11:andreafoo@cluster0-blvfe.mongodb.net/test?\
          retryWrites=true&w=majority";
var app = express() 
var adr = require('url');
const path = require('path');

// var searchRouter = require ('./routes/users');

app.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/index.html'));
});


app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ 
    extended: true
})); 

app.post('/submit-form', function(req,res){
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("Music_Events");
        if(req.body.menu == 1) {
            var currobj = { Artist : req.body.search_value };
            dbo.collection("Artist_search").insertOne(currobj, function(err, res) {
              if (err) throw err;
              console.log("updated");
              db.close();
            })
        }
        else if (req.body.menu == 2) {
          var currobj = { Genre : req.body.search_value };
          dbo.collection("Genre_Search").insertOne(currobj, function(err, res) {
            if (err) throw err;
            console.log("updated");
            db.close();
          })
        }
        else if (req.body.menu == 3) {
          var currobj = { City : req.body.search_value };
          dbo.collection("City_Search").insertOne(currobj, function(err, res) {
            if (err) throw err;
            console.log("updated");
            db.close();
          })
        }
        
  }); 
});
  
app.listen(process.env.PORT || 3000, process.env.IP || '0.0.0.0' );