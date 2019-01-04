require('dotenv').config();

module.exports = function (key, defaultValue) {
    return process.env[key] || defaultValue;
};