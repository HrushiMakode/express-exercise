const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
    },
    isGold: {
        type: Boolean,
        default: false,
    },
    phone: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
    },
});

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 255,
    },
    dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255,
    },
});

const Rental = mongoose.model(
    "Rental",
    new mongoose.Schema({
        customer: {
            type: customerSchema,
            required: true,
        },
        movie: {
            type: movieSchema,
            required: true,
        },
        dateOut: {
            type: Date,
            required: true,
            default: Date.now,
        },
        dateReturned: {
            type: Date,
        },
        rentalFee: {
            type: Number,
            min: 0,
        },
    })
);

const validateRental = (rental) => {
    const schema = {
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required(),
    };
    return Joi.validate(rental, schema);
};

exports.Rental = Rental;
exports.validate = validateRental;
