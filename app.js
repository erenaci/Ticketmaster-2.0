var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://afoo01:comp20proj@cluster0-pu67o.mongodb.net/test?\
           retryWrites=true&w=majority";


MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("Music_Events");
    var currobj = { name_of_event: "Company Inc", genre: "Highway 37", location: "blah"};
    dbo.collection("Recent_Searches").insertOne(currobj, function(err, res) {
      if (err) throw err;
      console.log("updated");
      db.close();
    })
});
