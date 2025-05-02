export interface IReceiver {
  _id: string;
  fullname: string;
  phone: string;
  email: string;
  bankAccount: string;
  bankName: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

export interface IReceiverSearchResult {
  _id: string;
  fullname: string;
  phone: string;
  email: string;
}

export interface IReceiverListResponse {
  statusCode: number;
  message: string;
  data: IReceiver[];
}

export interface IReceiverSearchResponse {
  statusCode: number;
  message: string;
  data: IReceiverSearchResult[];
}

export interface IReceiverDetailResponse {
  statusCode: number;
  message: string;
  data: IReceiver;
}

export interface IReceiverCreateResponse {
  statusCode: number;
  message: string;
  data: IReceiver;
}

export interface IReceiverUpdateResponse {
  statusCode: number;
  message: string;
  data: {
    _id: string;
    phone?: string;
    bankAccount?: string;
    updatedAt: string;
  };
}

export interface IReceiverDeleteResponse {
  statusCode: number;
  message: string;
  data: {
    _id: string;
    deleted: boolean;
  };
} 