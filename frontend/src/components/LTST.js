import React from "react";
import axios from "axios";
import { Reload } from "@web3uikit/icons";
import { Table } from "@web3uikit/core";
import { useState, useEffect } from "react";

let isStartUp = true;

function LTST({}) {

	const [ltstFundTable, setLtstFundTable] = useState([]);

	async function updateLtstFundTable() {
		const response = await axios.get(window.location.origin + "/api/MF/v2/ltst");
		// console.log("ltst v2 : " + JSON.stringify(response));

		var ltstFundTableList = response.data.ltstFundTableList;

		ltstFundTableList.forEach(function(row) {
			row[1] = row[1].toFixed(3);
			row[2] = "₹ " + parseFloat(row[2]).toFixed(2).toLocaleString("en-IN");
			row[3] = row[3].toFixed(3);
			row[4] = "₹ " + parseFloat(row[4]).toFixed(2).toLocaleString("en-IN");
		});

		var tableRows = [[
			"TOTAL CORPUS",
			"",
			"₹ " + parseFloat(response.data.longTermInvestedAmount).toFixed(2).toLocaleString("en-IN"),
			"",
			"₹ " + parseFloat(response.data.shortTermInvestedAmount).toFixed(2).toLocaleString("en-IN")
		]];

		setLtstFundTable(tableRows.concat(response.data.ltstFundTableList));
	}

	useEffect(() => {
        if (isStartUp) {
            isStartUp = false;
            updateLtstFundTable();
        }
    }, []);

	return (
		<>
			<div className="tabHeading">
				LTST Portfolio <Reload onClick={updateLtstFundTable} />
			</div>
			<Table
					pageSize={1}
					noPagination={true}
					style={{width:"1200px"}}
					columnsConfig="400px 150px 150px 150px 150px"
					data={ltstFundTable}
					header={["FUND", "LONG-TERM QUANTITY", "LONG-TERM AMOUNT", "SHORT-TERM QUANTITY", "SHORT-TERM AMOUNT"]}
				/>
		</>
	)
}

export default LTST;