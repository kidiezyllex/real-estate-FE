export interface IGetHomeOwnerDetailParams {
  id: string;
}

export interface ISearchHomeOwnerParams {
  q: string;
}

export interface ICreateHomeOwnerBody {
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
}

export interface IUpdateHomeOwnerParams {
  id: string;
}

export interface IUpdateHomeOwnerBody {
  phone?: string;
  bankAccount?: string;
  bankName?: string;
}

export interface IDeleteHomeOwnerParams {
  id: string;
} 