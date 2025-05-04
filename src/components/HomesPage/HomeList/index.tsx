"use client";

import { motion } from 'framer-motion';
import { IconHome, IconInfoCircle } from '@tabler/icons-react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/utils/format';
import { IHome, IHomeSearchResult } from '@/interface/response/home';
import { Pagination } from '@/components/ui/pagination';
import React from 'react';

interface StatusInfo {
  label: string;
  color: string;
}

const HomeStatus: Record<number, StatusInfo> = {
  0: { label: 'Không khả dụng', color: 'bg-mainDangerV1' },
  1: { label: 'Khả dụng', color: 'bg-mainSuccessV1' },
  2: { label: 'Đang cho thuê', color: 'bg-mainWarningV1' },
  3: { label: 'Đang bảo trì', color: 'bg-mainInfoV1' },
};

interface HomeListProps {
  homes?: (IHome | IHomeSearchResult)[];
  isLoading?: boolean;
  error?: any;
  page?: number;
  pageSize?: number;
  total?: number;
  onPageChange?: (page: number) => void;
}

const HomeList = ({ homes, isLoading = false, error = null, page = 1, pageSize = 10, total = 0, onPageChange }: HomeListProps) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(6).fill(0).map((_, i) => (
          <Card key={i} className="overflow-hidden border border-lightBorderV1">
            <div className="relative h-48 w-full bg-gray-100">
              <Skeleton className="h-full w-full" />
            </div>
            <CardHeader>
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center p-8 bg-mainCardV1 rounded-lg border border-lightBorderV1 text-mainTextV1">
        <IconInfoCircle className="h-5 w-5 mr-2 text-mainDangerV1" />
        <p>Đã xảy ra lỗi khi tải danh sách căn hộ. Vui lòng thử lại sau.</p>
      </div>
    );
  }

  if (!homes || homes.length === 0) {
    return (
      <div className="flex justify-center items-center p-8 bg-mainCardV1 rounded-lg border border-lightBorderV1 text-mainTextV1">
        <IconInfoCircle className="h-5 w-5 mr-2 text-mainInfoV1" />
        <p>Không có căn hộ nào để hiển thị.</p>
      </div>
    );
  }

  // Lấy danh sách item cho trang hiện tại
  const startIdx = (page - 1) * pageSize;
  const endIdx = startIdx + pageSize;
  const pagedHomes = homes.slice(startIdx, endIdx);

  return (
    <React.Fragment>
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {pagedHomes.map((home: IHome | IHomeSearchResult, index: number) => (
          <motion.div key={home._id} variants={item}>
            <Card className="overflow-hidden border border-lightBorderV1 h-full flex flex-col hover:shadow-md transition-shadow duration-200">
              <div className="relative h-48 w-full bg-gray-100">
                <Image 
                  draggable={false}
                  src={`/images/sample-img${index+1}.png`}
                  alt={home.building || home.address}
                  fill
                  className="object-cover"
                />
                <Badge 
                  className={`absolute top-4 right-4 ${HomeStatus[(home as any).status]?.color || 'bg-gray-500'} text-white`}
                >
                  {HomeStatus[(home as any).status]?.label || 'Chưa cho thuê'}
                </Badge>
              </div>
              <CardHeader className="flex flex-col items-start gap-1 border-b-0 pb-0">
                <CardTitle className="text-lg font-semibold text-mainTextV1 line-clamp-1">
                  {home.building} - {home.apartmentNv}
                </CardTitle>
                <p className="text-mainTextV1 font-bold text-lg">
                  {formatCurrency((home as any).price)}
                </p>
                <p className="text-mainTextV1 text-sm">
                  {home.address}, {home.ward}, {home.district}
                </p>
              </CardHeader>
              <CardContent className="flex-1 pt-2">
                <div className="space-y-2 text-secondaryTextV1">
                  <div className="grid grid-cols-3 gap-2 text-sm mb-2">
                    <div className="text-center p-2 bg-mainBackgroundV1 rounded-sm">
                      <p className="font-medium">{(home as any).area ? `${(home as any).area} m²` : '--'}</p>
                      <p className="text-xs">Diện tích</p>
                    </div>
                    <div className="text-center p-2 bg-mainBackgroundV1 rounded-sm">
                      <p className="font-medium">{(home as any).bedroom ?? '--'}</p>
                      <p className="text-xs">Phòng ngủ</p>
                    </div>
                    <div className="text-center p-2 bg-mainBackgroundV1 rounded-sm">
                      <p className="font-medium">{(home as any).toilet ?? '--'}</p>
                      <p className="text-xs">Phòng tắm</p>
                    </div>
                  </div>
                  <div>
                    <span className="font-semibold">Chủ nhà: </span>
                    {home.homeOwnerId?.fullname} ({home.homeOwnerId?.phone})
                  </div>
                  {home.note && (
                    <div>
                      <span className="font-semibold">Ghi chú: </span>
                      {home.note}
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Link href={`/admin/homes/${home._id}`} className="w-full">
                  <Button className="w-full bg-mainTextHoverV1 hover:bg-mainTextHoverV1/90">
                    Xem chi tiết
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </motion.div>
      {total > pageSize && onPageChange && (
        <div className="mt-6 flex justify-center">
          <Pagination
            page={page}
            pageSize={pageSize}
            total={total}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </React.Fragment>
  );
};

export default HomeList; 