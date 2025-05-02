interface IMevTrace {
	from: string;
	to: string;
	asset: string;
	value: string;
	eventLogIndex: number;
}

export interface IMevBlock {
	hash: string;
	number: number;
	timestamp: string;
}

export interface IMevBlockTransaction {
	hash: string;
	blockNumber: number;
	from: string;
	to: string;
	gasPrice: string;
	gasUsed: string;
	timestamp: string;
	label: string | null;
	index: number;
}

export interface IMevBlockResponse {
	block: IMevBlock;
	transactions: IMevBlockTransaction[];
}

export interface IMevBlocksResponse {
	blocks: IMevBlock[];
	totalPages: number;
	currentPage: number;
	limit: number;
}

export interface IMevTransaction {
	id: string;
	label: string | null;
	time?: string;
	hash: string;
	from: string;
	to: string;
	profit?: string;
	cost?: string;
	revenue?: string;
	blockNumber: number;
	index: number;
	traces?: IMevTrace[];
	frontRun?: IMevTrace[];
	backRun?: IMevTrace[];
	victim?: IMevTrace[];
	assetMetadata?: any;
	gasUsed?: string;
	gasPrice?: string;
	timestamp?: string;
}

export interface IMevOverview {
  totalTxs: number;
  totalProfit: string;
  blockRange: {
    start: number;
    end: number;
  };
  totalArbitrageTxs: number;
  totalProfitArbitrage: string;
  totalSandwichTxs: number;
  totalProfitSandwich: string;
  totalLiquidationTxs: number;
  totalProfitLiquidation: string;
}

export interface IMevLatestResponse {
  txs: IMevTransaction[];
  lastTxHash: string;
}

export type IMevAddressResponse = IMevTransaction[];

export interface IMevPerformanceResponse {
  totalProfit: string;
  totalTxs: number;
  profitHistory: {
    timestamp: string;
    profit: string;
    txCount: number;
  }[];
}

export interface IMevLiquidationResponse {
  txs: IMevTransaction[];
  totalTxs: number;
  totalProfit: string;
  totalLiquidationAmount: string;
  totalCost: string;
  totalBorrowers: number;
  totalLiquidators: number;
  totalRevenue: string;
  topProtocols: {
    name: string;
    value: number;
    percentage: number;
  };
}

export interface IMevSandwichResponse {
  txs: IMevTransaction[];
  totalCount: number;
  totalProfit: string;
  totalCost: string;
  totalAttackers: number;
  totalVictims: number;
  topProtocols: {
    name: string;
    value: number;
    percentage: number;
  };
}

export interface ILiquidationTrendResponse {
  timeRange: string;
  trendChart: {
    [key: string]: {
      liquidationAmount: number;
      liquidationTxCount: string;
    }
  }
}
