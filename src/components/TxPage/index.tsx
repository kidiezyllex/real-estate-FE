import { getMevBlockByNumber } from "@/api/mev";
import { useGetMevTransactionByHash } from "@/hooks/useMev";
import { mdiConsole, mdiEthereum, mdiMagnify } from "@mdi/js";
import Icon from "@mdi/react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { usePathname, useSearchParams } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";
import BlockTransactionsTable from "./BlockTransactionsTable";
import LoadingState from "./LoadingState";
import TracesTable from "./TracesTable";
import TransactionDiagram from "./TransactionDiagram";
import TransactionSummary from "./TransactionSummary";
import { getTransactionType } from "./utils";

export const EthereumTxPage: React.FC = () => {
	const [isLoading, setIsLoading] = useState(true);
	const pathname = usePathname();
	const hash = pathname.split("/")[5] || pathname.split("/")[4];
	const searchParams = useSearchParams();
	const activeTab = searchParams.get("tab") || "token-flow";
	const { data: apiResponse } = useGetMevTransactionByHash(hash);
	const shouldFetchBlock = Boolean(apiResponse?.blockNumber) && activeTab === "block";
	const { data: blockData } = useQuery({
		queryKey: ["mev", "block", apiResponse?.blockNumber],
		queryFn: () => getMevBlockByNumber(apiResponse?.blockNumber || 0),
		enabled: shouldFetchBlock,
	});

	const transactionType = getTransactionType(apiResponse?.label);

	// TODO: Fix transaction data
	const getSummaryData = (apiResponse: any) => {
		if (!apiResponse) {
			return {
				label: "None",
				transactionHash: "",
				from: "",
				contractTo: "",
				blockNumber: 0,
				gasPrice: "",
				gasUsed: "",
				time: "",
				timestamp: "",
			};
		}

		if (apiResponse?.label === "ARBITRAGE") {
			return {
				label: "ARBITRAGE",
				hash: apiResponse.hash,
				from: apiResponse.from,
				to: apiResponse.to,
				blockNumber: apiResponse.blockNumber,
				index: apiResponse.index,
				profit: apiResponse.profit,
				cost: apiResponse.cost,
				revenue: apiResponse.revenue,
				time: apiResponse.time,
				traces: apiResponse.traces,
				assetMetadata: apiResponse.assetMetadata,
			};
		} else if (apiResponse?.label === "SANDWICH") {
			return {
				label: "SANDWICH",
				id: apiResponse.id,
				blockNumber: apiResponse.blockNumber,
				profit: apiResponse.profit,
				cost: apiResponse.cost,
				revenue: apiResponse.revenue,
				time: apiResponse.time,
				frontRun: apiResponse.frontRun,
				victim: apiResponse.victim,
				backRun: apiResponse.backRun,
				assetMetadata: apiResponse.assetMetadata,
			};
		} else if (apiResponse?.label === "LIQUIDATION") {
			return {
				label: "LIQUIDATION",
				hash: apiResponse.hash,
				from: apiResponse.from,
				to: apiResponse.to,
				blockNumber: apiResponse.blockNumber,
				profit: apiResponse.profit,
				cost: apiResponse.cost,
				revenue: apiResponse.revenue,
				time: apiResponse.time,
				liquidator: apiResponse.liquidator,
				liquidationEvent: apiResponse.liquidationEvent,
				traces: apiResponse.traces,
				assetMetadata: apiResponse.assetMetadata,
			};
		} else {
			return {
				label: null,
				hash: apiResponse.hash,
				blockNumber: apiResponse.blockNumber,
				from: apiResponse.from,
				to: apiResponse.to,
				gasPrice: apiResponse.gasPrice,
				gasUsed: apiResponse.gasUsed,
				timestamp: apiResponse.timestamp,
				index: apiResponse.index,
			};
		}
	};

	const transactionData = getSummaryData(apiResponse);

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsLoading(false);
		}, 1500);

		return () => clearTimeout(timer);
	}, []);

	const renderContent = () => {
		if (isLoading) {
			return <LoadingState />;
		}
		switch (activeTab) {
			case "block":
				return (
					<div className="grid grid-cols-1 gap-6">
						<BlockTransactionsTable transactions={blockData?.transactions} />
						<TransactionSummary data={transactionData} />
					</div>
				);
			case "from":
			case "to":
				return (
					<div className="grid grid-cols-1 gap-6">
						<div className="p-6 bg-mainBackgroundV1 border border-lightBorderV1 rounded-md text-center">
							<p className="text-[#909296]">Unsupported.</p>
						</div>
						<TransactionSummary data={transactionData} />
					</div>
				);
			default:
				if (transactionData?.label === "SANDWICH") {
					return (
						<div className="grid grid-cols-1 gap-6">
							<TransactionSummary data={transactionData} />
							<h2 className="text-lg font-semibold text-maintext mt-2">Front Run Transaction</h2>
							<TracesTable
								traces={apiResponse?.frontRun?.[0]?.traces}
								assetMetadata={apiResponse?.frontRun?.[0]?.assetMetadata}
							/>
							<h2 className="text-lg font-semibold text-maintext mt-2">Victim Transaction</h2>
							<TracesTable
								traces={apiResponse?.victim?.[0]?.traces}
								assetMetadata={apiResponse?.victim?.[0]?.assetMetadata}
							/>
							<h2 className="text-lg font-semibold text-maintext mt-2">Back Run Transaction</h2>
							<TracesTable
								traces={apiResponse?.backRun?.[0]?.traces}
								assetMetadata={apiResponse?.backRun?.[0]?.assetMetadata}
							/>
							<TransactionDiagram transactionHash={transactionData?.id || hash} />
						</div>
					);
				} else if (transactionData?.label === "LIQUIDATION") {
					return (
						<div className="grid grid-cols-1 gap-6">
							<TransactionSummary data={transactionData} />
							<h2 className="text-lg font-semibold text-maintext mt-2">Liquidation Traces</h2>
							<TracesTable traces={apiResponse?.traces} assetMetadata={apiResponse?.assetMetadata} />
							<TransactionDiagram transactionHash={transactionData?.hash || hash} />
						</div>
					);
				} else if (transactionData?.label === "ARBITRAGE") {
					return (
						<div className="grid grid-cols-1 gap-6">
							<TransactionSummary data={transactionData} />
							<h2 className="text-lg font-semibold text-maintext mt-2">Arbitrage Traces</h2>
							<TracesTable traces={apiResponse?.traces} assetMetadata={apiResponse?.assetMetadata} />
							<TransactionDiagram transactionHash={transactionData?.hash || hash} />
						</div>
					);
				} else {
					return (
						<div className="grid grid-cols-1 gap-6">
							<TransactionSummary data={transactionData} />
							<TracesTable traces={apiResponse?.traces} assetMetadata={apiResponse?.assetMetadata} />
							<TransactionDiagram transactionHash={hash} />
						</div>
					);
				}
		}
	};

	return (
		<div className="min-h-screen bg-mainDarkBackgroundV1 text-maintext">
			<div className="px-6">
				<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
					<div className="flex flex-col space-y-4">
						<div className="flex justify-between items-center mb-4 mt-4">
							<div className="flex items-center justify-between w-full">
								<h1 className="text-2xl font-bold text-maintext">{transactionType}</h1>
								<div className="flex items-center space-x-1">
									<button className="p-1 rounded-full hover:bg-accent/50">
										<Icon path={mdiMagnify} size={0.8} className="text-maintext" />
									</button>
									<button className="p-1 rounded-full hover:bg-accent/50">
										<Icon path={mdiEthereum} size={0.8} className="text-maintext" />
									</button>
									<button className="p-1 rounded-full hover:bg-accent/50">
										<Icon path={mdiConsole} size={0.8} className="text-maintext" />
									</button>
								</div>
							</div>
						</div>
						{renderContent()}
					</div>
				</motion.div>
			</div>
		</div>
	);
};

export default EthereumTxPage;
