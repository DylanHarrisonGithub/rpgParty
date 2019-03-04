const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt-nodejs');
const config = require('../config/config');
const env = process.env.NODE_ENV || 'development';

module.exports = (router) => {

    router.post('/register', (req, res) => {
        let errors = [];
        if (!req.body.email) { errors.push('Email not provided.'); }
        if (!req.body.username) { errors.push('Username not provided.'); }
        if (!req.body.password) { errors.push('password not provided.'); }
        if (errors.length) { res.status(400).json({ success: false, message: errors })}
        else {
            let user = new User({
                email: req.body.email.toLowerCase(),
                username: req.body.username.toLowerCase(),
                password: req.body.password
            });
            user.save((err, doc) => {
                if (err) {
                    if (err.errors) {
                        for (let key in err.errors) {
                            if (err.errors.hasOwnProperty(key)) {
                                errors.push(err.errors[key].message);
                            }
                        }
                        res.status(400).json({ success: false, message: errors });
                    } else {
                        if (err.code && err.code == 11000) {
                            res.status(500).json({ success: false, message: ['Username or Email already exists.'] });
                        } else {
                            res.status(500).json({ success: false, message: [JSON.stringify(err)] });
                        }
                    }
                } else {
                    let token = jwt.sign({ id: doc._id, username: doc.username }, config[env].JWT_SECRET, { expiresIn: config[env].JWT_TTL });
                    res.status(200).json({ success: true, message: ['User saved!'], token: token, user: doc });
                }
            });
        }
    });

    router.post('/login', (req, res) => {
        let errors = [];
        if (!req.body.username) { errors.push('Username not provided.'); }
        if (!req.body.password) { errors.push('password not provided.'); }
        if (errors.length) { res.status(400).json({ success: false, message: errors })}
        else {
            User.findOne({ username: req.body.username }, (err, doc) => {
                if (err) {
                    res.status(400).json({ success: false, message: ['Username does not exist.']});
                } else {
                    if (doc) {
                        if (bcrypt.compareSync(req.body.password, doc.password)) {
                            let token = jwt.sign({ id: doc._id, username: doc.username }, config[env].JWT_SECRET, { expiresIn: config[env].JWT_TTL });
                            res.status(200).json({ success: true, message: ['Login success!'], token: token, user: doc });
                        } else {
                            res.status(400).json({ success: false, message: ['Incorrect password.']});
                        }
                    } else {
                        res.status(400).json({ success: false, message: ['Username does not exist.']});
                    }
                }
            });
        }
    });

    router.post('/isUniqueUsername', (req, res) => {
        if (req.body.username) {
            User.find({username: req.body.username}, (err, doc) => {
                if (doc.length) res.json({ isUniqueUsername: false });
                else res.json({ isUniqueUsername: true });
            });
        } else {
            res.json({ isUniqueUsername: true });
        }
    });

    router.post('/isUniqueEmail', (req, res) => {
        if (req.body.email) {
            User.find({email: req.body.email}, (err, doc) => {
                if (doc.length) res.json({ isUniqueEmail: false });
                else res.json({ isUniqueEmail: true });
            });
        } else {
            res.json({ isUniqueEmail: true });
        }
    });
    return router;
}