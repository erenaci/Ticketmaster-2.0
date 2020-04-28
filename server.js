const express=require("express");
var bodyParser=require("body-parser");


const MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://andreafoo11:andreafoo@cluster0-blvfe.mongodb.net/test?\
          retryWrites=true&w=majority";
var app = express();
var adr = require('url');
const path = require('path');


app.use(express.static(path.join(__dirname, '/')));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


MongoClient.connect(url, { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to Database');
    const dbo = client.db('Music_Events');

    var current_user;

    app.get('/',function(req,res){
        console.log(__dirname);
        res.sendFile(path.join(__dirname + '/public/login.html'));
    });

    app.get('/signup.html',function(req,res){
        console.log(__dirname);
        res.sendFile(path.join(__dirname + '/public/signup.html'));
    });
    
    
    
    

    app.get('/login.html',function(req,res){
        console.log(__dirname);
        res.sendFile(path.join(__dirname + '/public/login.html'));
    });

    app.get('/index.html',function(req,res){
        console.log(__dirname);
        dbo.collection("Users").find(current_user).toArray(function(err, result) {
              if (err) throw err;
              console.log(result)
              dbo.collection("City_Search").find({} , { projection: { _id: 0, City : 1 } }).toArray()
              .then(results => {
                 res.render('index.ejs', {data : { cities: results , name: current_user }})
              })
              .catch(error => console.error(error))

          });
    });

    app.post('/submit-login', function(req,res){
        var currobj = { Email : req.body.email,
                        Username : req.body.username,
                        Password : req.body.password };
        current_user = currobj;
        console.log(currobj.Email);
        dbo.collection("Users").find(currobj).toArray(function(err, result) {
                        if (err) throw err;
                        console.log(result)
                        if (result.length == 0) {
                          // res.sendFile(path.join(__dirname + '/public/login.html'))
                          res.render('login.ejs', {error: "Incorrect login information"})
                        }
                        else {
                          dbo.collection("City_Search").find({} , { projection: { _id: 0, City : 1 } }).toArray()
                          .then(results => {
                             res.render('index.ejs', {data : { cities: results , name: currobj }})
                          })
                          .catch(error => console.error(error))
                        }
                    });
    });

    app.post('/submit-signup', function(req,res){
        var currobj = { Email : req.body.email,
                        Username : req.body.username,
                        Password : req.body.password };
        current_user = currobj;
        console.log(currobj.Email);
        dbo.collection("Users").insertOne(currobj)
          .then(user_result => {
            dbo.collection("City_Search").find({} , { projection: { _id: 0, City : 1 } }).toArray()
            .then(results => {
               res.render('index.ejs', {data : { cities: results , name: currobj }})
            })
            .catch(error => console.error(error))
          })
          .catch(error => console.error(error))
    });

    // // Searching for recent searches from database
    // app.get('/search', (req, res) => {
    //   console.log("In here");
    //
    //   .catch(error => console.error(error))
    // });



    //saving search to database
    app.post('/search', function(req,res){
        var currobj = { City : req.body.city };
        const dbcollection = dbo.collection("City_search")
        dbo.collection("City_Search").insertOne(currobj)
          .then(result => {
              res.render('search.ejs', {city_name : currobj})
              // res.sendFile(path.join(__dirname + '/public/search.html'));
          })
          .catch(error => console.error(error))
    });
    
    app.get('/search',function(req,res){
      var currobj = { City : "Boston" };
      res.render('search.ejs', {city_name : currobj});
    });
    
    app.get('/submit-login',function(req,res){
      dbo.collection("Users").find(current_user).toArray(function(err, result) {
            if (err) throw err;
            console.log(result)
            dbo.collection("City_Search").find({} , { projection: { _id: 0, City : 1 } }).toArray()
            .then(results => {
               res.render('index.ejs', {data : { cities: results , name: current_user }})
            })
            .catch(error => console.error(error))

        });
      });
});



app.listen(process.env.PORT || 3000, process.env.IP || '0.0.0.0' );
