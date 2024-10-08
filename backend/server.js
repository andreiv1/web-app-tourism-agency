require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const httpLogger = require('morgan')
const app = express();
const port = process.env.PORT || 3000;
const session = require('express-session');

app.use(httpLogger('dev'));
app.use(cors({
  origin: 'http://localhost:8080',
  credentials: true,
}));


const sessionOptions = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}

if (process.env.SESSION_STORE === 'redis') {
    const redisClient = require("./utils/redis");
    const { default: RedisStore } = require("connect-redis");
    sessionOptions.store = new RedisStore({ client: redisClient });
}


app.use(session(sessionOptions));
app.use(express.json({ limit: '50mb' }));


app.use(express.static(path.join(__dirname, '../frontend/dist')));
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.resolve(__dirname, '../frontend/dist/index.html'));
});

app.use("/api/auth", require("./routes/auth"));
app.use("/api/trips", require("./routes/trips"));
app.use("/api/users", require("./routes/users"));


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
