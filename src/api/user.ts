import { sendGet, sendPut } from "./axios";
import { IUserProfileResponse, IUpdateUserProfileResponse } from "@/interface/response/user";
import { IUpdateUserProfileBody } from "@/interface/request/user";

export const getProfile = async (): Promise<IUserProfileResponse> => {
  const res = await sendGet(`/user/profile`);
  return res;
};

export const updateUserProfile = async (body: IUpdateUserProfileBody): Promise<IUpdateUserProfileResponse> => {
  const res = await sendPut(`/user/update-profile`, body);
  return res;
}; 