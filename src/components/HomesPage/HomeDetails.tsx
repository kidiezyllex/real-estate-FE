"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGetHomeDetail } from '@/hooks/useHome';
import { toast } from 'react-toastify';
import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip } from '@/components/ui/tooltip';
import { 
  IconHome, 
  IconBed, 
  IconBath, 
  IconRuler2, 
  IconBuilding, 
  IconUser, 
  IconClock, 
  IconMapPin,
  IconInfoCircle,
  IconCoin
} from '@tabler/icons-react';
import Link from 'next/link';
import Image from 'next/image';
import { formatCurrency, formatDate } from '@/utils/format';

interface HomeDetailsProps {
  homeId: string;
}

const homeStatusMap = {
  0: { label: 'Không khả dụng', color: 'bg-mainDangerV1', textColor: 'text-mainDangerV1' },
  1: { label: 'Khả dụng', color: 'bg-mainSuccessV1', textColor: 'text-mainSuccessV1' },
  2: { label: 'Đang cho thuê', color: 'bg-mainWarningV1', textColor: 'text-mainWarningV1' },
  3: { label: 'Đang bảo trì', color: 'bg-mainInfoV1', textColor: 'text-mainInfoV1' },
};

const HomeDetails = ({ homeId }: HomeDetailsProps) => {
  const { data, isLoading, error } = useGetHomeDetail({ id: homeId });
  const home = data?.data;

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-8 w-64" />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="border border-lightBorderV1">
              <Skeleton className="h-[400px] w-full" />
              <CardHeader>
                <Skeleton className="h-8 w-3/4 mb-2" />
                <Skeleton className="h-6 w-1/2" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card className="border border-lightBorderV1 h-full">
              <CardHeader>
                <Skeleton className="h-6 w-1/2" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (error || !home) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-mainCardV1 rounded-lg border border-lightBorderV1">
        <IconInfoCircle className="h-12 w-12 text-mainDangerV1 mb-4" />
        <h2 className="text-xl font-semibold text-mainTextV1 mb-2">Không thể tải thông tin căn hộ</h2>
        <p className="text-secondaryTextV1 mb-6">{error?.message || 'Đã xảy ra lỗi khi tải thông tin căn hộ'}</p>
        <Link href="/homes">
          <Button className="bg-mainTextHoverV1 hover:bg-mainTextHoverV1/90">
            Quay lại danh sách căn hộ
          </Button>
        </Link>
      </div>
    );
  }

  const statusInfo = homeStatusMap[home.status as keyof typeof homeStatusMap] || 
    { label: 'Không xác định', color: 'bg-gray-500', textColor: 'text-gray-500' };

  return (
    <div className="space-y-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Trang chủ</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/homes">Bất động sản</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{home.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div 
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border border-lightBorderV1">
            <div className="relative h-[400px] w-full bg-gray-100">
              <Image 
                src={`https://source.unsplash.com/random/1200x800/?house,${home._id}`}
                alt={home.name}
                fill
                className="object-cover"
              />
              <Badge 
                className={`absolute top-4 right-4 ${statusInfo.color} text-white px-3 py-1`}
              >
                {statusInfo.label}
              </Badge>
            </div>
            
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl font-bold text-mainTextV1">
                    {home.name}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <IconMapPin className="h-4 w-4 text-mainTextV1" />
                    <span className="text-secondaryTextV1">{home.address}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-mainTextV1 text-lg font-medium">Giá thuê</p>
                  <p className="text-mainTextHoverV1 text-2xl font-bold">
                    {formatCurrency(home.price)}
                  </p>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y border-lightBorderV1">
                <div className="flex flex-col items-center p-4 bg-mainBackgroundV1 rounded-sm">
                  <IconRuler2 className="h-6 w-6 text-mainTextV1 mb-2" />
                  <span className="text-mainTextV1 font-semibold">{home.area} m²</span>
                  <span className="text-secondaryTextV1 text-sm">Diện tích</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-mainBackgroundV1 rounded-sm">
                  <IconBed className="h-6 w-6 text-mainTextV1 mb-2" />
                  <span className="text-mainTextV1 font-semibold">{home.bedroom}</span>
                  <span className="text-secondaryTextV1 text-sm">Phòng ngủ</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-mainBackgroundV1 rounded-sm">
                  <IconBath className="h-6 w-6 text-mainTextV1 mb-2" />
                  <span className="text-mainTextV1 font-semibold">{home.toilet}</span>
                  <span className="text-secondaryTextV1 text-sm">Phòng tắm</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-mainBackgroundV1 rounded-sm">
                  <IconBuilding className="h-6 w-6 text-mainTextV1 mb-2" />
                  <span className="text-mainTextV1 font-semibold">{home.floor}</span>
                  <span className="text-secondaryTextV1 text-sm">Tầng</span>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-mainTextV1 mb-4">Mô tả</h3>
                <p className="text-secondaryTextV1 whitespace-pre-line">
                  {home.description || 'Không có mô tả cho căn hộ này.'}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="border border-lightBorderV1 sticky top-4">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-mainTextV1">
                Thông tin bổ sung
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-lightBorderV1">
                <div className="flex items-center gap-2">
                  <IconUser className="h-5 w-5 text-mainTextV1" />
                  <span className="text-secondaryTextV1">Chủ sở hữu</span>
                </div>
                <Link href={`/homes/homeowner/${home.homeOwnerId._id}`}>
                  <span className="font-medium text-mainTextHoverV1 hover:underline">
                    {home.homeOwnerId.fullname}
                  </span>
                </Link>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-lightBorderV1">
                <div className="flex items-center gap-2">
                  <IconCoin className="h-5 w-5 text-mainTextV1" />
                  <span className="text-secondaryTextV1">Giá thuê</span>
                </div>
                <span className="font-semibold text-mainTextV1">
                  {formatCurrency(home.price)}
                </span>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-lightBorderV1">
                <div className="flex items-center gap-2">
                  <IconHome className="h-5 w-5 text-mainTextV1" />
                  <span className="text-secondaryTextV1">Trạng thái</span>
                </div>
                <span className={`font-medium ${statusInfo.textColor}`}>
                  {statusInfo.label}
                </span>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-lightBorderV1">
                <div className="flex items-center gap-2">
                  <IconClock className="h-5 w-5 text-mainTextV1" />
                  <span className="text-secondaryTextV1">Cập nhật</span>
                </div>
                <span className="text-mainTextV1">
                  {formatDate(home.updatedAt)}
                </span>
              </div>
            </CardContent>
            
            <CardFooter>
              <Button 
                className="w-full bg-mainSuccessV1 hover:bg-mainSuccessHoverV1"
                onClick={() => toast.info('Chức năng đặt lịch xem nhà đang được phát triển!')}
              >
                Đặt lịch xem nhà
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default HomeDetails; 