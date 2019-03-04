const { Character, Classes, BaseStats } = require('../models/character');
const jsonwebtoken = require('jsonwebtoken');
const config = require('../config/config');
const env = process.env.NODE_ENV || 'development';

module.exports = (router => {

  router.get('/', (req, res) => {
    if (req.headers.authorization) {
      jsonwebtoken.verify(req.headers.authorization, config[env].JWT_SECRET, (err, decoded) => {
        if (err) {
          res.json({ success: false, message: "Authentication was not valid.", err: err });
        } else {
          Character.find({ owner_id: decoded._id }, (err, doc) => {
            if (err) {
              res.json({ success: false, message: "Error retrieving characters.", error: err });
            } else {
              res.json({ success: true, message: "Successfully retrieved characters.", characters: doc });
            }
          });
        }
      });
    } else {
      res.json({ success: false, message: "Must provide authentication for protected route."});
    }
  });

  router.post('/create', (req, res) => {
    if (req.headers.authorization) {
      jsonwebtoken.verify(req.headers.authorization, config[env].JWT_SECRET, (err, decoded) => {
        if (err) {
          res.json({ success: false, message: "Authentication was not valid.", err: err });
        } else {
          if (req.body.owner_id) {
            if (req.body.name) {
              if (req.body.class) {
                if (Classes.indexOf(req.body.class) > -1) {                  
                  let char = new Character({
                    owner_id: req.body.owner_id,
                    name: req.body.name,
                    class: req.body.class,
                    hit_points: BaseStats[req.body.class].hit_points,
                    magic_points: BaseStats[req.body.class].magic_points,
                    stats: BaseStats[req.body.class].stats
                  });
                  char.save((err, doc) => {
                    if (err) {
                      res.json({ success: false, message: "Error creating character.", error: err });
                    } else {
                      res.json({ success: true, message: "Successfully created character.", character: doc });
                    }
                  });
                } else {
                  res.json({ success: false, message: "Provided character class is not defined." });
                }
              } else {
                res.json({ success: false, message: "Character class was not provided." });          
              }
            } else {
              res.json({ success: false, message: "Character name was not provided." });          
            }
          } else {
            res.json({ success: false, message: "Owner_id was not provided." });
          }
        }
      });
    } else {
      res.json({ success: false, message: "Must provide authentication for protected route."});
    }
  });

  router.delete('/', (req, res) => {
    if (req.headers.authorization) {
      jsonwebtoken.verify(req.headers.authorization, config[env].JWT_SECRET, (err, decoded) => {
        if (err) {
          res.json({ success: false, message: "Authentication was not valid.", err: err });
        } else {
          if (req.body._id) {
            Character.deleteOne({ _id: req.body._id, owner_id: decoded._id }, (err) => {
              if (err) {
                res.json({ success: false, message: "Error deleting character.", error: err});
              } else {
                res.json({ success: true, message: "Character deleted."})
              }
            });
          } else {
            res.json({ success: false, message: "Could not delete because character id was not provided."});
          }
        }
      });
    } else {
      res.json({ success: false, message: "Must provide authentication for protected route."});
    }         
  });

  router.put('/', (req, res) => {
    if (req.headers.authorization) {
      jsonwebtoken.verify(req.headers.authorization, config[env].JWT_SECRET, (err, decoded) => {
        if (err) {
          res.json({ success: false, message: "Authentication was not valid.", err: err });
        } else {
          if (req.body._id) {
            if (req.body.character) {
              Character.updateOne({ _id: req.body._id }, req.body.character, (err, doc) => {
                if (err) {
                  res.json({ success: false, message: "Error updating character.", error: err });
                } else {
                  res.json({ success: true, message: "Character successfully updated.", doc: doc });
                }
              });
            } else {
              res.json({ success: false, message: "Error updating. Character was not provided." });
            }
          } else {
            res.json({ success: false, message: "Could not update because character id was not provided."});
          }
        }
      });
    } else {
      res.json({ success: false, message: "Must provide authentication for protected route."});
    } 
  });

  return router;
});