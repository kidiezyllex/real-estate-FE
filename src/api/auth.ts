import { sendPost } from "./axios";
import { ILoginBody, IRegisterBody } from "@/interface/request/auth";
import { ILoginResponse, IRegisterResponse } from "@/interface/response/auth";

export const login = async (body: ILoginBody): Promise<ILoginResponse> => {
  const res = await sendPost(`/auth/login`, body);
  return res;
};

export const register = async (body: IRegisterBody): Promise<IRegisterResponse> => {
  const res = await sendPost(`/auth/register`, body);
  return res;
}; 