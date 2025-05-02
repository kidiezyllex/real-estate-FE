import { useMutation } from '@tanstack/react-query';
import { login, register } from '@/api/auth';
import { ILoginBody, IRegisterBody } from '@/interface/request/auth';
import { ILoginResponse, IRegisterResponse } from '@/interface/response/auth';

export const useLogin = () => {
  return useMutation<ILoginResponse, Error, ILoginBody>({
    mutationFn: login,
  });
};

export const useRegister = () => {
  return useMutation<IRegisterResponse, Error, IRegisterBody>({
    mutationFn: register,
  });
}; 