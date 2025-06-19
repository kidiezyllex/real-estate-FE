"use client";

import { useEffect, useState } from "react";
import { useGetServiceContractDetail, useDeleteServiceContract } from "@/hooks/useServiceContract";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { ServiceContractDetailInfo } from "@/components/ServiceContractsPage/ServiceContractDetailInfo";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { IconPencil, IconTrash, IconLoader2, IconCheck, IconX, IconAlertTriangle } from "@tabler/icons-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

interface ServiceContractDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  contractId: string;
  onSuccess?: () => void;
}

// Simple interface for the form data
interface ServiceContractFormData {
  serviceId?: string;
  guestId?: string;
  startDate?: string;
  endDate?: string;
  price?: number;
  status?: number;
  note?: string;
}

export const ServiceContractDetailsDialog = ({ isOpen, onClose, contractId, onSuccess }: ServiceContractDetailsDialogProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [formData, setFormData] = useState<ServiceContractFormData>({
    serviceId: "",
    guestId: "",
    startDate: "",
    endDate: "",
    price: 0,
    status: 1,
    note: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: contractData, isLoading, error, refetch } = useGetServiceContractDetail({ 
    id: contractId 
  });
  
  // Using a placeholder for update mutation
  const isUpdating = false; // Will be replaced when the hook is available
  
  const { mutate: deleteContractMutation, isPending: isDeleting } = useDeleteServiceContract();

  useEffect(() => {
    if (error) {
      toast.error("Không thể tải thông tin hợp đồng");
      onClose();
    }
  }, [error, onClose]);

  useEffect(() => {
    if (contractData?.data) {
      const contract = contractData.data;
      // Update this mapping according to your actual service contract structure
      setFormData({
        serviceId: typeof contract.serviceId === 'object' ? contract.serviceId._id : contract.serviceId,
        guestId: typeof contract.guestId === 'object' ? contract.guestId._id : contract.guestId,
        startDate: contract.startDate,
        endDate: contract.endDate,
        price: contract.price,
        status: contract.status,
        note: contract.note,
      });
    }
  }, [contractData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: name === 'status' ? parseInt(value) : value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleDateChange = (name: string, date: Date | undefined) => {
    if (date) {
      setFormData((prev) => ({ ...prev, [name]: date.toISOString() }));
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: "" }));
      }
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.serviceId) newErrors.serviceId = "Dịch vụ không được để trống";
    if (!formData.guestId) newErrors.guestId = "Khách hàng không được để trống";
    if (!formData.startDate) newErrors.startDate = "Ngày bắt đầu không được để trống";
    if (!formData.endDate) newErrors.endDate = "Ngày kết thúc không được để trống";
    if (!formData.price || formData.price <= 0) newErrors.price = "Giá dịch vụ phải lớn hơn 0";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setErrors({});
    // Reset form data to original values
    if (contractData?.data) {
      const contract = contractData.data;
      setFormData({
        serviceId: typeof contract.serviceId === 'object' ? contract.serviceId._id : contract.serviceId,
        guestId: typeof contract.guestId === 'object' ? contract.guestId._id : contract.guestId,
        startDate: contract.startDate,
        endDate: contract.endDate,
        price: contract.price,
        status: contract.status,
        note: contract.note,
      });
    }
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;
    
    // For now, just show a message
    toast.info("Chức năng cập nhật đang được phát triển");
    setIsEditing(false);
  };

  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    deleteContractMutation(
      { id: contractId },
      {
        onSuccess: (data) => {
          if (data.statusCode === 200) {
            toast.success("Xóa hợp đồng dịch vụ thành công");
            setIsDeleteDialogOpen(false);
            onSuccess?.();
            onClose();
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

  const handleClose = () => {
    setIsEditing(false);
    setErrors({});
    onClose();
  };

  // Get service and guest names for display
  const getServiceName = () => {
    if (!contractData?.data) return "";
    const contract = contractData.data;
    return typeof contract.serviceId === 'object' ? contract.serviceId.name : "Unknown Service";
  };

  const getGuestName = () => {
    if (!contractData?.data) return "";
    const contract = contractData.data;
    return typeof contract.guestId === 'object' ? contract.guestId.fullname : "Unknown Guest";
  };

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle  >
              Chi tiết hợp đồng dịch vụ
            </DialogTitle>
          </DialogHeader>
          
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
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle  >
              {isEditing ? "Chỉnh sửa thông tin hợp đồng dịch vụ" : "Chi tiết hợp đồng dịch vụ"}
            </DialogTitle>
          </DialogHeader>
          
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col gap-4">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex w-full items-center justify-end gap-4">
                  {!isEditing ? (
                    <>
                      <Button
                        variant="outline"
                        onClick={handleDelete}
                      >
                        <IconTrash className="h-4 w-4" />
                        Xóa
                      </Button>
                      <Button
                        variant="default"
                        onClick={handleEdit}
                      >
                        <IconPencil className="h-4 w-4" />
                        Chỉnh sửa
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        onClick={handleCancelEdit}
                        disabled={isUpdating}
                      >
                        <IconX className="h-4 w-4" />
                        Hủy
                      </Button>
                      <Button
                        onClick={handleUpdate}
                        disabled={isUpdating}
                        className="bg-mainTextHoverV1 hover:bg-primary/90 text-white"
                      >
                        {isUpdating ? (
                          <IconLoader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <IconCheck className="h-4 w-4" />
                        )}
                        Cập nhật
                      </Button>
                    </>
                  )}
                </div>
              </div>

              <Card className="  border border-lightBorderV1">
                {isEditing ? (
                  <form onSubmit={handleUpdate} className="p-6 space-y-6">
                    {/* Edit form fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="serviceName" className="text-secondaryTextV1">
                          Tên dịch vụ <span className="text-mainDangerV1">*</span>
                        </Label>
                        <Input
                          id="serviceName"
                          value={getServiceName()}
                          readOnly
                          className="border-lightBorderV1 bg-gray-50"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="guestName" className="text-secondaryTextV1">
                          Tên khách hàng <span className="text-mainDangerV1">*</span>
                        </Label>
                        <Input
                          id="guestName"
                          value={getGuestName()}
                          readOnly
                          className="border-lightBorderV1 bg-gray-50"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="startDate" className="text-secondaryTextV1">
                          Ngày bắt đầu <span className="text-mainDangerV1">*</span>
                        </Label>
                        <DatePicker
                          date={formData.startDate ? new Date(formData.startDate) : undefined}
                          onDateChange={(date) => handleDateChange("startDate", date)}
                          placeholder="Chọn ngày bắt đầu"
                        />
                        {errors.startDate && (
                          <p className="text-sm text-mainDangerV1">{errors.startDate}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="endDate" className="text-secondaryTextV1">
                          Ngày kết thúc <span className="text-mainDangerV1">*</span>
                        </Label>
                        <DatePicker
                          date={formData.endDate ? new Date(formData.endDate) : undefined}
                          onDateChange={(date) => handleDateChange("endDate", date)}
                          placeholder="Chọn ngày kết thúc"
                        />
                        {errors.endDate && (
                          <p className="text-sm text-mainDangerV1">{errors.endDate}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="price" className="text-secondaryTextV1">
                          Giá dịch vụ <span className="text-mainDangerV1">*</span>
                        </Label>
                        <Input
                          id="price"
                          name="price"
                          type="number"
                          value={formData.price}
                          onChange={handleChange}
                          placeholder="Nhập giá dịch vụ"
                          className={`border-lightBorderV1 ${errors.price ? "border-mainDangerV1" : ""}`}
                        />
                        {errors.price && (
                          <p className="text-sm text-mainDangerV1">{errors.price}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="status" className="text-secondaryTextV1">
                          Trạng thái
                        </Label>
                        <Select
                          value={String(formData.status)}
                          onValueChange={(value) => handleSelectChange("status", value)}
                        >
                          <SelectTrigger className="border-lightBorderV1">
                            <SelectValue placeholder="Chọn trạng thái" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">Đã hủy</SelectItem>
                            <SelectItem value="1">Đang hoạt động</SelectItem>
                            <SelectItem value="2">Đã hết hạn</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="note" className="text-secondaryTextV1">
                        Ghi chú
                      </Label>
                      <Textarea
                        id="note"
                        name="note"
                        value={formData.note}
                        onChange={handleChange}
                        placeholder="Nhập ghi chú"
                        className="border-lightBorderV1 min-h-[120px]"
                      />
                    </div>
                  </form>
                ) : (
                  contractData?.data && <div className="p-4 bg-[#F9F9FC]">
                    <ServiceContractDetailInfo contract={contractData.data as any} />
                  </div>
                )}
              </Card>
            </div>
          </motion.div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={(open) => !open && setIsDeleteDialogOpen(false)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center text-red-600">
              Xác nhận xóa hợp đồng dịch vụ
            </DialogTitle>
            <DialogDescription className="text-secondaryTextV1 pt-2">
              Bạn có chắc chắn muốn xóa hợp đồng dịch vụ này? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>

          <div className="bg-red-50 p-4 my-4 rounded-sm border border-red-200">
            <p className="text-mainTextV1 text-sm">
              Khi xóa hợp đồng dịch vụ, tất cả dữ liệu liên quan sẽ bị xóa vĩnh viễn khỏi hệ thống và không thể khôi phục.
            </p>
          </div>

          <DialogFooter className="flex flex-row justify-end gap-2 sm:gap-0">
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isDeleting} className="text-secondaryTextV1">
                Hủy
              </Button>
            </DialogClose>

            <Button
              type="button"
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xóa...
                </>
              ) : (
                <>
                  <IconTrash className="mr-2 h-4 w-4" />
                  Xóa
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}; 