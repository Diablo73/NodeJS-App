import "./App.css";
import { useState } from "react";
import HeaderBar from "./components/HeaderBar";
import PortfolioSummary from "./components/PortfolioSummary";
import LTST from "./components/LTST";
import { TabList, Tab } from "@web3uikit/core";

function App() {

	const [roi, setRoi] = useState("7");
	// const [totalInvestedAmount, setTotalInvestedAmount] = useState(0);
	// const [totalSimpleInterest, setTotalSimpleInterest] = useState(0);
	// const [totalCompoundInterest, setTotalCompoundInterest] = useState(0);
	const [fdComparison, setFdComparison] = useState({});
	const [ltstSummary, setLtstSummary] = useState([]);


	return (
		<div className="App">
			<HeaderBar
				roi={roi}
				setRoi={setRoi}
			/>
			<div className="content">
				<TabList>
					<Tab tabKey={1} tabName={"Portfolio Summary"}>
						<PortfolioSummary
							roi={roi}
							fdComparison={fdComparison}
							setFdComparison={setFdComparison}
							ltstSummary={ltstSummary}
							setLtstSummary={setLtstSummary}
						/>
					</Tab>
					<Tab tabKey={2} tabName={"LTST"}>
						<LTST 
						/>
					</Tab>
					{/* <Tab tabKey={3} tabName={"NFT's"}>
						<Nfts 
							wallet={wallet} 
							chain={chain}
							nfts={nfts}
							setNfts={setNfts}
							filteredNfts={filteredNfts}
							setFilteredNfts={setFilteredNfts}
						/>
					</Tab> */}
				</TabList>	
			</div>
		</div>
	);
}

export default App;
