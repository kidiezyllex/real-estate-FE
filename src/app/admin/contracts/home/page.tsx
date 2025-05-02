'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useGetHomeContracts, useSearchHomeContracts, useDeleteHomeContract } from '@/hooks/useHomeContract';
import { IHomeContractSearch } from '@/interface/response/homeContract';
import { Button } from '@/components/ui/button';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import HomeContractTable from '@/components/HomeContractPage/HomeContractTable';
import HomeContractSearch from '@/components/HomeContractPage/HomeContractSearch';
import { HomeContractTableSkeleton } from '@/components/HomeContractPage/HomeContractSkeleton';
import { IconPlus, IconFileText, IconHome } from '@tabler/icons-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

export default function HomeContractsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [contractToDelete, setContractToDelete] = useState<string | null>(null);
  const [contracts, setContracts] = useState<IHomeContractSearch[]>([]);

  const { data: allContractsData, isLoading: isLoadingAll, refetch: refetchAll } = useGetHomeContracts();
  const { data: searchContractsData, isLoading: isLoadingSearch } = useSearchHomeContracts({ q: searchQuery });
  const deleteContractMutation = useDeleteHomeContract();

  const isLoading = searchQuery ? isLoadingSearch : isLoadingAll;

  useEffect(() => {
    if (searchQuery && searchContractsData) {
      setContracts(searchContractsData.data);
    } else if (!searchQuery && allContractsData) {
      if (allContractsData.data && Array.isArray(allContractsData.data)) {
        if (allContractsData.data.length === 0 || 
            (typeof allContractsData.data[0].guestId === 'object' && allContractsData.data[0].guestId !== null)) {
          setContracts(allContractsData.data as any);
        }
      }
    }
  }, [searchQuery, searchContractsData, allContractsData]);

  const handleSearch = useCallback((query: string) => {
    const url = query ? `/admin/contracts/home?q=${encodeURIComponent(query)}` : '/admin/contracts/home';
    router.push(url);
  }, [router]);

  const handleDeleteClick = (id: string) => {
    setContractToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!contractToDelete) return;

    try {
      await deleteContractMutation.mutateAsync({ id: contractToDelete });
      toast.success('Xóa hợp đồng thành công');
      refetchAll();
      setIsDeleteDialogOpen(false);
      setContractToDelete(null);
    } catch (error) {
      toast.error('Có lỗi xảy ra khi xóa hợp đồng');
      console.error(error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
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
                <BreadcrumbLink href="/admin/contracts/home" className="text-mainTextV1 font-medium">
                  <span className="flex items-center">
                    <IconHome size={16} className="mr-1" />
                    Hợp đồng căn hộ
                  </span>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-2xl font-bold text-mainTextV1">Quản lý hợp đồng căn hộ</h1>
        </div>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link href="/admin/contracts/home/create">
            <Button className="bg-mainTextHoverV1 hover:bg-purple-600 text-white">
              <IconPlus size={16} className="mr-2" />
              Tạo hợp đồng mới
            </Button>
          </Link>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <HomeContractSearch onSearch={handleSearch} initialQuery={searchQuery} />
      </motion.div>

      <div className="mt-8">
        {isLoading ? (
          <HomeContractTableSkeleton />
        ) : (
          <HomeContractTable 
            contracts={contracts} 
            onDelete={handleDeleteClick} 
          />
        )}
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-mainTextV1">Xác nhận xóa hợp đồng</DialogTitle>
            <DialogDescription className="text-secondaryTextV1">
              Bạn có chắc chắn muốn xóa hợp đồng này? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-end mt-4">
            <Button
              type="button"
              variant="outline"
              className="border-lightBorderV1 text-secondaryTextV1 hover:text-secondaryTextV1"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Hủy
            </Button>
            <Button
              type="button"
              className="bg-mainDangerV1 hover:bg-mainDangerHoverV1 text-white"
              onClick={handleConfirmDelete}
              disabled={deleteContractMutation.isPending}
            >
              {deleteContractMutation.isPending ? 'Đang xóa...' : 'Xóa hợp đồng'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 