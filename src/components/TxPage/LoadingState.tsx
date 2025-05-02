import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import type React from "react";

const LoadingState: React.FC = () => {
	return (
		<div className="grid grid-cols-1 gap-6">
			<Card className="bg-mainBackgroundV1 border border-lightBorderV1 p-4 space-y-4">
				<div className="flex items-center justify-between">
					<Skeleton className="h-6 w-24" />
					<Skeleton className="h-6 w-16" />
				</div>
				<Separator />
				{Array(8)
					.fill(0)
					.map((_, i) => (
						<div key={i} className="flex justify-between py-2">
							<Skeleton className="h-5 w-32" />
							<Skeleton className="h-5 w-64" />
						</div>
					))}
			</Card>

			<Card className="bg-mainBackgroundV1 border border-lightBorderV1 p-4 space-y-4">
				<div className="flex items-center justify-between">
					<Skeleton className="h-6 w-32" />
					<Skeleton className="h-6 w-16" />
				</div>
				<Separator />
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead>
							<tr>
								<th className="text-left">
									<Skeleton className="h-5 w-32" />
								</th>
								{Array(5)
									.fill(0)
									.map((_, i) => (
										<th key={i} className="text-right">
											<Skeleton className="h-5 w-16 ml-auto" />
										</th>
									))}
							</tr>
						</thead>
						<tbody>
							{Array(10)
								.fill(0)
								.map((_, i) => (
									<tr key={i}>
										<td className="py-2">
											<Skeleton className="h-5 w-40" />
										</td>
										{Array(5)
											.fill(0)
											.map((_, j) => (
												<td key={j} className="text-right py-2">
													<Skeleton className="h-5 w-16 ml-auto" />
												</td>
											))}
									</tr>
								))}
						</tbody>
					</table>
				</div>
			</Card>
		</div>
	);
};

export default LoadingState;
