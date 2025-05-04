"use client";

import { IHomeOwner } from "@/interface/response/homeOwner";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface HomeOwnerDetailInfoProps {
  homeOwner: IHomeOwner;
}

export const HomeOwnerDetailInfo = ({ homeOwner }: HomeOwnerDetailInfoProps) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return "Không có thông tin";
    try {
      return format(new Date(dateString), "dd/MM/yyyy", { locale: vi });
    } catch (error) {
      return dateString;
    }
  };
  
  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-secondaryTextV1">Họ tên</h3>
        <p className="text-base text-mainTextV1">{homeOwner.fullname}</p>
      </div>
      
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-secondaryTextV1">Số điện thoại</h3>
        <p className="text-base text-mainTextV1">{homeOwner.phone}</p>
      </div>
      
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-secondaryTextV1">Email</h3>
        <p className="text-base text-mainTextV1">{homeOwner.email || "Không có thông tin"}</p>
      </div>
      
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-secondaryTextV1">Số CMND/CCCD</h3>
        <p className="text-base text-mainTextV1">{homeOwner.citizenId}</p>
      </div>
      
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-secondaryTextV1">Ngày cấp CMND/CCCD</h3>
        <p className="text-base text-mainTextV1">{homeOwner.citizen_date ? formatDate(homeOwner.citizen_date) : "Không có thông tin"}</p>
      </div>
      
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-secondaryTextV1">Nơi cấp CMND/CCCD</h3>
        <p className="text-base text-mainTextV1">{homeOwner.citizen_place || "Không có thông tin"}</p>
      </div>
      
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-secondaryTextV1">Ngày sinh</h3>
        <p className="text-base text-mainTextV1">{homeOwner.birthday ? formatDate(homeOwner.birthday) : "Không có thông tin"}</p>
      </div>
      
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-secondaryTextV1">Địa chỉ</h3>
        <p className="text-base text-mainTextV1">{homeOwner.address || "Không có thông tin"}</p>
      </div>
      
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-secondaryTextV1">Số tài khoản</h3>
        <p className="text-base text-mainTextV1">{homeOwner.bankAccount || "Không có thông tin"}</p>
      </div>
      
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-secondaryTextV1">Tên ngân hàng</h3>
        <p className="text-base text-mainTextV1">{homeOwner.bankName || "Không có thông tin"}</p>
      </div>
      
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-secondaryTextV1">Ngày tạo</h3>
        <p className="text-base text-mainTextV1">{formatDate(homeOwner.createdAt)}</p>
      </div>
      
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-secondaryTextV1">Cập nhật lần cuối</h3>
        <p className="text-base text-mainTextV1">{formatDate(homeOwner.updatedAt)}</p>
      </div>
    </div>
  );
}; 