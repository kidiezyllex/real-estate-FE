"use client";

import { IHome } from "@/interface/response/home";
import { formatDateOnly } from "@/utils/dateFormat";
import { 
  IconBuilding, 
  IconMapPin, 
  IconUser, 
  IconPhone, 
  IconMail, 
  IconNotes,
  IconHome,
  IconCheck,
  IconX,
  IconBath,
  IconBed,
  IconWifi,
  IconSnowflake,
  IconWashMachine,
  IconFridge,
  IconElevator,
  IconCar,
  IconShield,
  IconBarbell,
  IconPool,
  IconTrees,
  IconDog,
  IconVolume,
  IconChefHat,
  IconDoor
} from "@tabler/icons-react";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface HomeDetailInfoProps {
  home: IHome;
}

export const HomeDetailInfo = ({ home }: HomeDetailInfoProps) => {
  const basicInfo = [
    {
      icon: <IconBuilding className="h-4 w-4 text-blue-600" />,
      label: "Tòa nhà",
      value: home.building,
    },
    {
      icon: <IconHome className="h-4 w-4 text-green-600" />,
      label: "Số căn hộ",
      value: home.apartmentNv,
    },
    {
      icon: <IconMapPin className="h-4 w-4 text-red-600" />,
      label: "Địa chỉ",
      value: `${home.address}, ${home.ward}, ${home.district}`,
    },
    {
      icon: home.active ? <IconCheck className="h-4 w-4 text-green-600" /> : <IconX className="h-4 w-4 text-red-600" />,
      label: "Trạng thái",
      value: home.active ? "Hoạt động" : "Không hoạt động",
    }
  ];

  const ownerInfo = [
    {
      icon: <IconUser className="h-4 w-4 text-slate-600" />,
      label: "Tên chủ nhà",
      value: home.homeOwnerId?.fullname,
    },
    {
      icon: <IconPhone className="h-4 w-4 text-green-600" />,
      label: "Số điện thoại",
      value: home.homeOwnerId?.phone,
    },
    {
      icon: <IconMail className="h-4 w-4 text-blue-600" />,
      label: "Email",
      value: home.homeOwnerId?.email,
    },
    ...(home.note ? [{
      icon: <IconNotes className="h-4 w-4 text-slate-600" />,
      label: "Ghi chú",
      value: home.note,
    }] : [])
  ];

  const amenities = [
    { key: 'hasBathroom', label: 'Phòng tắm', icon: <IconBath className="h-4 w-4" /> },
    { key: 'hasBedroom', label: 'Phòng ngủ', icon: <IconBed className="h-4 w-4" /> },
    { key: 'hasBalcony', label: 'Ban công', icon: <IconDoor className="h-4 w-4" /> },
    { key: 'hasKitchen', label: 'Nhà bếp', icon: <IconChefHat className="h-4 w-4" /> },
    { key: 'hasWifi', label: 'Wifi', icon: <IconWifi className="h-4 w-4" /> },
    { key: 'hasSoundproof', label: 'Cách âm', icon: <IconVolume className="h-4 w-4" /> },
    { key: 'hasAirConditioner', label: 'Điều hòa', icon: <IconSnowflake className="h-4 w-4" /> },
    { key: 'hasWashingMachine', label: 'Máy giặt', icon: <IconWashMachine className="h-4 w-4" /> },
    { key: 'hasRefrigerator', label: 'Tủ lạnh', icon: <IconFridge className="h-4 w-4" /> },
    { key: 'hasElevator', label: 'Thang máy', icon: <IconElevator className="h-4 w-4" /> },
    { key: 'hasParking', label: 'Chỗ đậu xe', icon: <IconCar className="h-4 w-4" /> },
    { key: 'hasSecurity', label: 'Bảo vệ', icon: <IconShield className="h-4 w-4" /> },
    { key: 'hasGym', label: 'Phòng gym', icon: <IconBarbell className="h-4 w-4" /> },
    { key: 'hasSwimmingPool', label: 'Hồ bơi', icon: <IconPool className="h-4 w-4" /> },
    { key: 'hasGarden', label: 'Vườn', icon: <IconTrees className="h-4 w-4" /> },
    { key: 'hasPetAllowed', label: 'Cho phép thú cưng', icon: <IconDog className="h-4 w-4" /> },
  ];

  const getContractStatusBadge = () => {
    if (home.homeContract) {
      switch (home.homeContract.status) {
        case 0:
          return <Badge variant="destructive">Hợp đồng đã hủy</Badge>;
        case 1:
          return <Badge className="bg-green-500 hover:bg-green-600 text-white">Đang cho thuê</Badge>;
        case 2:
          return <Badge variant="outline">Hợp đồng hết hạn</Badge>;
        default:
          return <Badge variant="secondary">Không xác định</Badge>;
      }
    }
    return <Badge className="bg-gray-500 hover:bg-gray-600 text-white">Chưa cho thuê</Badge>;
  };

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

  const AmenityBadge = ({ amenity, isAvailable }: { amenity: any, isAvailable: boolean }) => (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
      isAvailable 
        ? 'bg-green-50 border-green-200 text-green-700' 
        : 'bg-gray-50 border-gray-200 text-gray-500'
    }`}>
      <div className={isAvailable ? 'text-green-600' : 'text-gray-400'}>
        {amenity.icon}
      </div>
      <span className="text-sm font-medium">{amenity.label}</span>
      {isAvailable ? (
        <IconCheck className="h-3 w-3 text-green-600 ml-auto" />
      ) : (
        <IconX className="h-3 w-3 text-gray-400 ml-auto" />
      )}
    </div>
  );

  return (
    <div className="space-y-4 bg-[#F9F9FC]">
      {/* Contract Status */}
      <Card className="border border-slate-200">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">Trạng thái cho thuê</h3>
            {getContractStatusBadge()}
          </div>
          {home.homeContract && (
            <p className="text-sm text-slate-600 mt-2">
              Mã hợp đồng: {home.homeContract._id}
            </p>
          )}
        </div>
      </Card>

      {/* Information Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 bg-[#F9F9FC]">
        <InfoSection 
          title="Thông tin căn hộ" 
          items={basicInfo}
        />
        
        <InfoSection 
          title="Thông tin chủ nhà" 
          items={ownerInfo}
        />
      </div>

      {/* Amenities Section */}
      <Card className="border border-slate-200 bg-white overflow-hidden">
        <CardHeader>
          Tiện nghi & Dịch vụ
        </CardHeader>
        <div className="px-4 py-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {amenities.map((amenity) => (
              <AmenityBadge
                key={amenity.key}
                amenity={amenity}
                isAvailable={!!(home as any)[amenity.key]}
              />
            ))}
          </div>
        </div>
      </Card>

      {/* Dates */}
      <Card className="border border-slate-200 bg-white overflow-hidden">
        <CardHeader>
          Thông tin thời gian
        </CardHeader>
        <div className="px-4 py-3 space-y-1">
          <InfoRow
            icon={<IconNotes className="h-4 w-4 text-slate-600" />}
            label="Ngày tạo"
            value={formatDateOnly(home.createdAt)}
          />
          <InfoRow
            icon={<IconNotes className="h-4 w-4 text-slate-600" />}
            label="Cập nhật lần cuối"
            value={formatDateOnly(home.updatedAt)}
          />
        </div>
      </Card>
    </div>
  );
}; 