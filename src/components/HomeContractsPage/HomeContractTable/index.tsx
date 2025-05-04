"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { IHomeContract } from "@/interface/response/homeContract";
import { formatDate } from "@/utils/dateFormat";
import { formatCurrency } from "@/utils/format";
import { motion } from "framer-motion";
import { IconEye, IconEdit, IconTrash } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";

interface HomeContractTableProps {
  contracts: IHomeContract[];
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const HomeContractTable = ({ contracts, onView, onEdit, onDelete }: HomeContractTableProps) => {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 0:
        return <Badge variant="destructive">Đã hủy</Badge>;
      case 1:
        return <Badge className="bg-green-500 hover:bg-green-600">Đang hoạt động</Badge>;
      case 2:
        return <Badge variant="outline">Đã hết hạn</Badge>;
      default:
        return <Badge variant="secondary">Không xác định</Badge>;
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

  if (contracts.length === 0) {
    return (
      <div className="w-full">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50">
              <TableHead className="font-medium text-mainTextV1 w-[200px]">Mã hợp đồng</TableHead>
              <TableHead className="font-medium text-mainTextV1">Thông tin căn hộ</TableHead>
              <TableHead className="font-medium text-mainTextV1">Giá thuê</TableHead>
              <TableHead className="font-medium text-mainTextV1">Thời hạn</TableHead>
              <TableHead className="font-medium text-mainTextV1">Chu kỳ thanh toán</TableHead>
              <TableHead className="font-medium text-mainTextV1">Trạng thái</TableHead>
              <TableHead className="text-right font-medium text-mainTextV1">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-secondaryTextV1">
                Không có hợp đồng thuê nhà nào được tìm thấy
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 hover:bg-gray-50">
            <TableHead className="font-medium text-mainTextV1 w-[200px]">Mã hợp đồng</TableHead>
            <TableHead className="font-medium text-mainTextV1">Thông tin căn hộ</TableHead>
            <TableHead className="font-medium text-mainTextV1">Giá thuê</TableHead>
            <TableHead className="font-medium text-mainTextV1">Thời hạn</TableHead>
            <TableHead className="font-medium text-mainTextV1">Chu kỳ thanh toán</TableHead>
            <TableHead className="font-medium text-mainTextV1">Trạng thái</TableHead>
            <TableHead className="text-right font-medium text-mainTextV1">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contracts.map((contract) => (
            <TableRow 
              key={contract._id}
              className="hover:bg-gray-50 transition-colors"
              onMouseEnter={() => setHoveredRow(contract._id)}
              onMouseLeave={() => setHoveredRow(null)}
            >
              <TableCell className="font-medium text-mainTextV1">
                <div className="flex flex-col">
                  <span>{contract._id.substring(0, 8)}...</span>
                  <span className="text-xs text-gray-500">{formatDate(contract.createdAt || '')}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium">
                    {contract.homeId && typeof contract.homeId === 'object' && 'name' in contract.homeId
                      ? (contract.homeId as any).name 
                      : 'Căn hộ #' + contract.homeId}
                  </span>
                  <span className="text-xs text-gray-500">
                    Khách hàng: {contract.guestId && typeof contract.guestId === 'object' && 'fullname' in contract.guestId
                      ? (contract.guestId as any).fullname 
                      : contract.guestId}
                  </span>
                </div>
              </TableCell>
              <TableCell className="font-medium">
                {formatCurrency((contract as any).price)}
              </TableCell>
              <TableCell>
                {contract.duration} tháng
              </TableCell>
              <TableCell>
                {getPayCycleText(contract.payCycle)}
              </TableCell>
              <TableCell>
                {getStatusBadge(contract.status)}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onView(contract._id)}
                      className="text-mainTextV1 hover:text-mainTextHoverV1 hover:bg-transparent"
                    >
                      <IconEye className="h-4 w-4" />
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(contract._id)}
                      className="text-mainTextV1 hover:text-mainTextHoverV1 hover:bg-transparent"
                    >
                      <IconEdit className="h-4 w-4" />
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(contract._id)}
                      className="text-mainTextV1 hover:text-mainDangerV1 hover:bg-transparent"
                    >
                      <IconTrash className="h-4 w-4" />
                    </Button>
                  </motion.div>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}; 