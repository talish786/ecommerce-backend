const mongoose = require("mongoose")
const catgorySchema = mongoose.Schema({
    parentcategory: {
        required: true,
        type: Number,
        default: 0
    },
    categoryname: {
        required: true,
        type: String
    },
    enabled: {
        required: true,
        type: Boolean,
        default: false
    },
    inmenu: {
        required: true,
        type: Boolean,
        default: false
    }
}, {timestamps: true})
module.exports = mongoose.model("categories", catgorySchema)