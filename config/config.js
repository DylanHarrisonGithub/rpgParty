const secret = require('crypto').randomBytes(256).toString('hex');

module.exports = {
    "development": {
        "PORT": 3000,
        "MONGODB_URI": "mongodb://localhost:27017/rpgParty",
        "JWT_SECRET": secret,
        "JWT_TTL": "24h"
    },
    "production": {
        "PORT": 80,
        "MONGODB_URI": "mongodb://xxxxx/DB_Name",
        "JWT_SECRET": secret,
        "JWT_TTL": "24h"
    }
}