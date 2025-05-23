import { useQuery, useMutation } from '@tanstack/react-query';
import {
  getHomeContracts,
  searchHomeContracts,
  getHomeContractsByHome,
  getHomeContractDetail,
  createHomeContract,
  updateHomeContract,
  deleteHomeContract
} from '@/api/homeContract';
import {
  IHomeContractListResponse,
  IHomeContractSearchResponse,
  IHomeContractDetailResponse,
  IHomeContractCreateResponse,
  IHomeContractUpdateResponse,
  IHomeContractDeleteResponse
} from '@/interface/response/homeContract';
import {
  IGetHomeContractByHomeParams,
  IGetHomeContractDetailParams,
  ISearchHomeContractParams,
  ICreateHomeContractBody,
  IUpdateHomeContractParams,
  IUpdateHomeContractBody,
  IDeleteHomeContractParams
} from '@/interface/request/homeContract';

export const useGetHomeContracts = () => {
  return useQuery<IHomeContractListResponse, Error>({
    queryKey: ['home-contracts'],
    queryFn: getHomeContracts,
  });
};

export const useSearchHomeContracts = (params: ISearchHomeContractParams) => {
  return useQuery<IHomeContractSearchResponse, Error>({
    queryKey: ['home-contracts', 'search', params.q],
    queryFn: () => searchHomeContracts(params),
    enabled: !!params.q,
  });
};

export const useGetHomeContractsByHome = (params: IGetHomeContractByHomeParams) => {
  return useQuery<IHomeContractListResponse, Error>({
    queryKey: ['home-contracts', 'home', params.homeId],
    queryFn: () => getHomeContractsByHome(params),
    enabled: !!params.homeId,
  });
};

export const useGetHomeContractDetail = (params: IGetHomeContractDetailParams) => {
  return useQuery<IHomeContractDetailResponse, Error>({
    queryKey: ['home-contracts', 'detail', params.id],
    queryFn: () => getHomeContractDetail(params),
    enabled: !!params.id,
  });
};

export const useCreateHomeContract = () => {
  return useMutation<IHomeContractCreateResponse, Error, ICreateHomeContractBody>({
    mutationFn: createHomeContract,
  });
};

export const useUpdateHomeContract = () => {
  return useMutation<IHomeContractUpdateResponse, Error, { params: IUpdateHomeContractParams, body: IUpdateHomeContractBody }>({
    mutationFn: ({ params, body }) => updateHomeContract(params, body),
  });
};

export const useDeleteHomeContract = () => {
  return useMutation<IHomeContractDeleteResponse, Error, IDeleteHomeContractParams>({
    mutationFn: deleteHomeContract,
  });
}; 