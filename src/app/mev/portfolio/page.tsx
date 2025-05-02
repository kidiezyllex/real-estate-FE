"use client";

import CopyButton from "@/components/TxPage/CopyButton";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useGetMevByAddress } from "@/hooks/useMev";
import { gweiToEth } from "@/lib/utils";
import { useAddress } from "@/stores/useAddress";
import { mdiEthereum, mdiUnfoldMoreHorizontal } from "@mdi/js";
import Icon from "@mdi/react";
import { IconCurrencyEthereum } from "@tabler/icons-react";
import { message } from "antd";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Transaction {
	hash: string;
	blockNumber: number;
	from: string;
	to: string;
	gasPrice: string;
	gasUsed: string;
	timestamp: string;
	label: string;
	index: number;
}

const Portfolio = () => {
	const [isConnected, setIsConnected] = useState<boolean>(true);
	const { account } = useAddress();
	const { data, isLoading, error } = useGetMevByAddress(isConnected ? account || "" : "");
	const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
	const [sortedTransactions, setSortedTransactions] = useState<Transaction[] | undefined>([]);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const pageSize = 50;
	const [sortBy, setSortBy] = useState<"timestamp" | "blockNumber" | "index">("timestamp");
	const [copied, setCopied] = useState<string | null>(null);

	useEffect(() => {
		const handleDisconnectEvent = () => {
			setIsConnected(false);
		};

		const handleConnectEvent = () => {
			setIsConnected(true);
		};

		window.addEventListener("wallet-disconnect", handleDisconnectEvent);
		window.addEventListener("wallet-connect", handleConnectEvent);

		return () => {
			window.removeEventListener("wallet-disconnect", handleDisconnectEvent);
			window.removeEventListener("wallet-connect", handleConnectEvent);
		};
	}, []);

	useEffect(() => {
		if (data) {
			setSortedTransactions(sortData(data as any, sortBy, sortDirection));
		}
	}, [data, sortBy, sortDirection]);

	useEffect(() => {
		const handleDisconnectEvent = () => {
			setIsConnected(false);
		};

		const handleConnectEvent = () => {
			setIsConnected(true);
		};

		window.addEventListener("wallet-disconnect", handleDisconnectEvent);
		window.addEventListener("wallet-connect", handleConnectEvent);

		return () => {
			window.removeEventListener("wallet-disconnect", handleDisconnectEvent);
			window.removeEventListener("wallet-connect", handleConnectEvent);
		};
	}, []);

	const handleCopy = async (text: string, index: number) => {
		try {
			await navigator.clipboard.writeText(text);
			setCopied(text);
			message.success(`Copied ${text} to clipboard!`);
			setTimeout(() => setCopied(null), 2000);
		} catch (_) {
			message.error("Copy failed.");
		}
	};
	useEffect(() => {
		if (data) {
			setSortedTransactions(sortData(data as any, sortBy, sortDirection));
		}
	}, [data, sortBy, sortDirection]);

	const sortData = (data: Transaction[], sortField: string, direction: "asc" | "desc") => {
		return [...data].sort((a, b) => {
			let valueA;
			let valueB;

			if (sortField === "timestamp") {
				valueA = new Date(a.timestamp).getTime();
				valueB = new Date(b.timestamp).getTime();
			} else if (sortField === "blockNumber") {
				valueA = a.blockNumber;
				valueB = b.blockNumber;
			} else if (sortField === "index") {
				valueA = a.index;
				valueB = b.index;
			}

			if (direction === "asc") {
				return (valueA ?? 0) < (valueB ?? 0) ? -1 : 1;
			} else {
				return (valueA ?? 0) > (valueB ?? 0) ? -1 : 1;
			}
		});
	};

	const handleSort = (field: "timestamp" | "blockNumber" | "index") => {
		if (sortBy === field) {
			setSortDirection(sortDirection === "asc" ? "desc" : "asc");
		} else {
			setSortBy(field);
			setSortDirection("desc");
		}
	};

	const getCurrentPageData = () => {
		if (!sortedTransactions) return [];
		const startIndex = (currentPage - 1) * pageSize;
		return sortedTransactions.slice(startIndex, startIndex + pageSize);
	};

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	if (!isConnected || error || !data || data.length === 0) {
		return (
			<div className="px-6 py-4">
				<div className="flex flex-col space-y-4">
					<div className="flex items-center justify-between">
						<h1 className="text-2xl font-bold text-maintext">MEV Transactions by Address</h1>
					</div>
					<Card className="bg-mainBackgroundV1 border border-lightBorderV1">
						<CardHeader className="flex flex-row items-center justify-between space-x-4 pb-2 bg-mainCardV1">
							<div className="flex items-center space-x-3">
								<div className="p-2 rounded-full bg-white">
									<IconCurrencyEthereum className="w-5 h-5 text-mainActiveV1" />
								</div>
								<div>
									<CardTitle className="text-base font-bold text-maintext flex items-center space-x-2">
										<span>Ethereum MEV Transactions</span>
									</CardTitle>
									<p className="text-sm text-gray-400 mt-0.5">Monitoring latest MEV activities on Ethereum network</p>
								</div>
							</div>
						</CardHeader>
						<CardContent className="p-6 flex justify-center items-center">
							<div className="flex flex-col items-center justify-center py-2">
								<Icon path={mdiEthereum} size={1} className="text-gray-400 mb-2" />
								<p className="text-gray-400 text-center">
									{!isConnected
										? "Please connect to view the MEV transaction list."
										: "No MEV transactions found for this address."}
								</p>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		);
	}

	const formatTimeAgo = (timestamp: string) => {
		try {
			return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
		} catch (error) {
			return "Unknown";
		}
	};

	const getLabelColor = (label: string | null) => {
		switch (label) {
			case "ARBITRAGE":
				return "bg-blue-500/10 text-blue-500";
			case "SANDWICH":
				return "bg-orange-500/10 text-orange-500";
			case "LIQUIDATION":
				return "bg-red-500/10 text-red-500";
			default:
				return "bg-gray-500/10 text-gray-500";
		}
	};

	if (isLoading) {
		return (
			<div className="p-6">
				<Card className="bg-mainBackgroundV1 border border-lightBorderV1">
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<div className="flex items-center">
							<Skeleton className="h-5 w-[150px]" />
							<Skeleton className="ml-1 h-4 w-4 rounded-full" />
						</div>
						<Skeleton className="h-7 w-7" />
					</CardHeader>

					<CardContent className="p-0">
						<div className="overflow-x-auto max-w-full">
							<Table className="min-w-[1000px]">
								<TableHeader className="bg-mainCardV1">
									<TableRow>
										<TableHead className="py-2 px-3 text-left text-[#909296] text-xs font-medium w-[15%]">
											<div className="flex items-center space-x-1">
												<Icon path={mdiEthereum} size={0.7} />
												<span>Hash</span>
											</div>
										</TableHead>
										<TableHead className="py-2 px-3 text-center text-[#909296] text-xs font-medium w-[10%]">
											<div className="flex items-center justify-center space-x-1 w-full">
												<span>Block</span>
												<Icon path={mdiUnfoldMoreHorizontal} size={0.7} />
											</div>
										</TableHead>
										<TableHead className="py-2 px-3 text-left text-[#909296] text-xs font-medium w-[15%]">
											<span>From</span>
										</TableHead>
										<TableHead className="py-2 px-3 text-left text-[#909296] text-xs font-medium w-[15%]">
											<span>To</span>
										</TableHead>
										<TableHead className="py-2 px-3 text-right text-[#909296] text-xs font-medium w-[10%]">
											<span>Gas Price</span>
										</TableHead>
										<TableHead className="py-2 px-3 text-right text-[#909296] text-xs font-medium w-[10%]">
											<span>Gas Used</span>
										</TableHead>
										<TableHead className="py-2 px-3 text-center text-[#909296] text-xs font-medium w-[15%]">
											<div className="flex items-center justify-center space-x-1 w-full">
												<span>Time</span>
												<Icon path={mdiUnfoldMoreHorizontal} size={0.7} />
											</div>
										</TableHead>
										<TableHead className="py-2 px-3 text-center text-[#909296] text-xs font-medium w-[5%]">
											<span>Type</span>
										</TableHead>
										<TableHead className="py-2 px-3 text-center text-[#909296] text-xs font-medium w-[5%]">
											<div className="flex items-center justify-center space-x-1 w-full">
												<span>Index</span>
												<Icon path={mdiUnfoldMoreHorizontal} size={0.7} />
											</div>
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{Array.from({ length: 10 }).map((_, index) => (
										<TableRow key={index} className="border-b border-lightBorderV1">
											<TableCell className="py-2 px-3">
												<Skeleton className="h-4 w-full" />
											</TableCell>
											<TableCell className="py-2 px-3">
												<Skeleton className="h-4 w-full" />
											</TableCell>
											<TableCell className="py-2 px-3">
												<Skeleton className="h-4 w-full" />
											</TableCell>
											<TableCell className="py-2 px-3">
												<Skeleton className="h-4 w-full" />
											</TableCell>
											<TableCell className="py-2 px-3">
												<Skeleton className="h-4 w-full" />
											</TableCell>
											<TableCell className="py-2 px-3">
												<Skeleton className="h-4 w-full" />
											</TableCell>
											<TableCell className="py-2 px-3">
												<Skeleton className="h-4 w-full" />
											</TableCell>
											<TableCell className="py-2 px-3">
												<Skeleton className="h-4 w-[50px] rounded-full" />
											</TableCell>
											<TableCell className="py-2 px-3">
												<Skeleton className="h-4 w-[30px]" />
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					</CardContent>
					<CardFooter>
						<div className="w-full flex items-center justify-between mt-2">
							<Skeleton className="h-4 w-[150px]" />
							<Skeleton className="h-8 w-[200px]" />
						</div>
					</CardFooter>
				</Card>
			</div>
		);
	}

	if (!isConnected || error || !data || data.length === 0) {
		return (
			<div className="p-6">
				<Card className="bg-mainBackgroundV1 border border-lightBorderV1">
					<CardHeader className="flex flex-row items-center justify-between space-x-4 pb-2 bg-mainCardV1">
						<div className="flex items-center space-x-3">
							<div className="p-2 rounded-full bg-white">
								<IconCurrencyEthereum className="w-5 h-5 text-mainActiveV1" />
							</div>
							<div>
								<CardTitle className="text-base font-bold text-maintext flex items-center space-x-2">
									<span>Ethereum MEV Transactions</span>
								</CardTitle>
								<p className="text-sm text-gray-400 mt-0.5">Monitoring latest MEV activities on Ethereum network</p>
							</div>
						</div>
					</CardHeader>
					<CardContent className="p-6 flex justify-center items-center">
						<p className="text-[#909296]">
							{!isConnected
								? "Please connect to view the MEV transaction list."
								: "No MEV transactions found for this address."}
						</p>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="p-6">
			<Card className="bg-mainBackgroundV1 border border-lightBorderV1">
				<CardHeader className="flex flex-row items-center justify-between space-x-4 pb-2 bg-mainCardV1">
					<div className="flex items-center space-x-3">
						<div className="p-2 rounded-full bg-white">
							<IconCurrencyEthereum className="w-5 h-5 text-mainActiveV1" />
						</div>
						<div>
							<CardTitle className="text-base font-bold text-maintext flex items-center space-x-2">
								<span>Details about MEV transactions</span>
							</CardTitle>
							<p className="text-sm text-gray-400 mt-0.5">Monitoring latest MEV activities on Ethereum network</p>
						</div>
					</div>
				</CardHeader>

				<CardContent className="p-0">
					<div className="overflow-x-auto max-w-full">
						<Table className="min-w-[1000px]">
							<TableHeader className="bg-mainCardV1">
								<TableRow>
									<TableHead className="py-2 px-3 text-left text-[#909296] text-xs font-medium w-[15%]">
										<div className="flex items-center space-x-1">
											<Icon path={mdiEthereum} size={0.7} />
											<span>Hash</span>
										</div>
									</TableHead>
									<TableHead className="py-2 px-3 text-center text-[#909296] text-xs font-medium w-[10%]">
										<button
											className="flex items-center justify-center space-x-1 w-full cursor-pointer"
											onClick={() => handleSort("blockNumber")}
										>
											<span>Block</span>
											<Icon path={mdiUnfoldMoreHorizontal} size={0.7} />
										</button>
									</TableHead>
									<TableHead className="py-2 px-3 text-left text-[#909296] text-xs font-medium w-[15%]">
										<div className="flex items-center space-x-1">
											<span>From</span>
										</div>
									</TableHead>
									<TableHead className="py-2 px-3 text-left text-[#909296] text-xs font-medium w-[15%]">
										<div className="flex items-center space-x-1">
											<span>To</span>
										</div>
									</TableHead>
									<TableHead className="py-2 px-3 text-right text-[#909296] text-xs font-medium w-[10%]">
										<div className="flex items-center justify-end space-x-1">
											<span>Gas Price</span>
										</div>
									</TableHead>
									<TableHead className="py-2 px-3 text-right text-[#909296] text-xs font-medium w-[10%]">
										<div className="flex items-center justify-end space-x-1">
											<span>Gas Used</span>
										</div>
									</TableHead>
									<TableHead className="py-2 px-3 text-center text-[#909296] text-xs font-medium w-[15%]">
										<button
											className="flex items-center justify-center space-x-1 w-full cursor-pointer"
											onClick={() => handleSort("timestamp")}
										>
											<span>Time</span>
											<Icon path={mdiUnfoldMoreHorizontal} size={0.7} />
										</button>
									</TableHead>
									<TableHead className="py-2 px-3 text-center text-[#909296] text-xs font-medium w-[5%]">
										<div className="flex items-center justify-center space-x-1">
											<span>Type</span>
										</div>
									</TableHead>
									<TableHead className="py-2 px-3 text-center text-[#909296] text-xs font-medium w-[5%]">
										<button
											className="flex items-center justify-center space-x-1 w-full cursor-pointer"
											onClick={() => handleSort("index")}
										>
											<span>Index</span>
											<Icon path={mdiUnfoldMoreHorizontal} size={0.7} />
										</button>
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{getCurrentPageData().map((tx, index) => (
									<TableRow key={index} className="border-b border-lightBorderV1 hover:bg-mainCardV1/50">
										<TableCell className="py-2 px-3">
											<div className="flex items-center space-x-1">
												<Link
													href={`/mev/tx/${tx.hash}`}
													className="text-xs text-mainActiveV1 hover:underline truncate"
												>
													{tx.hash.slice(0, 8)}...{tx.hash.slice(-6)}
												</Link>
												<CopyButton
													text={tx.hash}
													onCopy={(text) => handleCopy(text, index)}
													copied={copied === tx.hash}
												/>
											</div>
										</TableCell>
										<TableCell className="py-2 px-3 text-center">
											<Link href={`/mev/block/${tx.blockNumber}`} className="text-xs text-mainActiveV1 hover:underline">
												{tx.blockNumber}
											</Link>
										</TableCell>
										<TableCell className="py-2 px-3">
											<div className="flex items-center space-x-1">
												<Link
													href={`/mev/address/${tx.from}`}
													className="text-xs text-maintext hover:text-mainActiveV1 truncate"
												>
													{tx.from.slice(0, 6)}...{tx.from.slice(-4)}
												</Link>
												<CopyButton
													text={tx.from}
													onCopy={(text) => handleCopy(text, index)}
													copied={copied === tx.from}
												/>
											</div>
										</TableCell>
										<TableCell className="py-2 px-3">
											<div className="flex items-center space-x-1">
												<Link
													href={`/mev/address/${tx.to}`}
													className="text-xs text-maintext hover:text-mainActiveV1 truncate"
												>
													{tx.to.slice(0, 6)}...{tx.to.slice(-4)}
												</Link>
												<CopyButton text={tx.to} onCopy={(text) => handleCopy(text, index)} copied={copied === tx.to} />
											</div>
										</TableCell>
										<TableCell className="py-2 px-3 text-right">
											<span className="text-xs text-maintext">{gweiToEth(tx.gasPrice)}</span>
										</TableCell>
										<TableCell className="py-2 px-3 text-right">
											<span className="text-xs text-maintext">{tx.gasUsed}</span>
										</TableCell>
										<TableCell className="py-2 px-3 text-center">
											<span className="text-xs text-[#909296]">{formatTimeAgo(tx.timestamp)}</span>
										</TableCell>
										<TableCell className="py-2 px-3 text-center">
											<Badge className={`${getLabelColor(tx.label)}`}>{tx.label || "UNKNOWN"}</Badge>
										</TableCell>
										<TableCell className="py-2 px-3 text-center">
											<span className="text-xs text-maintext">{tx.index}</span>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				</CardContent>

				<CardFooter>
					<div className="w-full flex items-center justify-between mt-2">
						<div className="text-sm text-[#909296]">
							<span>Total: {data.length} transactions</span>
						</div>
						<Pagination current={currentPage} pageSize={pageSize} total={data.length} onChange={handlePageChange} />
					</div>
				</CardFooter>
			</Card>
		</div>
	);
};

export default Portfolio;
