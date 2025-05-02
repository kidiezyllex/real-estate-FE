import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { IHomeContractSearch } from '@/interface/response/homeContract';
import { formatDate, formatCurrency, formatContractStatus, formatPayCycle } from '@/utils/format';
import { motion } from 'framer-motion';
import { IconEdit, IconTrash, IconEye } from '@tabler/icons-react';

interface HomeContractTableProps {
  contracts: IHomeContractSearch[];
  onDelete: (id: string) => void;
}

const tableAnimations = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const rowAnimations = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const HomeContractTable: React.FC<HomeContractTableProps> = ({ contracts, onDelete }) => {
  return (
    <motion.div 
      initial="hidden"
      animate="show"
      variants={tableAnimations}
      className="rounded-md border border-lightBorderV1 bg-mainCardV1 overflow-hidden"
    >
      <Table>
        <TableHeader>
          <TableRow className="bg-mainBackgroundV1 hover:bg-mainBackgroundV1">
            <TableHead className="text-secondaryTextV1 font-medium">Mã hợp đồng</TableHead>
            <TableHead className="text-secondaryTextV1 font-medium">Khách hàng</TableHead>
            <TableHead className="text-secondaryTextV1 font-medium">Căn hộ</TableHead>
            <TableHead className="text-secondaryTextV1 font-medium">Tiền thuê</TableHead>
            <TableHead className="text-secondaryTextV1 font-medium">Kỳ thanh toán</TableHead>
            <TableHead className="text-secondaryTextV1 font-medium">Thời hạn</TableHead>
            <TableHead className="text-secondaryTextV1 font-medium">Ngày bắt đầu</TableHead>
            <TableHead className="text-secondaryTextV1 font-medium">Trạng thái</TableHead>
            <TableHead className="text-secondaryTextV1 font-medium text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contracts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-8 text-secondaryTextV1">
                Không có dữ liệu hợp đồng
              </TableCell>
            </TableRow>
          ) : (
            contracts.map((contract) => (
              <motion.tr 
                key={contract._id}
                variants={rowAnimations}
                className="border-b border-lightBorderV1 hover:bg-mainBackgroundV1"
              >
                <TableCell className="font-medium text-mainTextV1">
                  {contract._id.substring(0, 8)}...
                </TableCell>
                <TableCell className="text-secondaryTextV1">
                  {contract.guestId.fullname}
                </TableCell>
                <TableCell className="text-secondaryTextV1">
                  {contract.homeId.name}
                </TableCell>
                <TableCell className="text-secondaryTextV1">
                  {formatCurrency(contract.renta)}
                </TableCell>
                <TableCell className="text-secondaryTextV1">
                  {formatPayCycle(contract.payCycle)}
                </TableCell>
                <TableCell className="text-secondaryTextV1">
                  {contract.duration} tháng
                </TableCell>
                <TableCell className="text-secondaryTextV1">
                  {formatDate(contract.dateStar)}
                </TableCell>
                <TableCell>
                  <Badge className={`${formatContractStatus(contract.status).color} font-medium`}>
                    {formatContractStatus(contract.status).label}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/contracts/home/${contract._id}`}>
                      <Button 
                        variant="outline" 
                        size="icon"
                        className="h-8 w-8 border-lightBorderV1 text-mainTextV1 hover:text-mainTextHoverV1 hover:border-mainTextHoverV1"
                      >
                        <IconEye size={16} />
                      </Button>
                    </Link>
                    <Link href={`/admin/contracts/home/${contract._id}/edit`}>
                      <Button 
                        variant="outline" 
                        size="icon"
                        className="h-8 w-8 border-lightBorderV1 text-mainInfoV1 hover:text-mainInfoHoverV1 hover:border-mainInfoHoverV1"
                      >
                        <IconEdit size={16} />
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      size="icon"
                      className="h-8 w-8 border-lightBorderV1 text-mainDangerV1 hover:text-mainDangerHoverV1 hover:border-mainDangerHoverV1"
                      onClick={() => onDelete(contract._id)}
                    >
                      <IconTrash size={16} />
                    </Button>
                  </div>
                </TableCell>
              </motion.tr>
            ))
          )}
        </TableBody>
      </Table>
    </motion.div>
  );
};

export default HomeContractTable; 