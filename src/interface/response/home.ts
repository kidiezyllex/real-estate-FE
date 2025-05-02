export interface IHome {
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
  description?: string;
  createdAt?: string;
  updatedAt?: string;
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
  data: IHome[];
}

export interface IHomeAvailableListResponse {
  statusCode: number;
  message: string;
  data: IHomeAvailable[];
}

export interface IHomeSearchResponse {
  statusCode: number;
  message: string;
  data: IHomeSearchResult[];
}

export interface IHomeListByOwnerResponse {
  statusCode: number;
  message: string;
  data: IHomeAvailable[];
}

export interface IHomeDetailResponse {
  statusCode: number;
  message: string;
  data: IHomeDetail;
}

export interface IHomeCreateResponse {
  statusCode: number;
  message: string;
  data: IHome;
}

export interface IHomeUpdateResponse {
  statusCode: number;
  message: string;
  data: {
    _id: string;
    name?: string;
    price?: number;
    status?: number;
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