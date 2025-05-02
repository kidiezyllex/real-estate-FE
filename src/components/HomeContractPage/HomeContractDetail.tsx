import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { IHomeContractDetail } from '@/interface/response/homeContract';
import { formatDate, formatCurrency, formatContractStatus, formatPayCycle } from '@/utils/format';
import Link from 'next/link';
import { IconEdit, IconArrowLeft } from '@tabler/icons-react';

interface HomeContractDetailProps {
  contract: IHomeContractDetail;
}

const DetailRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="grid grid-cols-3 py-3">
    <div className="col-span-1 text-mainTextV1 font-medium">{label}</div>
    <div className="col-span-2 text-secondaryTextV1">{value}</div>
  </div>
);

const HomeContractDetail: React.FC<HomeContractDetailProps> = ({ contract }) => {
  if (!contract) return null;

  const status = formatContractStatus(contract.status);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between">
        <Link href="/admin/contracts/home">
          <Button variant="outline" className="border-lightBorderV1 text-mainTextV1 hover:text-mainTextHoverV1">
            <IconArrowLeft size={16} className="mr-2" />
            Quay lại
          </Button>
        </Link>
        <Link href={`/admin/contracts/home/${contract._id}/edit`}>
          <Button className="bg-mainTextHoverV1 hover:bg-purple-600 text-white">
            <IconEdit size={16} className="mr-2" />
            Chỉnh sửa
          </Button>
        </Link>
      </div>

      <Card className="border-lightBorderV1 bg-mainCardV1">
        <CardHeader className="border-b border-lightBorderV1 pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-mainTextV1 text-xl">
              Hợp đồng căn hộ #{contract._id.substring(0, 8)}
            </CardTitle>
            <Badge className={`${status.color} font-medium`}>
              {status.label}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-mainTextV1 mb-4">Thông tin cơ bản</h3>
              <div className="bg-mainBackgroundV1 rounded-md p-4 divide-y divide-lightBorderV1">
                <DetailRow label="Ngày bắt đầu" value={formatDate(contract.dateStar)} />
                <DetailRow label="Thời hạn" value={`${contract.duration} tháng`} />
                <DetailRow label="Kỳ thanh toán" value={formatPayCycle(contract.payCycle)} />
                <DetailRow label="Tiền thuê" value={formatCurrency(contract.renta)} />
                <DetailRow label="Tiền đặt cọc" value={formatCurrency(contract.deposit)} />
                <DetailRow label="Ngày tạo" value={formatDate(contract.createdAt)} />
                <DetailRow label="Cập nhật gần nhất" value={formatDate(contract.updatedAt)} />
              </div>
            </div>

            <Separator className="bg-lightBorderV1" />

            <div>
              <h3 className="text-lg font-medium text-mainTextV1 mb-4">Thông tin khách hàng</h3>
              <div className="bg-mainBackgroundV1 rounded-md p-4 divide-y divide-lightBorderV1">
                <DetailRow label="Họ tên" value={contract.guestId.fullname} />
                <DetailRow label="Số điện thoại" value={contract.guestId.phone} />
                <DetailRow label="Email" value={contract.guestId.email} />
                <DetailRow label="CMND/CCCD" value={contract.guestId.citizenId} />
                <DetailRow label="Ngày cấp" value={formatDate(contract.guestId.citizen_date)} />
                <DetailRow label="Nơi cấp" value={contract.guestId.citizen_place} />
                <DetailRow label="Ngày sinh" value={formatDate(contract.guestId.birthday)} />
                <DetailRow label="Quê quán" value={contract.guestId.hometown} />
              </div>
            </div>

            <Separator className="bg-lightBorderV1" />

            <div>
              <h3 className="text-lg font-medium text-mainTextV1 mb-4">Thông tin căn hộ</h3>
              <div className="bg-mainBackgroundV1 rounded-md p-4 divide-y divide-lightBorderV1">
                <DetailRow label="Tên căn hộ" value={contract.homeId.name} />
                <DetailRow label="Địa chỉ" value={contract.homeId.address} />
                <DetailRow label="Mã chủ sở hữu" value={contract.homeId.homeOwnerId} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default HomeContractDetail; 