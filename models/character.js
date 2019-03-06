const mongoose = require('mongoose');
const User = require('./user');

const baseStats = {
  "Paladin": {
    hit_points: 30,
    magic_points: 5,
    stats: {
      strength: 10,
      agility: 5,
      vitality: 5,
      intelligence: 5
    },
    assets: {
      portrait: "paladin.png",
      gamePiece: ""
    }
  },
  "Mage": {
    hit_points: 10,
    magic_points: 25,
    stats: {
      strength: 1,
      agility: 4,
      vitality: 4,
      intelligence: 16
    },
    assets: {
      portrait: "mage.png",
      gamePiece: ""
    }
  },
  "Healer": {
    hit_points: 20,
    magic_points: 15,
    stats: {
      strength: 1,
      agility: 4,
      vitality: 10,
      intelligence: 10,
    },
    assets: {
      portrait: "healer.png",
      gamePiece: ""
    }
  },
  "Orc": {
    hit_points: 35,
    magic_points: 0,
    stats: {
      strength: 16,
      agility: 2,
      vitality: 6,
      intelligence: 1,
    },
    assets: {
      portrait: "orc.png",
      gamePiece: ""
    }
  }
};

let charNameLengthChecker = (charName) => {
  if (charName) {
      if (charName.length < 3 || charName.length > 15) {
          return false;
      } else {
          return true;
      }
  } else {
      return false;
  }
}

let validCharName = (charName) => {
  if (charName) {
      let reg = /^[a-zA-Z0-9]+$/;
      return reg.test(charName);
  }
  return false;
}

const charNameValidators = [
  {
      validator: charNameLengthChecker,
      message: 'Character name must be at least 3 characters but no more than 15'
  },
  {
      validator: validCharName,
      message: 'Character name can only contain alpha-numeric characters.'
  }
];

classValidators = [
  {
    validator: (className) => { return baseStats.hasOwnProperty(className); },
    message: "Undefined character class."
  }
];

ownerIdValidators = [
  {
    validator: (owner_id) => { User.findById(owner_id, (err, doc) => {
      if (err) {
        return false;
      } else {
        if (doc) {
          return true;
        } else {
          return false;
        }
      }
    })},
    message: "Owner id not found."
  }
];

const characterScheema = mongoose.Schema({
  owner_id: { type: String, required: true, validate: ownerIdValidators },
  name: { type: String, required: true, validate: charNameValidators },
  class: { type: String, required: true, validate: classValidators },
  level: { type: Number, default: 1 },
  gold: { type: Number, default: 100 },
  hit_points: { type: Number, default: 20 },
  magic_points: { type: Number, default: 0 },
  experience: { type: Number, default: 0 },
  stats: { 
    strength: { type: Number, default: 1 },
    agility: { type: Number, default: 1 },
    vitality: { type: Number, default: 1 },
    inteligence: { type: Number, default: 1 },
    luck: { type: Number, default: 1 },
  },
  items: { type: Array, default: [] },
  equipped: {
    head: { type: String },
    neck: { type: String },
    body: { type: String },
    leftHand: { type: String },
    rightHand: { type: String },
    legs: { type: String },
    feet: { type: String }
  },
  assets: {
    portrait: { type: String },
    gamePiece: { type: String }
  }
});

module.exports = {
  Character: mongoose.model('Character', characterScheema),
  BaseStats: baseStats
}