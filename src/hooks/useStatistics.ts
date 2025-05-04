import { useQuery } from '@tanstack/react-query';
import {
  getGeneralStatistics,
  getRevenueStatistics,
  getHomeStatistics,
  getContractStatistics,
  getPaymentStatistics,
  getDuePaymentsStatistics
} from '@/api/statistics';
import {
  IGeneralStatisticsResponse,
  IRevenueStatisticsResponse,
  IHomeStatisticsResponse,
  IContractStatisticsResponse,
  IPaymentStatisticsResponse,
  IDuePaymentsStatisticsResponse
} from '@/interface/response/statistics';
import { IGetRevenueStatisticsParams } from '@/interface/request/statistics';

export const useGetGeneralStatistics = () => {
  return useQuery<IGeneralStatisticsResponse, Error>({
    queryKey: ['statistics', 'general'],
    queryFn: getGeneralStatistics,
  });
};

export const useGetRevenueStatistics = (params: IGetRevenueStatisticsParams) => {
  return useQuery<IRevenueStatisticsResponse, Error>({
    queryKey: ['statistics', 'revenue', params.year],
    queryFn: () => getRevenueStatistics(params),
    enabled: !!params.year,
  });
};

export const useGetHomeStatistics = () => {
  return useQuery<IHomeStatisticsResponse, Error>({
    queryKey: ['statistics', 'homes'],
    queryFn: getHomeStatistics,
  });
};

export const useGetContractStatistics = () => {
  return useQuery<IContractStatisticsResponse, Error>({
    queryKey: ['statistics', 'contracts'],
    queryFn: getContractStatistics,
  });
};

export const useGetPaymentStatistics = () => {
  return useQuery<IPaymentStatisticsResponse, Error>({
    queryKey: ['statistics', 'payments'],
    queryFn: getPaymentStatistics,
  });
};

export const useGetDuePaymentsStatistics = () => {
  return useQuery<IDuePaymentsStatisticsResponse, Error>({
    queryKey: ['statistics', 'due-payments'],
    queryFn: getDuePaymentsStatistics,
  });
}; 