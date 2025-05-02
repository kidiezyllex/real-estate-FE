import { getMevTransactionByHash, getMevBlockByNumber, getMevBlocks, getMevOverview, getMevLatest, getMevByAddress, getMevBlockDetail, getMevLatestWithParams, getMevPerformance, getMevLiquidation, getMevSandwich, getLiquidationTrend } from '@/api/mev';
import { IMevTransaction, IMevBlockResponse, IMevBlock, IMevOverview, IMevLatestResponse, IMevAddressResponse, IMevBlocksResponse, IMevPerformanceResponse, IMevLiquidationResponse, IMevSandwichResponse, ILiquidationTrendResponse } from '@/interface/response/mev';
import { IGetMevLatestParams, IGetMevBlockDetailParams, IGetMevPerformanceParams, IGetLiquidationTrendParams } from '@/interface/request/mev';
import { useQuery } from '@tanstack/react-query';

export const useGetMevTransactionByHash = (hash: string) => {
	return useQuery<IMevTransaction, Error>({
		queryKey: ["mev", "transaction", hash],
		queryFn: () => getMevTransactionByHash(hash),
		retry: 1,
		staleTime: 1000 * 60 * 5,
	});
};

export const useGetMevBlockByNumber = (blockNumber: number) => {
	return useQuery<IMevBlockResponse, Error>({
		queryKey: ["mev", "block", blockNumber],
		queryFn: () => getMevBlockByNumber(blockNumber),
		enabled: !!blockNumber,
	});
};

export const useGetMevBlocks = (page: number = 1, limit: number = 20) => {
	return useQuery<IMevBlocksResponse, Error>({
		queryKey: ["mev", "blocks", page, limit],
		queryFn: () => getMevBlocks(page, limit),
	});
};

export const useGetMevOverview = () => {
	return useQuery<IMevOverview, Error>({
		queryKey: ["mev", "overview"],
		queryFn: getMevOverview,
		retry: 1,
		staleTime: 1000 * 60 * 5, // 5 minutes
	});
};

export const useGetMevLatest = () => {
	return useQuery<IMevLatestResponse, Error>({
		queryKey: ["mev", "latest"],
		queryFn: getMevLatest,
		retry: 1,
		staleTime: 1000 * 60, // 1 minute
	});
};

export const useGetMevByAddress = (address: string) => {
	return useQuery<IMevAddressResponse, Error>({
		queryKey: ["mev", "address", address],
		queryFn: () => getMevByAddress(address),
		enabled: !!address,
		retry: 1,
		staleTime: 1000 * 60 * 5,
	});
};

export const useGetMevLatestWithParams = (params: IGetMevLatestParams) => {
  return useQuery<IMevLatestResponse, Error>({
    queryKey: ['mev', 'latest', params],
    queryFn: () => getMevLatestWithParams(params),
    retry: 1,
    staleTime: 1000 * 60, // 1 minute
  });
};

export const useGetMevBlockDetail = (params: IGetMevBlockDetailParams) => {
  return useQuery<IMevBlockResponse, Error>({
    queryKey: ['mev', 'block-detail', params],
    queryFn: () => getMevBlockDetail(params),
    enabled: !!params.blockNumber,
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useGetMevPerformance = (params: IGetMevPerformanceParams) => {
  return useQuery<IMevPerformanceResponse, Error>({
    queryKey: ['mev', 'performance', params.timeRange],
    queryFn: () => getMevPerformance(params),
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useGetMevLiquidation = () => {
  return useQuery<IMevLiquidationResponse, Error>({
    queryKey: ['mev', 'liquidation'],
    queryFn: getMevLiquidation,
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useGetMevSandwich = () => {
  return useQuery<IMevSandwichResponse, Error>({
    queryKey: ['mev', 'sandwich'],
    queryFn: getMevSandwich,
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useGetLiquidationTrend = (params: IGetLiquidationTrendParams) => {
  return useQuery<ILiquidationTrendResponse, Error>({
    queryKey: ['liquidation', 'trend', params.timeRange],
    queryFn: () => getLiquidationTrend(params),
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
