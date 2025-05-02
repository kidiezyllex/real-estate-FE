"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useCreateGuest } from "@/hooks/useGuest";
import { ICreateGuestBody } from "@/interface/request/guest";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { IconLoader2 } from "@tabler/icons-react";

interface GuestCreateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const GuestCreateDialog = ({ isOpen, onClose, onSuccess }: GuestCreateDialogProps) => {
  const [formData, setFormData] = useState<ICreateGuestBody>({
    fullname: "",
    phone: "",
    email: "",
    citizenId: "",
    citizen_date: "",
    citizen_place: "",
    birthday: "",
    hometown: "",
    note: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const { mutate: createGuestMutation, isPending } = useCreateGuest();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullname.trim()) newErrors.fullname = "Họ tên không được để trống";
    if (!formData.phone.trim()) newErrors.phone = "Số điện thoại không được để trống";
    if (!formData.citizenId.trim()) newErrors.citizenId = "Số CMND/CCCD không được để trống";
    
    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }
    
    if (formData.phone && !/^(0|\+84)[3|5|7|8|9][0-9]{8}$/.test(formData.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    createGuestMutation(formData, {
      onSuccess: (data) => {
        if (data.statusCode === 200 || data.statusCode === 201) {
          onSuccess();
          resetForm();
        } else {
          toast.error("Tạo khách hàng thất bại");
        }
      },
      onError: (error) => {
        toast.error(`Lỗi: ${error.message}`);
      }
    });
  };

  const resetForm = () => {
    setFormData({
      fullname: "",
      phone: "",
      email: "",
      citizenId: "",
      citizen_date: "",
      citizen_place: "",
      birthday: "",
      hometown: "",
      note: "",
    });
    setErrors({});
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-xl font-semibold text-mainTextV1">
            Thêm khách hàng mới
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="p-6 pt-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fullname" className="text-secondaryTextV1">
                  Họ tên <span className="text-mainDangerV1">*</span>
                </Label>
                <Input
                  id="fullname"
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleChange}
                  placeholder="Nhập họ tên"
                  className={`border-lightBorderV1 ${
                    errors.fullname ? "border-mainDangerV1" : ""
                  }`}
                />
                {errors.fullname && (
                  <p className="text-sm text-mainDangerV1">{errors.fullname}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-secondaryTextV1">
                  Số điện thoại <span className="text-mainDangerV1">*</span>
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Nhập số điện thoại"
                  className={`border-lightBorderV1 ${
                    errors.phone ? "border-mainDangerV1" : ""
                  }`}
                />
                {errors.phone && (
                  <p className="text-sm text-mainDangerV1">{errors.phone}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-secondaryTextV1">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Nhập email"
                  className={`border-lightBorderV1 ${
                    errors.email ? "border-mainDangerV1" : ""
                  }`}
                />
                {errors.email && (
                  <p className="text-sm text-mainDangerV1">{errors.email}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="citizenId" className="text-secondaryTextV1">
                  Số CMND/CCCD <span className="text-mainDangerV1">*</span>
                </Label>
                <Input
                  id="citizenId"
                  name="citizenId"
                  value={formData.citizenId}
                  onChange={handleChange}
                  placeholder="Nhập số CMND/CCCD"
                  className={`border-lightBorderV1 ${
                    errors.citizenId ? "border-mainDangerV1" : ""
                  }`}
                />
                {errors.citizenId && (
                  <p className="text-sm text-mainDangerV1">{errors.citizenId}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="citizen_date" className="text-secondaryTextV1">
                  Ngày cấp
                </Label>
                <Input
                  id="citizen_date"
                  name="citizen_date"
                  type="date"
                  value={formData.citizen_date}
                  onChange={handleChange}
                  className="border-lightBorderV1"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="citizen_place" className="text-secondaryTextV1">
                  Nơi cấp
                </Label>
                <Input
                  id="citizen_place"
                  name="citizen_place"
                  value={formData.citizen_place}
                  onChange={handleChange}
                  placeholder="Nhập nơi cấp"
                  className="border-lightBorderV1"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="birthday" className="text-secondaryTextV1">
                  Ngày sinh
                </Label>
                <Input
                  id="birthday"
                  name="birthday"
                  type="date"
                  value={formData.birthday}
                  onChange={handleChange}
                  className="border-lightBorderV1"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="hometown" className="text-secondaryTextV1">
                  Quê quán
                </Label>
                <Input
                  id="hometown"
                  name="hometown"
                  value={formData.hometown}
                  onChange={handleChange}
                  placeholder="Nhập quê quán"
                  className="border-lightBorderV1"
                />
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
                className="border-lightBorderV1 min-h-[80px]"
              />
            </div>
          </div>
          
          <DialogFooter className="p-6 pt-2">
            <div className="flex justify-end gap-4 w-full">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="border-lightBorderV1 text-secondaryTextV1"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="bg-mainTextHoverV1 hover:bg-primary/90 text-white"
              >
                {isPending ? (
                  <IconLoader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Lưu
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}; 