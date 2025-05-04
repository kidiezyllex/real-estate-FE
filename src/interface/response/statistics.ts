export interface IGeneralStatistics {
  totalHomes: number;
  totalGuests: number;
  totalHomeOwners: number;
  totalServices: number;
}

export interface IGeneralStatisticsResponse {
  statusCode: number;
  message: string;
  data: {
    statistics: IGeneralStatistics;
  };
}

export interface IRevenueByMonth {
  month: number;
  revenue: number;
}

export interface IRevenueStatistics {
  year: number;
  months: IRevenueByMonth[];
  totalRevenue: number;
}

export interface IRevenueStatisticsResponse {
  statusCode: number;
  message: string;
  data: {
    statistics: IRevenueStatistics;
  };
}

export interface IHomeStatistics {
  totalHomes: number;
  availableHomes: number;
  occupiedHomes: number;
}

export interface IHomeStatisticsResponse {
  statusCode: number;
  message: string;
  data: {
    statistics: IHomeStatistics;
  };
}

export interface IContractStatistics {
  totalContracts: number;
  homeContracts: number;
  serviceContracts: number;
  activeContracts: number;
  expiredContracts: number;
}

export interface IContractStatisticsResponse {
  statusCode: number;
  message: string;
  data: {
    statistics: IContractStatistics;
  };
}

export interface IPaymentStatistics {
  totalPayments: number;
  paidOnTime: number;
  paidLate: number;
  unpaid: number;
}

export interface IPaymentStatisticsResponse {
  statusCode: number;
  message: string;
  data: {
    statistics: IPaymentStatistics;
  };
}

export interface IDuePayment {
  _id: string;
  homeId: {
    name: string;
  };
  guestName: string;
  datePaymentExpec: string;
  totalReceive: number;
  type: number;
  daysUntilDue: number;
}

export interface IDuePaymentsStatistics {
  duePaymentsCount: number;
  duePayments: IDuePayment[];
}

export interface IDuePaymentsStatisticsResponse {
  statusCode: number;
  message: string;
  data: {
    statistics: IDuePaymentsStatistics;
  };
} 