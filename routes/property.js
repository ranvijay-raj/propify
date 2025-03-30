const mongoose = require("mongoose")
mongoose.connect(process.env.MONGOOSE_URI)
const userSchema = mongoose.Schema({
    title: String,
    type: String,
    status: {
        type: String,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    contacted: [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }],
    price: Number,
    inclusions: [{
        kitchen: String,
        bathroom: String,
        floors: String,
        bedroom: String
    }],
    area: Number,
    media: [{
        default: "",
        type: String
    }],
    date: {
        type: Date,
        default: Date.now
    },
    description: String,
    address: String,
    city: String,
    state: String,
    pincode: String,
    sold: {
        type: String,
        default: "no"
    },
    areaUnit: String,
    new: {
        type: Boolean,
        default: false
    },
    featured: {
        type: Boolean,
        default: false
    },
    valid: {
        type: Date
    }
})
module.exports = mongoose.model("property", userSchema)