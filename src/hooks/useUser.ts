import { useQuery, useMutation } from '@tanstack/react-query';
import { getUserProfile, updateUserProfile } from '@/api/user';
import { IUserProfileResponse, IUpdateUserProfileResponse } from '@/interface/response/user';
import { IUpdateUserProfileBody } from '@/interface/request/user';

export const useGetUserProfile = () => {
  return useQuery<IUserProfileResponse, Error>({
    queryKey: ['user', 'profile'],
    queryFn: getUserProfile,
  });
};

export const useUpdateUserProfile = () => {
  return useMutation<IUpdateUserProfileResponse, Error, IUpdateUserProfileBody>({
    mutationFn: updateUserProfile,
  });
}; 