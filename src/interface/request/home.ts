export interface IGetHomeDetailParams {
  id: string;
}

export interface ISearchHomeParams {
  q: string;
}

export interface IGetHomeByOwnerParams {
  homeOwnerId: string;
}

export interface IHomeOwner {
  _id: string;
  fullname: string;
  phone: string;
  email: string;
  citizenId: string;
  citizen_date: string;
  citizen_place: string;
  birthday: string;
  address: string;
  bankAccount: string;
  bankName: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateHomeBody {
  address: string;
  homeOwnerId: IHomeOwner;
  district: string;
  ward: string;
  building: string;
  apartmentNv: string;
  active: boolean;
  note: string;
}

export interface IUpdateHomeParams {
  id: string;
}

export interface IUpdateHomeBody {
  address?: string;
  homeOwnerId?: IHomeOwner;
  district?: string;
  ward?: string;
  building?: string;
  apartmentNv?: string;
  active?: boolean;
  note?: string;
}

export interface IDeleteHomeParams {
  id: string;
} 