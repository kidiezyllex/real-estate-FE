export interface IGetMevTxParams {
	hash: string;
}

export interface IGetMevBlockParams {
	blockNumber: number;
}

export interface IGetMevBlocksParams {
	page?: number;
	limit?: number;
}

export interface IGetMevByAddressParams {
  address: string;
}

export interface IGetMevLatestParams {
  limit?: number;
  lastTxHash?: string;
}

export interface IGetMevBlockDetailParams {
  blockNumber: number;
  limit?: number;
  lastTxHash?: string | null;
	address: string;
}

export interface IGetMevPerformanceParams {
  timeRange: '30d' | '7d' | '24h';
}

export interface IGetLiquidationTrendParams {
  timeRange: '30d' | '7d' | '24h';
} 
