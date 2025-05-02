"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetMevLatestWithParams } from "@/hooks/useMev";
import type { IMevTransaction } from "@/interface/response/mev";
import { gweiToEth } from "@/lib/utils";
import {
	IconChevronLeft,
	IconChevronRight,
	IconChevronsDown,
	IconChevronsUp,
	IconCurrencyEthereum,
} from "@tabler/icons-react";
import { format } from "date-fns";
import Link from "next/link";
import { useEffect, useState } from "react";

const take = 50;

export default function LatestMevPage() {
	const [lastTxHash, setLastTxHash] = useState<string | undefined>(undefined);
	const [previousHashes, setPreviousHashes] = useState<string[]>([]);
	const [isScrolling, setIsScrolling] = useState(false);

	const { data: transactions, isLoading } = useGetMevLatestWithParams({
		limit: take,
		lastTxHash,
	});

	useEffect(() => {
		let scrollTimer: NodeJS.Timeout;

		const handleScroll = () => {
			setIsScrolling(true);

			if (scrollTimer) {
				clearTimeout(scrollTimer);
			}

			scrollTimer = setTimeout(() => {
				setIsScrolling(false);
			}, 1000);
		};

		window.addEventListener("scroll", handleScroll);
		return () => {
			window.removeEventListener("scroll", handleScroll);
			if (scrollTimer) {
				clearTimeout(scrollTimer);
			}
		};
	}, []);

	const handleNextPage = () => {
		if (transactions?.lastTxHash) {
			setPreviousHashes((prev) => [...prev, lastTxHash || ""]);
			setLastTxHash(transactions.lastTxHash);
		}
	};

	const handlePrevPage = () => {
		if (previousHashes.length > 0) {
			const newPreviousHashes = [...previousHashes];
			const previousHash = newPreviousHashes.pop();
			setPreviousHashes(newPreviousHashes);
			setLastTxHash(previousHash);
		}
	};

	const scrollToTop = () => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	const scrollToBottom = () => {
		window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
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
			<div className="px-6 py-4">
				<div className="flex flex-col space-y-4">
					<div className="flex items-center justify-between">
						<h1 className="text-2xl font-bold text-maintext">Latest MEV Transactions</h1>
					</div>
					<Card className="bg-mainBackgroundV1 border border-lightBorderV1 overflow-hidden">
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
						<CardContent className="p-0">
							<div className="overflow-x-auto">
								<table className="w-full border-collapse">
									<thead>
										<tr className="border-b border-lightBorderV1">
											<th className="py-3 px-4 text-left text-sm font-semibold text-maintext">Tx Hash</th>
											<th className="py-3 px-4 text-left text-sm font-semibold text-maintext">Block</th>
											<th className="py-3 px-4 text-left text-sm font-semibold text-maintext">Type</th>
											<th className="py-3 px-4 text-left text-sm font-semibold text-maintext">From</th>
											<th className="py-3 px-4 text-left text-sm font-semibold text-maintext">To</th>
											<th className="py-3 px-4 text-left text-sm font-semibold text-maintext">Gas Price</th>
											<th className="py-3 px-4 text-left text-sm font-semibold text-maintext">Gas Used</th>
											<th className="py-3 px-4 text-left text-sm font-semibold text-maintext">Time</th>
										</tr>
									</thead>
									<tbody>
										{[1, 2, 3, 4, 5].map((item) => (
											<tr key={item} className="border-b border-lightBorderV1">
												<td className="py-3 px-4">
													<Skeleton className="h-4 w-24" />
												</td>
												<td className="py-3 px-4">
													<Skeleton className="h-4 w-16" />
												</td>
												<td className="py-3 px-4">
													<Skeleton className="h-4 w-20" />
												</td>
												<td className="py-3 px-4">
													<Skeleton className="h-4 w-24" />
												</td>
												<td className="py-3 px-4">
													<Skeleton className="h-4 w-24" />
												</td>
												<td className="py-3 px-4">
													<Skeleton className="h-4 w-20" />
												</td>
												<td className="py-3 px-4">
													<Skeleton className="h-4 w-16" />
												</td>
												<td className="py-3 px-4">
													<Skeleton className="h-4 w-32" />
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
							<div className="flex items-center justify-between p-4 border-t border-lightBorderV1">
								<Button disabled variant="outline" className="text-maintext border-lightBorderV1">
									<IconChevronLeft className="w-4 h-4 mr-2" />
									Previous
								</Button>
								<Button disabled variant="outline" className="text-maintext border-lightBorderV1">
									Next
									<IconChevronRight className="w-4 h-4 ml-2" />
								</Button>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		);
	}

	return (
		<div className="px-6 py-4">
			<div className="flex flex-col space-y-4">
				<div className="flex items-center justify-between">
					<h1 className="text-2xl font-bold text-maintext">Latest MEV Transactions</h1>
				</div>

				<Card className="bg-mainBackgroundV1 border border-lightBorderV1 overflow-hidden">
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
					<CardContent className="p-0">
						<div className="overflow-x-auto">
							<table className="w-full border-collapse">
								<thead>
									<tr className="border-b border-lightBorderV1">
										<th className="py-3 px-4 text-left text-sm font-semibold text-maintext">Tx Hash</th>
										<th className="py-3 px-4 text-left text-sm font-semibold text-maintext">Block</th>
										<th className="py-3 px-4 text-left text-sm font-semibold text-maintext">Type</th>
										<th className="py-3 px-4 text-left text-sm font-semibold text-maintext">From</th>
										<th className="py-3 px-4 text-left text-sm font-semibold text-maintext">To</th>
										<th className="py-3 px-4 text-left text-sm font-semibold text-maintext">Gas Price</th>
										<th className="py-3 px-4 text-left text-sm font-semibold text-maintext">Gas Used</th>
										<th className="py-3 px-4 text-left text-sm font-semibold text-maintext">Time</th>
									</tr>
								</thead>
								<tbody>
									{transactions?.txs?.map((tx: IMevTransaction) => (
										<tr key={tx.hash} className="border-b border-lightBorderV1">
											<td className="py-3 px-4">
												<Link href={`/mev/tx/${tx.hash}`} className="text-sm text-blue-500 hover:underline">
													{tx.hash.slice(0, 6)}...{tx.hash.slice(-4)}
												</Link>
											</td>
											<td className="py-3 px-4">
												<Link href={`/mev/blocks/${tx.blockNumber}`} className="text-sm text-blue-500 hover:underline">
													{tx.blockNumber}
												</Link>
											</td>
											<td className="py-3 px-4">
												<Badge className={`${getLabelColor(tx.label)}`}>{tx.label || "UNKNOWN"}</Badge>
											</td>
											<td className="py-3 px-4">
												<span className="text-sm text-maintext">
													{tx.from.slice(0, 6)}...{tx.from.slice(-4)}
												</span>
											</td>
											<td className="py-3 px-4">
												<span className="text-sm text-maintext">
													{tx.to.slice(0, 6)}...{tx.to.slice(-4)}
												</span>
											</td>
											<td className="py-3 px-4">
												<span className="text-sm text-maintext">{tx.gasPrice ? gweiToEth(tx.gasPrice) : "-"} ETH</span>
											</td>
											<td className="py-3 px-4">
												<span className="text-sm text-maintext">{tx.gasUsed || "-"}</span>
											</td>
											<td className="py-3 px-4">
												<span className="text-sm text-maintext">
													{tx.timestamp ? format(new Date(tx.timestamp), "dd/MM/yyyy HH:mm:ss") : "-"}
												</span>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>

						<div className="flex items-center justify-between p-4 border-t border-lightBorderV1">
							<Button
								onClick={handlePrevPage}
								disabled={previousHashes.length === 0}
								variant="outline"
								className="text-maintext border-lightBorderV1"
							>
								<IconChevronLeft className="w-4 h-4 mr-2" />
								Previous
							</Button>
							<Button
								onClick={handleNextPage}
								disabled={!transactions?.txs || transactions.txs.length === 0}
								variant="outline"
								className="text-maintext border-lightBorderV1"
							>
								Next
								<IconChevronRight className="w-4 h-4 ml-2" />
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
			<div className="fixed bottom-2 right-2 flex flex-col gap-2">
				<Button
					variant="ghost"
					size="icon"
					onClick={scrollToTop}
					className={`text-white hover:bg-mainActiveV1/90 h-8 w-8 rounded-full bg-mainActiveV1 transition-opacity duration-300 ${isScrolling ? "opacity-100" : "opacity-0 pointer-events-none"}`}
				>
					<IconChevronsUp size={24} className="text-white !h-5 !w-5" />
				</Button>
				<Button
					variant="ghost"
					size="icon"
					onClick={scrollToBottom}
					className={`text-white hover:bg-mainActiveV1/90 h-8 w-8 rounded-full bg-mainActiveV1 transition-opacity duration-300 ${isScrolling ? "opacity-100" : "opacity-0 pointer-events-none"}`}
				>
					<IconChevronsDown size={24} className="text-white !h-5 !w-5" />
				</Button>
			</div>
		</div>
	);
}
