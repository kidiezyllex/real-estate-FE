import { gweiToEth } from "@/lib/utils";
import { message } from "antd";
import type React from "react";
import { useState } from "react";
import AddressLink from "./AddressLink";
import CopyButton from "./CopyButton";
import TransactionLink from "./TransactionLink";

interface SummaryRowProps {
	label: string;
	value: any;
	isLast: boolean;
	sandwichData?: any;
}

const formatFieldValue = (label: string, value: any): React.ReactNode => {
	if (value === undefined || value === null) return "-";
	const fieldName = label.toLowerCase();
	switch (fieldName) {
		case "profit":
		case "cost":
		case "revenue":
			if (typeof value === "number") {
				return `${value.toFixed(6)} USD`;
			} else if (typeof value === "string") {
				if (value.includes("USD")) {
					return value;
				}

				const num = Number.parseFloat(value);
				if (!Number.isNaN(num)) {
					return `${num.toFixed(6)} USD`;
				}
				return `${value} USD`;
			}
			return `${value} USD`;

		case "gasprice":
			return `${gweiToEth(value)} ETH`;

		case "blocknumber":
		case "index":
			return Number(value).toString();

		case "liquidatedamount":
		case "debttocover":
			if (typeof value === "number") {
				return value.toFixed(6);
			}
			return value;

		case "time":
		case "timestamp":
			try {
				const date = new Date(value);
				return date.toLocaleString("vi-VN");
			} catch (_) {
				return value;
			}

		default:
			return value;
	}
};

const SummaryRow: React.FC<SummaryRowProps> = ({ label, value, isLast, sandwichData }) => {
	const [copied, setCopied] = useState(false);
	const handleCopy = async (text: string) => {
		try {
			await navigator.clipboard.writeText(text);
			setCopied(true);
			message.success(`Copied ${text} to clipboard!`);
			setTimeout(() => setCopied(false), 2000);
		} catch (_) {
			message.error("Copy failed.");
		}
	};

	const formattedValue = formatFieldValue(label, value);
	const isAddress = typeof value === "string" && value.startsWith("0x") && value.length === 42;
	const isTransactionHash = typeof value === "string" && value.startsWith("0x") && value.length === 66;

	if (label.toLowerCase() === "transaction type" && value === "SANDWICH" && sandwichData) {
		return (
			<tr className={`border-b ${isLast ? "border-transparent" : "border-lightBorderV1"}`}>
				<td className="py-3 px-4 text-sm text-[#909296]">{label}</td>
				<td className="py-3 px-4 text-left">
					<div className="bg-mainCardV1 p-3 rounded-md">
						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<span className="text-[#909296] text-sm">Type:</span>
								<span className="text-sm font-medium bg-mainActiveV1/20 text-mainActiveV1 px-2 py-0.5 rounded">
									SANDWICH
								</span>
							</div>
							{sandwichData.profit !== undefined && (
								<div className="flex items-center justify-between">
									<span className="text-[#909296] text-sm">Profit:</span>
									<span className="text-sm text-green-400">{formatFieldValue("profit", sandwichData.profit)}</span>
								</div>
							)}
							{sandwichData.cost !== undefined && (
								<div className="flex items-center justify-between">
									<span className="text-[#909296] text-sm">Cost:</span>
									<span className="text-sm text-red-400">{formatFieldValue("cost", sandwichData.cost)}</span>
								</div>
							)}
							{sandwichData.revenue !== undefined && (
								<div className="flex items-center justify-between">
									<span className="text-[#909296] text-sm">Revenue:</span>
									<span className="text-sm text-blue-400">{formatFieldValue("revenue", sandwichData.revenue)}</span>
								</div>
							)}
						</div>
					</div>
				</td>
			</tr>
		);
	}

	if (label.toLowerCase() === "transaction type") {
		return (
			<tr className={`border-b ${isLast ? "border-transparent" : "border-lightBorderV1"}`}>
				<td className="py-3 px-4 text-sm text-maintext font-semibold">{label}</td>
				<td className="py-3 px-4 text-right flex justify-start border-l border-l-lightBorderV1">
					<span className="text-sm  font-medium bg-mainActiveV1/20 text-mainActiveV1 px-2 py-0.5 rounded">{value}</span>
				</td>
			</tr>
		);
	}

	return (
		<tr className={`border-b ${isLast ? "border-transparent" : "border-lightBorderV1"}`}>
			<td className="py-3 px-4 text-sm text-maintext font-semibold">{label}</td>
			<td className="py-3 px-4 text-right flex justify-start border-l border-l-lightBorderV1">
				<div className="flex items-center justify-start space-x-1">
					{isAddress ? (
						<div className="flex items-center space-x-2">
							<AddressLink address={value} shorten={false} />
							<CopyButton text={value} onCopy={handleCopy} copied={copied} />
						</div>
					) : isTransactionHash ? (
						<div className="flex items-center space-x-2">
							<TransactionLink hash={value} shorten={false} />
							<CopyButton text={value} onCopy={handleCopy} copied={copied} />
						</div>
					) : (
						<div className="flex items-center space-x-2">
							<span className="text-sm text-maintext">{formattedValue}</span>
						</div>
					)}
				</div>
			</td>
		</tr>
	);
};

export default SummaryRow;
