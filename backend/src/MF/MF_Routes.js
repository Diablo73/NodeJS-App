const express = require("express");
const axios = require("axios");
const router = express.Router();
const MF_Utils = require("./MF_Utils");


router.get("/", (req, res) => {
	res.send(process.env.SAMPLE_DATA ? process.env.SAMPLE_DATA : "Analysis of mutual funds on Zerodha Coin app...");
});

router.get("/test", (req, res) => {
	res.send(MF_Utils.get_FUND_WISE_DATA());
});

router.get("/refreshGSheetData", (req, res) => {
	MF_Utils.initializeMFExpressServer();
});

router.get("/fdComparison/:ROI", (req, res) => {
	const roi = req.params.ROI
	res.send(MF_Utils.fdComparison(roi));
});


module.exports = router;
