const express = require("express");
const app = express();
const mongoose = require("mongoose");
const connectDB = require("./helper/connectDB");

app.use(express.json());

const port = 5000;
app.listen(port, (err) => {
  err ? console.log(err) : console.log("server is running in port 5000");
});

connectDB();

//Access  the person routes
app.use("/persons", require("./routes/personRoutes"));
