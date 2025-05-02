"use client";

import BlockTransactionsTable from "@/components/TxPage/BlockTransactionsTable";
import CopyButton from "@/components/TxPage/CopyButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetMevBlockDetail } from "@/hooks/useMev";
import { IconChevronsDown, IconChevronsUp } from "@tabler/icons-react";
import { message } from "antd";
import { format } from "date-fns";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function BlockDetailsPage() {
	const params = useParams();
	const blockNumber = Number.parseInt(params.blockNumber as string, 10);
	const [copiedHash, setCopiedHash] = useState<boolean>(false);
	const [isScrolling, setIsScrolling] = useState(false);

	const {
		data: blockData,
		isLoading: isBlockLoading,
		isError: isBlockError,
	} = useGetMevBlockDetail({
		blockNumber: blockNumber,
		limit: 50,
		lastTxHash: null,
		address: "",
	});

	const handleCopy = () => {
		setCopiedHash(true);
		message.success("Block hash copied to clipboard");
		setTimeout(() => setCopiedHash(false), 2000);
	};

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

	const scrollToTop = () => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	const scrollToBottom = () => {
		window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
	};

	if (isBlockLoading) {
		return (
			<div className="px-6 py-4">
				<div className="flex flex-col space-y-4">
					<div className="flex items-center justify-between">
						<h1 className="text-2xl font-bold text-maintext">Block Details #{blockNumber}</h1>
					</div>
					<Card className="bg-mainBackgroundV1 border border-lightBorderV1 overflow-hidden">
						<CardHeader className="pb-2 bg-mainActiveV1/50">
							<CardTitle className="text-base font-bold text-maintext">Block Information</CardTitle>
						</CardHeader>
						<CardContent className="p-0">
							<table className="w-full border-collapse">
								<tbody>
									<tr className="border-b border-lightBorderV1">
										<td className="py-3 px-4 text-sm text-maintext font-semibold">Block Hash</td>
										<td className="py-3 px-4 text-right flex justify-start border-l border-l-lightBorderV1">
											<div className="flex items-center space-x-2">
												<Skeleton className="h-4 w-96" />
											</div>
										</td>
									</tr>
									<tr className="border-b border-lightBorderV1">
										<td className="py-3 px-4 text-sm text-maintext font-semibold">Block Number</td>
										<td className="py-3 px-4 text-right flex justify-start border-l border-l-lightBorderV1">
											<Skeleton className="h-4 w-24" />
										</td>
									</tr>
									<tr>
										<td className="py-3 px-4 text-sm text-maintext font-semibold">Timestamp</td>
										<td className="py-3 px-4 text-right flex justify-start border-l border-l-lightBorderV1">
											<Skeleton className="h-4 w-48" />
										</td>
									</tr>
								</tbody>
							</table>
						</CardContent>
					</Card>

					<Card className="bg-mainBackgroundV1 border border-lightBorderV1 overflow-hidden">
						<CardHeader className="pb-2 bg-mainActiveV1/50">
							<CardTitle className="text-base font-bold text-maintext">Block Transactions</CardTitle>
						</CardHeader>
						<CardContent className="p-0">
							<div className="overflow-x-auto">
								<table className="w-full border-collapse">
									<thead>
										<tr className="border-b border-lightBorderV1">
											<th className="py-3 px-4 text-left text-sm font-semibold text-maintext">Tx Hash</th>
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
						</CardContent>
					</Card>
				</div>
			</div>
		);
	}

	if (isBlockError || !blockData) {
		return (
			<div className="px-6 py-4">
				<div className="flex flex-col space-y-4">
					<div className="flex items-center justify-between">
						<h1 className="text-2xl font-bold text-maintext">Block #{blockNumber}</h1>
					</div>
					<Card className="bg-mainBackgroundV1 border border-lightBorderV1">
						<CardContent className="p-6 flex justify-center items-center">
							<p className="text-maintext">No information found for Block #{blockNumber}</p>
						</CardContent>
					</Card>
				</div>
			</div>
		);
	}

	const { block, transactions } = blockData;

	return (
		<div className="px-6 py-4">
			<div className="flex flex-col space-y-4">
				<div className="flex items-center justify-between">
					<h1 className="text-2xl font-bold text-maintext">Block Details #{blockNumber}</h1>
				</div>
				<Card className="bg-mainBackgroundV1 border border-lightBorderV1 overflow-hidden">
					<CardHeader className="flex flex-row items-center justify-between pb-2 bg-mainActiveV1/50">
						<div className="flex items-center">
							<CardTitle className="text-base font-bold text-maintext">Block Information</CardTitle>
						</div>
					</CardHeader>
					<CardContent className="p-0">
						<table className="w-full border-collapse">
							<tbody>
								<tr className="border-b border-lightBorderV1">
									<td className="py-3 px-4 text-sm text-maintext font-semibold">Block Hash</td>
									<td className="py-3 px-4 text-right flex justify-start border-l border-l-lightBorderV1">
										<div className="flex items-center space-x-2">
											<Link
												href={`/mev/blocks/${block.hash}`}
												className="text-sm text-blue-500 hover:underline break-all"
											>
												{block.hash}
											</Link>
											<CopyButton text={block.hash} copied={copiedHash} onCopy={handleCopy} />
										</div>
									</td>
								</tr>
								<tr className="border-b border-lightBorderV1">
									<td className="py-3 px-4 text-sm text-maintext font-semibold">Block Number</td>
									<td className="py-3 px-4 text-right flex justify-start border-l border-l-lightBorderV1">
										<Link href={`/mev/blocks/${block.number}`} className="text-sm text-blue-500 hover:underline">
											{block.number}
										</Link>
									</td>
								</tr>
								<tr>
									<td className="py-3 px-4 text-sm text-maintext font-semibold">Timestamp</td>
									<td className="py-3 px-4 text-right flex justify-start border-l border-l-lightBorderV1">
										<span className="text-sm text-maintext">
											{format(new Date(block.timestamp), "dd/MM/yyyy HH:mm:ss")}
										</span>
									</td>
								</tr>
							</tbody>
						</table>
					</CardContent>
				</Card>

				<BlockTransactionsTable transactions={transactions} />

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
		</div>
	);
}
