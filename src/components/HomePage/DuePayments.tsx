"use client";

import { useGetDuePaymentsStatistics } from "@/hooks/useStatistics";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format, parseISO } from "date-fns";
import { vi } from "date-fns/locale";
import { AlertCircle } from "tabler-icons-react";

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

const getPaymentTypeLabel = (type: number) => {
  switch (type) {
    case 1:
      return "Tiền nhà";
    case 2:
      return "Tiền dịch vụ";
    default:
      return "Khác";
  }
};

const getDueStatusColor = (daysUntilDue: number) => {
  if (daysUntilDue < 0) return "#E66666"; // Đã quá hạn
  if (daysUntilDue <= 3) return "#F0934E"; // Sắp hết hạn (trong vòng 3 ngày)
  return "#5CC184"; // Còn hạn
};

const getDueStatusLabel = (daysUntilDue: number) => {
  if (daysUntilDue < 0) return `Quá hạn ${Math.abs(daysUntilDue)} ngày`;
  if (daysUntilDue === 0) return "Đến hạn hôm nay";
  return `Còn ${daysUntilDue} ngày`;
};

export default function DuePayments() {
  const { data, isLoading, error } = useGetDuePaymentsStatistics();

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="mb-4">
          <Skeleton className="h-7 w-48" />
        </div>
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-mainDangerV1 p-4 bg-red-50 rounded-md">
          Lỗi khi tải dữ liệu về thanh toán đến hạn: {error.message}
        </div>
      </Card>
    );
  }

  const duePayments = data?.data.duePayments || [];
  const duePaymentsCount = data?.data.duePaymentsCount || 0;

  if (duePayments.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-xl font-semibold text-mainTextV1 mb-4">Thanh toán sắp đến hạn</h3>
        <div className="flex items-center justify-center flex-col p-8 text-center">
          <AlertCircle size={48} className="text-secondaryTextV1 mb-4" />
          <p className="text-secondaryTextV1">Không có thanh toán nào sắp đến hạn</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-mainTextV1">Thanh toán sắp đến hạn</h3>
        <div className="bg-primary/10 text-primary px-4 py-1 rounded-full text-sm font-medium">
          {duePaymentsCount} thanh toán
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="overflow-auto"
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Tên nhà/Người thuê</TableHead>
              <TableHead>Loại</TableHead>
              <TableHead>Ngày đến hạn</TableHead>
              <TableHead className="text-right">Số tiền</TableHead>
              <TableHead className="text-right">Trạng thái</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {duePayments.map((payment) => (
              <TableRow key={payment._id}>
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span className="text-mainTextV1">{payment.homeId.name}</span>
                    <span className="text-sm text-secondaryTextV1">{payment.guestName}</span>
                  </div>
                </TableCell>
                <TableCell>{getPaymentTypeLabel(payment.type)}</TableCell>
                <TableCell>
                  {format(parseISO(payment.datePaymentExpec), 'dd/MM/yyyy', { locale: vi })}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(payment.totalReceive)}
                </TableCell>
                <TableCell className="text-right">
                  <span 
                    className="inline-flex px-2 py-1 rounded-full text-xs font-medium"
                    style={{ 
                      color: getDueStatusColor(payment.daysUntilDue),
                      backgroundColor: `${getDueStatusColor(payment.daysUntilDue)}15` 
                    }}
                  >
                    {getDueStatusLabel(payment.daysUntilDue)}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </motion.div>
    </Card>
  );
} 