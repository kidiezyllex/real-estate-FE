"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { useCreateHomeOwner } from "@/hooks/useHomeOwner";
import { ICreateHomeOwnerBody } from "@/interface/request/homeOwner";
import { toast } from "react-toastify";
import { IconLoader2, IconUpload } from "@tabler/icons-react";
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface HomeOwnerCreateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const HomeOwnerCreateDialog = ({ isOpen, onClose, onSuccess }: HomeOwnerCreateDialogProps) => {
  const [formData, setFormData] = useState<ICreateHomeOwnerBody>({
    fullname: "",
    phone: "",
    email: "",
    citizenId: "",
    citizen_date: "",
    citizen_place: "",
    birthday: "",
    hometown: "",
    note: "",
    gender: undefined,
    avatarUrl: "",
    address: "",
    bankAccount: "",
    bankName: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { mutate: createHomeOwnerMutation, isPending } = useCreateHomeOwner();

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

  const handleGenderChange = (value: string) => {
    setFormData((prev) => ({ ...prev, gender: value === "male" }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you would upload to a server and get back a URL
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData((prev) => ({ ...prev, avatarUrl: event.target?.result as string }));
      };
      reader.readAsDataURL(file);
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
    createHomeOwnerMutation(formData, {
      onSuccess: (data) => {
        if (data.statusCode === 200 || data.statusCode === 201) {
          toast.success("Tạo chủ nhà thành công!");
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
            gender: undefined,
            avatarUrl: "",
            address: "",
            bankAccount: "",
            bankName: "",
          });
          setErrors({});
          onSuccess?.();
          onClose();
        } else {
          toast.error("Tạo chủ nhà thất bại");
        }
      },
      onError: (error) => {
        toast.error(`Lỗi: ${error.message}`);
      }
    });
  };

  const handleClose = () => {
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
      gender: undefined,
      avatarUrl: "",
      address: "",
      bankAccount: "",
      bankName: "",
    });
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent size="medium" className="max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-medium text-mainTextV1">
            Tạo chủ nhà mới
          </DialogTitle>
        </DialogHeader>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border border-lightBorderV1 bg-mainBackgroundV1">
            <CardContent className="space-y-6 pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Avatar Upload */}
                <div className="space-y-2">
                  <Label className="text-secondaryTextV1">Ảnh đại diện</Label>
                  <div className="flex items-center gap-4">
                    {formData.avatarUrl && (
                      <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white ">
                        <img 
                          src={formData.avatarUrl} 
                          alt="Avatar"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="avatar-upload"
                      />
                      <Label htmlFor="avatar-upload" className="cursor-pointer">
                        <div className="flex items-center gap-2 px-4 py-2 border border-lightBorderV1 rounded-sm hover:bg-gray-50">
                          <IconUpload className="h-4 w-4" />
                          Tải ảnh lên
                        </div>
                      </Label>
                    </div>
                  </div>
                </div>

                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      className={`border-lightBorderV1 ${errors.fullname ? "border-mainDangerV1" : ""}`}
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
                      className={`border-lightBorderV1 ${errors.phone ? "border-mainDangerV1" : ""}`}
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
                      className={`border-lightBorderV1 ${errors.email ? "border-mainDangerV1" : ""}`}
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
                      className={`border-lightBorderV1 ${errors.citizenId ? "border-mainDangerV1" : ""}`}
                    />
                    {errors.citizenId && (
                      <p className="text-sm text-mainDangerV1">{errors.citizenId}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="citizen_date" className="text-secondaryTextV1">
                      Ngày cấp
                    </Label>
                    <DatePicker
                      date={formData.citizen_date ? new Date(formData.citizen_date) : undefined}
                      onDateChange={(date) => handleDateChange("citizen_date", date)}
                      placeholder="Chọn ngày cấp"
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
                    <DatePicker
                      date={formData.birthday ? new Date(formData.birthday) : undefined}
                      onDateChange={(date) => handleDateChange("birthday", date)}
                      placeholder="Chọn ngày sinh"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-secondaryTextV1">Giới tính</Label>
                    <RadioGroup
                      value={formData.gender === true ? "male" : formData.gender === false ? "female" : undefined}
                      onValueChange={handleGenderChange}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="male" id="r1" />
                        <Label htmlFor="r1">Nam</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="female" id="r2" />
                        <Label htmlFor="r2">Nữ</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hometown" className="text-secondaryTextV1">
                    Địa chỉ
                  </Label>
                  <Input
                    id="hometown"
                    name="hometown"
                    value={formData.hometown}
                    onChange={handleChange}
                    placeholder="Nhập địa chỉ"
                    className="border-lightBorderV1"
                  />
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
              </form>
            </CardContent>
            <CardFooter className="flex justify-end space-x-4 border-t border-lightBorderV1 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isPending}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                onClick={handleSubmit}
                disabled={isPending}
                className="bg-mainTextHoverV1 hover:bg-primary/90 text-white"
              >
                {isPending ? (
                  <>
                    <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang tạo...
                  </>
                ) : 'Tạo chủ nhà'}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}; 