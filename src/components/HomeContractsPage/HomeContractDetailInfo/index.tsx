"use client";

import { formatDateOnly } from "@/utils/dateFormat";
import { 
  IconHome, 
  IconUser, 
  IconCalendar, 
  IconCash, 
  IconStatusChange,
  IconNotes,
  IconReceipt,
  IconClock,
  IconPhone,
  IconMail,
  IconMapPin,
  IconBuilding,
  IconId
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

interface HomeContractDetailInfoProps {
  contract: any; // Using any for now to handle the nested structure from API
}

export const HomeContractDetailInfo = ({ contract }: HomeContractDetailInfoProps) => {
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
  
  const getPayCycleText = (payCycle: number) => {
    switch (payCycle) {
      case 1: return "Hàng tháng";
      case 3: return "Hàng quý";
      case 6: return "6 tháng";
      case 12: return "Hàng năm";
      default: return `${payCycle} tháng`;
    }
  };

  // Extract guest information
  const guest = contract.guestId;
  const home = contract.homeId;
  const homeOwner = home?.homeOwnerId;

  const contractInfo = [
    {
      icon: <IconCalendar className="h-4 w-4 text-green-600" />,
      label: "Ngày bắt đầu",
      value: formatDateOnly(contract.dateStar),
    },
    {
      icon: <IconClock className="h-4 w-4 text-slate-600" />,
      label: "Thời hạn",
      value: `${contract.duration} tháng`,
    },
    {
      icon: <IconCash className="h-4 w-4 text-amber-600" />,
      label: "Giá thuê",
      value: formatCurrency(contract.renta),
    },
    {
      icon: <IconCash className="h-4 w-4 text-blue-600" />,
      label: "Tiền đặt cọc",
      value: formatCurrency(contract.deposit),
    },
    {
      icon: <IconClock className="h-4 w-4 text-purple-600" />,
      label: "Chu kỳ thanh toán",
      value: getPayCycleText(contract.payCycle),
    },
    {
      icon: <IconStatusChange className={`h-4 w-4 ${getStatusColor(contract.status)}`} />,
      label: "Trạng thái",
      value: getStatusText(contract.status),
    }
  ];

  const guestInfo = [
    {
      icon: <IconUser className="h-4 w-4 text-slate-600" />,
      label: "Họ tên",
      value: guest?.fullname,
    },
    {
      icon: <IconPhone className="h-4 w-4 text-green-600" />,
      label: "Số điện thoại",
      value: guest?.phone,
    },
    {
      icon: <IconMail className="h-4 w-4 text-blue-600" />,
      label: "Email",
      value: guest?.email,
    },
    {
      icon: <IconId className="h-4 w-4 text-red-600" />,
      label: "Số CMND/CCCD",
      value: guest?.citizenId,
    },
    {
      icon: <IconCalendar className="h-4 w-4 text-slate-600" />,
      label: "Ngày sinh",
      value: guest?.birthday ? formatDateOnly(guest.birthday) : "",
    },
    {
      icon: <IconMapPin className="h-4 w-4 text-slate-600" />,
      label: "Quê quán",
      value: guest?.hometown,
    }
  ];

  const homeInfo = [
    {
      icon: <IconHome className="h-4 w-4 text-blue-600" />,
      label: "Địa chỉ",
      value: home?.address,
    },
    {
      icon: <IconMapPin className="h-4 w-4 text-slate-600" />,
      label: "Quận/Huyện",
      value: home?.district,
    },
    {
      icon: <IconMapPin className="h-4 w-4 text-slate-600" />,
      label: "Phường/Xã",
      value: home?.ward,
    },
    {
      icon: <IconBuilding className="h-4 w-4 text-slate-600" />,
      label: "Tòa nhà",
      value: home?.building,
    },
    {
      icon: <IconHome className="h-4 w-4 text-slate-600" />,
      label: "Số căn hộ",
      value: home?.apartmentNv,
    }
  ];

  const homeOwnerInfo = [
    {
      icon: <IconUser className="h-4 w-4 text-slate-600" />,
      label: "Họ tên chủ nhà",
      value: homeOwner?.fullname,
    },
    {
      icon: <IconPhone className="h-4 w-4 text-green-600" />,
      label: "Số điện thoại",
      value: homeOwner?.phone,
    },
    {
      icon: <IconMail className="h-4 w-4 text-blue-600" />,
      label: "Email",
      value: homeOwner?.email,
    },
    {
      icon: <IconId className="h-4 w-4 text-red-600" />,
      label: "Số CMND/CCCD",
      value: homeOwner?.citizenId,
    },
    {
      icon: <IconCash className="h-4 w-4 text-green-600" />,
      label: "Ngân hàng",
      value: homeOwner?.bank,
    },
    {
      icon: <IconReceipt className="h-4 w-4 text-slate-600" />,
      label: "Số tài khoản",
      value: homeOwner?.bankNumber,
    }
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

  const InfoSection = ({ title, items, className = "" }: { title: string, items: any[], className?: string }) => (
    <Card className={`border border-slate-200 bg-white overflow-hidden ${className}`}>
      <CardHeader>
        {title}
      </CardHeader>
  
      <div className="px-4 py-3 space-y-1">
        {items.map((item, index) => (
          <InfoRow key={index} {...item} />
        ))}
      </div>
    </Card>
  );

  return (
    <div className="space-y-4 bg-[#F9F9FC]">
      {/* Information Grid - 4 Cards in 2x2 layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 bg-[#F9F9FC]">
        <InfoSection 
          title="Thông tin hợp đồng" 
          items={contractInfo}
        />
        
        <InfoSection 
          title="Thông tin khách thuê" 
          items={guestInfo}
        />
        
        <InfoSection 
          title="Thông tin nhà cho thuê" 
          items={homeInfo}
        />
        
        <InfoSection 
          title="Thông tin chủ nhà" 
          items={homeOwnerInfo}
        />
      </div>
    </div>
  );
}; 