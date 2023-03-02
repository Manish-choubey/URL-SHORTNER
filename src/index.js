const express = require('express');
const bodyParser = require('body-parser');
const route = require("./routes/route");
const  mongoose = require('mongoose');
// const validUrl=require("valid-url")
const cache=require("./controllers/urlcontroller")

const app = express();

app.use(bodyParser.json());



mongoose.connect("mongodb+srv://navneet:Navneet719@cluster0.3oclrwu.mongodb.net/navneet?retryWrites=true&w=majority", { useNewUrlParser: true })
.then( () => console.log("MongoDb is connected"))
.catch ( err => console.log(err) )

app.use('/', route);


app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});