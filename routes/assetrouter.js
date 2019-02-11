let path = require('path');

module.exports = (router) => {
    router.get('/tilesets/:file', (req, res) => {
        res.sendFile('/public/assets/tilesets/' + req.params.file, {'root': './'}, (error) => {
            if (error) {
                res.json({'message': 'could not find tileset ' + req.params.file, 'error': error });
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