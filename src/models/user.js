const Joi = require("joi");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 5,
        maxlength: 255,
        required: [true, "Name required"],
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        validate: {
            validator: function (v) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: "Please enter a valid email",
        },
        required: [true, "Email required"],
    },
    password: {
        type: String,
        required: [true, "Password required"],
        minlength: 5,
        maxlength: 1024,
    },
    isAdmin: Boolean,
});

userSchema.methods.genrateAuthToken = function () {
    const token = jwt.sign(
        {
            _id: this._id,
            isAdmin: this.isAdmin,
        },
        config.get("jwtPrivateKey")
    );
    return token;
};

const User = mongoose.model("User", userSchema);

const validateUser = (user) => {
    const schema = {
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(50).required().email(),
        password: Joi.string().min(8).max(20).required(),
    };
    return Joi.validate(user, schema);
};

exports.User = User;
exports.validate = validateUser;
