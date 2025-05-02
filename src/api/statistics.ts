import { sendGet } from "./axios";
import {
  IGeneralStatisticsResponse,
  IRevenueStatisticsResponse,
  IHomeStatisticsResponse,
  IContractStatisticsResponse,
  IPaymentStatisticsResponse,
  IDuePaymentsStatisticsResponse
} from "@/interface/response/statistics";
import { IGetRevenueStatisticsParams } from "@/interface/request/statistics";

export const getGeneralStatistics = async (): Promise<IGeneralStatisticsResponse> => {
  const res = await sendGet(`/statistics/general`);
  return res;
};

export const getRevenueStatistics = async (params: IGetRevenueStatisticsParams): Promise<IRevenueStatisticsResponse> => {
  const res = await sendGet(`/statistics/revenue?year=${params.year}`);
  return res;
};

export const getHomeStatistics = async (): Promise<IHomeStatisticsResponse> => {
  const res = await sendGet(`/statistics/homes`);
  return res;
};

export const getContractStatistics = async (): Promise<IContractStatisticsResponse> => {
  const res = await sendGet(`/statistics/contracts`);
  return res;
};

export const getPaymentStatistics = async (): Promise<IPaymentStatisticsResponse> => {
  const res = await sendGet(`/statistics/payments`);
  return res;
};

export const getDuePaymentsStatistics = async (): Promise<IDuePaymentsStatisticsResponse> => {
  const res = await sendGet(`/statistics/due-payments`);
  return res;
}; 