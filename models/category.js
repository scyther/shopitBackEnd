const mongoose = require('mongoose');
var schema = mongoose.Schema;

var categorySchema = schema({
    name:{
        type: String,
        required:true,
        maxlength: 32,
        unique: true
    }
    },{timestamps:true});

module.exports = mongoose.model("Category",categorySchema);