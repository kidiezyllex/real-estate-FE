export interface IGetHomeContractByHomeParams {
  homeId: string;
}

export interface IGetHomeContractDetailParams {
  id: string;
}

export interface ISearchHomeContractParams {
  q: string;
}

export interface ICreateHomeContractBody {
  guestId: string;
  homeId: string;
  duration: number;
  payCycle: number;
  renta: number;
  dateStar: string;
  deposit: number;
  status: number;
}

export interface IUpdateHomeContractParams {
  id: string;
}

export interface IUpdateHomeContractBody {
  duration?: number;
  renta?: number;
  payCycle?: number;
  status?: number;
}

export interface IDeleteHomeContractParams {
  id: string;
} 