export interface IHomeContract {
  _id: string;
  guestId: string;
  homeId: string;
  duration: number;
  payCycle: number;
  renta: number;
  dateStar: string;
  deposit: number;
  status: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface IHomeContractSearch {
  _id: string;
  guestId: {
    _id: string;
    fullname: string;
    phone: string;
  };
  homeId: {
    _id: string;
    name: string;
  };
  duration: number;
  payCycle: number;
  renta: number;
  dateStar: string;
  deposit: number;
  status: number;
}

export interface IHomeContractDetail {
  _id: string;
  guestId: {
    _id: string;
    fullname: string;
    phone: string;
    email: string;
    citizenId: string;
    citizen_date: string;
    citizen_place: string;
    birthday: string;
    hometown: string;
  };
  homeId: {
    _id: string;
    name: string;
    address: string;
    homeOwnerId: string;
  };
  duration: number;
  payCycle: number;
  renta: number;
  dateStar: string;
  deposit: number;
  status: number;
  createdAt: string;
  updatedAt: string;
}

export interface IHomeContractListResponse {
  statusCode: number;
  message: string;
  data: {
    contracts: IHomeContract[];
  };
}

export interface IHomeContractSearchResponse {
  statusCode: number;
  message: string;
  data: {
    contracts: IHomeContractSearch[];
  };
}

export interface IHomeContractDetailResponse {
  statusCode: number;
  message: string;
  data: {
    contract: IHomeContractDetail;
  };
}

export interface IHomeContractCreateResponse {
  statusCode: number;
  message: string;
  data: {
    contract: IHomeContract;
  };
}

export interface IHomeContractUpdateResponse {
  statusCode: number;
  message: string;
  data: {
    _id: string;
    duration?: number;
    renta?: number;
    payCycle?: number;
    status?: number;
    updatedAt: string;
  };
}

export interface IHomeContractDeleteResponse {
  statusCode: number;
  message: string;
  data: {
    _id: string;
    deleted: boolean;
  };
} 