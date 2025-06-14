import { useQuery, useMutation } from '@tanstack/react-query';
import {
  getServices,
  searchServices,
  getServiceDetail,
  createService,
  updateService,
  deleteService
} from '@/api/service';
import {
  IServiceListResponse,
  IServiceSearchResponse,
  IServiceDetailResponse,
  IServiceCreateResponse,
  IServiceUpdateResponse,
  IServiceDeleteResponse
} from '@/interface/response/service';
import {
  IGetServiceDetailParams,
  ISearchServiceParams,
  ICreateServiceBody,
  IUpdateServiceParams,
  IUpdateServiceBody,
  IDeleteServiceParams
} from '@/interface/request/service';

export const useGetServices = () => {
  return useQuery<IServiceListResponse, Error>({
    queryKey: ['services'],
    queryFn: getServices,
  });
};

export const useSearchServices = (params: ISearchServiceParams) => {
  return useQuery<IServiceSearchResponse, Error>({
    queryKey: ['services', 'search', params.q],
    queryFn: () => searchServices(params),
    enabled: !!params.q,
  });
};

export const useGetServiceDetail = (params: IGetServiceDetailParams) => {
  return useQuery<IServiceDetailResponse, Error>({
    queryKey: ['services', 'detail', params.id],
    queryFn: () => getServiceDetail(params),
    enabled: !!params.id,
  });
};

export const useCreateService = () => {
  return useMutation<IServiceCreateResponse, Error, ICreateServiceBody>({
    mutationFn: createService,
  });
};

export const useUpdateService = () => {
  return useMutation<IServiceUpdateResponse, Error, { params: IUpdateServiceParams, body: IUpdateServiceBody }>({
    mutationFn: ({ params, body }) => updateService(params, body),
  });
};

export const useDeleteService = () => {
  return useMutation<IServiceDeleteResponse, Error, IDeleteServiceParams>({
    mutationFn: deleteService,
  });
}; 