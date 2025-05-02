"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGetHomesByOwner } from '@/hooks/useHome';
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
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { 
  IconHome, 
  IconInfoCircle, 
  IconUser, 
  IconFilter 
} from '@tabler/icons-react';
import Link from 'next/link';
import Image from 'next/image';
import { formatCurrency } from '@/utils/format';

interface HomeOwnerListingProps {
  homeOwnerId: string;
  ownerName?: string;
}

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

const HomeOwnerListing = ({ homeOwnerId, ownerName }: HomeOwnerListingProps) => {
  const { data, isLoading, error } = useGetHomesByOwner({ homeOwnerId });
  const homes = data?.data || [];
  const [statusFilter, setStatusFilter] = useState<number | null>(null);

  const filteredHomes = statusFilter !== null 
    ? homes.filter(home => home.status === statusFilter)
    : homes;

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
      <div className="space-y-8">
        <Skeleton className="h-8 w-64" />
        
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
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-mainCardV1 rounded-lg border border-lightBorderV1">
        <IconInfoCircle className="h-12 w-12 text-mainDangerV1 mb-4" />
        <h2 className="text-xl font-semibold text-mainTextV1 mb-2">Không thể tải danh sách căn hộ</h2>
        <p className="text-secondaryTextV1 mb-6">{error?.message || 'Đã xảy ra lỗi khi tải danh sách căn hộ của chủ sở hữu'}</p>
        <Link href="/homes">
          <Button className="bg-mainTextHoverV1 hover:bg-mainTextHoverV1/90">
            Quay lại danh sách căn hộ
          </Button>
        </Link>
      </div>
    );
  }

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
            <BreadcrumbPage>Chủ sở hữu: {ownerName || homeOwnerId}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <div className="bg-mainCardV1 p-6 rounded-lg border border-lightBorderV1">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex items-center">
            <IconUser className="h-6 w-6 text-mainTextV1 mr-2" />
            <h2 className="text-xl font-semibold text-mainTextV1">
              Bất động sản của {ownerName || homeOwnerId}
            </h2>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <IconFilter className="h-5 w-5 text-mainTextV1 mr-2" />
              <span className="text-mainTextV1 mr-2">Lọc theo trạng thái:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge 
                className={`cursor-pointer ${statusFilter === null ? 'bg-mainTextHoverV1' : 'bg-gray-200 text-mainTextV1 hover:bg-gray-300'}`}
                onClick={() => setStatusFilter(null)}
              >
                Tất cả
              </Badge>
              {Object.entries(HomeStatus).map(([status, info]) => (
                <Badge 
                  key={status}
                  className={`cursor-pointer ${statusFilter === Number(status) ? info.color : 'bg-gray-200 text-mainTextV1 hover:bg-gray-300'}`}
                  onClick={() => setStatusFilter(Number(status))}
                >
                  {info.label}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        
        {filteredHomes.length === 0 ? (
          <div className="flex justify-center items-center p-12 bg-mainBackgroundV1 rounded-lg text-mainTextV1">
            <IconInfoCircle className="h-5 w-5 mr-2" />
            <p>{statusFilter !== null ? `Không có căn hộ nào có trạng thái ${HomeStatus[statusFilter]?.label || 'đã chọn'}` : 'Chủ sở hữu này chưa có căn hộ nào'}</p>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {filteredHomes.map((home) => (
              <motion.div key={home._id} variants={item}>
                <Card className="overflow-hidden border border-lightBorderV1 h-full flex flex-col hover:shadow-md transition-shadow duration-200">
                  <div className="relative h-48 w-full bg-gray-100">
                    <Image 
                      src={`https://source.unsplash.com/random/600x400/?house,${home._id}`}
                      alt={home.name}
                      fill
                      className="object-cover"
                    />
                    <Badge 
                      className={`absolute top-4 right-4 ${HomeStatus[home.status]?.color || 'bg-gray-500'} text-white`}
                    >
                      {HomeStatus[home.status]?.label || 'Không xác định'}
                    </Badge>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-mainTextV1 line-clamp-1">
                      {home.name}
                    </CardTitle>
                    <p className="text-mainTextV1 font-bold text-lg">
                      {formatCurrency(home.price)}
                    </p>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="space-y-2 text-secondaryTextV1">
                      <div className="flex items-center gap-2">
                        <IconHome className="h-4 w-4 text-mainTextV1" />
                        <span>{home.address}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm mt-4">
                        <div className="text-center p-2 bg-mainBackgroundV1 rounded-sm">
                          <p className="font-medium">{home.area} m²</p>
                          <p className="text-xs">Diện tích</p>
                        </div>
                        <div className="text-center p-2 bg-mainBackgroundV1 rounded-sm">
                          <p className="font-medium">{home.bedroom}</p>
                          <p className="text-xs">Phòng ngủ</p>
                        </div>
                        <div className="text-center p-2 bg-mainBackgroundV1 rounded-sm">
                          <p className="font-medium">{home.toilet}</p>
                          <p className="text-xs">Phòng tắm</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Link href={`/homes/${home._id}`} className="w-full">
                      <Button className="w-full bg-mainTextHoverV1 hover:bg-mainTextHoverV1/90">
                        Xem chi tiết
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default HomeOwnerListing; 