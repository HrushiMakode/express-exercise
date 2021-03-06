const { Rental, validate } = require("../models/rental");
const { Customer } = require("../models/customer");
const { Movie } = require("../models/movie");
const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");

router.get("/", async (req, res) => {
    const rentals = await Rental.find().sort("-dateOut");
    res.send(rentals);
});

router.get("/:id", async (req, res) => {
    const rental = await Rental.findById(req.params.id);
    if (!rental)
        return res.status(404).send("The rentals with given ID was not found");
    res.send(rental);
});

router.post("/", async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(400).send("Invalid Customer!!!");

    const movie = await Movie.findById(req.body.movieId);
    if (!movie) return res.status(400).send("Invalid Movie!!!");

    if (movie.numberInStock === 0)
        return res.status(400).send("Movie not in stock.");

    let rental = new Rental({
        customer: {
            _id: customer._id,
            name: customer.name,
            phone: customer.phone,
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate,
        },
    });
    // * Here we need Transcation so if rental.save() movie.save should be rolled back
    rental = await rental.save();
    movie.numberInStock--;
    movie.save();
    res.send(rental);
    // * So thats why using fawn

    // try {
    //     new Fawn()
    //         .Task()
    //         .save("rentals", rental)
    //         .update(
    //             "movies",
    //             { _id: movie._id },
    //             {
    //                 $inc: { numberInStock: -1 },
    //             }
    //         )
    //         .run();
    //     res.send(rental);
    // } catch (error) {
    //     res.status(500).send("Something failed at fawn " + error);
    // }
});

module.exports = router;
