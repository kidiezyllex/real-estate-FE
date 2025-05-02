import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IconMaximize } from "@tabler/icons-react";
import type React from "react";
import { useEffect, useMemo, useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import { mdiChartLine } from "@mdi/js";
import Icon from "@mdi/react";
import Image from "next/image";

interface TransactionDiagramProps {
	transactionHash: string;
}

const TransactionDiagram: React.FC<TransactionDiagramProps> = ({ transactionHash }) => {
	const isValidHash = useMemo(() => {
		return transactionHash && /^0x([A-Fa-f0-9]{64})$/.test(transactionHash);
	}, [transactionHash]);

	const diagramUrl = useMemo(() => {
		return isValidHash ? `https://tx.eigenphi.io/analyseTransaction.svg?chain=ALL&tx=${transactionHash}` : "";
	}, [transactionHash, isValidHash]);

	const [open, setOpen] = useState(false);
	const [imageLoadError, setImageLoadError] = useState(false);

	useEffect(() => {
		if (isValidHash && diagramUrl) {
			setImageLoadError(false);
			fetch(diagramUrl)
				.then((response) => {
					if (!response.ok) {
						console.error(`Failed to load transaction diagram: ${response.status}`);
						setImageLoadError(true);
					} else {
						setImageLoadError(false);
					}
				})
				.catch((error) => {
					console.error("Network error fetching transaction diagram:", error);
					setImageLoadError(true);
				});
		} else {
			setImageLoadError(false);
		}
	}, [diagramUrl, isValidHash]);

	return (
		<Card className="bg-mainBackgroundV1 border border-lightBorderV1 overflow-hidden mb-12">
			<CardHeader className="flex flex-row items-center justify-between pb-2 bg-mainActiveV1/50">
				<div className="flex items-center">
					<CardTitle className="text-base font-bold text-maintext">Token Flow Chart</CardTitle>
				</div>
				{isValidHash && (
					<Button
						variant="ghost"
						size="icon"
						className="bg-white hover:bg-white/90 h-7 w-7"
						onClick={() => setOpen(true)}
					>
						<IconMaximize className="text-maintext !h-4 !w-4" />
					</Button>
				)}
			</CardHeader>

			<CardContent className="p-4 flex justify-center items-center overflow-hidden">
				{isValidHash && !imageLoadError ? (
					<div className="w-full max-h-[500px] overflow-auto" style={{ backgroundColor: "#F8F9FA" }}>
						<Image
							draggable={false}
							src={diagramUrl}
							alt="Transaction Diagram"
							width={800}
							height={600}
							className="w-full h-auto cursor-pointer"
							onClick={() => setOpen(true)}
							unoptimized // Since this is an external SVG
						/>
						<Lightbox
							open={open}
							close={() => setOpen(false)}
							slides={[{ src: diagramUrl }]}
							plugins={[Zoom]}
							zoom={{
								maxZoomPixelRatio: 3,
								scrollToZoom: true,
							}}
							styles={{ container: { backgroundColor: "#FFFFFF" } }}
						/>
					</div>
				) : (
					<div className="flex flex-col items-center justify-center py-2">
						<Icon path={mdiChartLine} size={1} className="text-gray-400 mb-2" />
						<p className="text-gray-400 text-center">Token Flow Chart does not exist!</p>
					</div>
				)}
			</CardContent>
		</Card>
	);
};

export default TransactionDiagram;
