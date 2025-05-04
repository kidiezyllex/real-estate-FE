"use client";

import { useEffect, useState } from "react";
import { useGetServiceContracts, useDeleteServiceContract } from "@/hooks/useServiceContract";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { IconSearch, IconPlus, IconFilter, IconSortAscending, IconSortDescending, IconX } from "@tabler/icons-react";
import Link from "next/link";
import { ServiceContractTable } from "./ServiceContractTable";
import { ServiceContractDeleteDialog } from "./ServiceContractDeleteDialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

export default function ServiceContractsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedContractId, setSelectedContractId] = useState<string | null>(null);
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const { data: contractsData, isLoading, refetch } = useGetServiceContracts();
  const { mutate: deleteContractMutation, isPending: isDeleting } = useDeleteServiceContract();

  const toggleFilters = () => {
    setIsFiltersVisible(!isFiltersVisible);
  };

  const resetFilters = () => {
    setStatusFilter("all");
    setSortBy("newest");
    setSortDirection("desc");
  };

  const handleViewDetail = (id: string) => {
    router.push(`/admin/contracts/service-contracts/${id}`);
  };

  const handleEdit = (id: string) => {
    router.push(`/admin/contracts/service-contracts/${id}/edit`);
  };

  const handleDelete = (id: string) => {
    setSelectedContractId(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!selectedContractId) return;

    deleteContractMutation(
      { id: selectedContractId },
      {
        onSuccess: (data) => {
          if (data.statusCode === 200) {
            toast.success("Xóa hợp đồng dịch vụ thành công");
            refetch();
            setIsDeleteDialogOpen(false);
            setSelectedContractId(null);
          } else {
            toast.error("Xóa hợp đồng dịch vụ thất bại");
          }
        },
        onError: (error) => {
          toast.error(`Lỗi: ${error.message}`);
        }
      }
    );
  };

  // Lọc và sắp xếp danh sách hợp đồng
  const filteredAndSortedContracts = () => {
    if (!contractsData?.data?.contracts) return [];
    
    let result = [...contractsData.data.contracts];
    
    // Lọc theo trạng thái
    if (statusFilter !== "all") {
      const statusNumber = parseInt(statusFilter);
      result = result.filter(contract => contract.status === statusNumber);
    }
    
    // Sắp xếp
    result.sort((a, b) => {
      if (sortBy === "newest") {
        const dateA = new Date(a.createdAt || '').getTime();
        const dateB = new Date(b.createdAt || '').getTime();
        return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      } else if (sortBy === "price") {
        return sortDirection === 'asc' ? a.price - b.price : b.price - a.price;
      } else if (sortBy === "duration") {
        return sortDirection === 'asc' ? a.duration - b.duration : b.duration - a.duration;
      }
      return 0;
    });
    
    return result;
  };

  return (
    <div className="space-y-8 bg-mainBackgroundV1 p-6 rounded-lg border border-lightBorderV1">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/contracts">Quản lý hợp đồng</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Hợp đồng dịch vụ</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between gap-4 w-full md:w-auto">
            <div className="flex items-center gap-2">
              <div className="relative w-full md:w-64">
                <Input
                  placeholder="Tìm kiếm hợp đồng..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border-lightBorderV1 focus:border-mainTextHoverV1 text-secondaryTextV1"
                />
                <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mainTextV1 w-5 h-5" />
              </div>
              <Button
                variant="outline"
                className="flex items-center"
                onClick={toggleFilters}
              >
                <IconFilter className="h-4 w-4 mr-2" />
                Bộ lọc
              </Button>
            </div>
            <Link href="/admin/contracts/service-contracts/create">
              <Button
                className="bg-mainTextHoverV1 hover:bg-primary/90 text-white"
              >
                <IconPlus className="mr-2 h-4 w-4" />
                Thêm hợp đồng
              </Button>
            </Link>
          </div>

          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ 
              height: isFiltersVisible ? 'auto' : 0,
              opacity: isFiltersVisible ? 1 : 0
            }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            {isFiltersVisible && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-mainBackgroundV1 rounded-lg mb-6 border border-lightBorderV1">
                <div>
                  <label className="text-sm text-mainTextV1 mb-2 block">Trạng thái</label>
                  <Select 
                    value={statusFilter} 
                    onValueChange={setStatusFilter}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả</SelectItem>
                      <SelectItem value="0">Đã hủy</SelectItem>
                      <SelectItem value="1">Đang hoạt động</SelectItem>
                      <SelectItem value="2">Đã hết hạn</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm text-mainTextV1 mb-2 block">Sắp xếp theo</label>
                  <Select 
                    value={sortBy} 
                    onValueChange={setSortBy}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sắp xếp theo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Ngày tạo</SelectItem>
                      <SelectItem value="price">Giá dịch vụ</SelectItem>
                      <SelectItem value="duration">Thời hạn</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm text-mainTextV1 mb-2 block">Thứ tự</label>
                  <Button
                    variant="outline"
                    className="w-full flex justify-between items-center"
                    onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                  >
                    {sortDirection === 'asc' ? (
                      <>
                        <span>Tăng dần</span>
                        <IconSortAscending className="h-4 w-4" />
                      </>
                    ) : (
                      <>
                        <span>Giảm dần</span>
                        <IconSortDescending className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
                
                <div className="md:col-span-3 flex justify-end mt-4">
                  <Button
                    variant="outline"
                    className="flex items-center"
                    onClick={resetFilters}
                  >
                    <IconX className="h-4 w-4 mr-2" />
                    Đặt lại bộ lọc
                  </Button>
                </div>
              </div>
            )}
          </motion.div>

          <Card className="p-0 overflow-hidden shadow-sm border border-lightBorderV1">
            {isLoading ? (
              <div className="p-6">
                <div className="flex flex-col gap-4">
                  {[...Array(5)].map((_, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <ServiceContractTable
                contracts={filteredAndSortedContracts()}
                onView={handleViewDetail}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
          </Card>
        </div>
      </motion.div>
      <ServiceContractDeleteDialog
        isOpen={isDeleteDialogOpen}
        isDeleting={isDeleting}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
} 