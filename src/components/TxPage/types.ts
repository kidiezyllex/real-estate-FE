export enum MevType {
	Normal = "None",
	Arbitrage = "Arbitrage",
	Sandwich = "Sandwich",
	Liquidation = "Liquidation",
}

export type SandwichTransactionSummaryData = {
	mevType: MevType.Sandwich;
	timestamp: string;
	sandwichId: string;
	profit: string;
	cost: string;
	revenue: string;
	blockNumber: number;
	gasPrice?: string;
	gasUsed?: string;
	time?: string;
};

export type NormalTransactionSummaryData = {
	mevType: MevType.Normal;
	time: string;
	transactionHash: string;
	from: string;
	contractTo: string;
	blockNumber: number;
	gasPrice: string;
	gasUsed: string;
	timestamp?: string;
};

export type LiquidationTransactionSummaryData = {
	mevType: MevType.Liquidation;
	time: string;
	transactionHash: string;
	from: string;
	contractTo: string;
	profit: string;
	cost: string;
	revenue: string;
	blockNumber: number;
	borrower: string;
	liquidator: string;
	debtToken: string;
	debtToCover: number;
	liquidatedToken: string;
	liquidatedAmount: number;
	timestamp?: string;
};

export type TransactionSummaryData =
	| SandwichTransactionSummaryData
	| ArbitrageTransactionSummaryData
	| LiquidationTransactionSummaryData
	| NormalTransactionSummaryData;

export type ArbitrageTransactionSummaryData = {
	mevType: MevType.Arbitrage;
	time: string;
	transactionHash: string;
	from: string;
	contractTo: string;
	profit: string;
	cost: string;
	revenue: string;
	blockNumber: number;
	position: number;
	timestamp?: string;
};

export interface TokenAmount {
	token: string;
	amount: number;
}

export interface TokenTransfer {
	address: string;
	name?: string;
	protocol?: string;
	amounts: TokenAmount[];
	type?: "revenue" | "cost" | "profit" | "normal";
}

export interface Trace {
	from: string;
	to: string;
	asset: string;
	value: string;
	eventLogIndex: number;
}
