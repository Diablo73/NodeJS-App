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

		var tableRowsData = [];
		ltstFundTableList.forEach(function(row) {
			let rowData = [];
			rowData.push(row[0]);
			rowData.push(parseFloat(row[1]).toFixed(3).toLocaleString("en-IN"));
			rowData.push("₹ " + parseFloat(row[2]).toFixed(2).toLocaleString("en-IN"));
			rowData.push("₹ " + parseFloat(row[3]).toFixed(2).toLocaleString("en-IN") + " (" + ((row[3] * 100) / row[2]).toFixed(2) + "%)");
			rowData.push(parseFloat(row[4]).toFixed(3).toLocaleString("en-IN"));
			rowData.push("₹ " + parseFloat(row[5]).toFixed(2).toLocaleString("en-IN"));
			rowData.push("₹ " + parseFloat(row[6]).toFixed(2).toLocaleString("en-IN") + " (" + ((row[6] * 100) / row[5]).toFixed(2) + "%)");

			tableRowsData.push(rowData);
		});

		var tableRows = [[
			"TOTAL CORPUS",
			"",
			"₹ " + parseFloat(response.data.longTermInvestedAmount).toFixed(2).toLocaleString("en-IN"),
			"",
			"",
			"₹ " + parseFloat(response.data.shortTermInvestedAmount).toFixed(2).toLocaleString("en-IN"),
			""
		]];

		setLtstFundTable(tableRows.concat(tableRowsData));
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
				style={{width:"1500px"}}
				columnsConfig="400px 100px 150px 250px 100px 150px 250px"
				data={ltstFundTable}
				header={["FUND", "LONG-TERM QUANTITY", "LONG-TERM AMOUNT", "LONG-TERM PROFIT", "SHORT-TERM QUANTITY", "SHORT-TERM AMOUNT", "SHORT-TERM PROFIT"]}
			>
			</Table>
		</>
	)
}

export default LTST;