let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let mongoClient = require('mongodb').MongoClient;
let url = "mongodb://localhost:27017/mydb";
let path = require('path');
let router = express.Router();
let assetrouter = require('./routes/assetrouter')(router);
let cors = require('cors');

/* mongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("mydb");
  var myobj = { name: "Company Inc", address: "Highway 37" };
  dbo.collection("customers").insertOne(myobj, function(err, res) {
    if (err) throw err;
    console.log("1 document inserted");
    db.close();
  });
}); */
//middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//set static path
app.use(express.static(path.join(__dirname, 'public')));

//routers
app.use('/assets', assetrouter);

app.get('/', (req, res) => {
    console.log(req);
    res.sendFile(__dirname + '/public/client/index.html');
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});