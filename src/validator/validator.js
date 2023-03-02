const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;


const isValid = function (value) {
    if (typeof value == undefined || value == null || value.length == 0)
      return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true;
  };

  const isValidBody = function (data) {
    return Object.keys(data).length > 0;
  };

  const ValidUrl= function(Link){
    return (!(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/).test(Link))
  }

 



  module.exports = { isValid,ValidUrl, isValidBody }