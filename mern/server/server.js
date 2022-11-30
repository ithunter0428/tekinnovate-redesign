const express = require("express");
const app = express();
const cors = require("cors");
// require("dotenv").config({ path: "./config.env" });
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const tekRoute = require("./routes/tekRoutes");

const config = require(process.env.NODE_ENV === "production"
  ? "./config/production"
  : "./config/development");

const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,PUT,POST,PATCH,DELETE,OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Content-Length, X-Requested-With"
  );
  if (req.method === "OPTIONS") res.sendStatus(200);
  else next();
});

app.use(cors());
app.use(express.json());
app.use(require("./routes/record"));

//inqury
app.use("/inquiries", tekRoute);

mongoose.connect(config.mongodbURI, { useNewUrlParser: true })
.then(() => console.log("MongoDB Connected!"))
.catch(err => console.log(err));
// get driver connection
app.listen(port, () => console.log(`Server is running on port: ${port}`));
