import React from "react";
import axios from "axios";
import { Table } from "@web3uikit/core";
import { Reload } from "@web3uikit/icons";
var console = require("console-browserify");
let ROI = 0;

function FdComparison({ roi, fdComparison, setFdComparison }) {

    async function getFdComparisonAPI() {
		const response = await axios.get(window.location.origin + "/api/MF/fdComparison/" + roi);
		console.log("fdComparison" + JSON.stringify(response));

		setFdComparison(response.data);
	}

	if (ROI !== roi) {
		ROI = roi;
		getFdComparisonAPI();
	}

	return (
		<>
			<div className="tabHeading">Portfolio Summary <Reload onClick={getFdComparisonAPI}/></div>
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
		</>
	);
}

export default FdComparison;