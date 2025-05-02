import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import type { IMevBlockTransaction } from "@/interface/response/mev";
import { gweiToEth } from "@/lib/utils";
import { mdiEthereum } from "@mdi/js";
import Icon from "@mdi/react";
import type React from "react";
import { useState } from "react";
import AddressLink from "./AddressLink";
import Blockie from "./Blockie";
import TransactionLink from "./TransactionLink";

interface BlockTransactionsTableProps {
	transactions: IMevBlockTransaction[] | undefined;
}

const BlockTransactionsTable: React.FC<BlockTransactionsTableProps> = ({ transactions }) => {
	const [currentPage, setCurrentPage] = useState<number>(1);
	const pageSize = 50; // 50 transactions per page

	const getCurrentPageData = () => {
		if (!transactions) return [];
		const startIndex = (currentPage - 1) * pageSize;
		return transactions.slice(startIndex, startIndex + pageSize);
	};

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	if (!transactions || transactions.length === 0) {
		return (
			<Card className="bg-mainBackgroundV1 border border-lightBorderV1">
				<CardHeader className="flex flex-row items-center justify-between pb-2 bg-mainActiveV1/50">
					<div className="flex items-center">
						<CardTitle className="text-base font-bold text-maintext">Block Transactions</CardTitle>
					</div>
				</CardHeader>
				<CardContent className="p-6 flex justify-center items-center">
					<p className="text-[#909296]">No transactions found in this block.</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="bg-mainBackgroundV1 border border-lightBorderV1 overflow-hidden">
			<CardHeader className="flex flex-row items-center justify-between pb-2 bg-mainActiveV1/50">
				<div className="flex items-center">
					<CardTitle className="text-base font-bold text-maintext">Block Transactions</CardTitle>
				</div>
			</CardHeader>

			<CardContent className="p-0">
				<div className="overflow-x-auto">
					<table className="w-full border-collapse">
						<thead className="bg-mainCardV1">
							<tr>
								<th className="py-2 px-4 text-left text-[#909296] text-xs font-medium">
									<div className="flex items-center space-x-1">
										<Icon path={mdiEthereum} size={0.7} />
										<span>Tx Hash</span>
									</div>
								</th>
								<th className="py-2 px-4 text-left text-[#909296] text-xs font-medium">Block</th>
								<th className="py-2 px-4 text-left text-[#909296] text-xs font-medium">From</th>
								<th className="py-2 px-4 text-left text-[#909296] text-xs font-medium">To</th>
								<th className="py-2 px-4 text-right text-[#909296] text-xs font-medium">Gas Price</th>
								<th className="py-2 px-4 text-right text-[#909296] text-xs font-medium">Gas Used</th>
								<th className="py-2 px-4 text-center text-[#909296] text-xs font-medium">Type</th>
							</tr>
						</thead>
						<tbody>
							{getCurrentPageData().map((tx, index) => (
								<tr key={index} className="border-b border-lightBorderV1 hover:bg-mainCardV1/50">
									<td className="py-3 px-4">
										<div className="flex items-center space-x-2">
											<TransactionLink hash={tx.hash} shorten={true} />
										</div>
									</td>
									<td className="py-3 px-4">
										<span className="text-sm text-maintext">{tx.blockNumber}</span>
									</td>
									<td className="py-3 px-4">
										<div className="flex items-center space-x-2">
											<Blockie address={tx.from} size={18} />
											<AddressLink address={tx.from} shorten={true} />
										</div>
									</td>
									<td className="py-3 px-4">
										<div className="flex items-center space-x-2">
											<Blockie address={tx.to} size={18} />
											<AddressLink address={tx.to} shorten={true} />
										</div>
									</td>
									<td className="py-3 px-4 text-right">
										<span className="text-sm text-maintext">{gweiToEth(tx.gasPrice)} ETH</span>
									</td>
									<td className="py-3 px-4 text-right">
										<span className="text-sm text-maintext">{tx.gasUsed}</span>
									</td>
									<td className="py-3 px-4 text-center">
										{tx.label ? (
											<span className="text-sm font-medium bg-mainActiveV1/20 text-mainActiveV1 px-2 py-0.5 rounded">
												{tx.label}
											</span>
										) : (
											<span className="text-sm font-medium bg-gray-500/20 text-[#909296] px-2 py-0.5 rounded">
												Normal
											</span>
										)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</CardContent>

			<CardFooter>
				<div className="w-full flex items-center justify-between mt-2">
					<div className="text-sm text-[#909296]">
						<span>Total: {transactions.length} transactions</span>
					</div>
					<Pagination
						current={currentPage}
						pageSize={pageSize}
						total={transactions.length}
						onChange={handlePageChange}
					/>
				</div>
			</CardFooter>
		</Card>
	);
};

export default BlockTransactionsTable;
