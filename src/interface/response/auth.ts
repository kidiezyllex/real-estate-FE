export interface IUser {
  _id: string;
  name: string;
  email: string;
  age: number;
}

export interface ILoginResponse {
  statusCode: number;
  message: string;
  data: {
    token: string;
    user: IUser;
  };
}

export interface IRegisterResponse {
  statusCode: number;
  message: string;
  data: {
    user: IUser;
  };
} 