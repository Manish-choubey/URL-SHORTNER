const express = require('express');
const Router = express.Router();
const urlcon=require("../controllers/urlcontroller")





Router.post("/shorten",urlcon.urlShort)


Router.get("/:urlCode",urlcon.getUrlCode)


















module.exports = Router;