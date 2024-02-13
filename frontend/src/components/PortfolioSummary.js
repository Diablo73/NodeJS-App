import React from "react";
import axios from "axios";
import { Table } from "@web3uikit/core";
import { Reload } from "@web3uikit/icons";
var console = require("console-browserify");

let ROI = 0;

function PortfolioSummary({ roi, fdComparison, setFdComparison, ltstSummary, setLtstSummary }) {

    async function getFdComparisonAPI() {
		const response = await axios.get(window.location.origin + "/api/MF/fdComparison/" + roi);
		// console.log("fdComparison : " + JSON.stringify(response));

		setFdComparison(response.data);
	}

	async function getLtStComparisonAPI() {
		const response = await axios.get(window.location.origin + "/api/MF/v2/ltst");
		// console.log("ltst : " + JSON.stringify(response));

		setLtstSummary(response.data);
	}

	if (ROI !== roi) {
		ROI = roi;
		getFdComparisonAPI();
		getLtStComparisonAPI();
	}

	return (
		<>
		<div className="summaryTables">
			<div className="tabHeading">FD Comparison <Reload onClick={getFdComparisonAPI}/></div>
			{(fdComparison) && 
				<Table
					pageSize={1}
					noPagination={true}
					style={{width:"500px"}}
					columnsConfig="300px 50px 150px"
					data={[
						[ "Total Principle Amount", "|", "₹ " + parseFloat(fdComparison.totalPrincipleAmount).toLocaleString("en-IN") ],
						[ "Total Simple Interest", "|", "₹ " + parseFloat(fdComparison.totalSimpleInterest).toLocaleString("en-IN") ],
						[ "Total Compound Interest", "|", "₹ " + parseFloat(fdComparison.totalCompoundInterest).toLocaleString("en-IN") ],
					]}
					header={[]}
				/>
			}
			</div>
			<div className="summaryTables">
			<div className="tabHeading">LTST <Reload onClick={getLtStComparisonAPI}/></div>
			{(ltstSummary) && 
				<Table
					pageSize={1}
					noPagination={true}
					style={{width:"500px"}}
					columnsConfig="300px 50px 150px"
					data={[
						[ "Total Principle Amount", "|", "₹ " + (parseFloat(ltstSummary.longTermInvestedAmount) + parseFloat(ltstSummary.shortTermInvestedAmount)).toLocaleString("en-IN") ],
						[ "Long Term Invested Amount", "|", "₹ " + parseFloat(ltstSummary.longTermInvestedAmount).toLocaleString("en-IN") ],
						[ "Short Term Invested Amount", "|", "₹ " + parseFloat(ltstSummary.shortTermInvestedAmount).toLocaleString("en-IN") ],
					]}
					header={[]}
				/>
			}
			</div>
		</>
	);
}

export default PortfolioSummary;