require("dotenv").config();
const redis = require("redis");
console.log("REDIS HOST: " + process.env.REDIS_HOST);

const redisClient = redis.createClient({
 host: process.env.REDIS_HOST,
 port: process.env.REDIS_PORT,
});

redisClient.connect();

redisClient.on("error", function (err) {
 console.log("Could not establish a connection with redis. " + err);
 process.exit(1);
});
redisClient.on("connect", function (err) {
 console.log("Connected to redis successfully");
});

module.exports = redisClient;
