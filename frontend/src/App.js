import "./App.css";
import { useState } from "react";
import HeaderBar from "./components/HeaderBar";
import FdComparison from "./components/FdComparison";
import { Avatar, TabList, Tab } from "@web3uikit/core";

function App() {

	const [roi, setRoi] = useState("7");
	const [wallet, setWallet] = useState("");
	const [chain, setChain] = useState("0x1");
	const [totalInvestedAmount, setTotalInvestedAmount] = useState(0);
	const [totalSimpleInterest, setTotalSimpleInterest] = useState(0);
	const [totalCompoundInterest, setTotalCompoundInterest] = useState(0);
	const [nativeValue, setNativeValue] = useState(0);
	const [nativeBalance, setNativeBalance] = useState(0);
	const [fdComparison, setFdComparison] = useState(0);
	const [tokens, setTokens] = useState([]);
	const [transfers, setTransfers] = useState([]);
	const [nfts, setNfts] = useState([]);
	const [filteredNfts, setFilteredNfts] = useState([]);


	return (
		<div className="App">
			<HeaderBar
				roi={roi}
				setRoi={setRoi}
			/>
			<div className="content">
				<TabList>
					<Tab tabKey={1} tabName={"FD Comparison"}>
						<FdComparison
							roi={roi}
							fdComparison={fdComparison}
							setFdComparison={setFdComparison}
						/>
					</Tab>
					{/* <Tab tabKey={2} tabName={"Transfers"}>
						<TransferHistory 
							chain={chain} 
							wallet={wallet}
							transfers={transfers}
							setTransfers={setTransfers}
						/>
					</Tab>
					<Tab tabKey={3} tabName={"NFT's"}>
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
