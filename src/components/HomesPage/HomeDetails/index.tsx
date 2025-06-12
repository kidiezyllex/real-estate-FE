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
  IconCoin,
  IconTrash,
  IconEdit
} from '@tabler/icons-react';
import Link from 'next/link';
import Image from 'next/image';
import { formatCurrency, formatDate } from '@/utils/format';
import React from 'react';
import { useUser } from '@/context/useUserContext';
import DeleteHomeDialog from '../DeleteHomeDialog';

interface HomeDetailsProps {
  homeId: string;
}

const homeStatusMap = {
  0: { label: 'Không khả dụng', color: 'bg-mainDangerV1', textColor: 'text-mainDangerV1' },
  1: { label: 'Khả dụng', color: 'bg-mainSuccessV1', textColor: 'text-mainSuccessV1' },
  2: { label: 'Đang cho thuê', color: 'bg-mainWarningV1', textColor: 'text-mainWarningV1' },
  3: { label: 'Đang bảo trì', color: 'bg-mainInfoV1', textColor: 'text-mainInfoV1' },
};

const getRandom = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const HomeDetails = ({ homeId }: HomeDetailsProps) => {
  const { data: homeDetail, isLoading, error } = useGetHomeDetail({ id: homeId });
  const home = homeDetail?.data;
  const { user } = useUser();

  // Random số liệu nếu thiếu
  const area = (home as any)?.area ?? getRandom(40, 120);
  const bedroom = (home as any)?.bedroom ?? getRandom(1, 4);
  const toilet = (home as any)?.toilet ?? getRandom(1, 3);
  const floor = (home as any)?.floor ?? getRandom(1, 30);
  const price = (home as any)?.price ?? getRandom(5000000, 20000000);
  const status = (home as any)?.status ?? 1;
  const description = (home as any)?.description;

  if (isLoading) {
    return (
      <div className="space-y-8 bg-mainBackgroundV1 p-6 rounded-lg border border-lightBorderV1">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <Skeleton className="h-4 w-24" />
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <Skeleton className="h-4 w-32" />
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <Skeleton className="h-4 w-40" />
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="border border-lightBorderV1">
              <div className="relative h-[400px] w-full bg-gray-100">
                <Skeleton className="absolute inset-0 h-full w-full" />
                <Skeleton className="absolute top-4 right-4 h-8 w-24 rounded-full" />
              </div>
              <CardHeader className="border-b border-lightBorderV1 pb-4 mb-2 bg-gradient-to-r from-white via-mainBackgroundV1 to-white rounded-t-lg">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 w-full flex-1">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Skeleton className="h-7 w-7 rounded" />
                      <Skeleton className="h-6 w-40" />
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Skeleton className="h-4 w-4 rounded" />
                      <Skeleton className="h-4 w-48" />
                    </div>
                  </div>
                  <div className=" min-w-[180px] flex flex-col items-end">
                    <Skeleton className="h-4 w-16 mb-1" />
                    <Skeleton className="h-8 w-32" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y border-lightBorderV1">
                  {[1, 2, 3, 4].map((_, idx) => (
                    <div key={idx} className="text-center p-4 bg-mainBackgroundV1 rounded-sm flex flex-col items-center">
                      <Skeleton className="h-6 w-6 mb-2 rounded" />
                      <Skeleton className="h-5 w-12 mb-1" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  ))}
                </div>
                <div>
                  <Skeleton className="h-6 w-24 mb-2" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </CardContent>
            </Card>
            <div className="flex flex-wrap gap-4 mt-4 w-full justify-end">
              <Skeleton className="h-10 w-32 rounded" />
              <Skeleton className="h-10 w-32 rounded" />
            </div>
          </div>
          <div>
            <Card className="border border-lightBorderV1 sticky top-4">
              <CardHeader>
                <Skeleton className="h-6 w-32 mb-2" />
              </CardHeader>
              <CardContent className="space-y-4">
                {[1, 2, 3, 4].map((_, idx) => (
                  <div key={idx} className="flex items-center justify-between py-3 border-b border-lightBorderV1">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-5 w-5 rounded" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                    <Skeleton className="h-4 w-24" />
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full rounded" />
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

  const statusInfo = homeStatusMap[status as keyof typeof homeStatusMap] ||
    { label: 'Không xác định', color: 'bg-gray-500', textColor: 'text-mainTextV1' };

  return (
    <div className="space-y-8 bg-mainBackgroundV1 p-6 rounded-lg border border-lightBorderV1">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/homes">Quản lý căn hộ</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{(home as any)?.building} - {(home as any)?.apartmentNv}</BreadcrumbPage>
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
                src={`/images/sample-img${getRandom(1, 10)}.png`}
                alt={((home as any)?.building || '') + ' - ' + ((home as any)?.apartmentNv || '')}
                fill
                className="object-cover"
              />
              <Badge
                className={`absolute top-4 right-4 ${statusInfo.color} text-white px-3 py-1`}
              >
                {statusInfo.label}
              </Badge>
            </div>

            <CardHeader className="border-b border-lightBorderV1 pb-4 mb-2 bg-gradient-to-r from-white via-mainBackgroundV1 to-white rounded-t-lg">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4  w-full flex-1">
                <div className="flex-1 ">
                  <div className="flex items-center gap-2 mb-2 ">
                    <IconBuilding className="h-7 w-7 text-mainTextHoverV1" />
                    <CardTitle className="text-lg md:text-xl font-semibold text-mainTextV1">
                      {(home as any)?.building} - {(home as any)?.apartmentNv}
                    </CardTitle>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap text-secondaryTextV1 text-sm">
                    <IconMapPin className="h-4 w-4" />
                    <span>
                      {(home as any)?.address}
                      {(home as any)?.ward ? `, ${(home as any).ward}` : ''}
                      {(home as any)?.district ? `, ${(home as any).district}` : ''}
                    </span>
                  </div>
                </div>
                <div className=" min-w-[180px] flex flex-col items-end">
                  <span className="text-xs text-secondaryTextV1 mb-1 flex items-center gap-1">
                    <IconCoin className="h-4 w-4" /> Giá thuê
                  </span>
                  <span className="text-2xl md:text-3xl font-semibold text-mainTextHoverV1">
                    {formatCurrency(price)}
                  </span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y border-lightBorderV1">
                <div className="text-center p-4 bg-mainBackgroundV1 rounded-sm flex flex-col items-center">
                  <IconRuler2 className="h-6 w-6 text-mainTextV1 mb-2" />
                  <span className="text-mainTextV1 font-semibold">{area} m²</span>
                  <span className="text-secondaryTextV1 text-sm">Diện tích</span>
                </div>
                <div className="text-center p-4 bg-mainBackgroundV1 rounded-sm flex flex-col items-center">
                  <IconBed className="h-6 w-6 text-mainTextV1 mb-2" />
                  <span className="text-mainTextV1 font-semibold">{bedroom}</span>
                  <span className="text-secondaryTextV1 text-sm">Phòng ngủ</span>
                </div>
                <div className="text-center p-4 bg-mainBackgroundV1 rounded-sm flex flex-col items-center">
                  <IconBath className="h-6 w-6 text-mainTextV1 mb-2" />
                  <span className="text-mainTextV1 font-semibold">{toilet}</span>
                  <span className="text-secondaryTextV1 text-sm">Phòng tắm</span>
                </div>
                <div className="text-center p-4 bg-mainBackgroundV1 rounded-sm flex flex-col items-center">
                  <IconBuilding className="h-6 w-6 text-mainTextV1 mb-2" />
                  <span className="text-mainTextV1 font-semibold">{floor}</span>
                  <span className="text-secondaryTextV1 text-sm">Tầng</span>
                </div>
              </div>

              {description && (
                <div>
                  <h3 className="text-lg font-semibold text-mainTextV1 mb-2">Mô tả</h3>
                  <p className="text-secondaryTextV1 whitespace-pre-line">{description}</p>
                </div>
              )}
            </CardContent>
          </Card>
          <motion.div
            className="flex flex-wrap gap-4 mt-4 w-full justify-end"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <DeleteHomeDialog
              homeId={homeId}
              homeName={((home as any)?.building || '') + ' - ' + ((home as any)?.apartmentNv || '')}
              trigger={
                <Button
                  className="bg-mainDangerV1 !text-white hover:bg-mainDangerHoverV1 border-none"
                >
                  <IconTrash className="h-4 w-4 mr-2" />
                  Xóa căn hộ
                </Button>
              }
            />
            <Link href={`/admin/homes/${homeId}/edit`}>
              <Button
                className="bg-mainInfoV1 !text-white hover:bg-mainInfoHoverV1 border-none"
              >
                <IconEdit className="h-4 w-4 mr-2" />
                Sửa thông tin
              </Button>
            </Link>
          </motion.div>
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
                <div className="text-right">
                  <div className="font-medium text-mainTextHoverV1">{(home as any)?.homeOwnerId?.fullname}</div>
                  <div className="text-xs text-mainTextV1">{(home as any)?.homeOwnerId?.phone}</div>
                  <div className="text-xs text-mainTextV1">{(home as any)?.homeOwnerId?.email}</div>
                </div>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-lightBorderV1">
                <div className="flex items-center gap-2">
                  <IconCoin className="h-5 w-5 text-mainTextV1" />
                  <span className="text-secondaryTextV1">Giá thuê</span>
                </div>
                <span className="font-semibold text-mainTextV1">
                  {formatCurrency(price)}
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
                  {formatDate((home as any)?.updatedAt)}
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