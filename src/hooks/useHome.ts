import { useQuery, useMutation } from '@tanstack/react-query';
import {
  getHomes,
  getAvailableHomes,
  searchHomes,
  getHomesByOwner,
  getHomeDetail,
  createHome,
  updateHome,
  deleteHome
} from '@/api/home';
import {
  IHomeListResponse,
  IHomeAvailableListResponse,
  IHomeSearchResponse,
  IHomeListByOwnerResponse,
  IHomeDetailResponse,
  IHomeCreateResponse,
  IHomeUpdateResponse,
  IHomeDeleteResponse
} from '@/interface/response/home';
import {
  IGetHomeDetailParams,
  ISearchHomeParams,
  IGetHomeByOwnerParams,
  ICreateHomeBody,
  IUpdateHomeParams,
  IUpdateHomeBody,
  IDeleteHomeParams
} from '@/interface/request/home';

export const useGetHomes = () => {
  return useQuery<IHomeListResponse, Error>({
    queryKey: ['homes'],
    queryFn: getHomes,
  });
};

export const useGetAvailableHomes = () => {
  return useQuery<IHomeAvailableListResponse, Error>({
    queryKey: ['homes', 'available'],
    queryFn: getAvailableHomes,
  });
};

export const useSearchHomes = (params: ISearchHomeParams) => {
  return useQuery<IHomeSearchResponse, Error>({
    queryKey: ['homes', 'search', params.q],
    queryFn: () => searchHomes(params),
    enabled: !!params.q,
  });
};

export const useGetHomesByOwner = (params: IGetHomeByOwnerParams) => {
  return useQuery<IHomeListByOwnerResponse, Error>({
    queryKey: ['homes', 'homeowner', params.homeOwnerId],
    queryFn: () => getHomesByOwner(params),
    enabled: !!params.homeOwnerId,
  });
};

export const useGetHomeDetail = (params: IGetHomeDetailParams) => {
  return useQuery<IHomeDetailResponse, Error>({
    queryKey: ['homes', 'detail', params.id],
    queryFn: () => getHomeDetail(params),
    enabled: !!params.id,
  });
};

export const useCreateHome = () => {
  return useMutation<IHomeCreateResponse, Error, ICreateHomeBody>({
    mutationFn: createHome,
  });
};

export const useUpdateHome = () => {
  return useMutation<IHomeUpdateResponse, Error, { params: IUpdateHomeParams, body: IUpdateHomeBody }>({
    mutationFn: ({ params, body }) => updateHome(params, body),
  });
};

export const useDeleteHome = () => {
  return useMutation<IHomeDeleteResponse, Error, IDeleteHomeParams>({
    mutationFn: deleteHome,
  });
}; 