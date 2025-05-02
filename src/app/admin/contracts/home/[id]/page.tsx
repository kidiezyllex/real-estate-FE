'use client';

import React from 'react';
import { useGetHomeContractDetail } from '@/hooks/useHomeContract';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { IconFileText, IconHome } from '@tabler/icons-react';
import HomeContractDetail from '@/components/HomeContractPage/HomeContractDetail';
import { HomeContractDetailSkeleton } from '@/components/HomeContractPage/HomeContractSkeleton';

interface HomeContractDetailPageProps {
  params: {
    id: string;
  };
}

export default function HomeContractDetailPage({ params }: HomeContractDetailPageProps) {
  const { data, isLoading, error } = useGetHomeContractDetail({ id: params.id });

  return (
    <div className="space-y-6">
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin" className="text-mainTextV1">
              Dashboard
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/contracts" className="text-mainTextV1">
              <span className="flex items-center">
                <IconFileText size={16} className="mr-1" />
                Hợp đồng
              </span>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/contracts/home" className="text-mainTextV1">
              <span className="flex items-center">
                <IconHome size={16} className="mr-1" />
                Hợp đồng căn hộ
              </span>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/admin/contracts/home/${params.id}`} className="text-mainTextV1 font-medium">
              Chi tiết hợp đồng
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {isLoading ? (
        <HomeContractDetailSkeleton />
      ) : error ? (
        <div className="text-mainDangerV1 p-4 bg-red-50 rounded-md">
          Có lỗi xảy ra khi tải thông tin hợp đồng. Vui lòng thử lại sau.
        </div>
      ) : data?.data ? (
        <HomeContractDetail contract={data.data} />
      ) : (
        <div className="text-mainWarningV1 p-4 bg-yellow-50 rounded-md">
          Không tìm thấy thông tin hợp đồng.
        </div>
      )}
    </div>
  );
} 