import { IMevTransaction, IMevBlockResponse, IMevBlock, IMevOverview, IMevLatestResponse, IMevAddressResponse, IMevBlocksResponse, IMevPerformanceResponse, IMevLiquidationResponse, IMevSandwichResponse, ILiquidationTrendResponse } from "@/interface/response/mev";
import { IGetMevLatestParams, IGetMevBlockDetailParams, IGetMevPerformanceParams, IGetLiquidationTrendParams } from "@/interface/request/mev";
import { sendGet, sendPost } from "./axios";

export const getMevTransactionByHash = async (hash: string): Promise<IMevTransaction> => {
	const res = await sendGet(`/mev/tx/${hash}`);
	return res;
};

export const getMevBlockByNumber = async (blockNumber: number): Promise<IMevBlockResponse> => {
	const res = await sendGet(`/mev/block/${blockNumber}`);
	const data: IMevBlockResponse = res;
	return data;
};

export const getMevBlocks = async (page: number = 1, limit: number = 20): Promise<IMevBlocksResponse> => {
	const res = await sendGet(`/mev/blocks?page=${page}&limit=${limit}`);
	return res;
};

export const getMevOverview = async (): Promise<IMevOverview> => {
	const res = await sendGet(`/mev/overview`);
	return res;
};

export const getMevLatest = async (): Promise<IMevLatestResponse> => {
	const res = await sendGet(`/latest/`);
	return res;
};

export const getMevLatestWithParams = async (params: IGetMevLatestParams): Promise<IMevLatestResponse> => {
  const res = await sendPost(`/mev/latest`, params);
  return res;
};

export const getMevBlockDetail = async (params: IGetMevBlockDetailParams): Promise<IMevBlockResponse> => {
  const res = await sendPost(`/mev/block`, params);
  return res;
};

export const getMevByAddress = async (
  address: string
): Promise<IMevAddressResponse> => {
  const res = await sendGet(`/address/${address}`);
  return res;
}; 

export const getMevPerformance = async (params: IGetMevPerformanceParams): Promise<IMevPerformanceResponse> => {
  const res = await sendPost(`/performance`, params);
  return res;
};

export const getMevLiquidation = async (): Promise<IMevLiquidationResponse> => {
  const res = await sendGet(`/mev/liquidation`);
  return res;
};

export const getMevSandwich = async (): Promise<IMevSandwichResponse> => {
  const res = await sendGet(`/mev/sandwich`);
  return res;
};

export const getLiquidationTrend = async (params: IGetLiquidationTrendParams): Promise<ILiquidationTrendResponse> => {
  const res = await sendPost(`/liquidation/trend`, params);
  return res;
};
