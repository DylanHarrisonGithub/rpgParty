const fs = require('fs')
let path = require('path');

module.exports = (router) => {

    router.get('/tilesets', (req, res) => {
        fs.readdir('./public/assets/tilesets/', (err, tilesetlist) => {
            if (err) {
                res.json({ message: 'error getting tileset list', 'error': err});
            } else {
                res.json({ tilesets: tilesetlist });
            }
        });
    });

    router.get('/tilesets/:file', (req, res) => {
        res.sendFile('/public/assets/tilesets/' + req.params.file, {'root': './'}, (error) => {
            if (error) {
                res.json({'message': 'could not find tileset ' + req.params.file, 'error': error });
            }
        });
    });

    router.get('/maps', (req, res) => {
        fs.readdir('./public/assets/maps/', (err, maplist) => {
            if (err) {
                res.json({ message: 'error getting maps list', 'error': err});
            } else {
                res.json({ maps: maplist });
            }
        });
    });
    
    router.get('/maps/:file', (req, res) => {
        res.sendFile('/public/assets/maps/' + req.params.file, {'root': './'}, (error) => {
            if (error) {
                res.json({'message': 'could not find map' + req.params.file, 'error': error });
            }
        });
    });
    return router;
}