const express = require("express");
const axios = require("axios");
const router = express.Router();
const MF_Utils = require("./MF_Utils");


router.get("/", (req, res) => {
	res.send(process.env.SAMPLE_DATA ? process.env.SAMPLE_DATA : "Analysis of mutual funds on Zerodha Coin app...");
});

router.get("/test", (req, res) => {
	res.send(process.env.SAMPLE_DATA ? MF_Utils.get_FUND_WISE_DATA() : "Testing endpoint for the analysis of mutual funds on Zerodha Coin app...");
});

router.get("/refreshGSheetData", (req, res) => {
	MF_Utils.initializeMFExpressServer();
});

router.get("/fdComparison/:ROI", (req, res) => {
	const roi = req.params.ROI
	res.send(MF_Utils.fdComparison(roi));
});

router.get("/v1/ltst", (req, res) => {
	res.send({
		"longTermFundList" : MF_Utils.get_LONG_TERM_FUND_SUM_DATA(),
		"shortTermFundList" : MF_Utils.get_SHORT_TERM_FUND_SUM_DATA(),
		"longTermInvestedAmount" : MF_Utils.get_LONG_TERM_FUND_SUM_DATA().reduce((investedAmount, fund) => investedAmount + fund.investedAmount, 0),
		"shortTermInvestedAmount" : MF_Utils.get_SHORT_TERM_FUND_SUM_DATA().reduce((investedAmount, fund) => investedAmount + fund.investedAmount, 0)
	});
});

router.get("/v2/ltst", (req, res) => {
	res.send({
		"ltstFundTableList" : MF_Utils.getV2Ltst(),
		"longTermInvestedAmount" : Object.keys(MF_Utils.get_LTST_FUND_SUM_DATA()).reduce((investedAmount, isin) => {
			const fundObject = MF_Utils.get_LTST_FUND_SUM_DATA()[isin];
			if (fundObject.longTermFundQuantity !== 0) {
				investedAmount += fundObject.longTermFundAmount;
			}
			return investedAmount;
		}, 0),
		"shortTermInvestedAmount" : Object.keys(MF_Utils.get_LTST_FUND_SUM_DATA()).reduce((investedAmount, isin) => {
			const fundObject = MF_Utils.get_LTST_FUND_SUM_DATA()[isin];
			if (fundObject.shortTermFundQuantity !== 0) {
				investedAmount += fundObject.shortTermFundAmount;
			}
			return investedAmount;
		}, 0),
	});
});

module.exports = router;
