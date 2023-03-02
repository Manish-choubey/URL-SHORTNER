const urlModel = require("../models/urlModel")

const { isValid,ValidUrl, isValidBody } = require("../validator/validator");
const shortid = require('shortid');
const validUrl = require('valid-url')

const redis = require("redis");

const { promisify } = require("util");

//Connect to redis
const redisClient = redis.createClient(
    11697,
    "redis-11697.c262.us-east-1-3.ec2.cloud.redislabs.com",

    { no_ready_check: true }
);
redisClient.auth("Z4swFVvm3beErEZzZ4n0T6fi8QlAtqbs", function (err) {
    if (err) throw err;
});

redisClient.on("connect", async function () {
    console.log("Connected to Redis..");
});




const SET_ASYNC = promisify(redisClient.SET).bind(redisClient);
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);
const urlShort = async (req, res) => {
    try {
        const data = req.body;

        //Validating request body
        if (!isValidBody(data))
            return res.status(400).send({ status: false, message: "Enter a valid input in body" });

        //validating longUrl
        if (!data.longUrl)
            return res.status(400).send({ status: false, message: "Please enter longUrl" });

        if (!isValid(data))
            return res.status(400).send({ status: false, message: "Enter a valid longUrl" });

        data.longUrl = data.longUrl.trim();

        if (!ValidUrl(data.longUrl))
            data.longUrl = "https://" + data.longUrl;

        let { longUrl } = data;

        if (!validUrl.isUri(data.longUrl))
            return res.status(400).send({ status: false, message: `'${longUrl}' is not a valid URL` });

        let checkLongUrl = await urlModel.findOne({ longUrl: longUrl })

        if (checkLongUrl) {
            return res.status(201).send({ status: true, data: checkLongUrl })
        }

        //creating urlCode
        let short = shortid.generate().toLowerCase();

        // //checking if urlCode is unique
        // if (await urlModel.findOne({ urlCode: short })) { short = shortid.generate().toLowerCase() }

        req.body.urlCode = short;
        req.body.shortUrl = "http://localhost:3000/" + short;

        let savedData = await urlModel.create(data);

        let allData = {
            longUrl: savedData.longUrl,
            shortUrl: savedData.shortUrl,
            urlCode: savedData.urlCode,
        };

        res.status(201).send({ status: true, data: allData });

    } catch (err) {
        res.status(500).send({ sattus: false, message: err.message });
    }
};


const getUrlCode = async function (req, res) {
    try {
        // find a document match to the code in req.params.code
        if(!shortid.isValid(req.params.urlCode)  )   return res.status(400).send({ status: false, message: 'Wrong UrlCode' })
        let cachedUrl = await GET_ASYNC(`${req.params.urlCode}`)
        if(cachedUrl)    return res.status(302).redirect(cachedUrl)
        const url = await urlModel.findOne({
            urlCode: req.params.urlCode
        })
        if (url) {
            await SET_ASYNC(`${req.params.urlCode}`, url.longUrl)
            return res.status(302).redirect(url.longUrl)
        } else {
            return res.status(404).send({ status: false, message: 'No URL Found' })
        }

    }
    catch (err) {
        console.error(err)
        res.status(500).send({ status: false, message: err.message })
    }
}






module.exports.urlShort=urlShort
module.exports.getUrlCode=getUrlCode