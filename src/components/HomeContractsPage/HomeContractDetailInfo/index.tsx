"use client";

import { IHomeContractDetail } from "@/interface/response/homeContract";
import { formatDate } from "@/utils/dateFormat";
import { formatCurrency } from "@/utils/format";
import { 
  IconCoins, 
  IconCalendar, 
  IconHome, 
  IconUser, 
  IconClock,
  IconReceipt,
  IconStatusChange,
  IconFile
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";

interface HomeContractDetailInfoProps {
  contract: IHomeContractDetail;
}

export const HomeContractDetailInfo = ({ contract }: HomeContractDetailInfoProps) => {
  const getStatusText = (status: number) => {
    switch (status) {
      case 0:
        return { text: "Đã hủy", color: "text-red-500", badge: <Badge variant="destructive">Đã hủy</Badge> };
      case 1:
        return { text: "Đang hoạt động", color: "text-green-600", badge: <Badge className="bg-green-500 hover:bg-green-600">Đang hoạt động</Badge> };
      case 2:
        return { text: "Đã hết hạn", color: "text-gray-500", badge: <Badge variant="outline">Đã hết hạn</Badge> };
      default:
        return { text: "Không xác định", color: "text-gray-500", badge: <Badge variant="secondary">Không xác định</Badge> };
    }
  };

  const getPayCycleText = (payCycle: number) => {
    switch (payCycle) {
      case 1:
        return "Hàng tháng";
      case 3:
        return "Hàng quý";
      case 6:
        return "6 tháng";
      case 12:
        return "Hàng năm";
      default:
        return `${payCycle} tháng`;
    }
  };

  const statusInfo = getStatusText(contract.status);
  
  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-1">
            <IconReceipt className="h-5 w-5 text-mainTextV1" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Mã hợp đồng</p>
            <p className="text-base text-mainTextV1">{contract._id}</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-1">
            <IconFile className="h-5 w-5 text-mainTextV1" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Số hợp đồng</p>
            <p className="text-base text-mainTextV1">
              {contract.contractCode || 'Không có'}
            </p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-1">
            <IconHome className="h-5 w-5 text-mainTextV1" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Căn hộ</p>
            <p className="text-base text-mainTextV1">
              {contract.homeId && typeof contract.homeId === 'object' ? contract.homeId.name : 'Không xác định'}
            </p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-1">
            <IconUser className="h-5 w-5 text-mainTextV1" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Khách hàng</p>
            <p className="text-base text-mainTextV1">
              {contract.guestId && typeof contract.guestId === 'object' ? contract.guestId.fullname : 'Không xác định'}
            </p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-1">
            <IconCoins className="h-5 w-5 text-mainTextV1" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Giá thuê</p>
            <p className="text-base text-mainTextV1 font-semibold">{formatCurrency(contract.price)}</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-1">
            <IconClock className="h-5 w-5 text-mainTextV1" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Chu kỳ thanh toán</p>
            <p className="text-base text-mainTextV1">{getPayCycleText(contract.payCycle)}</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-1">
            <IconCalendar className="h-5 w-5 text-mainTextV1" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Ngày bắt đầu</p>
            <p className="text-base text-mainTextV1">{formatDate(contract.dateStar)}</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-1">
            <IconCalendar className="h-5 w-5 text-mainTextV1" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Thời hạn</p>
            <p className="text-base text-mainTextV1">{contract.duration} tháng</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-1">
            <IconStatusChange className="h-5 w-5 text-mainTextV1" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Trạng thái</p>
            <div className="flex items-center">
              {statusInfo.badge}
            </div>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-1">
            <IconClock className="h-5 w-5 text-mainTextV1" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Ngày tạo</p>
            <p className="text-base text-mainTextV1">{formatDate((contract as any).createdAt)}</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-1">
            <IconClock className="h-5 w-5 text-mainTextV1" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Cập nhật gần nhất</p>
            <p className="text-base text-mainTextV1">{formatDate((contract as any).updatedAt)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}; 