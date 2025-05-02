"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useGetMevBlocks } from "@/hooks/useMev";
import { IconInfoCircle } from "@tabler/icons-react";
import { format } from "date-fns";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export default function BlocksListPage() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const pageParam = searchParams.get("page");
	const page = pageParam ? Number.parseInt(pageParam, 10) : 1;
	const limit = 20;

	const { data: blocksData, isLoading, isError } = useGetMevBlocks(page, limit);
	// const {
	// 	data: blockData,
	// 	isLoading: isBlockLoading,
	// 	isError: isBlockError
	//   } = useGetMevBlockDetail(
	// 	{
	// 	  blockNumber: blockNumber,
	// 	  limit: 50,
	// 	  lastTxHash: null,
	// 	  address: ''
	// 	}
	//   );

	const handlePageChange = (newPage: number) => {
		router.push(`/mev/blocks?page=${newPage}`);
	};

	if (isLoading) {
		return (
			<div className="px-6 py-4">
				<div className="flex flex-col space-y-4">
					<div className="flex items-center justify-between">
						<h1 className="text-2xl font-bold text-maintext">Blocks List</h1>
					</div>
					<Card className="bg-mainBackgroundV1 border border-lightBorderV1">
						<CardHeader className="pb-2">
							<CardTitle className="text-sm font-bold text-maintext">Blocks</CardTitle>
						</CardHeader>
						<CardContent className="py-6">
							<div className="space-y-4">
								{Array(10)
									.fill(0)
									.map((_, index) => (
										<Skeleton key={index} className="h-16 w-full" />
									))}
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		);
	}

	if (isError || !blocksData) {
		return (
			<div className="px-6 py-4">
				<div className="flex flex-col space-y-4">
					<div className="flex items-center justify-between">
						<h1 className="text-2xl font-bold text-maintext">Blocks List</h1>
					</div>
					<Card className="bg-mainBackgroundV1 border border-lightBorderV1">
						<CardContent className="p-6 flex justify-center items-center">
							<p className="text-maintext">Cannot load blocks data</p>
						</CardContent>
					</Card>
				</div>
			</div>
		);
	}

	const { blocks, totalPages } = blocksData;

	return (
		<div className="px-6 py-4">
			<div className="flex flex-col space-y-4">
				<div className="flex items-center justify-between">
					<h1 className="text-2xl font-bold text-maintext">Blocks List</h1>
				</div>

				<Card className="bg-mainBackgroundV1 border border-lightBorderV1">
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<div className="flex items-center">
							<CardTitle className="text-sm font-bold text-maintext">Blocks</CardTitle>
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<button className="ml-1">
											<IconInfoCircle className="h-4 w-4 text-[#909296]" />
										</button>
									</TooltipTrigger>
									<TooltipContent>
										<p className="w-[200px] text-xs">List of recent blocks</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						</div>
					</CardHeader>
					<CardContent className="p-0">
						<div className="overflow-x-auto">
							<table className="w-full">
								<thead>
									<tr className="border-b border-lightBorderV1">
										<th className="py-3 px-4 text-left text-xs font-medium text-[#909296] uppercase tracking-wider">
											Block
										</th>
										<th className="py-3 px-4 text-left text-xs font-medium text-[#909296] uppercase tracking-wider">
											Hash
										</th>
										<th className="py-3 px-4 text-left text-xs font-medium text-[#909296] uppercase tracking-wider">
											Timestamp
										</th>
									</tr>
								</thead>
								<tbody>
									{blocks.map((block, index) => (
										<tr key={index} className="border-b border-lightBorderV1 hover:bg-mainCardV1/50">
											<td className="py-3 px-4">
												<Link href={`/mev/blocks/${block.number}`} className="text-mainActiveV1 hover:underline">
													{block.number}
												</Link>
											</td>
											<td className="py-3 px-4">
												<span className="text-sm text-maintext font-mono">
													{block.hash.substring(0, 10)}...{block.hash.substring(block.hash.length - 10)}
												</span>
											</td>
											<td className="py-3 px-4">
												<span className="text-sm text-maintext">
													{format(new Date(block.timestamp), "dd/MM/yyyy HH:mm:ss")}
												</span>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>

						{totalPages > 1 && (
							<div className="py-4 flex justify-center">
								<Pagination current={page} pageSize={limit} total={totalPages * limit} onChange={handlePageChange} />
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
