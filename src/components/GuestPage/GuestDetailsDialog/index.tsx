"use client";

import { useEffect, useState } from "react";
import { useGetGuestDetail, useUpdateGuest, useDeleteGuest } from "@/hooks/useGuest";
import { useGetHomeContractsByGuest } from "@/hooks/useHomeContract";
import { useGetServiceContractsByGuest } from "@/hooks/useServiceContract";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DatePicker } from "@/components/ui/date-picker";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/ui/pagination";
import { GuestDetailInfo } from "@/components/GuestPage/GuestDetailInfo";
import { HomeContractDetailsDialog } from "@/components/HomeContractsPage/HomeContractDetailsDialog";
import { ServiceContractDetailsDialog } from "@/components/ServiceContractsPage/ServiceContractDetailsDialog";
import { IUpdateGuestBody } from "@/interface/request/guest";
import { IHomeContract } from "@/interface/response/homeContract";
import { IServiceContract } from "@/interface/response/serviceContract";
import { formatDate } from "@/utils/dateFormat";
import { formatCurrency } from "@/utils/format";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { IconPencil, IconTrash, IconLoader2, IconCheck, IconX, IconUpload, IconAlertTriangle, IconEye } from "@tabler/icons-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

interface GuestDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  guestId: string;
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

// Combined contract interface for unified table
interface CombinedContract {
  _id: string;
  type: 'home' | 'service';
  contractCode?: string;
  serviceName?: string;
  homeName?: string;
  homeAddress?: string;
  startDate: string;
  duration: number;
  price: number;
  deposit?: number;
  payCycle: number;
  status: number;
  createdAt?: string;
}

export const GuestDetailsDialog = ({ isOpen, onClose, guestId, onSuccess }: GuestDetailsDialogProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedContractId, setSelectedContractId] = useState<string | null>(null);
  const [selectedContractType, setSelectedContractType] = useState<'home' | 'service' | null>(null);
  const [isHomeContractDialogOpen, setIsHomeContractDialogOpen] = useState(false);
  const [isServiceContractDialogOpen, setIsServiceContractDialogOpen] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [formData, setFormData] = useState<IUpdateGuestBody>({
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

  const { data: guestData, isLoading, error, refetch } = useGetGuestDetail({
    id: guestId
  });

  const { data: homeContractsData, isLoading: isLoadingHomeContracts } = useGetHomeContractsByGuest({
    guestId: guestId
  });

  const { data: serviceContractsData, isLoading: isLoadingServiceContracts } = useGetServiceContractsByGuest({
    guestId: guestId
  });

  const { mutate: updateGuestMutation, isPending: isUpdating } = useUpdateGuest();
  const { mutate: deleteGuestMutation, isPending: isDeleting } = useDeleteGuest();

  // Combine contracts for unified table
  const homeContracts = Array.isArray(homeContractsData?.data)
    ? homeContractsData.data
    : homeContractsData?.data?.contracts || [];

  const serviceContracts = Array.isArray(serviceContractsData?.data)
    ? serviceContractsData.data
    : serviceContractsData?.data?.contracts || [];

  const combinedContracts: CombinedContract[] = [
    ...homeContracts.map((contract: any): CombinedContract => ({
      _id: contract._id,
      type: 'home',
      contractCode: contract.contractCode,
      homeName: contract.homeId ?
        `${contract.homeId.building} - ${contract.homeId.apartmentNv || ''}` :
        `Căn hộ #${contract._id}`,
      homeAddress: contract.homeId ?
        `${contract.homeId.address}, ${contract.homeId.ward}, ${contract.homeId.district}` :
        '',
      startDate: contract.dateStar,
      duration: contract.duration,
      price: contract.renta,
      deposit: contract.deposit,
      payCycle: contract.payCycle,
      status: contract.status,
      createdAt: contract.createdAt,
    })),
    ...serviceContracts.map((contract: any): CombinedContract => ({
      _id: contract._id,
      type: 'service',
      serviceName: contract.serviceId && typeof contract.serviceId === 'object' ?
        contract.serviceId.name :
        `Dịch vụ #${contract.serviceId}`,
      homeName: contract.homeId && typeof contract.homeId === 'object' ?
        `${contract.homeId.building} - ${contract.homeId.apartmentNv || ''}` :
        `Căn hộ #${contract.homeId}`,
      startDate: contract.dateStar,
      duration: contract.duration,
      price: contract.price,
      payCycle: contract.payCycle,
      status: contract.status,
      createdAt: contract.createdAt,
    }))
  ];

  // Sort contracts by creation date (newest first)
  const sortedContracts = combinedContracts.sort((a, b) =>
    new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime()
  );

  // Pagination logic
  const totalContracts = sortedContracts.length;
  const totalPages = Math.ceil(totalContracts / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedContracts = sortedContracts.slice(startIndex, endIndex);

  // Fetch provinces on component mount
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

    if (isEditing) {
      fetchProvinces();
    }
  }, [isEditing]);

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

  useEffect(() => {
    if (error) {
      toast.error("Không thể tải thông tin khách hàng");
      onClose();
    }
  }, [error, onClose]);

  useEffect(() => {
    if (guestData?.data) {
      const guest = guestData.data;
      setFormData({
        fullname: guest.fullname,
        phone: guest.phone,
        email: guest.email,
        citizenId: guest.citizenId,
        citizen_date: guest.citizen_date,
        citizen_place: guest.citizen_place,
        birthday: guest.birthday,
        hometown: guest.hometown,
        note: guest.note,
        gender: guest.gender,
        avatarUrl: guest.avatarUrl || "",
      });
    }
  }, [guestData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
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
    if (!formData.fullname?.trim()) newErrors.fullname = "Họ tên không được để trống";
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
    if (guestData?.data) {
      const guest = guestData.data;
      setFormData({
        fullname: guest.fullname,
        phone: guest.phone,
        email: guest.email,
        citizenId: guest.citizenId,
        citizen_date: guest.citizen_date,
        citizen_place: guest.citizen_place,
        birthday: guest.birthday,
        hometown: guest.hometown,
        note: guest.note,
        gender: guest.gender,
        avatarUrl: guest.avatarUrl || "",
      });
    }
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    updateGuestMutation(
      {
        params: { id: guestId },
        body: formData
      },
      {
        onSuccess: (data) => {
          if (data.statusCode === 200) {
            toast.success("Cập nhật thông tin khách hàng thành công");
            setIsEditing(false);
            refetch();
            onSuccess?.();
          } else {
            toast.error("Cập nhật thông tin khách hàng thất bại");
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
    deleteGuestMutation(
      { id: guestId },
      {
        onSuccess: (data) => {
          if (data.statusCode === 200) {
            toast.success("Xóa khách hàng thành công");
            setIsDeleteDialogOpen(false);
            onSuccess?.();
            onClose();
          } else {
            toast.error("Xóa khách hàng thất bại");
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

  const handleViewContract = (contractId: string, contractType: 'home' | 'service') => {
    setSelectedContractId(contractId);
    setSelectedContractType(contractType);

    if (contractType === 'home') {
      setIsHomeContractDialogOpen(true);
    } else {
      setIsServiceContractDialogOpen(true);
    }
  };

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 0:
        return <Badge variant="destructive">Đã hủy</Badge>;
      case 1:
        return <Badge className="bg-green-500 hover:bg-green-600 text-white border-2 border-green-100 text-nowrap">Hoạt động</Badge>;
      case 2:
        return <Badge variant="outline">Hết hạn</Badge>;
      default:
        return <Badge variant="secondary">Không xác định</Badge>;
    }
  };

  const getContractTypeBadge = (type: 'home' | 'service') => {
    return type === 'home' ? (
      <Badge className="bg-blue-500 hover:bg-blue-600 text-white text-nowrap">Thuê nhà</Badge>
    ) : (
      <Badge className="bg-purple-500 hover:bg-purple-600 text-white text-nowrap">Dịch vụ</Badge>
    );
  };

  const getPayCycleText = (payCycle: number) => {
    switch (payCycle) {
      case 1:
        return "Hàng tháng";
      case 3:
        return "Hàng quý";
      case 6:
        return "6 tháng";
      case 12:
        return "Hàng năm";
      default:
        return `${payCycle} tháng`;
    }
  };

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent size="medium" className="max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-medium text-mainTextV1">
              Chi tiết khách hàng
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
            <Card className="!p-0">
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
        <DialogContent size="medium" className="max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle className="text-xl font-medium text-mainTextV1">
              {isEditing ? "Chỉnh sửa thông tin khách hàng" : "Chi tiết khách hàng"}
            </DialogTitle>
            <div className="flex flex-row items-center justify-between gap-4">
              <div className="flex w-full items-center justify-end gap-4">
                {!isEditing ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={handleDelete}
                    >
                      <IconTrash className="h-4 w-4 mr-2" />
                      Xóa
                    </Button>
                    <Button
                      variant="default"
                      onClick={handleEdit}
                    >
                      <IconPencil className="h-4 w-4 mr-2" />
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
                      <IconX className="h-4 w-4 mr-2" />
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
                        <IconCheck className="h-4 w-4 mr-2" />
                      )}
                      Cập nhật
                    </Button>
                  </>
                )}
              </div>
            </div>
          </DialogHeader>

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col gap-6">


              {/* Guest Information Card */}
              <Card className="border border-lightBorderV1 bg-[#F9F9FC]">
                {isEditing ? (
                  <form onSubmit={handleUpdate} className="p-6 space-y-6">
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
                          disabled
                        />
                        {errors.email && (
                          <p className="text-sm text-mainDangerV1">{errors.email}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="citizenId" className="text-secondaryTextV1">
                          Số CMND/CCCD
                        </Label>
                        <Input
                          id="citizenId"
                          name="citizenId"
                          value={formData.citizenId}
                          onChange={handleChange}
                          placeholder="Nhập số CMND/CCCD"
                          className="border-lightBorderV1"
                          disabled
                        />
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
                          disabled
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
                      <Label className="text-secondaryTextV1 text-lg font-semibold">Địa chỉ</Label>
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
                        className="border-lightBorderV1 min-h-[120px]"
                      />
                    </div>
                  </form>
                ) : (
                  guestData?.data && <div className="p-4 bg-[#F9F9FC]">
                    <GuestDetailInfo guest={guestData.data} />
                  </div>
                )}
              </Card>

              {/* Contracts Table */}
              {!isEditing && (
                <Card className="border border-lightBorderV1">
                  <CardHeader>
                    Danh sách hợp đồng ({totalContracts})
                  </CardHeader>
                  <div className="!p-0">
                    {isLoadingHomeContracts || isLoadingServiceContracts ? (
                      <div className="space-y-4">
                        {[...Array(3)].map((_, index) => (
                          <Skeleton key={index} className="h-16 w-full" />
                        ))}
                      </div>
                    ) : totalContracts === 0 ? (
                      <div className="text-center py-8 text-secondaryTextV1">
                        Khách hàng chưa có hợp đồng nào
                      </div>
                    ) : (
                      <>
                        <div className="w-full overflow-x-auto">
                          <Table className="text-mainTextV1">
                            <TableHeader>
                              <TableRow>
                                <TableHead className="font-medium text-mainTextV1">Loại</TableHead>
                                <TableHead className="font-medium text-mainTextV1">Mã hợp đồng</TableHead>
                                <TableHead className="font-medium text-mainTextV1">Thông tin</TableHead>
                                <TableHead className="font-medium text-mainTextV1">Ngày bắt đầu</TableHead>
                                <TableHead className="font-medium text-mainTextV1">Thời hạn</TableHead>
                                <TableHead className="font-medium text-mainTextV1">Giá</TableHead>
                                <TableHead className="font-medium text-mainTextV1">Trạng thái</TableHead>
                                <TableHead className="font-medium text-mainTextV1">Thao tác</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {paginatedContracts.map((contract) => (
                                <TableRow
                                  key={`${contract.type}-${contract._id}`}
                                  className="hover:bg-gray-50 transition-colors"
                                >
                                  <TableCell>
                                    {getContractTypeBadge(contract.type)}
                                  </TableCell>
                                  <TableCell className="font-medium text-mainTextV1">
                                    <div className="flex flex-col">
                                      <span className="text-sm">
                                        {contract.contractCode || `${contract._id.substring(0, 8)}...`}
                                      </span>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex flex-col">
                                      <span className="font-medium text-sm">
                                        {contract.type === 'home' ? contract.homeName : contract.serviceName}
                                      </span>
                                      {contract.type === 'home' && contract.homeAddress && (
                                        <span className="text-xs text-secondaryTextV1">
                                          {contract.homeAddress}
                                        </span>
                                      )}
                                      {contract.type === 'service' && contract.homeName && (
                                        <span className="text-xs text-secondaryTextV1">
                                          Tại: {contract.homeName}
                                        </span>
                                      )}
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <span className="text-sm font-medium">
                                      {formatDate(contract.startDate)}
                                    </span>
                                  </TableCell>
                                  <TableCell className="text-sm font-medium">
                                    {contract.duration} tháng
                                  </TableCell>
                                  <TableCell className="font-medium">
                                    <div className="flex flex-col">
                                      <span>{formatCurrency(contract.price)}</span>
                                      <span className="text-xs text-secondaryTextV1">
                                        {getPayCycleText(contract.payCycle)}
                                      </span>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    {getStatusBadge(contract.status)}
                                  </TableCell>
                                  <TableCell>
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      onClick={() => handleViewContract(contract._id, contract.type)}
                                      className="text-mainTextV1 hover:text-mainTextHoverV1 hover:bg-transparent"
                                    >
                                      <IconEye className="h-4 w-4" />
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                          <div className="mt-6 flex justify-center">
                            <Pagination
                              page={currentPage}
                              pageSize={itemsPerPage}
                              total={totalContracts}
                              onPageChange={setCurrentPage}
                            />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </Card>
              )}
            </div>
          </motion.div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={(open) => !open && setIsDeleteDialogOpen(false)}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center text-red-600">
              <IconAlertTriangle className="h-5 w-5 mr-2" />
              Xác nhận xóa khách hàng
            </DialogTitle>
            <DialogDescription className="text-secondaryTextV1 pt-2">
              Bạn có chắc chắn muốn xóa khách hàng này? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>

          <div className="bg-red-50 p-4 my-4 rounded-sm border border-red-200">
            <p className="text-mainTextV1 text-sm">
              Khi xóa khách hàng, tất cả dữ liệu liên quan sẽ bị xóa vĩnh viễn khỏi hệ thống và không thể khôi phục.
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

      {/* Home Contract Details Dialog */}
      {selectedContractId && selectedContractType === 'home' && (
        <HomeContractDetailsDialog
          isOpen={isHomeContractDialogOpen}
          onClose={() => {
            setIsHomeContractDialogOpen(false);
            setSelectedContractId(null);
            setSelectedContractType(null);
          }}
          contractId={selectedContractId}
          onSuccess={() => {
            // Optionally refetch contracts data
          }}
        />
      )}

      {/* Service Contract Details Dialog */}
      {selectedContractId && selectedContractType === 'service' && (
        <ServiceContractDetailsDialog
          isOpen={isServiceContractDialogOpen}
          onClose={() => {
            setIsServiceContractDialogOpen(false);
            setSelectedContractId(null);
            setSelectedContractType(null);
          }}
          contractId={selectedContractId}
          onSuccess={() => {
            // Optionally refetch contracts data
          }}
        />
      )}
    </>
  );
}; 