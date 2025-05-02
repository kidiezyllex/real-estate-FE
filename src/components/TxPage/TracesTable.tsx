import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mdiAccountArrowLeft, mdiAccountArrowRight, mdiEthereum, mdiUnfoldMoreHorizontal } from "@mdi/js";
import Icon from "@mdi/react";
import { message } from "antd";
import React, { useState, useEffect, useMemo } from "react";
import Blockie from "./Blockie";
import CopyButton from "./CopyButton";
import type { Trace } from "./types";
import { formatValue } from "./utils";

interface TracesTableProps {
	traces: Trace[] | undefined;
	assetMetadata: {
		[key: string]: {
			address: string;
			symbol: string;
			decimals: number;
			logo: string;
		};
	};
}

const TracesTable: React.FC<TracesTableProps> = ({ traces, assetMetadata }) => {
	const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
	const [sortedTraces, setSortedTraces] = useState<Trace[] | undefined>(traces);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const pageSize = 20; // 20 items per page
	const [copiedEventLogIndex, setCopiedEventLogIndex] = useState<number | null>(null);

	// Lấy danh sách các asset duy nhất từ traces
	const uniqueAssets = useMemo(() => {
		if (!traces) return [];
		const assetSet = new Set<string>();
		traces.forEach((trace) => {
			assetSet.add(trace.asset);
		});
		return Array.from(assetSet);
	}, [traces]);

	// Tạo màu cho mỗi loại asset
	const assetColors = useMemo(() => {
		const colors: { [key: string]: string } = {};

		uniqueAssets.forEach((asset, index) => {
			const hue = (index * 137) % 360; // Đảm bảo màu sắc khác nhau bằng cách sử dụng phép nhân và chia dư
			colors[asset] = `hsla(${hue}, 70%, 80%, 0.1)`;
		});

		return colors;
	}, [uniqueAssets]);

	const handleCopy = async (text: string, eventLogIndex: number) => {
		try {
			await navigator.clipboard.writeText(text);
			setCopiedEventLogIndex(eventLogIndex);
			message.success(`Copied ${text} to clipboard!`);
			setTimeout(() => setCopiedEventLogIndex(null), 2000);
		} catch (err) {
			message.error("Copy failed.");
		}
	};

	useEffect(() => {
		setSortedTraces(traces);
	}, [traces]);

	const handleSort = () => {
		if (!sortedTraces) return;

		const newDirection = sortDirection === "asc" ? "desc" : "asc";
		setSortDirection(newDirection);

		const sorted = [...sortedTraces].sort((a, b) => {
			if (newDirection === "asc") {
				return a.eventLogIndex - b.eventLogIndex;
			} else {
				return b.eventLogIndex - a.eventLogIndex;
			}
		});

		setSortedTraces(sorted);
	};

	const getCurrentPageData = () => {
		if (!sortedTraces) return [];
		const startIndex = (currentPage - 1) * pageSize;
		return sortedTraces.slice(startIndex, startIndex + pageSize);
	};

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	// Render header cho asset column
	const renderAssetHeader = (asset: string) => {
		if (assetMetadata && assetMetadata[asset]) {
			const metadata = assetMetadata[asset];
			return (
				<div className="flex items-center justify-center space-x-1">
					{metadata.logo ? (
						<img src={metadata.logo} alt={metadata.symbol} className="w-4 h-4" />
					) : (
						<Blockie address={asset} size={16} />
					)}
					<span>{metadata.symbol}</span>
				</div>
			);
		} else {
			return (
				<div className="flex items-center justify-center space-x-1">
					<Blockie address={asset} size={16} />
					<span>{`${asset.slice(0, 6)}...${asset.slice(-4)}`}</span>
				</div>
			);
		}
	};

	if (!traces || traces.length === 0) {
		return (
			<Card className="bg-mainBackgroundV1 border border-lightBorderV1 overflow-hidden">
				<CardHeader className="flex flex-row items-center justify-between pb-2 bg-mainActiveV1/50">
					<div className="flex items-center">
						<CardTitle className="text-base font-bold text-maintext">Transfer List</CardTitle>
					</div>
				</CardHeader>
				<CardContent className="p-6 flex justify-center items-center">
					<p className="text-[#909296]">Cannot find traces of this transaction.</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="bg-mainBackgroundV1 border border-lightBorderV1 overflow-hidden">
			<CardHeader className="flex flex-row items-center justify-between pb-2 bg-mainActiveV1/50">
				<div className="flex items-center">
					<CardTitle className="text-base font-bold text-maintext">Transfer List</CardTitle>
				</div>
			</CardHeader>
			<CardContent className="p-0">
				<div className="relative w-full overflow-x-auto">
					<Table>
						<TableHeader className="sticky top-0 z-10">
							<TableRow>
								<TableHead className="sticky left-0 z-20 bg-mainCardV1 w-[200px] min-w-[200px]">
									<div className="flex items-center space-x-1">
										<Icon path={mdiEthereum} size={0.7} />
										<span>Hash</span>
									</div>
								</TableHead>
								{uniqueAssets.map((asset, index) => (
									<TableHead
										key={asset}
										className="text-center min-w-[150px]"
										style={{ backgroundColor: assetColors[asset] }}
									>
										{renderAssetHeader(asset)}
									</TableHead>
								))}
								<TableHead className="w-[150px] min-w-[150px]">
									<button
										className="flex items-center justify-end space-x-1 w-full cursor-pointer"
										onClick={handleSort}
									>
										<span>Event Log Index</span>
										<Icon path={mdiUnfoldMoreHorizontal} size={0.7} />
									</button>
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{getCurrentPageData().map((trace, index) => (
								<React.Fragment key={index}>
									{/* From row */}
									<TableRow className="hover:bg-mainCardV1/50">
										<TableCell className="sticky left-0 z-10 bg-mainBackgroundV1">
											<div className="flex items-center space-x-2">
												<Icon path={mdiAccountArrowRight} size={0.8} className="text-red-400" />
												<Blockie address={trace.from} size={18} />
												<span className="text-sm text-maintext">{`${trace.from.slice(0, 6)}...${trace.from.slice(-4)}`}</span>
												<CopyButton
													text={trace.from}
													onCopy={() => handleCopy(trace.from, trace.eventLogIndex)}
													copied={copiedEventLogIndex === trace.eventLogIndex}
												/>
											</div>
										</TableCell>

										{uniqueAssets.map((asset) => (
											<TableCell
												key={asset}
												className="text-center"
												style={{ backgroundColor: asset === trace.asset ? assetColors[asset] : "transparent" }}
											>
												{asset === trace.asset && (
													<div className="flex items-center justify-center space-x-2">
														<Blockie address={trace.asset} size={18} />
														<span className="text-sm text-red-400">-{formatValue(trace.value)}</span>
														<CopyButton
															text={trace.asset}
															onCopy={() => handleCopy(trace.asset, trace.eventLogIndex)}
															copied={copiedEventLogIndex === trace.eventLogIndex}
														/>
													</div>
												)}
											</TableCell>
										))}

										<TableCell className="text-right">
											<span className="text-sm text-maintext">{trace.eventLogIndex}</span>
										</TableCell>
									</TableRow>

									{/* To row */}
									<TableRow className="hover:bg-mainCardV1/50">
										<TableCell className="sticky left-0 z-10 bg-mainBackgroundV1">
											<div className="flex items-center space-x-2">
												<Icon path={mdiAccountArrowLeft} size={0.8} className="text-green-400" />
												<Blockie address={trace.to} size={18} />
												<span className="text-sm text-maintext">{`${trace.to.slice(0, 6)}...${trace.to.slice(-4)}`}</span>
												<CopyButton
													text={trace.to}
													onCopy={() => handleCopy(trace.to, trace.eventLogIndex)}
													copied={copiedEventLogIndex === trace.eventLogIndex}
												/>
											</div>
										</TableCell>

										{uniqueAssets.map((asset) => (
											<TableCell
												key={asset}
												className="text-center"
												style={{ backgroundColor: asset === trace.asset ? assetColors[asset] : "transparent" }}
											>
												{asset === trace.asset && (
													<div className="flex items-center justify-center space-x-2">
														<Blockie address={trace.asset} size={18} />
														<span className="text-sm text-green-400">+{formatValue(trace.value)}</span>
														<CopyButton
															text={trace.asset}
															onCopy={() => handleCopy(trace.asset, trace.eventLogIndex)}
															copied={copiedEventLogIndex === trace.eventLogIndex}
														/>
													</div>
												)}
											</TableCell>
										))}

										<TableCell className="text-right">
											<span className="text-sm text-maintext">{trace.eventLogIndex}</span>
										</TableCell>
									</TableRow>
								</React.Fragment>
							))}
						</TableBody>
					</Table>
				</div>
			</CardContent>
			<CardFooter>
				<div className="w-full flex items-center justify-between mt-2">
					<div className="text-sm text-[#909296]">
						<span>
							Total: {traces.length} traces ({traces.length * 2} rows)
						</span>
					</div>
					<Pagination current={currentPage} pageSize={pageSize} total={traces.length} onChange={handlePageChange} />
				</div>
			</CardFooter>
		</Card>
	);
};

export default TracesTable;
