"use client";

import { useEffect, useState } from "react";
import { useGetHomeOwnerDetail, useUpdateHomeOwner, useDeleteHomeOwner } from "@/hooks/useHomeOwner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { HomeOwnerDetailInfo } from "@/components/HomeOwnerPage/HomeOwnerDetailInfo";
import { IUpdateHomeOwnerBody } from "@/interface/request/homeOwner";
import { IHomeOwnerDetailResponse } from "@/interface/response/homeOwner";
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

interface HomeOwnerDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  ownerId: string;
  onSuccess?: () => void;
}

export const HomeOwnerDetailsDialog = ({ isOpen, onClose, ownerId, onSuccess }: HomeOwnerDetailsDialogProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [formData, setFormData] = useState<IUpdateHomeOwnerBody>({
    fullname: "",
    phone: "",
    email: "",
    citizenId: "",
    citizen_date: "",
    citizen_place: "",
    birthday: "",
    bank: "",
    bankAccount: "",
    bankNumber: "",
    note: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: ownerData, isLoading, error, refetch } = useGetHomeOwnerDetail({ 
    id: ownerId 
  });
  const { mutate: updateOwnerMutation, isPending: isUpdating } = useUpdateHomeOwner();
  const { mutate: deleteOwnerMutation, isPending: isDeleting } = useDeleteHomeOwner();
  useEffect(() => {
    if (error) {
      toast.error("Không thể tải thông tin chủ nhà");
      onClose();
    }
  }, [error, onClose]);

  useEffect(() => {
    if (ownerData?.data?.owner) {
      const owner = ownerData.data.owner;
      setFormData({
        fullname: owner.fullname || "",
        phone: owner.phone || "",
        email: owner.email || "",
        citizenId: owner.citizenId || "",
        citizen_date: owner.citizen_date || "",
        citizen_place: owner.citizen_place || "",
        birthday: owner.birthday || "",
        bank: owner.bank || "",
        bankAccount: owner.bankAccount || "",
        bankNumber: owner.bankNumber || "",
        note: owner.note || "",
      });
    }
  }, [ownerData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
    if (!formData.phone?.trim()) newErrors.phone = "Số điện thoại không được để trống";
    if (formData.phone && !/^(0|\+84)[3|5|7|8|9][0-9]{8}$/.test(formData.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }
    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }
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
    if (ownerData?.data?.owner) {
      const owner = ownerData.data.owner;
      setFormData({
        fullname: owner.fullname || "",
        phone: owner.phone || "",
        email: owner.email || "",
        citizenId: owner.citizenId || "",
        citizen_date: owner.citizen_date || "",
        citizen_place: owner.citizen_place || "",
        birthday: owner.birthday || "",
        bank: owner.bank || "",
        bankAccount: owner.bankAccount || "",
        bankNumber: owner.bankNumber || "",
        note: owner.note || "",
      });
    }
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    updateOwnerMutation(
      {
        params: { id: ownerId },
        body: formData
      },
      {
        onSuccess: (data) => {
          if (data.statusCode === 200) {
            toast.success("Cập nhật thông tin chủ nhà thành công");
            setIsEditing(false);
            refetch();
            onSuccess?.();
          } else {
            toast.error("Cập nhật thông tin chủ nhà thất bại");
          }
        },
        onError: (error) => {
          toast.error(`Lỗi: ${error.message}`);
        }
      }
    );
  };

  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    deleteOwnerMutation(
      { id: ownerId },
      {
        onSuccess: (data) => {
          if (data.statusCode === 200) {
            toast.success("Xóa chủ nhà thành công");
            setIsDeleteDialogOpen(false);
            onSuccess?.();
            onClose();
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

  const handleClose = () => {
    setIsEditing(false);
    setErrors({});
    onClose();
  };

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
         <DialogContent size="medium" className="max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle>Thông tin chủ nhà</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[300px]" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent size="medium" className="max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle>Thông tin chủ nhà</DialogTitle>
          </DialogHeader>

          {isEditing ? (
            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullname">Họ và tên</Label>
                  <Input
                    id="fullname"
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleChange}
                    placeholder="Nhập họ và tên"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Nhập số điện thoại"
                    className={errors.phone ? "border-red-500" : ""}
                  />
                  {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Nhập email"
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="citizenId">Số CMND/CCCD</Label>
                  <Input
                    id="citizenId"
                    name="citizenId"
                    value={formData.citizenId}
                    onChange={handleChange}
                    placeholder="Nhập số CMND/CCCD"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="citizen_date">Ngày cấp</Label>
                  <DatePicker
                    date={formData.citizen_date ? new Date(formData.citizen_date) : undefined}
                    onDateChange={(date) => handleDateChange("citizen_date", date)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="citizen_place">Nơi cấp</Label>
                  <Input
                    id="citizen_place"
                    name="citizen_place"
                    value={formData.citizen_place}
                    onChange={handleChange}
                    placeholder="Nhập nơi cấp"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="birthday">Ngày sinh</Label>
                  <DatePicker
                    date={formData.birthday ? new Date(formData.birthday) : undefined}
                    onDateChange={(date) => handleDateChange("birthday", date)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bank">Tên ngân hàng</Label>
                  <Input
                    id="bank"
                    name="bank"
                    value={formData.bank}
                    onChange={handleChange}
                    placeholder="Nhập tên ngân hàng"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bankAccount">Số tài khoản</Label>
                  <Input
                    id="bankAccount"
                    name="bankAccount"
                    value={formData.bankAccount}
                    onChange={handleChange}
                    placeholder="Nhập số tài khoản"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bankNumber">Số thẻ</Label>
                  <Input
                    id="bankNumber"
                    name="bankNumber"
                    value={formData.bankNumber}
                    onChange={handleChange}
                    placeholder="Nhập số thẻ"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="note">Ghi chú</Label>
                <Textarea
                  id="note"
                  name="note"
                  value={formData.note}
                  onChange={handleChange}
                  placeholder="Nhập ghi chú"
                  rows={3}
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleCancelEdit}>
                  Hủy
                </Button>
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? (
                    <>
                      <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang cập nhật...
                    </>
                  ) : (
                    <>
                      <IconCheck className="mr-2 h-4 w-4" />
                      Lưu thay đổi
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          ) : (
            <>
              {ownerData?.data && (
                <HomeOwnerDetailInfo homeOwner={ownerData.data} />
              )}
              <DialogFooter>
                <Button variant="outline" onClick={handleClose}>
                  Đóng
                </Button>
                <Button variant="destructive" onClick={handleDelete}>
                  <IconTrash className="mr-2 h-4 w-4" />
                  Xóa
                </Button>
                <Button onClick={handleEdit}>
                  <IconPencil className="mr-2 h-4 w-4" />
                  Chỉnh sửa
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa chủ nhà này? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={isDeleting}>
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