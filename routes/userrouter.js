const User = require('../models/user');

module.exports = (router) => {

    router.post('/register', (req, res) => {
        let errors = [];
        if (!req.body.email) { errors.push('Email not provided.'); }
        if (!req.body.username) { errors.push('Username not provided.'); }
        if (!req.body.password) { errors.push('password not provided.'); }
        if (errors.length) { res.status(400).json({ success: false, messages: errors })}
        else {
            let user = new User({
                email: req.body.email.toLowerCase(),
                username: req.body.username.toLowerCase(),
                password: req.body.password
            });
            user.save((err) => {
                if (err) {
                    if (err.errors) {
                        for (let key in err.errors) {
                            if (err.errors.hasOwnProperty(key)) {
                                errors.push(err.errors[key].message);
                            }
                        }
                        res.status(400).json({ success: false, messages: errors });
                    } else {
                        if (err.code && err.code == 11000) {
                            res.status(500).json({ success: false, messages: ['Username or Email already exists.'] });
                        } else {
                            res.status(500).json({ success: false, messages: [JSON.stringify(err)] });
                        }
                    }
                } else res.status(200).json({ success: true, message: 'User saved!' });
            });
        }
    });

    return router;
}