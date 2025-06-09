"use client";

import { useEffect, useState } from "react";
import { useGetHomeOwners, useSearchHomeOwners, useDeleteHomeOwner } from "@/hooks/useHomeOwner";
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
import { IconSearch, IconPlus } from "@tabler/icons-react";
import Link from "next/link";
import { IHomeOwnerSearchResult } from "@/interface/response/homeOwner";
import { HomeOwnerTable } from "@/components/HomeOwnerPage/HomeOwnerTable";
import { HomeOwnerDeleteDialog } from "@/components/HomeOwnerPage/HomeOwnerDeleteDialog";

export default function HomeOwnersPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedHomeOwnerId, setSelectedHomeOwnerId] = useState<string | null>(null);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [searchResults, setSearchResults] = useState<IHomeOwnerSearchResult[]>([]);

  const { data: homeOwnersData, isLoading, refetch } = useGetHomeOwners();
  const { data: searchData, isLoading: isSearchLoading } = useSearchHomeOwners({
    q: debouncedQuery
  });
  const { mutate: deleteHomeOwnerMutation, isPending: isDeleting } = useDeleteHomeOwner();

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      if (searchQuery.trim()) {
        setDebouncedQuery(searchQuery);
      } else {
        setDebouncedQuery("");
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(debounceTimeout);
  }, [searchQuery]);

  useEffect(() => {
    if (searchData?.data?.owners) {
      setSearchResults(searchData.data.owners);
    }
  }, [searchData]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleViewDetail = (id: string) => {
    router.push(`/admin/users/home-owners/${id}`);
  };

  const handleEdit = (id: string) => {
    router.push(`/admin/users/home-owners/${id}/edit`);
  };

  const handleDelete = (id: string) => {
    setSelectedHomeOwnerId(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!selectedHomeOwnerId) return;

    deleteHomeOwnerMutation(
      { id: selectedHomeOwnerId },
      {
        onSuccess: (data) => {
          if (data.statusCode === 200) {
            toast.success("Xóa chủ nhà thành công");
            refetch();
            setIsDeleteDialogOpen(false);
            setSelectedHomeOwnerId(null);
          } else {
            toast.error("Xóa chủ nhà thất bại");
          }
        },
        onError: (error) => {
          toast.error(`Lỗi: ${error.message}`);
        }
      }
    );
  };

  const displayData = searchResults.length > 0 ? searchResults : (homeOwnersData?.data?.owners || []);

  return (
    <div className="space-y-8 bg-mainBackgroundV1 p-6 rounded-lg border border-lightBorderV1">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/users">Quản lý người dùng</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Quản lý chủ nhà</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Input
                placeholder="Tìm kiếm chủ nhà..."
                value={searchQuery}
                onChange={handleSearch}
                className="pl-10 pr-4 py-2 w-full border-lightBorderV1 focus:border-mainTextHoverV1 text-secondaryTextV1"
              />
              <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mainTextV1 w-5 h-5" />
            </div>
            <Link href="/admin/users/home-owners/create">
              <Button
                className="bg-mainTextHoverV1 hover:bg-primary/90 text-white"
              >
                <IconPlus className="mr-2 h-4 w-4" />
                Thêm chủ nhà
              </Button>
            </Link>
          </div>

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
              <HomeOwnerTable
                homeOwners={displayData}
                isSearching={!!debouncedQuery}
                onView={handleViewDetail}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
          </Card>
        </div>
      </motion.div>
      
      <HomeOwnerDeleteDialog
        isOpen={isDeleteDialogOpen}
        isDeleting={isDeleting}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
} 