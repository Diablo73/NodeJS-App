const express = require("express");
const cors = require("cors");
const app = express();
const fs = require("fs");
const axios = require("axios");
const csvParser = require("csv-parser");
const port = 8080;
require("dotenv").config();
app.use(cors());

let GSHEET_DATA = [];

app.listen(port, () => {
	initializeExpressServer();
	console.log(`NodeJS-App listening on port ${port}`);
});

async function initializeExpressServer() {
	let csvData;
	try {
		csvData = await axios.get("https://sheets.googleapis.com/v4/spreadsheets/" + process.env.GSHEET_ID + "/values/2021?alt=json&key=" + process.env.GSHEET_API_KEY);
	} catch (e) {
		console.log(e);
	}
	GSHEET_DATA = GSHEET_DATA.concat(gsheetRows2Objects(csvData.data.values));
}


app.get("/", (req, res) => {
	res.send("If you are seeing this message, then it means that the backend NodeJS server is up and running.<br>Please wait for some time while the frontend ReactJS server boots up...");
});

app.get("/MF", (req, res) => {
	res.send("Analysis of mutual funds on Zerodha Coin app...");
});

app.get("/MF/refreshGSheetData", (req, res) => {
	initializeExpressServer();
	// res.send(GSHEET_DATA);
});

app.get("/MF/returnComparison/:ROI", (req, res) => {
	const ROI = req.params.ROI
	if (isNumeric(ROI)) {
		let totalPrinciple = 0;
		let totalSimpleInterest = 0;
		let totalCompoundInterest = 0;
		const todayDate = new Date();
		todayDate.setUTCHours(todayDate.getUTCHours() + 5, 30, 0, 0);
		todayDate.setUTCHours(0, 0, 0, 0);
		GSHEET_DATA.forEach(function(obj) {
			let principle = parseFloat(obj.quantity) * parseFloat(obj.price);
			let tradeDate = new Date(obj.trade_date);
			tradeDate.setUTCHours(tradeDate.getUTCHours() + 5, 30, 0, 0);
			let yearsHeld = (todayDate - tradeDate) / (1000 * 60 * 60 * 24 * 365);
			let simpleInterest = (principle * ROI * yearsHeld) / 100;
			let compoundInterest = calculateCompoundInterest(principle, ROI, yearsHeld, 4);
			totalSimpleInterest += simpleInterest;
			totalCompoundInterest += compoundInterest;
			totalPrinciple += principle;
		});
		const response = {
			"totalSimpleInterest": totalSimpleInterest.toFixed(2),
			"totalCompoundInterest": totalCompoundInterest.toFixed(2),
			"totalPrinciple": totalPrinciple.toFixed(2)
		};
		res.send(response);
	} else {
		res.send("NOT a valid ROI : " + ROI);
	}
});


function calculateCompoundInterest(principal, roi, time, compoundingFrequency) {
	roi = roi / 100;
	var n = compoundingFrequency;
	var amount = principal * Math.pow(1 + (roi / n), n * time);
	var interest = amount - principal;
	return interest;
}

function gsheetRows2Objects(rowList) {
	var [headers, ...rows] = rowList;
	var dataObjectList = [];
	rows.forEach(function(r) {
		var obj = {};
		r.forEach(function (c, j) {
			obj[headers[j]] = c;
		})
		dataObjectList.push(obj);
	})
	return dataObjectList;
}

function isNumeric(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}
