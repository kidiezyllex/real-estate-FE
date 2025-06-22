import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProfile, updateUserProfile } from '@/api/user';
import { IUserProfileResponse, IUpdateUserProfileResponse } from '@/interface/response/user';
import { IUpdateUserProfileBody } from '@/interface/request/user';

export const useGetUserProfile = () => {
  return useQuery<IUserProfileResponse, Error>({
    queryKey: ['user', 'profile'],
    queryFn: getProfile,
  });
};

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation<IUpdateUserProfileResponse, Error, IUpdateUserProfileBody>({
    mutationFn: updateUserProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
    },
  });
}; 