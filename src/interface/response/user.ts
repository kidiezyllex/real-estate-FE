export interface IUserProfile {
  _id: string;
  name: string;
  email: string;
  age: number;
}

export interface IUserProfileResponse {
  statusCode: number;
  message: string;
  data: {
    user: IUserProfile;
  };
}

export interface IUpdateUserProfileResponse {
  statusCode: number;
  message: string;
  data: {
    user: IUserProfile;
  };
} 