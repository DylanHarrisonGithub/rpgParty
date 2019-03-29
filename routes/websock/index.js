const User = require('../../models/user');
const Character = require('../../models/character');
const jsonwebtoken = require('jsonwebtoken');
const config = require('../../config/config');
const env = process.env.NODE_ENV || 'development';

module.exports = (server) => {
  let io = require('socket.io')(server);
  io.on('connection', (soc) => {
    if (soc.handshake.query.hasOwnProperty('msg')) {
      let msg = JSON.parse(soc.handshake.query['msg']);
      if (msg.hasOwnProperty('token')) {
        jsonwebtoken.verify(msg.token, config[env].JWT_SECRET, (err, decoded) => {
          if (err) {
            soc.emit('message', { success: false, message: "Could not connect to socket server because JWT token not valid." });
            soc.disconnect(true);            
          } else {



            if (msg.hasOwnProperty('initialize')) {
        
              // generate a unique room code
              let tempCode = generateRoomCode(4);
              let exists = Object.keys(io.sockets.adapter.rooms).filter(r => r == tempCode);
              while (exists.length) {
                tempCode = generateRoomCode(4);
                exists = Object.keys(io.sockets.adapter.rooms).filter(r => r == tempCode);
              }
              // join new room and respond
              soc.join(tempCode, () => {
                soc.emit('message', { success: true, message: "New room created", room: tempCode });
              });
      
            } else if (msg.hasOwnProperty('user') && msg.hasOwnProperty('character') && msg.hasOwnProperty('room')) {
      
              // verify room exists
              if (Object.keys(io.sockets.adapter.rooms).filter(r => r.toUpperCase() == msg.room.toUpperCase()).length) {
                // join room
                soc.join(msg.room, () => {
                  // send success message to socket
                  soc.emit('message', { success: true, message: "Successfully joined room.", soc_id: soc.id });
                  // send new user and character to whole room
                  io.sockets.in(msg.room).emit('message', { success: true, message: "A new user joined the room.", user: msg.user, character: msg.character, soc_id: soc.id });
                });
              } else {
                soc.emit('message', { success: false, message: "Room does not exist with provided roomcode." });
              }
            } else {
              soc.emit('message', { success: false, message: "Could not create socket connection because msg was invalid." });
            }

            soc.on('message', (data) => {
              console.log(data);
              if (data.hasOwnProperty('room') && data.hasOwnProperty('msg')) {
                if (data.hasOwnProperty('to')) {
                  io.to(data.to).emit(data.msg);
                } else {
                  soc.to(data.room).emit(data.msg);
                }
              }
            });

            soc.on('disconnect', (soc) => { console.log('disconnected: ', soc.id) });
          }
        });
      } else {
        soc.emit('message', { success: false, message: "Could not connect to socket server because JWT token not provided." });
        soc.disconnect(true);
      }
    } else {
      soc.emit('message', { success: false, message: "Could not create socket connection because msg was not provided." });
      soc.disconnect(true);
    }

  });
}

generateRoomCode = (length) => {
  let c = '';
  let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  for (let i = 0; i < length; i++) {
    c += chars[Math.floor(Math.random()*26)];
  }
  return c;
}  