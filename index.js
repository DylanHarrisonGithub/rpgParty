let express = require('express');
let bodyParser = require('body-parser');
let cors = require('cors');
let path = require('path');
let mongoose = require('mongoose');
let config = require('./config/config');

let router = express.Router();
let assetrouter = require('./routes/assetrouter')(router);
let userrouter = require('./routes/userrouter')(router);
let characterrouter = require('./routes/characterrouter')(router);

const env = process.env.NODE_ENV || 'development';
let app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//set static path
app.use(express.static(path.join(__dirname, 'public')));

//routes
app.use('/assets', assetrouter);
app.use('/user', userrouter);
app.use('/character', characterrouter);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/client/index.html');
});

mongoose.connect(config[env].MONGODB_URI, (err) => {
  if (err) {
    console.log('Could not connect to MongoDB.');
  } else {
    console.log('MongoDB connection established.');
    let server = app.listen(config[env].PORT, () => {

      console.log('Server started on port ' + config[env].PORT.toString());
    
      // websock.io server
      require('./routes/websock/index')(server);
    });
  }
});


