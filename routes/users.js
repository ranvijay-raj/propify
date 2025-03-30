const mongoose = require("mongoose")
const passport = require("passport")
const plm = require("passport-local-mongoose")
mongoose.connect(process.env.MONGOOSE_URI)
const userSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true
    },
    fullName: String,
    password: String,
    dp: {
        type: String,
        default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSw9kkioHRLqjNVqdYjWHdKWCLEYKfjJRoCYw&usqp=CAU"
    },
    property: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "property"
    }],
    mobile: {
        type: String,
        default: "N.A"
    },
    wishlist: [{
        type: mongoose.mongoose.Schema.Types.ObjectId,
        ref: "property"
    }],
    updated: String,
    searched: [{
        type: String
    }],
    visited: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }]
})
userSchema.plugin(plm)
module.exports = mongoose.model("user", userSchema)