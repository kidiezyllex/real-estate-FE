'use client';

import React, { useState, useEffect } from 'react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { IconFileText, IconHome, IconPlus } from '@tabler/icons-react';
import { useCreateHomeContract } from '@/hooks/useHomeContract';
import HomeContractForm from '@/components/HomeContractPage/HomeContractForm';
import { HomeContractFormSkeleton } from '@/components/HomeContractPage/HomeContractSkeleton';
import { ICreateHomeContractBody } from '@/interface/request/homeContract';
import { toast } from 'react-toastify';

export default function CreateHomeContractPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [customers, setCustomers] = useState<{ id: string; name: string }[]>([]);
  const [homes, setHomes] = useState<{ id: string; name: string }[]>([]);
  
  const createContractMutation = useCreateHomeContract();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
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

  const handleCreateContract = async (formData: ICreateHomeContractBody) => {
    try {
      await createContractMutation.mutateAsync(formData);
      return true;
    } catch (error) {
      console.error('Error creating contract:', error);
      throw error;
    }
  };

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
            <BreadcrumbLink href="/admin/contracts/home/create" className="text-mainTextV1 font-medium">
              <span className="flex items-center">
                <IconPlus size={16} className="mr-1" />
                Tạo hợp đồng mới
              </span>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-2xl font-bold text-mainTextV1 mb-6">Tạo hợp đồng căn hộ mới</h1>

      {isLoading ? (
        <HomeContractFormSkeleton />
      ) : (
        <HomeContractForm 
          customers={customers}
          homes={homes}
          onSubmit={(data) => { handleCreateContract(data as ICreateHomeContractBody); }}
        />
      )}
    </div>
  );
} 