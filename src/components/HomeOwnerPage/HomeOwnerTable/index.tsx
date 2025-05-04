"use client";

import { Button } from "@/components/ui/button";
import { IHomeOwnerSearchResult, IHomeOwner } from "@/interface/response/homeOwner";

interface HomeOwnerTableProps {
  homeOwners: IHomeOwnerSearchResult[] | IHomeOwner[];
  isSearching: boolean;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const HomeOwnerTable = ({
  homeOwners,
  isSearching,
  onView,
  onEdit,
  onDelete,
}: HomeOwnerTableProps) => {
  if (homeOwners.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-secondaryTextV1">
          {isSearching
            ? "Không tìm thấy chủ nhà phù hợp"
            : "Chưa có chủ nhà nào trong hệ thống"}
        </p>
      </div>
    );
  }

  return (
    <table className="w-full">
      <thead className="bg-mainBackgroundV1 border-b border-lightBorderV1">
        <tr>
          <th className="text-left p-4 font-medium text-mainTextV1">Họ tên</th>
          <th className="text-left p-4 font-medium text-mainTextV1">Số điện thoại</th>
          <th className="text-left p-4 font-medium text-mainTextV1">Email</th>
          <th className="text-right p-4 font-medium text-mainTextV1">Hành động</th>
        </tr>
      </thead>
      <tbody>
        {homeOwners.map((homeOwner) => (
          <tr key={homeOwner._id} className="border-b border-lightBorderV1 hover:bg-mainBackgroundV1">
            <td className="p-4 text-mainTextV1">{homeOwner.fullname}</td>
            <td className="p-4 text-mainTextV1">{homeOwner.phone}</td>
            <td className="p-4 text-mainTextV1">{homeOwner.email || "-"}</td>
            <td className="p-4 text-right">
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onView(homeOwner._id)}
                  className="text-mainTextV1 hover:text-mainTextHoverV1"
                >
                  Xem
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(homeOwner._id)}
                  className="text-mainTextV1 hover:text-mainTextHoverV1"
                >
                  Sửa
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(homeOwner._id)}
                  className="text-mainDangerV1 hover:bg-mainDanger/10"
                >
                  Xóa
                </Button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}; 