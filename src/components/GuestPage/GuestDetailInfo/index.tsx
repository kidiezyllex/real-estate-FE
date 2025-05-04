"use client";

import { IGuest } from "@/interface/response/guest";
import { formatDateOnly } from "@/utils/dateFormat";
import { 
  IconUser, 
  IconPhone, 
  IconMail, 
  IconId, 
  IconCalendar, 
  IconMapPin, 
  IconHome, 
  IconNotes 
} from "@tabler/icons-react";

interface GuestDetailInfoProps {
  guest: IGuest;
}

export const GuestDetailInfo = ({ guest }: GuestDetailInfoProps) => {
  const details = [
    {
      icon: <IconUser className="h-5 w-5 text-mainTextV1" />,
      label: "Họ tên",
      value: guest.fullname,
    },
    {
      icon: <IconPhone className="h-5 w-5 text-mainTextV1" />,
      label: "Số điện thoại",
      value: guest.phone,
    },
    {
      icon: <IconMail className="h-5 w-5 text-mainTextV1" />,
      label: "Email",
      value: guest.email,
    },
    {
      icon: <IconId className="h-5 w-5 text-mainTextV1" />,
      label: "Số CMND/CCCD",
      value: guest.citizenId,
    },
    {
      icon: <IconCalendar className="h-5 w-5 text-mainTextV1" />,
      label: "Ngày cấp",
      value: guest.citizen_date ? formatDateOnly(guest.citizen_date) : "",
    },
    {
      icon: <IconMapPin className="h-5 w-5 text-mainTextV1" />,
      label: "Nơi cấp",
      value: guest.citizen_place,
    },
    {
      icon: <IconCalendar className="h-5 w-5 text-mainTextV1" />,
      label: "Ngày sinh",
      value: guest.birthday ? formatDateOnly(guest.birthday) : "",
    },
    {
      icon: <IconHome className="h-5 w-5 text-mainTextV1" />,
      label: "Quê quán",
      value: guest.hometown,
    },
    {
      icon: <IconNotes className="h-5 w-5 text-mainTextV1" />,
      label: "Ghi chú",
      value: guest.note,
    },
  ];

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        {details.map((detail, index) => (
          <div 
            key={index} 
            className={`flex items-start gap-3 ${index === details.length - 1 && details.length % 2 !== 0 ? "md:col-span-2" : ""}`}
          >
            <div className="flex-shrink-0 mt-1">{detail.icon}</div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">{detail.label}</p>
              <p className="text-base text-mainTextV1">{detail.value || "N/A"}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 