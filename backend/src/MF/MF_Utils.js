const axios = require("axios");
const Utils = require("../Utils");

const YEARS = ["2021-22", "2022-23", "2023-24"];
// const YEARS = ["2021-22"];
let GSHEET_DATA = [];
let FUND_WISE_DATA = {};
let LONG_TERM_FUND_SUM_DATA = [];
let SHORT_TERM_FUND_SUM_DATA = [];
let LTST_FUND_SUM_DATA = {};

function get_GSHEET_DATA() {
	return GSHEET_DATA;
}

function get_FUND_WISE_DATA() {
	return FUND_WISE_DATA;
}

function get_LONG_TERM_FUND_SUM_DATA() {
	return LONG_TERM_FUND_SUM_DATA;
}

function get_SHORT_TERM_FUND_SUM_DATA() {
	return SHORT_TERM_FUND_SUM_DATA;
}

function get_LTST_FUND_SUM_DATA() {
	return LTST_FUND_SUM_DATA;
}

async function initializeMFExpressServer() {
	await initialize_GSHEET_DATA();
	initialize_FUND_WISE_DATA();
	initialize_LS_TERM_FUND_SUM_DATA();
}

async function initialize_GSHEET_DATA() {
	GSHEET_DATA = [];
	let csvData;
	try {
		for (let i = 0; i < YEARS.length; i++) {
			csvData = await axios.get("https://sheets.googleapis.com/v4/spreadsheets/" + process.env.GSHEET_ID + "/values/" + YEARS[i] + "?alt=json&key=" + process.env.GSHEET_API_KEY);
			// csvData = await axios.get("http://localhost:8080/api/MF");
			GSHEET_DATA = GSHEET_DATA.concat(Utils.gsheetRows2Objects(csvData.data.values));
		}
	} catch (e) {
		console.log(e);
	}
	// console.log(GSHEET_DATA);
}

function initialize_FUND_WISE_DATA() {
	FUND_WISE_DATA = {};
	try {
		for (let i = 0; i < GSHEET_DATA.length; i++) {
			if (FUND_WISE_DATA.hasOwnProperty(GSHEET_DATA[i]["isin"])) {
				FUND_WISE_DATA[GSHEET_DATA[i]["isin"]] = FUND_WISE_DATA[GSHEET_DATA[i]["isin"]].concat(GSHEET_DATA[i]);
			} else {
				FUND_WISE_DATA[GSHEET_DATA[i]["isin"]] = [GSHEET_DATA[i]];
			}
		}
	} catch (e) {
		console.log(e);
	}
	// console.log(FUND_WISE_DATA);
}

function initialize_LS_TERM_FUND_SUM_DATA() {
	LONG_TERM_FUND_SUM_DATA = [];
	SHORT_TERM_FUND_SUM_DATA = [];
	LTST_FUND_SUM_DATA = {};
	try {
		for (var key in FUND_WISE_DATA) {
			const fundIsinList = FUND_WISE_DATA[key];
			let sumData = { "isin" : key , "symbol" : fundIsinList[0]["symbol"]};
			const todayDate = Utils.getNewDate();
			let longTermFundQuantity = 0;
			let longTermFundAmount = 0;
			let shortTermFundQuantity = 0;
			let shortTermFundAmount = 0;
			for (var i = 0; i < fundIsinList.length; i++) {
				if (todayDate - new Date(fundIsinList[i]["trade_date"]) > 1000 * 60 * 60 * 24 * 365) {
					longTermFundQuantity += parseFloat(fundIsinList[i]["quantity"]);
					longTermFundAmount += fundIsinList[i]["quantity"] * fundIsinList[i]["price"];
				} else {
					shortTermFundQuantity += parseFloat(fundIsinList[i]["quantity"]);
					shortTermFundAmount += fundIsinList[i]["quantity"] * fundIsinList[i]["price"];
				}
			}
			
			if (longTermFundQuantity !== 0) {
				const ltFundSumData = Object.assign({ quantity: longTermFundQuantity, investedAmount: longTermFundAmount }, sumData);
				LONG_TERM_FUND_SUM_DATA.push(ltFundSumData);
			}
			if (shortTermFundQuantity !== 0) {
				const stFundSumData = Object.assign({ quantity: shortTermFundQuantity, investedAmount: shortTermFundAmount }, sumData);
				SHORT_TERM_FUND_SUM_DATA.push(stFundSumData);
			}
			LTST_FUND_SUM_DATA[sumData["isin"]] = Object.assign({
				longTermFundQuantity : longTermFundQuantity,
				longTermFundAmount : longTermFundAmount,
				shortTermFundQuantity : shortTermFundQuantity,
				shortTermFundAmount : shortTermFundAmount
			}, sumData);
		} 
	} catch (e) {
		console.log(e);
	}
	// console.log(FUND_WISE_DATA);
}

function fdComparison(roi) {
	if (Utils.isNumeric(roi)) {
		let totalPrinciple = 0;
		let totalSimpleInterest = 0;
		let totalCompoundInterest = 0;
		const todayDate = Utils.getNewDate();
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
	get_FUND_WISE_DATA,
	get_LONG_TERM_FUND_SUM_DATA,
	get_SHORT_TERM_FUND_SUM_DATA,
	get_LTST_FUND_SUM_DATA,
	initializeMFExpressServer,
	fdComparison
};
