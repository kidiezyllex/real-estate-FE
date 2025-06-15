"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DatePicker } from "@/components/ui/date-picker";
import { useCreateGuest } from "@/hooks/useGuest";
import { ICreateGuestBody } from "@/interface/request/guest";
import { toast } from "react-toastify"
import { IconLoader2, IconUpload } from "@tabler/icons-react";
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface GuestCreateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface Province {
  code: number;
  name: string;
}

interface District {
  code: number;
  name: string;
  province_code: number;
}

interface Ward {
  code: number;
  name: string;
  district_code: number;
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
    gender: undefined,
    avatarUrl: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Address selection states
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const [specificAddress, setSpecificAddress] = useState("");
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingWards, setLoadingWards] = useState(false);

  const { mutate: createGuestMutation, isPending } = useCreateGuest();

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        setLoadingProvinces(true);
        const response = await fetch('https://provinces.open-api.vn/api/');
        const data = await response.json();
        setProvinces(data);
      } catch (error) {
        toast.error('Không thể tải danh sách tỉnh/thành');
      } finally {
        setLoadingProvinces(false);
      }
    };

    if (isOpen) {
      fetchProvinces();
    }
  }, [isOpen]);

  // Fetch districts when province changes
  useEffect(() => {
    if (selectedProvince) {
      const fetchDistricts = async () => {
        try {
          setLoadingDistricts(true);
          const response = await fetch(`https://provinces.open-api.vn/api/p/${selectedProvince}?depth=2`);
          const data = await response.json();
          setDistricts(data.districts || []);
          setSelectedDistrict("");
          setSelectedWard("");
          setWards([]);
        } catch (error) {
          toast.error('Không thể tải danh sách quận/huyện');
        } finally {
          setLoadingDistricts(false);
        }
      };

      fetchDistricts();
    } else {
      setDistricts([]);
      setWards([]);
      setSelectedDistrict("");
      setSelectedWard("");
    }
  }, [selectedProvince]);

  // Fetch wards when district changes
  useEffect(() => {
    if (selectedDistrict) {
      const fetchWards = async () => {
        try {
          setLoadingWards(true);
          const response = await fetch(`https://provinces.open-api.vn/api/d/${selectedDistrict}?depth=2`);
          const data = await response.json();
          setWards(data.wards || []);
          setSelectedWard("");
        } catch (error) {
          toast.error('Không thể tải danh sách phường/xã');
        } finally {
          setLoadingWards(false);
        }
      };

      fetchWards();
    } else {
      setWards([]);
      setSelectedWard("");
    }
  }, [selectedDistrict]);

  // Update hometown when address components change
  useEffect(() => {
    if (selectedProvince && selectedDistrict && selectedWard && specificAddress) {
      const provinceName = provinces.find(p => p.code.toString() === selectedProvince)?.name || "";
      const districtName = districts.find(d => d.code.toString() === selectedDistrict)?.name || "";
      const wardName = wards.find(w => w.code.toString() === selectedWard)?.name || "";

      const fullAddress = `${specificAddress}, ${wardName}, ${districtName}, ${provinceName}`;
      setFormData(prev => ({ ...prev, hometown: fullAddress }));
    }
  }, [selectedProvince, selectedDistrict, selectedWard, specificAddress, provinces, districts, wards]);

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
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData((prev) => ({ ...prev, avatarUrl: event.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullname.trim()) {
      newErrors.fullname = "Họ tên không được để trống";
      toast.error("Vui lòng nhập họ tên");
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Số điện thoại không được để trống";
      toast.error("Vui lòng nhập số điện thoại");
    }
    if (!formData.citizenId.trim()) {
      newErrors.citizenId = "Số CMND/CCCD không được để trống";
      toast.error("Vui lòng nhập số CMND/CCCD");
    }
    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
      toast.error("Email không đúng định dạng");
    }
    if (formData.phone && !/^(0|\+84)[3|5|7|8|9][0-9]{8}$/.test(formData.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ";
      toast.error("Số điện thoại không đúng định dạng");
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    createGuestMutation(formData, {
      onSuccess: (response: any) => {
        if (response.statusCode === 500) {
          toast.error(response.message || "Lỗi hệ thống, vui lòng thử lại sau");
          return;
        }
        if (response.statusCode === 200 || response.statusCode === 201) {
          toast.success(response.message || "Tạo khách hàng thành công!");
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
          });
          setErrors({});
          setSelectedProvince("");
          setSelectedDistrict("");
          setSelectedWard("");
          setSpecificAddress("");
          onSuccess?.();
          onClose();
        } else {
          toast.error(response.message || "Tạo khách hàng thất bại");
        }
      },
      onError: (error: any) => {
        console.error("Error:", error); // For debugging
        const errorMessage = error.response?.data?.message || error.message || "Có lỗi xảy ra khi tạo khách hàng";
        toast.error(errorMessage);
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
    });
    setErrors({});
    setSelectedProvince("");
    setSelectedDistrict("");
    setSelectedWard("");
    setSpecificAddress("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent size="medium" className="max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>
            Tạo khách hàng mới
          </DialogTitle>
          <div className="flex items-center justify-between gap-4">
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
              ) : 'Tạo khách hàng'}
            </Button>
          </div>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-[#F9F9FC]">
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
                      type="number"
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
                      value={formData.gender === true ? "male" : formData.gender === false ? "female" : ""}
                      onValueChange={handleGenderChange}
                      className="flex gap-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="male" id="male" />
                        <Label htmlFor="male">Nam</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="female" id="female" />
                        <Label htmlFor="female">Nữ</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                {/* Address Selection */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-secondaryTextV1">Tỉnh/Thành phố</Label>
                      <Select
                        value={selectedProvince}
                        onValueChange={setSelectedProvince}
                        disabled={loadingProvinces}
                      >
                        <SelectTrigger className="border-lightBorderV1">
                          <SelectValue placeholder={loadingProvinces ? "Đang tải..." : "Chọn tỉnh/thành phố"} />
                        </SelectTrigger>
                        <SelectContent>
                          {provinces.map((province) => (
                            <SelectItem key={province.code} value={province.code.toString()}>
                              {province.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-secondaryTextV1">Quận/Huyện</Label>
                      <Select
                        value={selectedDistrict}
                        onValueChange={setSelectedDistrict}
                        disabled={!selectedProvince || loadingDistricts}
                      >
                        <SelectTrigger className="border-lightBorderV1">
                          <SelectValue placeholder={
                            !selectedProvince
                              ? "Vui lòng chọn tỉnh/thành phố trước"
                              : loadingDistricts
                                ? "Đang tải..."
                                : "Chọn quận/huyện"
                          } />
                        </SelectTrigger>
                        <SelectContent>
                          {districts.map((district) => (
                            <SelectItem key={district.code} value={district.code.toString()}>
                              {district.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-secondaryTextV1">Phường/Xã</Label>
                      <Select
                        value={selectedWard}
                        onValueChange={setSelectedWard}
                        disabled={!selectedDistrict || loadingWards}
                      >
                        <SelectTrigger className="border-lightBorderV1">
                          <SelectValue placeholder={
                            !selectedDistrict
                              ? "Vui lòng chọn quận/huyện trước"
                              : loadingWards
                                ? "Đang tải..."
                                : "Chọn phường/xã"
                          } />
                        </SelectTrigger>
                        <SelectContent>
                          {wards.map((ward) => (
                            <SelectItem key={ward.code} value={ward.code.toString()}>
                              {ward.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-secondaryTextV1">Địa chỉ cụ thể</Label>
                      <Input
                        value={specificAddress}
                        onChange={(e) => setSpecificAddress(e.target.value)}
                        placeholder="Số nhà, tên đường..."
                        className="border-lightBorderV1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-secondaryTextV1">Địa chỉ đầy đủ</Label>
                    <Input
                      value={formData.hometown}
                      readOnly
                      className="border-lightBorderV1 bg-gray-50"
                      placeholder="Địa chỉ sẽ được tự động tạo từ các trường trên"
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
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}; 