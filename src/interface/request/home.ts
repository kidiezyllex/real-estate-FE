export interface IGetHomeDetailParams {
  id: string;
}

export interface ISearchHomeParams {
  q: string;
}

export interface IGetHomeByOwnerParams {
  homeOwnerId: string;
}

export interface ICreateHomeBody {
  name: string;
  address: string;
  area: number;
  floor: number;
  bedroom: number;
  toilet: number;
  homeOwnerId: string;
  price: number;
  description: string;
  status: number;
}

export interface IUpdateHomeParams {
  id: string;
}

export interface IUpdateHomeBody {
  name?: string;
  price?: number;
  status?: number;
}

export interface IDeleteHomeParams {
  id: string;
} 