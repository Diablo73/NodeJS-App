const express = require("express");
const cors = require("cors");
const app = express();
const fs = require("fs");
const axios = require("axios");
const csvParser = require("csv-parser");
const port = 8080;
require("dotenv").config();
app.use(cors());

const Utils = require("./src/Utils");
const MF_Routes = require("./src/MF/MF_Routes");
const MF_Utils = require("./src/MF/MF_Utils");

app.use("/api/MF", MF_Routes);

app.listen(port, () => {
	MF_Utils.initializeMFExpressServer();
	console.log(`NodeJS-App listening on port ${port}`);
});


app.get("/", (req, res) => {
	res.send("If you are seeing this message, then it means that the backend NodeJS server is up and running.<br>Please wait for some time while the frontend ReactJS server boots up...");
});
