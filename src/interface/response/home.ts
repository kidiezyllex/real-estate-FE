export interface IHomeOwner {
  _id: string;
  fullname: string;
  phone: string;
  email: string;
  citizenId: string;
  citizen_date: string; // ISO date string
  citizen_place: string;
  birthday: string; // ISO date string
  bank: string;
  bankAccount: string;
  bankNumber: string;
  active: boolean;
  note: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  __v: number;
}

export interface IHome {
  _id: string;
  address: string;
  district: string;
  ward: string;
  building: string;
  apartmentNv: string;
  homeOwnerId: IHomeOwner;
  active: boolean;
  note: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  __v: number;
}

export interface IHomeAvailable {
  _id: string;
  name: string;
  address: string;
  area: number;
  floor: number;
  bedroom: number;
  toilet: number;
  homeOwnerId: string;
  status: number;
  price: number;
}

export interface IHomeSearchResult {
  _id: string;
  address: string;
  district: string;
  ward: string;
  building: string;
  apartmentNv: string;
  homeOwnerId: IHomeOwner;
  active: boolean;
  note: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface IHomeDetail {
  _id: string;
  name: string;
  address: string;
  area: number;
  floor: number;
  bedroom: number;
  toilet: number;
  homeOwnerId: {
    _id: string;
    fullname: string;
  };
  status: number;
  price: number;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface IHomeListResponse {
  statusCode: number;
  message: string;
  data: {
    homes: IHome[];
  };
}

export interface IHomeAvailableListResponse {
  statusCode: number;
  message: string;
  data: {
    homes: IHomeAvailable[];
  };
}

export interface IHomeSearchResponse {
  statusCode: number;
  message: string;
  data: {
    homes: IHomeSearchResult[];
  };
}

export interface IHomeListByOwnerResponse {
  statusCode: number;
  message: string;
  data: {
    homes: IHomeAvailable[];
  };
}

export interface IHomeDetailResponse {
  statusCode: number;
  message: string;
  data: {
    home: IHome;
  };
}

export interface IHomeCreateResponse {
  statusCode: number;
  message: string;
  data: {
    home: IHome;
  };
}

export interface IHomeUpdateResponse {
  statusCode: number;
  message: string;
  data: {
    _id: string;
    updatedAt: string;
  };
}

export interface IHomeDeleteResponse {
  statusCode: number;
  message: string;
  data: {
    _id: string;
    deleted: boolean;
  };
} 