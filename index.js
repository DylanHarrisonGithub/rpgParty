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
      let io = require('socket.io')(server);
      io.on('connection', (soc) => {
        if (soc.handshake.query.hasOwnProperty('user')) {
          let user = JSON.parse(soc.handshake.query['user']);
          if (user.hasOwnProperty('initialize')) {

            // generate a unique room code
            let tempCode = generateRoomCode(4);
            let exists = Object.keys(io.sockets.adapter.rooms).filter(r => r == tempCode);
            while (exists.length) {
              tempCode = generateRoomCode(4);
              exists = Object.keys(io.sockets.adapter.rooms).filter(r => r == tempCode);
            }
            // join new room
            soc.join(tempCode, () => {
              soc.emit('message', { success: true, message: "New room created", room: tempCode });
            });

          } else {}
        } else {
          soc.emit('message', { success: false, message: "Could not create socket connection because no user was provided." });
        }

        console.log(soc.id);         
        soc.on('message', (data) => {
          console.log(data);
        });
      });

    });
  }
});

generateRoomCode = (length) => {
  let c = '';
  let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  for (let i = 0; i < length; i++) {
    c += chars[Math.floor(Math.random()*26)];
  }
  return c;
}  

