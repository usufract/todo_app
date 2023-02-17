// mintify is used with Command .

/* This is importing the Express module and the MongoDB module. */
const { request } = require("express");
const express = require("express");
const mongodb = require("mongodb");
const sanitizeHTML = require("sanitize-html");

const app = express();

/* A middleware function that is used to parse the data that is being sent to the server. */
// middleware function
app.use(express.urlencoded({extended: false}));
app.use(express.static("public"));
app.use(express.json());

/* This is connecting the Express server with the MongoDB database. */
const connectionString =
"mongodb+srv://usufract:winter2023@andrewscluster.wzdr3ck.mongodb.net/ToDoAppDB?retryWrites=true&w=majority";
const port = 3000;
let db;

/* This is connecting the Express server with the MongoDB database. */
// connect Express with MongoDB
mongodb.MongoClient.connect(
    // Parameter A
    connectionString, 
    // Parameter B
    {useNewUrlParser: true},
    // Parameter C 
    function(error, client){
        // error connecting to DB
        if (error) {
            console.log(error);
        } else {
            db = client.db();
            app.listen(port, function(){
                console.log("Database is connected!");
            });
        }
});

// "GET" request on Home Page
app.get("/", function (req, res) {
  db.collection("items").find().toArray(function(err, items) {
    if(err) {
      res.send("Error");
    }
    else {
      res.send(`<!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Simple To-Do App</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
  </head>
  <body>
    <div class="container">
      <h1 class="display-4 text-center py-1">To-Do App</h1>
      
      <div class="jumbotron p-3 shadow-sm">
        <!--information to be saved to /create-item-->
        <form action="/create-item" method="POST">
          <div class="d-flex align-items-center">
            <input name="item" autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;">
            <button class="btn btn-primary">Add New Item</button>
          </div>
        </form>
      </div>
      
      <ul class="list-group pb-5">
        ${items.map(function(x) {
          return `
            <li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
              <span class="item-text">${x.text}</span>
              <div>
              <button id="${x._id}" class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
              <button id="${x._id}" class="delete-me btn btn-danger btn-sm">Delete</button>
              </div>
            </li>`;
        })
        .join("")}
      </ul>
      
    </div>
    
    <script src="browser.js">
    </script>
    <!-- importing Axios from NPM: https://github.com/axios/axios (used to send data to server) -->
    <script src="https://cdn.jsdelivr.net/npm/axios@1.1.2/dist/axios.min.js">
    </script>

  </body>
  </html>`);
      console.log(items);
    }
  });
});

/* This is a POST request that is being sent to the server. The server is then sending the data to the
database. */
app.post("/create-item", function(req, res) {
  let safeText = sanitizeHTML(req.body.text, 
    { allowedTags: [],
      allowedAttributes: {}
    });
  console.log(req.body.item);
  db.collection("items").insertOne({text:safeText});
  // res.send("Success!");
  res.redirect("/");
});

app.post("/edit", function(req, res) {
  // reading the text passed through Axios; need the middleware function app.use(express.json());
  console.log(req.body.newText);
  console.log(req.body.id);
  // findOneAndUpdate(id_data, data_to_update,function_to_execute) is used because we are modifying and updating an existing entry
  // I need the key _id to find the text value in MongoDB
  db.collection("items").findOneAndUpdate(
    {_id : new mongodb.ObjectId(req.body.id)},
    {$set : { text: req.body.newText}},
    function() {
      res.redirect("/");
    }
  );
});

/* Deleting the data from the database. */
app.post("/delete", function(req, res) {
  console.log(req.body.id);
  db.collection("items").deleteOne(
    {_id : new mongodb.ObjectId(req.body.id) },
    function() {
      res.redirect("/");
    }  
  );
});