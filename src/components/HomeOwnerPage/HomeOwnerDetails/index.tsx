"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetHomeOwnerDetail, useDeleteHomeOwner } from "@/hooks/useHomeOwner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { IconArrowLeft, IconPencil, IconTrash } from "@tabler/icons-react";
import { HomeOwnerDeleteDialog } from "@/components/HomeOwnerPage/HomeOwnerDeleteDialog";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { HomeOwnerDetailInfo } from "../HomeOwnerDetailInfo";

export default function HomeOwnerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const homeOwnerId = params.id as string;
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { data: homeOwnerData, isLoading, error } = useGetHomeOwnerDetail({
    id: homeOwnerId
  });

  const { mutate: deleteHomeOwnerMutation, isPending: isDeleting } = useDeleteHomeOwner();

  useEffect(() => {
    if (error) {
      toast.error("Không thể tải thông tin chủ nhà");
      router.push("/admin/users/home-owners");
    }
  }, [error, router]);

  const handleEdit = () => {
    router.push(`/admin/users/home-owners/${homeOwnerId}/edit`);
  };

  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    deleteHomeOwnerMutation(
      { id: homeOwnerId },
      {
        onSuccess: (data) => {
          if (data.statusCode === 200) {
            toast.success("Xóa chủ nhà thành công");
            router.push("/admin/users/home-owners");
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

  const handleBack = () => {
    router.push("/admin/users/home-owners");
  };

  if (isLoading) {
    return (
      <div className="p-4 md:p-8 bg-mainBackgroundV1 min-h-screen">
        <div className="mb-6 h-8">
          <Skeleton className="h-8 w-64" />
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-64" />
            <div className="flex gap-4">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>
          <Card className="p-6">
            <div className="space-y-4">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-mainBackgroundV1 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/users/home-owners">Quản lý chủ nhà</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Chi tiết chủ nhà</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="text-mainTextV1 hover:text-mainTextHoverV1 p-0 h-auto"
              >
                <IconArrowLeft className="h-5 w-5 mr-1" />
              </Button>
              <h1 className="text-2xl font-medium text-mainTextV1">
                {homeOwnerData?.data?.owner?.fullname || "Chi tiết chủ nhà"}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={handleEdit}
                className="border-lightBorderV1 text-mainTextV1 hover:text-mainTextHoverV1"
              >
                <IconPencil className="h-4 w-4 mr-2" />
                Chỉnh sửa
              </Button>
              <Button
                variant="outline"
                onClick={handleDelete}
                className="border-lightBorderV1 text-mainDangerV1 hover:text-white hover:bg-mainDangerV1"
              >
                <IconTrash className="h-4 w-4 mr-2" />
                Xóa
              </Button>
            </div>
          </div>

          <Card className="shadow-sm border border-lightBorderV1">
            {homeOwnerData?.data?.owner && (
              <HomeOwnerDetailInfo homeOwner={homeOwnerData.data.owner} />
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