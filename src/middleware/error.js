const winston = require("winston");

module.exports = (err, req, res, next) => {
    // error
    // warn
    // info
    // verbose
    // debug
    // silly
    winston.error("Error", err);

    res.status(500).send("Something Failed");
};
