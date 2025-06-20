import { useQuery, useMutation } from '@tanstack/react-query';
import {
  getInvoicePayments,
  getDueInvoicePayments,
  searchInvoicePayments,
  getInvoicePaymentsByHomeContract,
  getInvoicePaymentsByServiceContract,
  getInvoicePaymentsByHome,
  getInvoicePaymentDetail,
  createInvoicePayment,
  updateInvoicePayment,
  updateInvoicePaymentStatus,
  deleteInvoicePayment,
  generateInvoicePaymentForHomeContract,
  generateInvoicePaymentForServiceContract
} from '@/api/invoicePayment';
import {
  IInvoicePaymentListResponse,
  IInvoicePaymentSearchResponse,
  IInvoicePaymentDetailResponse,
  IInvoicePaymentCreateResponse,
  IInvoicePaymentUpdateResponse,
  IInvoicePaymentDeleteResponse,
  IInvoicePaymentGenerateResponse
} from '@/interface/response/invoicePayment';
import {
  IGetInvoicePaymentDetailParams,
  ISearchInvoicePaymentParams,
  IGetInvoicePaymentsByHomeContractParams,
  IGetInvoicePaymentsByServiceContractParams,
  IGetInvoicePaymentsByHomeParams,
  ICreateInvoicePaymentBody,
  IUpdateInvoicePaymentParams,
  IUpdateInvoicePaymentBody,
  IUpdateInvoicePaymentStatusParams,
  IUpdateInvoicePaymentStatusBody,
  IDeleteInvoicePaymentParams,
  IGenerateInvoicePaymentForHomeContractParams,
  IGenerateInvoicePaymentForServiceContractParams,
  IGenerateInvoicePaymentForHomeContractBody,
  IGenerateInvoicePaymentForServiceContractBody
} from '@/interface/request/invoicePayment';

export const useGetInvoicePayments = () => {
  return useQuery<IInvoicePaymentListResponse, Error>({
    queryKey: ['invoice-payments'],
    queryFn: getInvoicePayments,
  });
};

export const useGetDueInvoicePayments = () => {
  return useQuery<IInvoicePaymentListResponse, Error>({
    queryKey: ['invoice-payments', 'due'],
    queryFn: getDueInvoicePayments,
  });
};

export const useSearchInvoicePayments = (params: ISearchInvoicePaymentParams) => {
  return useQuery<IInvoicePaymentSearchResponse, Error>({
    queryKey: ['invoice-payments', 'search', params.q],
    queryFn: () => searchInvoicePayments(params),
    enabled: !!params.q,
  });
};

export const useGetInvoicePaymentsByHomeContract = (params: IGetInvoicePaymentsByHomeContractParams) => {
  return useQuery<IInvoicePaymentListResponse, Error>({
    queryKey: ['invoice-payments', 'home-contract', params.homeContractId],
    queryFn: () => getInvoicePaymentsByHomeContract(params),
    enabled: !!params.homeContractId,
  });
};

export const useGetInvoicePaymentsByServiceContract = (params: IGetInvoicePaymentsByServiceContractParams) => {
  return useQuery<IInvoicePaymentListResponse, Error>({
    queryKey: ['invoice-payments', 'service-contract', params.serviceContractId],
    queryFn: () => getInvoicePaymentsByServiceContract(params),
    enabled: !!params.serviceContractId,
  });
};

export const useGetInvoicePaymentsByHome = (params: IGetInvoicePaymentsByHomeParams) => {
  return useQuery<IInvoicePaymentListResponse, Error>({
    queryKey: ['invoice-payments', 'home', params.homeId],
    queryFn: () => getInvoicePaymentsByHome(params),
    enabled: !!params.homeId,
  });
};

export const useGetInvoicePaymentDetail = (params: IGetInvoicePaymentDetailParams) => {
  return useQuery<IInvoicePaymentDetailResponse, Error>({
    queryKey: ['invoice-payments', 'detail', params.id],
    queryFn: () => getInvoicePaymentDetail(params),
    enabled: !!params.id,
  });
};

export const useCreateInvoicePayment = () => {
  return useMutation<IInvoicePaymentCreateResponse, Error, ICreateInvoicePaymentBody>({
    mutationFn: createInvoicePayment,
  });
};

export const useUpdateInvoicePayment = () => {
  return useMutation<IInvoicePaymentUpdateResponse, Error, { params: IUpdateInvoicePaymentParams, body: IUpdateInvoicePaymentBody }>({
    mutationFn: ({ params, body }) => updateInvoicePayment(params, body),
  });
};

export const useUpdateInvoicePaymentStatus = () => {
  return useMutation<IInvoicePaymentUpdateResponse, Error, { params: IUpdateInvoicePaymentStatusParams, body: IUpdateInvoicePaymentStatusBody }>({
    mutationFn: ({ params, body }) => updateInvoicePaymentStatus(params, body),
  });
};

export const useDeleteInvoicePayment = () => {
  return useMutation<IInvoicePaymentDeleteResponse, Error, IDeleteInvoicePaymentParams>({
    mutationFn: deleteInvoicePayment,
  });
};

export const useGenerateInvoicePaymentForHomeContract = () => {
  return useMutation<IInvoicePaymentGenerateResponse, Error, { params: IGenerateInvoicePaymentForHomeContractParams, body: IGenerateInvoicePaymentForHomeContractBody }>({
    mutationFn: ({ params, body }) => generateInvoicePaymentForHomeContract(params, body),
  });
};

export const useGenerateInvoicePaymentForServiceContract = () => {
  return useMutation<IInvoicePaymentGenerateResponse, Error, { params: IGenerateInvoicePaymentForServiceContractParams, body: IGenerateInvoicePaymentForServiceContractBody }>({
    mutationFn: ({ params, body }) => generateInvoicePaymentForServiceContract(params, body),
  });
}; 