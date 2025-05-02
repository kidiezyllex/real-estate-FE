import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { IconClock, IconFileAnalytics } from "@tabler/icons-react";
import type React from "react";
import SummaryRow from "./SummaryRow";
import type { TransactionSummaryData } from "./types";

interface TransactionSummaryProps {
	data: TransactionSummaryData;
}

const TransactionSummary: React.FC<TransactionSummaryProps> = ({ data }) => {
	const summaryEntries: [string, any][] = [];

	const getTimeAgo = () => {
		const timestamp = (data as any).timestamp || (data as any).time;
		if (!timestamp) return "Time not determined";

		const txTime = new Date(timestamp);
		const now = new Date();
		const diffMs = now.getTime() - txTime.getTime();
		const diffSec = Math.floor(diffMs / 1000);

		if (diffSec < 60) return `${diffSec} seconds ago`;

		const diffMin = Math.floor(diffSec / 60);
		if (diffMin < 60) return `${diffMin} minutes ago`;

		const diffHour = Math.floor(diffMin / 60);
		if (diffHour < 24) return `${diffHour} hours ago`;

		const diffDay = Math.floor(diffHour / 24);
		return `${diffDay} days ago`;
	};

	if ((data as any).label === "SANDWICH") {
		summaryEntries.push(["Transaction Type", "SANDWICH"]);
		const excludedFields = [
			"label",
			"id",
			"blockNumber",
			"profit",
			"cost",
			"revenue",
			"time",
			"frontRun",
			"victim",
			"backRun",
			"assetMetadata",
			"mevType",
		];
		if ((data as any).profit !== undefined) summaryEntries.push(["Profit", (data as any).profit + " USD"]);
		if ((data as any).cost !== undefined) summaryEntries.push(["Cost", (data as any).cost + " USD"]);
		if ((data as any).revenue !== undefined) summaryEntries.push(["Revenue", (data as any).revenue + " USD"]);
		if ((data as any).blockNumber !== undefined) summaryEntries.push(["Block Number", (data as any).blockNumber]);
		for (const [key, value] of Object.entries(data)) {
			if (!excludedFields.includes(key) && key !== "sandwichId" && value !== undefined) {
				summaryEntries.push([key, value]);
			}
		}
	} else if ((data as any).label === "ARBITRAGE") {
		summaryEntries.push(["Transaction Type", "ARBITRAGE"]);

		if ((data as any).profit !== undefined) summaryEntries.push(["Profit", (data as any).profit + " USD"]);
		if ((data as any).cost !== undefined) summaryEntries.push(["Cost", (data as any).cost + " USD"]);
		if ((data as any).revenue !== undefined) summaryEntries.push(["Revenue", (data as any).revenue + " USD"]);
		if ((data as any).time) summaryEntries.push(["Time", (data as any).time]);

		return (
			<Card className="bg-mainBackgroundV1 border border-lightBorderV1 overflow-hidden">
				<CardHeader className="flex flex-row items-center justify-between space-x-4 pb-2 bg-mainCardV1">
					<div className="flex items-center space-x-3">
						<div className="p-2 rounded-full bg-white">
							<IconFileAnalytics className="w-5 h-5 text-mainActiveV1" />
						</div>
						<div>
							<CardTitle className="text-base font-bold text-maintext">Overview</CardTitle>
							<p className="text-sm text-gray-400 mt-0.5">Transaction details and analysis</p>
						</div>
					</div>
				</CardHeader>
				<CardContent className="p-0">
					<table className="w-full">
						<tbody>
							{summaryEntries.map(([key, value], index) => (
								<SummaryRow
									key={`${key}-${index}`}
									label={key}
									value={value}
									isLast={index === summaryEntries.length - 1}
									sandwichData={(data as any).label === "SANDWICH" ? (data as any) : undefined}
								/>
							))}
						</tbody>
					</table>
				</CardContent>
				<CardFooter>
					<div className="flex items-center justify-start mt-2 text-sm text-gray-400">
						<IconClock className="h-4 w-4 mr-1" />
						<span>{getTimeAgo()}</span>
					</div>
				</CardFooter>
			</Card>
		);
	} else if ((data as any).label === "LIQUIDATION") {
		summaryEntries.push(["Transaction Type", "LIQUIDATION"]);

		if ((data as any).hash) summaryEntries.push(["Hash", (data as any).hash]);
		if ((data as any).from) summaryEntries.push(["Sender", (data as any).from]);
		if ((data as any).to) summaryEntries.push(["Recipient", (data as any).to]);
		if ((data as any).blockNumber) summaryEntries.push(["Block Number", (data as any).blockNumber]);
		if ((data as any).time) summaryEntries.push(["Time", (data as any).time]);

		if ((data as any).profit !== undefined) summaryEntries.push(["Profit", (data as any).profit.toString() + " USD"]);
		if ((data as any).cost !== undefined) summaryEntries.push(["Cost", (data as any).cost.toString() + " USD"]);
		if ((data as any).revenue !== undefined)
			summaryEntries.push(["Revenue", (data as any).revenue.toString() + " USD"]);

		if ((data as any).liquidator) summaryEntries.push(["Liquidator", (data as any).liquidator]);

		if ((data as any).liquidationEvent && (data as any).liquidationEvent.length > 0) {
			const event = (data as any).liquidationEvent[0];
			if (event.borrower) summaryEntries.push(["Borrower", event.borrower]);
			if (event.liquidatedToken) summaryEntries.push(["Liquidated Token", event.liquidatedToken]);
			if (event.liquidatedAmount) summaryEntries.push(["Liquidated Amount", event.liquidatedAmount.toString()]);
			if (event.debtToken) summaryEntries.push(["Debt Token", event.debtToken]);
			if (event.debtToCover) summaryEntries.push(["Debt to Cover", event.debtToCover.toString()]);
		}
	} else {
		summaryEntries.push(["Transaction Type", "NORMAL"]);
		Object.entries(data).forEach(([key, value]) => {
			if (key !== "label" && key !== "timestamp" && value !== undefined && key !== "mevType") {
				if (key === "time" && (data as any).timestamp) return;

				if (key === "hash") {
					summaryEntries.push(["Hash", value]);
				} else if (key === "from") {
					summaryEntries.push(["Sender", value]);
				} else if (key === "to") {
					summaryEntries.push(["Recipient", value]);
				} else if (key === "blockNumber") {
					summaryEntries.push(["Block Number", value]);
				} else if (key === "gasPrice" && value) {
					summaryEntries.push(["Gas Price", value + " Gwei"]);
				} else if (key === "gasUsed") {
					summaryEntries.push(["Gas Used", value]);
				} else if (key === "timestamp") {
					summaryEntries.push(["Time", value]);
				} else if (key === "index") {
					summaryEntries.push(["Index", value]);
				} else {
					summaryEntries.push([key, value]);
				}
			}
		});
	}

	return (
		<Card className="bg-mainBackgroundV1 border border-lightBorderV1 overflow-hidden">
			<CardHeader className="flex flex-row items-center justify-between pb-2 bg-mainActiveV1/50">
				<div className="flex items-center">
					<CardTitle className="text-base font-bold text-maintext">Overview</CardTitle>
				</div>
			</CardHeader>
			<CardContent className="p-0">
				<table className="w-full">
					<tbody>
						{summaryEntries.map(([key, value], index) => (
							<SummaryRow
								key={`${key}-${index}`}
								label={key}
								value={value}
								isLast={index === summaryEntries.length - 1}
								sandwichData={(data as any).label === "SANDWICH" ? (data as any) : undefined}
							/>
						))}
					</tbody>
				</table>
			</CardContent>
			<CardFooter>
				<div className="flex items-center justify-start mt-2 text-sm text-gray-400">
					<IconClock className="h-4 w-4 mr-1" />
					<span>{getTimeAgo()}</span>
				</div>
			</CardFooter>
		</Card>
	);
};

export default TransactionSummary;
