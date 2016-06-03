'use strict';

var mongoose =  require("mongoose");
var Schema = mongoose.Schema;

var barSchema = new Schema({
    attending : {
        type: Array,
        default : []
    },
    url : String,
    img : String,
    snippet : String,
    name : String
});

module.exports = mongoose.model("Bar", barSchema);