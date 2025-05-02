'use client';

import React, { useState, useEffect } from 'react';
import { useGetHomeContractDetail, useUpdateHomeContract } from '@/hooks/useHomeContract';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { IconFileText, IconHome, IconEdit } from '@tabler/icons-react';
import HomeContractForm from '@/components/HomeContractPage/HomeContractForm';
import { HomeContractFormSkeleton } from '@/components/HomeContractPage/HomeContractSkeleton';
import { IUpdateHomeContractBody } from '@/interface/request/homeContract';
import { toast } from 'react-toastify';

interface EditHomeContractPageProps {
  params: {
    id: string;
  };
}

export default function EditHomeContractPage({ params }: EditHomeContractPageProps) {
  const { data: contractData, isLoading: isLoadingContract } = useGetHomeContractDetail({ id: params.id });
  const [isLoading, setIsLoading] = useState(true);
  const [customers, setCustomers] = useState<{ id: string; name: string }[]>([]);
  const [homes, setHomes] = useState<{ id: string; name: string }[]>([]);
  
  const updateContractMutation = useUpdateHomeContract();

  useEffect(() => {
    // Mô phỏng việc tải dữ liệu khách hàng và căn hộ từ API
    const fetchData = async () => {
      try {
        // Mô phỏng thời gian tải dữ liệu
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Dữ liệu mẫu
        setCustomers([
          { id: '1', name: 'Nguyễn Văn A' },
          { id: '2', name: 'Trần Thị B' },
          { id: '3', name: 'Lê Văn C' },
        ]);
        
        setHomes([
          { id: '1', name: 'Căn hộ A1' },
          { id: '2', name: 'Căn hộ B2' },
          { id: '3', name: 'Căn hộ C3' },
        ]);
        
        setIsLoading(false);
      } catch (error) {
        toast.error('Không thể tải dữ liệu. Vui lòng thử lại sau.');
        console.error(error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleUpdateContract = async (formData: IUpdateHomeContractBody) => {
    try {
      await updateContractMutation.mutateAsync({ 
        params: { id: params.id },
        body: formData
      });
      return true;
    } catch (error) {
      console.error('Error updating contract:', error);
      throw error;
    }
  };

  const isPageLoading = isLoading || isLoadingContract || !contractData;

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
            <BreadcrumbLink href={`/admin/contracts/home/${params.id}`} className="text-mainTextV1">
              Chi tiết hợp đồng
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/admin/contracts/home/${params.id}/edit`} className="text-mainTextV1 font-medium">
              <span className="flex items-center">
                <IconEdit size={16} className="mr-1" />
                Chỉnh sửa
              </span>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-2xl font-bold text-mainTextV1 mb-6">Chỉnh sửa hợp đồng</h1>

      {isPageLoading ? (
        <HomeContractFormSkeleton />
      ) : contractData?.data ? (
        <HomeContractForm 
          isEditing={true}
          initialData={contractData.data}
          customers={customers}
          homes={homes}
          onSubmit={handleUpdateContract}
        />
      ) : (
        <div className="text-mainWarningV1 p-4 bg-yellow-50 rounded-md">
          Không tìm thấy thông tin hợp đồng.
        </div>
      )}
    </div>
  );
} 