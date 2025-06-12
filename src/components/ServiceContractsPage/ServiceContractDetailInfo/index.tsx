"use client";

import { formatDateOnly } from "@/utils/dateFormat";
import { 
  IconCalendar, 
  IconCash, 
  IconStatusChange,
  IconNotes,
  IconReceipt,
  IconUser,
  IconCategory
} from "@tabler/icons-react";
import { Card, CardHeader } from "@/components/ui/card";

// Helper function for currency formatting
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('vi-VN', { 
    style: 'currency', 
    currency: 'VND',
    maximumFractionDigits: 0 
  }).format(value);
};

interface ServiceContractDetailInfoProps {
  contract: any; // Replace with proper interface when available
}

export const ServiceContractDetailInfo = ({ contract }: ServiceContractDetailInfoProps) => {
  const getStatusText = (status: number) => {
    switch (status) {
      case 0: return "Đã hủy";
      case 1: return "Đang hoạt động";
      case 2: return "Đã hết hạn";
      default: return "Không xác định";
    }
  };

  const getStatusColor = (status: number) => {
    switch (status) {
      case 0: return "text-red-600";
      case 1: return "text-green-600";
      case 2: return "text-gray-600";
      default: return "text-gray-600";
    }
  };

  const serviceName = typeof contract.serviceId === 'object' ? contract.serviceId.name : 'Không xác định';
  const guestName = typeof contract.guestId === 'object' ? contract.guestId.fullname : 'Không xác định';

  const contractInfo = [
    {
      icon: <IconReceipt className="h-4 w-4 text-slate-600" />,
      label: "Mã hợp đồng",
      value: contract.contractCode || "Chưa có mã",
    },
    {
      icon: <IconCategory className="h-4 w-4 text-blue-600" />,
      label: "Tên dịch vụ",
      value: serviceName,
    },
    {
      icon: <IconUser className="h-4 w-4 text-slate-600" />,
      label: "Tên khách hàng",
      value: guestName,
    },
    {
      icon: <IconCalendar className="h-4 w-4 text-green-600" />,
      label: "Ngày bắt đầu",
      value: formatDateOnly(contract.startDate),
    },
    {
      icon: <IconCalendar className="h-4 w-4 text-red-600" />,
      label: "Ngày kết thúc",
      value: formatDateOnly(contract.endDate),
    },
    {
      icon: <IconCash className="h-4 w-4 text-amber-600" />,
      label: "Giá dịch vụ",
      value: formatCurrency(contract.price),
    },
    {
      icon: <IconStatusChange className={`h-4 w-4 ${getStatusColor(contract.status)}`} />,
      label: "Trạng thái",
      value: getStatusText(contract.status),
    },
    ...(contract.note ? [{
      icon: <IconNotes className="h-4 w-4 text-slate-600" />,
      label: "Ghi chú",
      value: contract.note,
    }] : [])
  ];

  const InfoRow = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
    <div className="flex items-center gap-3 py-2">
      <div className="flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
          {label}
        </span>
        <p className="text-sm text-slate-900 mt-0.5 truncate">
          {value || <span className="text-slate-400 italic">Chưa cập nhật</span>}
        </p>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <Card className="border border-slate-200 bg-white overflow-hidden">
        <CardHeader>
          Thông tin hợp đồng dịch vụ
        </CardHeader>
    
        <div className="px-4 py-3 space-y-1">
          {contractInfo.map((item, index) => (
            <InfoRow key={index} {...item} />
          ))}
        </div>
      </Card>
    </div>
  );
}; 