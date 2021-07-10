require("express-async-errors");
const express = require("express");
const mongoose = require("mongoose");
const config = require("config");
const Joi = require("joi");
const error = require("./middleware/error");
const winston = require("winston");
require("winston-mongodb");

Joi.objectId = require("joi-objectid")(Joi);

const users = require("./routes/users");
const movies = require("./routes/movies");
const genres = require("./routes/genres");
const customers = require("./routes/customers");
const rentals = require("./routes/rentals");
const auth = require("./routes/auth");

// !! Some Problem with winston v3.3+
// winston.add(
//     new winston.transports.Console({
//         format: winston.format.combine(
//             winston.format.simple(),
//             winston.format.colorize()
//         ),
//         colorize: true,
//         prettyPrint: true,
//         handleExceptions: true,
//     })
// );

process.on("uncaughtException", (err) => {
    throw err;
});

winston.add(
    new winston.transports.File({
        filename: "logfile.log",
    })
);
winston.add(
    new winston.transports.MongoDB({ db: "mongodb://localhost/vidly" })
);

if (!config.get("jwtPrivateKey")) {
    console.log("FATAL ERROR : jwtPrivateKey is Not Define in ENV");
    process.exit(1);
}

mongoose
    .connect("mongodb://localhost/vidly", { useNewUrlParser: true })
    .then(() => {
        console.log("Conncected to MongoDB....");
    })
    .catch((err) => {
        console.error(`Could not connect to MongoDB ${err}`);
    });

const app = express();

app.use(express.json());
app.use("/api/movies", movies);
app.use("/api/genres", genres);
app.use("/api/customers", customers);
app.use("/api/rentals", rentals);
app.use("/api/users", users);
app.use("/api/auth", auth);

app.use(error);

//create a server object:
app.get("/", (req, res) => {
    res.send("Welcome Home, <h3>Hrshikesh</h3>");
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on ${port}`));
