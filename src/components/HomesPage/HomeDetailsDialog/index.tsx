"use client";

import { useEffect, useState } from "react";
import { useGetHomeDetail, useUpdateHome, useDeleteHome } from "@/hooks/useHome";
import { useGetHomeContractsByHome } from "@/hooks/useHomeContract";
import { useGetServiceContractsByHome } from "@/hooks/useServiceContract";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/ui/pagination";
import { HomeDetailInfo } from "@/components/HomesPage/HomeDetailInfo";
import { HomeContractDetailsDialog } from "@/components/HomeContractsPage/HomeContractDetailsDialog";
import { ServiceContractDetailsDialog } from "@/components/ServiceContractsPage/ServiceContractDetailsDialog";
import { IUpdateHomeBody } from "@/interface/request/home";
import { IHomeContract } from "@/interface/response/homeContract";
import { IServiceContract } from "@/interface/response/serviceContract";
import { formatDate } from "@/utils/dateFormat";
import { formatCurrency } from "@/utils/format";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { IconPencil, IconTrash, IconLoader2, IconCheck, IconX, IconAlertTriangle, IconEye } from "@tabler/icons-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

interface HomeDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  homeId: string;
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
  guestName?: string;
  guestPhone?: string;
  startDate: string;
  duration: number;
  price: number;
  deposit?: number;
  payCycle: number;
  status: number;
  createdAt?: string;
}

export const HomeDetailsDialog = ({ isOpen, onClose, homeId, onSuccess }: HomeDetailsDialogProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedContractId, setSelectedContractId] = useState<string | null>(null);
  const [selectedContractType, setSelectedContractType] = useState<'home' | 'service' | null>(null);
  const [isHomeContractDialogOpen, setIsHomeContractDialogOpen] = useState(false);
  const [isServiceContractDialogOpen, setIsServiceContractDialogOpen] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [formData, setFormData] = useState<IUpdateHomeBody>({
    address: "",
    district: "",
    ward: "",
    building: "",
    apartmentNv: "",
    active: true,
    note: "",
    // Amenities
    hasBathroom: false,
    hasBedroom: false,
    hasBalcony: false,
    hasKitchen: false,
    hasWifi: false,
    hasSoundproof: false,
    hasAirConditioner: false,
    hasWashingMachine: false,
    hasRefrigerator: false,
    hasElevator: false,
    hasParking: false,
    hasSecurity: false,
    hasGym: false,
    hasSwimmingPool: false,
    hasGarden: false,
    hasPetAllowed: false,
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

  const { data: homeData, isLoading, error, refetch } = useGetHomeDetail({
    id: homeId
  });

  const { data: homeContractsData, isLoading: isLoadingHomeContracts } = useGetHomeContractsByHome({
    homeId: homeId
  });

  const { data: serviceContractsData, isLoading: isLoadingServiceContracts } = useGetServiceContractsByHome({
    homeId: homeId
  });

  const { mutate: updateHomeMutation, isPending: isUpdating } = useUpdateHome();
  const { mutate: deleteHomeMutation, isPending: isDeleting } = useDeleteHome();

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
      guestName: contract.guestId && typeof contract.guestId === 'object' ?
        contract.guestId.fullname :
        `Khách hàng #${contract.guestId}`,
      guestPhone: contract.guestId && typeof contract.guestId === 'object' ?
        contract.guestId.phone : '',
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
      guestName: contract.guestId && typeof contract.guestId === 'object' ?
        contract.guestId.fullname :
        `Khách hàng #${contract.guestId}`,
      guestPhone: contract.guestId && typeof contract.guestId === 'object' ?
        contract.guestId.phone : '',
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

  // Update address when address components change
  useEffect(() => {
    if (selectedProvince && selectedDistrict && selectedWard && specificAddress) {
      const provinceName = provinces.find(p => p.code.toString() === selectedProvince)?.name || "";
      const districtName = districts.find(d => d.code.toString() === selectedDistrict)?.name || "";
      const wardName = wards.find(w => w.code.toString() === selectedWard)?.name || "";

      const fullAddress = `${specificAddress}, ${wardName}, ${districtName}, ${provinceName}`;
      setFormData(prev => ({ ...prev, address: fullAddress }));
    }
  }, [selectedProvince, selectedDistrict, selectedWard, specificAddress, provinces, districts, wards]);

  useEffect(() => {
    if (error) {
      toast.error("Không thể tải thông tin căn hộ");
      onClose();
    }
  }, [error, onClose]);

  useEffect(() => {
    if (homeData?.data?.home) {
      const home = homeData.data.home;
      setFormData({
        address: home.address,
        district: home.district,
        ward: home.ward,
        building: home.building,
        apartmentNv: home.apartmentNv,
        active: home.active,
        note: home.note,
        // Amenities
        hasBathroom: home.hasBathroom || false,
        hasBedroom: home.hasBedroom || false,
        hasBalcony: home.hasBalcony || false,
        hasKitchen: home.hasKitchen || false,
        hasWifi: home.hasWifi || false,
        hasSoundproof: home.hasSoundproof || false,
        hasAirConditioner: home.hasAirConditioner || false,
        hasWashingMachine: home.hasWashingMachine || false,
        hasRefrigerator: home.hasRefrigerator || false,
        hasElevator: home.hasElevator || false,
        hasParking: home.hasParking || false,
        hasSecurity: home.hasSecurity || false,
        hasGym: home.hasGym || false,
        hasSwimmingPool: home.hasSwimmingPool || false,
        hasGarden: home.hasGarden || false,
        hasPetAllowed: home.hasPetAllowed || false,
      });
    }
  }, [homeData]);

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

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.building?.trim()) newErrors.building = "Tên tòa nhà không được để trống";
    if (!formData.apartmentNv?.trim()) newErrors.apartmentNv = "Số căn hộ không được để trống";
    if (!formData.address?.trim()) newErrors.address = "Địa chỉ không được để trống";
    if (!formData.district?.trim()) newErrors.district = "Quận/huyện không được để trống";
    if (!formData.ward?.trim()) newErrors.ward = "Phường/xã không được để trống";

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
    if (homeData?.data?.home) {
      const home = homeData.data.home;
      setFormData({
        address: home.address,
        district: home.district,
        ward: home.ward,
        building: home.building,
        apartmentNv: home.apartmentNv,
        active: home.active,
        note: home.note,
        // Amenities
        hasBathroom: home.hasBathroom || false,
        hasBedroom: home.hasBedroom || false,
        hasBalcony: home.hasBalcony || false,
        hasKitchen: home.hasKitchen || false,
        hasWifi: home.hasWifi || false,
        hasSoundproof: home.hasSoundproof || false,
        hasAirConditioner: home.hasAirConditioner || false,
        hasWashingMachine: home.hasWashingMachine || false,
        hasRefrigerator: home.hasRefrigerator || false,
        hasElevator: home.hasElevator || false,
        hasParking: home.hasParking || false,
        hasSecurity: home.hasSecurity || false,
        hasGym: home.hasGym || false,
        hasSwimmingPool: home.hasSwimmingPool || false,
        hasGarden: home.hasGarden || false,
        hasPetAllowed: home.hasPetAllowed || false,
      });
    }
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    updateHomeMutation(
      {
        params: { id: homeId },
        body: formData
      },
      {
        onSuccess: (data) => {
          if (data.statusCode === 200) {
            toast.success("Cập nhật thông tin căn hộ thành công");
            setIsEditing(false);
            refetch();
            onSuccess?.();
          } else {
            toast.error("Cập nhật thông tin căn hộ thất bại");
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
    deleteHomeMutation(
      { id: homeId },
      {
        onSuccess: (data) => {
          if (data.statusCode === 200) {
            toast.success("Xóa căn hộ thành công");
            setIsDeleteDialogOpen(false);
            onSuccess?.();
            onClose();
          } else {
            toast.error("Xóa căn hộ thất bại");
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

  const amenityLabels = {
    hasBathroom: 'Phòng tắm',
    hasBedroom: 'Phòng ngủ',
    hasBalcony: 'Ban công',
    hasKitchen: 'Nhà bếp',
    hasWifi: 'Wifi',
    hasSoundproof: 'Cách âm',
    hasAirConditioner: 'Điều hòa',
    hasWashingMachine: 'Máy giặt',
    hasRefrigerator: 'Tủ lạnh',
    hasElevator: 'Thang máy',
    hasParking: 'Chỗ đậu xe',
    hasSecurity: 'Bảo vệ',
    hasGym: 'Phòng gym',
    hasSwimmingPool: 'Hồ bơi',
    hasGarden: 'Vườn',
    hasPetAllowed: 'Cho phép thú cưng',
  };

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent size="medium" className="max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-medium text-mainTextV1">
              Chi tiết căn hộ
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
              {isEditing ? "Chỉnh sửa thông tin căn hộ" : "Chi tiết căn hộ"}
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
              {/* Home Information Card */}
              <Card className="border border-lightBorderV1 bg-[#F9F9FC]">
                {isEditing ? (
                  <form onSubmit={handleUpdate} className="p-6 space-y-6">
                    {/* Basic Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="building" className="text-secondaryTextV1">
                          Tòa nhà <span className="text-mainDangerV1">*</span>
                        </Label>
                        <Input
                          id="building"
                          name="building"
                          value={formData.building}
                          onChange={handleChange}
                          placeholder="Nhập tên tòa nhà"
                          className={`border-lightBorderV1 ${errors.building ? "border-mainDangerV1" : ""}`}
                        />
                        {errors.building && (
                          <p className="text-sm text-mainDangerV1">{errors.building}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="apartmentNv" className="text-secondaryTextV1">
                          Số căn hộ <span className="text-mainDangerV1">*</span>
                        </Label>
                        <Input
                          id="apartmentNv"
                          name="apartmentNv"
                          value={formData.apartmentNv}
                          onChange={handleChange}
                          placeholder="Nhập số căn hộ"
                          className={`border-lightBorderV1 ${errors.apartmentNv ? "border-mainDangerV1" : ""}`}
                        />
                        {errors.apartmentNv && (
                          <p className="text-sm text-mainDangerV1">{errors.apartmentNv}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="district" className="text-secondaryTextV1">
                          Quận/Huyện <span className="text-mainDangerV1">*</span>
                        </Label>
                        <Input
                          id="district"
                          name="district"
                          value={formData.district}
                          onChange={handleChange}
                          placeholder="Nhập quận/huyện"
                          className={`border-lightBorderV1 ${errors.district ? "border-mainDangerV1" : ""}`}
                        />
                        {errors.district && (
                          <p className="text-sm text-mainDangerV1">{errors.district}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="ward" className="text-secondaryTextV1">
                          Phường/Xã <span className="text-mainDangerV1">*</span>
                        </Label>
                        <Input
                          id="ward"
                          name="ward"
                          value={formData.ward}
                          onChange={handleChange}
                          placeholder="Nhập phường/xã"
                          className={`border-lightBorderV1 ${errors.ward ? "border-mainDangerV1" : ""}`}
                        />
                        {errors.ward && (
                          <p className="text-sm text-mainDangerV1">{errors.ward}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address" className="text-secondaryTextV1">
                        Địa chỉ <span className="text-mainDangerV1">*</span>
                      </Label>
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Nhập địa chỉ"
                        className={`border-lightBorderV1 ${errors.address ? "border-mainDangerV1" : ""}`}
                      />
                      {errors.address && (
                        <p className="text-sm text-mainDangerV1">{errors.address}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-secondaryTextV1">Trạng thái hoạt động</Label>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={formData.active}
                          onCheckedChange={(checked) => handleSwitchChange("active", checked)}
                        />
                        <Label className="text-sm">
                          {formData.active ? "Hoạt động" : "Không hoạt động"}
                        </Label>
                      </div>
                    </div>

                    {/* Amenities */}
                    <div className="space-y-4">
                      <Label className="text-secondaryTextV1 text-lg font-semibold">Tiện nghi</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {Object.entries(amenityLabels).map(([key, label]) => (
                          <div key={key} className="flex items-center space-x-2">
                            <Switch
                              checked={!!(formData as any)[key]}
                              onCheckedChange={(checked) => handleSwitchChange(key, checked)}
                            />
                            <Label className="text-sm">{label}</Label>
                          </div>
                        ))}
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
                  homeData?.data?.home && <div className="p-4 bg-[#F9F9FC]">
                    <HomeDetailInfo home={homeData.data.home} />
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
                        Căn hộ chưa có hợp đồng nào
                      </div>
                    ) : (
                      <>
                        <div className="w-full overflow-x-auto">
                          <Table className="text-mainTextV1">
                            <TableHeader>
                              <TableRow>
                                <TableHead className="font-medium text-mainTextV1">Loại</TableHead>
                                <TableHead className="font-medium text-mainTextV1">Mã hợp đồng</TableHead>
                                <TableHead className="font-medium text-mainTextV1">Khách hàng</TableHead>
                                <TableHead className="font-medium text-mainTextV1">Dịch vụ</TableHead>
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
                                        {contract.guestName}
                                      </span>
                                      {contract.guestPhone && (
                                        <span className="text-xs text-secondaryTextV1">
                                          {contract.guestPhone}
                                        </span>
                                      )}
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <span className="text-sm">
                                      {contract.type === 'service' ? contract.serviceName : '--'}
                                    </span>
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
              Xác nhận xóa căn hộ
            </DialogTitle>
            <DialogDescription className="text-secondaryTextV1 pt-2">
              Bạn có chắc chắn muốn xóa căn hộ này? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>

          <div className="bg-red-50 p-4 my-4 rounded-sm border border-red-200">
            <p className="text-mainTextV1 text-sm">
              Khi xóa căn hộ, tất cả dữ liệu liên quan sẽ bị xóa vĩnh viễn khỏi hệ thống và không thể khôi phục.
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
