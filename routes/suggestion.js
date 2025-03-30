const mongoose = require("mongoose")
mongoose.connect(process.env.MONGOOSE_URI)
const suggestionSchema = mongoose.Schema({
    suggest: String,
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    date: {
        type: Date,
        default: Date.now
    }
})
module.exports = mongoose.model("suggestion", suggestionSchema)