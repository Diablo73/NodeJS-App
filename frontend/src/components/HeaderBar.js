import React from "react";
import "../App.css";
import {Input} from "@web3uikit/core"

function HeaderBar({roi, setRoi}) {


	return (
		<>
			<div className="header">
				<div className="title">
					<img src="https://zerodha.com/static/images/products/coin.svg" />
					<h1>Zerodha Coin Portfolio</h1>
				</div>

				<div className="headerBar">
					<Input
						label="ROI (%)"
						value={roi}
						step={0.05}
						onChange={(e) => setRoi(e.target.value)}
						style={{maxWidth: "50px"}}
						type="number"
					/>
				</div>
			</div>
		</>
	);
}

export default HeaderBar;