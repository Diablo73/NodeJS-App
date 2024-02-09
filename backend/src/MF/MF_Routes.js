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

router.get("/ltst", (req, res) => {
	res.send({
		"longTermFundList" : MF_Utils.get_LONG_TERM_FUND_SUM_DATA(),
		"shortTermFundList" : MF_Utils.get_SHORT_TERM_FUND_SUM_DATA(),
		"longTermInvestedAmount" : MF_Utils.get_LONG_TERM_FUND_SUM_DATA().reduce((investedAmount, fund) => investedAmount + fund.investedAmount, 0),
		"shortTermInvestedAmount" : MF_Utils.get_SHORT_TERM_FUND_SUM_DATA().reduce((investedAmount, fund) => investedAmount + fund.investedAmount, 0)
	});
});

module.exports = router;
