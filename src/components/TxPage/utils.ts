export function formatValue(value: string): string {
	if (value.length > 10) {
		const num = BigInt(value);
		const divisor = BigInt(10 ** 18);
		const whole = num / divisor;
		const fraction = num % divisor;
		const fractionalPart = fraction.toString().padStart(18, "0").substring(0, 6);
		return `${whole.toString()}.${fractionalPart}`;
	}
	return value;
}

export function getTransactionType(label: string | null | undefined): string {
	if (!label) return "Transaction";

	switch (label.toUpperCase()) {
		case "ARBITRAGE":
			return "Arbitrage";
		case "SANDWICH":
			return "Sandwich";
		case "LIQUIDATION":
			return "Liquidation";
		case "NONE":
			return "Transaction";
		default:
			return label || "Transaction";
	}
}
