const axios = require("axios");
const Utils = require("../Utils");

const YEARS = [2021, 2022, 2023];
let GSHEET_DATA = [];

function get_GSHEET_DATA() {
	return GSHEET_DATA;
}

async function initializeMFExpressServer() {
	let csvData;
	try {
		for (let i = 0; i < YEARS.length; i++) {
			csvData = await axios.get("https://sheets.googleapis.com/v4/spreadsheets/" + process.env.GSHEET_ID + "/values/" + YEARS[i] + "?alt=json&key=" + process.env.GSHEET_API_KEY);
			// csvData = await axios.get("http://localhost:8080/");
			GSHEET_DATA = GSHEET_DATA.concat(Utils.gsheetRows2Objects(csvData.data.values));
		}
	} catch (e) {
		console.log(e);
	}
}

function fdComparison(roi) {
	if (Utils.isNumeric(roi)) {
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
			let simpleInterest = Utils.calculateSimpleInterest(principle, roi, yearsHeld);
			let compoundInterest = Utils.calculateCompoundInterest(principle, roi, yearsHeld, 4);
			totalSimpleInterest += simpleInterest;
			totalCompoundInterest += compoundInterest;
			totalPrinciple += principle;
		});
		const response = {
			"totalSimpleInterest": totalSimpleInterest.toFixed(2),
			"totalCompoundInterest": totalCompoundInterest.toFixed(2),
			"totalPrincipleAmount": totalPrinciple.toFixed(2)
		};
		return response;
	} else {
		return "NOT a valid ROI : " + roi;
	}
}


module.exports = {
	get_GSHEET_DATA,
	initializeMFExpressServer,
	fdComparison
};
