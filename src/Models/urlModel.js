const mongoose = require("mongoose")

const urlSchema =  new mongoose.Schema({


    urlCode: {
        type: String,
        require: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    longUrl: {
        type: String,
        require: true,

    },
    shortUrl: {
        type: String,
        require: true,
        unique: true,
    }

},{timeStamp:true})

module.exports=mongoose.model("url",urlSchema)