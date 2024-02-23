const axios = require("axios");
const Utils = require("../Utils");

const YEARS = ["2021-22", "2022-23", "2023-24"];
// const YEARS = ["2021-22"];
let GSHEET_DATA = [];
let FUND_WISE_DATA = {};
let FILTERED_FUND_WISE_DATA = {};
let LONG_TERM_FUND_SUM_DATA = [];
let SHORT_TERM_FUND_SUM_DATA = [];
let LTST_FUND_SUM_DATA = {};

function get_GSHEET_DATA() {
	return GSHEET_DATA;
}

function get_FUND_WISE_DATA() {
	return FUND_WISE_DATA;
}

function get_FILTERED_FUND_WISE_DATA() {
	return FILTERED_FUND_WISE_DATA;
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
	await initialize_FUND_WISE_DATA();
	initialize_FILTERED_FUND_WISE_DATA();
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

async function initialize_FUND_WISE_DATA() {
	FUND_WISE_DATA = {};
	try {
		for (let i = 0; i < GSHEET_DATA.length; i++) {
			if (FUND_WISE_DATA.hasOwnProperty(GSHEET_DATA[i]["isin"])) {
				FUND_WISE_DATA[GSHEET_DATA[i]["isin"]]["orderList"] = FUND_WISE_DATA[GSHEET_DATA[i]["isin"]]["orderList"].concat(GSHEET_DATA[i]);
			} else {
				let response = await Utils.axiosApiCall("https://mf.captnemo.in/kuvera/" + GSHEET_DATA[i]["isin"])
                const kuveraApiData = response.data;
                const currentNav = kuveraApiData[0].nav.nav;
				FUND_WISE_DATA[GSHEET_DATA[i]["isin"]] = {"currentNav" : currentNav, "orderList" : [GSHEET_DATA[i]]};
			}
		}
	} catch (e) {
		console.log(e);
	}
	// console.log(FUND_WISE_DATA);
}

function initialize_FILTERED_FUND_WISE_DATA() {
	FILTERED_FUND_WISE_DATA = Utils.deepClone(FUND_WISE_DATA);
	try {
		Object.keys(FILTERED_FUND_WISE_DATA).forEach(function(isin) {
			let fundObj = FILTERED_FUND_WISE_DATA[isin];
			let sellQuantity = 0;
			for (let i = 0; i < fundObj["orderList"].length; i++) {
				const txn = fundObj["orderList"][i];
				if (txn["trade_type"] == "sell") {
					sellQuantity += parseFloat(txn["quantity"]);
				}
			}
			let i = 0;
			while (i < fundObj["orderList"].length) {
				let txn = fundObj["orderList"][i];
				if (txn["trade_type"] === "sell") {
					fundObj["orderList"].splice(i, 1);
				} else if (sellQuantity >= txn["quantity"] && txn["trade_type"] === "buy") {
					sellQuantity -= parseFloat(txn["quantity"]);
					fundObj["orderList"].splice(i, 1);
				} else if (sellQuantity >= 0 && txn["trade_type"] == "buy") {
					txn["quantity"] = (parseFloat(txn["quantity"] - sellQuantity).toFixed(3)).toString();
					sellQuantity = 0;
					i++;
				}
			}
		});
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
		for (var key in FILTERED_FUND_WISE_DATA) {
			const fundOrderList = FILTERED_FUND_WISE_DATA[key].orderList;
			let sumData = { "isin" : key , "symbol" : fundOrderList[0]["symbol"]};
			const todayDate = Utils.getNewDate();
			let longTermFundQuantity = 0;
			let longTermFundAmount = 0;
			let shortTermFundQuantity = 0;
			let shortTermFundAmount = 0;
			for (var i = 0; i < fundOrderList.length; i++) {
				if (todayDate - new Date(fundOrderList[i]["trade_date"]) > 1000 * 60 * 60 * 24 * 365) {
					longTermFundQuantity += parseFloat(fundOrderList[i]["quantity"]);
					longTermFundAmount += fundOrderList[i]["quantity"] * fundOrderList[i]["price"];
				} else {
					shortTermFundQuantity += parseFloat(fundOrderList[i]["quantity"]);
					shortTermFundAmount += fundOrderList[i]["quantity"] * fundOrderList[i]["price"];
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
		Object.keys(FILTERED_FUND_WISE_DATA).forEach(function(isin) {
			let fundObj = FILTERED_FUND_WISE_DATA[isin];
			for (let i = 0; i < fundObj["orderList"].length; i++) {
				const txn = fundObj["orderList"][i];

				let principle = parseFloat(txn.quantity) * parseFloat(txn.price);
				let tradeDate = new Date(txn.trade_date);
				tradeDate.setUTCHours(tradeDate.getUTCHours() + 5, 30, 0, 0);
				let yearsHeld = (todayDate - tradeDate) / (1000 * 60 * 60 * 24 * 365);
				let simpleInterest = Utils.calculateSimpleInterest(principle, roi, yearsHeld);
				let compoundInterest = Utils.calculateCompoundInterest(principle, roi, yearsHeld, 4);
				totalSimpleInterest += simpleInterest;
				totalCompoundInterest += compoundInterest;
				totalPrinciple += principle;
			}
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

function getV2Ltst() {
	var tableRows = [];

	Object.keys(LTST_FUND_SUM_DATA).forEach(function(isin) {
		const fundObj = LTST_FUND_SUM_DATA[isin];
		const currentNav = FUND_WISE_DATA[isin]["currentNav"];
		tableRows.push([
			fundObj.symbol,
			fundObj.longTermFundQuantity,
			fundObj.longTermFundAmount,
			(parseFloat(fundObj.longTermFundQuantity) * parseFloat(currentNav)) - fundObj.longTermFundAmount,
			fundObj.shortTermFundQuantity,
			fundObj.shortTermFundAmount,
			(parseFloat(fundObj.shortTermFundQuantity) * parseFloat(currentNav)) - fundObj.shortTermFundAmount
		])
	});

	tableRows = tableRows.sort((rowA, rowB) => {
		if (rowA[2] === rowB[2]) {
			return rowB[4] - rowA[4];
		} else {
			return rowB[2] - rowA[2];
		}
	});

	return tableRows;
}


module.exports = {
	get_GSHEET_DATA,
	get_FUND_WISE_DATA,
	get_FILTERED_FUND_WISE_DATA,
	get_LONG_TERM_FUND_SUM_DATA,
	get_SHORT_TERM_FUND_SUM_DATA,
	get_LTST_FUND_SUM_DATA,
	initializeMFExpressServer,
	fdComparison,
	getV2Ltst
};
