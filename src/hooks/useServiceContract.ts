import { useQuery, useMutation } from '@tanstack/react-query';
import {
  getServiceContracts,
  searchServiceContracts,
  getServiceContractsByHome,
  getServiceContractsByGuest,
  getServiceContractsByHomeContract,
  getServiceContractsByService,
  getServiceContractDetail,
  createServiceContract,
  updateServiceContract,
  deleteServiceContract,
} from '@/api/serviceContract';
import {
  IServiceContractListResponse,
  IServiceContractDetailResponse,
  IServiceContractCreateResponse,
  IServiceContractUpdateResponse,
  IServiceContractDeleteResponse,
  IServiceContractSearchResponse
} from '@/interface/response/serviceContract';
import {
  IGetServiceContractByHomeParams,
  IGetServiceContractByGuestParams,
  IGetServiceContractByHomeContractParams,
  IGetServiceContractByServiceParams,
  IGetServiceContractDetailParams,
  ICreateServiceContractBody,
  IUpdateServiceContractParams,
  IUpdateServiceContractBody,
  IDeleteServiceContractParams,
  ISearchServiceContractParams
} from '@/interface/request/serviceContract';

export const useGetServiceContracts = () => {
  return useQuery<IServiceContractListResponse, Error>({
    queryKey: ['service-contracts'],
    queryFn: getServiceContracts,
  });
};

export const useSearchServiceContracts = (params: ISearchServiceContractParams) => {
  return useQuery<IServiceContractSearchResponse, Error>({
    queryKey: ['service-contracts', 'search', params.q],
    queryFn: () => searchServiceContracts(params),
    enabled: !!params.q,
  });
};

export const useGetServiceContractsByHome = (params: IGetServiceContractByHomeParams) => {
  return useQuery<IServiceContractListResponse, Error>({
    queryKey: ['service-contracts', 'home', params.homeId],
    queryFn: () => getServiceContractsByHome(params),
    enabled: !!params.homeId,
  });
};

export const useGetServiceContractsByGuest = (params: IGetServiceContractByGuestParams) => {
  return useQuery<IServiceContractListResponse, Error>({
    queryKey: ['service-contracts', 'guest', params.guestId],
    queryFn: () => getServiceContractsByGuest(params),
    enabled: !!params.guestId,
  });
};

export const useGetServiceContractsByHomeContract = (params: IGetServiceContractByHomeContractParams) => {
  return useQuery<IServiceContractListResponse, Error>({
    queryKey: ['service-contracts', 'homecontract', params.homeContractId],
    queryFn: () => getServiceContractsByHomeContract(params),
    enabled: !!params.homeContractId,
  });
};

export const useGetServiceContractsByService = (params: IGetServiceContractByServiceParams) => {
  return useQuery<IServiceContractListResponse, Error>({
    queryKey: ['service-contracts', 'service', params.serviceId],
    queryFn: () => getServiceContractsByService(params),
    enabled: !!params.serviceId,
  });
};

export const useGetServiceContractDetail = (params: IGetServiceContractDetailParams) => {
  return useQuery<IServiceContractDetailResponse, Error>({
    queryKey: ['service-contracts', 'detail', params.id],
    queryFn: () => getServiceContractDetail(params),
    enabled: !!params.id,
  });
};

export const useCreateServiceContract = () => {
  return useMutation<IServiceContractCreateResponse, Error, ICreateServiceContractBody>({
    mutationFn: createServiceContract,
  });
};

export const useUpdateServiceContract = () => {
  return useMutation<IServiceContractUpdateResponse, Error, { params: IUpdateServiceContractParams, body: IUpdateServiceContractBody }>({
    mutationFn: ({ params, body }) => updateServiceContract(params, body),
  });
};

export const useDeleteServiceContract = () => {
  return useMutation<IServiceContractDeleteResponse, Error, IDeleteServiceContractParams>({
    mutationFn: deleteServiceContract,
  });
}; 