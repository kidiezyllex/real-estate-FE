"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateHomeContract } from "@/hooks/useHomeContract";
import { useGetHomeOwners } from "@/hooks/useHomeOwner";
import { useGetHomes, useGetHomesByOwner } from "@/hooks/useHome";
import { useGetGuests } from "@/hooks/useGuest";
import { ICreateHomeContractBody } from "@/interface/request/homeContract";
import { toast } from "react-toastify";
import { IconLoader2, IconUser, IconHome, IconUsers, IconMapPin, IconPhone, IconCurrencyDong } from "@tabler/icons-react";
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Icon from "@mdi/react";
import { mdiAccount, mdiAccountTie, mdiHomeCity } from "@mdi/js";

interface HomeContractCreateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

// Extend the interface to include optional note field and selection mode
interface ExtendedCreateHomeContractBody extends ICreateHomeContractBody {
  note?: string;
}

type SelectionMode = "owner-first" | "home-first";

export const HomeContractCreateDialog = ({ isOpen, onClose, onSuccess }: HomeContractCreateDialogProps) => {
  const [selectionMode, setSelectionMode] = useState<SelectionMode>("owner-first");
  const [selectedHomeOwnerId, setSelectedHomeOwnerId] = useState<string>("");
  const [selectedHomeId, setSelectedHomeId] = useState<string>("");
  const [selectedGuestId, setSelectedGuestId] = useState<string>("");

  const [formData, setFormData] = useState<ExtendedCreateHomeContractBody>({
    homeId: "",
    guestId: "",
    contractCode: "",
    dateStar: "",
    duration: 0,
    price: 0,
    deposit: 0,
    payCycle: 1,
    note: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Hooks for data fetching
  const { data: homeOwnersData, isLoading: isLoadingHomeOwners, error: homeOwnersError } = useGetHomeOwners();
  const { data: allHomesData, isLoading: isLoadingAllHomes, error: allHomesError } = useGetHomes();
  const { data: homesByOwnerData, isLoading: isLoadingHomesByOwner, error: homesByOwnerError } = useGetHomesByOwner({
    homeOwnerId: selectedHomeOwnerId
  });
  const { data: guestsData, isLoading: isLoadingGuests, error: guestsError } = useGetGuests();

  const { mutate: createContractMutation, isPending } = useCreateHomeContract();
  
  useEffect(() => {
    if (selectionMode === "home-first" && selectedHomeId && allHomesData?.data) {
      const homes = Array.isArray(allHomesData.data) ? allHomesData.data : allHomesData.data?.homes || [];
      const selectedHome = homes.find(home => home._id === selectedHomeId);
      if (selectedHome) {
        setFormData(prev => ({
          ...prev,
          homeId: selectedHomeId,
          price: selectedHome.price || 0
        }));
      }
    }
  }, [selectedHomeId, allHomesData, selectionMode]);

  useEffect(() => {
    if (selectionMode === "owner-first" && selectedHomeId) {
      const homes = homesByOwnerData?.data?.homes || [];
      const selectedHome = homes.find(home => home._id === selectedHomeId);
      if (selectedHome) {
        setFormData(prev => ({
          ...prev,
          homeId: selectedHomeId,
          price: selectedHome.price || 0
        }));
      }
    }
  }, [selectedHomeId, homesByOwnerData, selectionMode]);

  useEffect(() => {
    if (selectedGuestId) {
      setFormData(prev => ({ ...prev, guestId: selectedGuestId }));
    }
  }, [selectedGuestId]);

  const resetForm = () => {
    setFormData({
      homeId: "",
      guestId: "",
      contractCode: "",
      dateStar: "",
      duration: 0,
      price: 0,
      deposit: 0,
      payCycle: 1,
      note: "",
    });
    setSelectedHomeOwnerId("");
    setSelectedHomeId("");
    setSelectedGuestId("");
    setErrors({});
    setSelectionMode("owner-first");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (["price", "duration", "deposit", "payCycle"].includes(name)) {
      const numValue = parseFloat(value);
      if (numValue < 0) {
        toast.warning(`${getFieldDisplayName(name)} không được nhập số âm`);
        return;
      }
      setFormData((prev) => ({
        ...prev,
        [name]: numValue || 0
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const getFieldDisplayName = (fieldName: string): string => {
    const fieldNames: Record<string, string> = {
      price: "Giá thuê",
      duration: "Thời hạn",
      deposit: "Tiền đặt cọc",
      payCycle: "Chu kỳ thanh toán"
    };
    return fieldNames[fieldName] || fieldName;
  };

  const handleDateChange = (name: string, date: Date | undefined) => {
    if (date) {
      setFormData((prev) => ({ ...prev, [name]: date.toISOString() }));
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: "" }));
      }
    }
  };

  const handleSelectionModeChange = (mode: SelectionMode) => {
    setSelectionMode(mode);
    setSelectedHomeOwnerId("");
    setSelectedHomeId("");
    setFormData(prev => ({ ...prev, homeId: "", price: 0 }));
    setErrors({});
  };

  const handleHomeOwnerSelect = (homeOwnerId: string) => {
    setSelectedHomeOwnerId(homeOwnerId);
    setSelectedHomeId("");
    setFormData(prev => ({ ...prev, homeId: "", price: 0 }));
  };

  const handleHomeSelect = (homeId: string) => {
    setSelectedHomeId(homeId);
  };

  const handleGuestSelect = (guestId: string) => {
    setSelectedGuestId(guestId);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    let hasErrors = false;

    if (!formData.homeId.trim()) {
      newErrors.homeId = "Vui lòng chọn nhà";
      hasErrors = true;
    }
    if (!formData.guestId.trim()) {
      newErrors.guestId = "Vui lòng chọn khách hàng";
      hasErrors = true;
    }
    if (!formData.dateStar) {
      newErrors.dateStar = "Vui lòng chọn ngày bắt đầu";
      hasErrors = true;
    }
    if (formData.duration <= 0) {
      newErrors.duration = "Thời hạn phải lớn hơn 0";
      hasErrors = true;
    }
    if (formData.price <= 0) {
      newErrors.price = "Giá thuê phải lớn hơn 0";
      hasErrors = true;
    }
    if (formData.payCycle <= 0) {
      newErrors.payCycle = "Chu kỳ thanh toán phải lớn hơn 0";
      hasErrors = true;
    }

    if (formData.duration > 120) {
      newErrors.duration = "Thời hạn không được vượt quá 120 tháng";
      hasErrors = true;
    }
    if (formData.payCycle > formData.duration) {
      newErrors.payCycle = "Chu kỳ thanh toán không được lớn hơn thời hạn hợp đồng";
      hasErrors = true;
    }
    if (formData.deposit > formData.price * 12) {
      newErrors.deposit = "Tiền đặt cọc không được vượt quá 12 tháng tiền thuê";
      hasErrors = true;
    }

    setErrors(newErrors);
    if (hasErrors) {
      const errorCount = Object.keys(newErrors).length;
      toast.error(`Vui lòng kiểm tra lại thông tin! Có ${errorCount} lỗi cần sửa.`);
    }

    return !hasErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    const { note, ...contractData } = formData;
    createContractMutation(contractData, {
      onSuccess: (data) => {
        if (data.statusCode === 200 || data.statusCode === 201) {
          toast.success(data.message || "Tạo hợp đồng thuê nhà thành công!");
          resetForm();
          onSuccess?.();
          onClose();
        } else {
          toast.error(data.message || "Tạo hợp đồng thuê nhà thất bại");
        }
      },
      onError: (error: any) => {
        console.error("Create contract error:", error);
        if (error?.response?.status === 400) {
          const errorMessage = error?.response?.data?.message;
          if (errorMessage === "Căn hộ này đã được cho thuê và đang có hợp đồng hiệu lực") {
            toast.error("Căn hộ này đã được cho thuê và đang có hợp đồng hiệu lực. Vui lòng chọn căn hộ khác!");
          } else {
            toast.error("Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin!");
          }
        } else if (error?.response?.status === 409) {
          toast.error("Hợp đồng đã tồn tại hoặc xung đột dữ liệu!");
        } else if (error?.response?.status === 500) {
          toast.error("Lỗi hệ thống. Vui lòng thử lại sau!");
        } else {
          const errorMessage = error?.response?.data?.message || error.message || "Đã xảy ra lỗi khi tạo hợp đồng";
          toast.error(errorMessage);
        }
      }
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Get available homes based on selection mode
  const getAvailableHomes = () => {
    if (selectionMode === "owner-first") {
      return homesByOwnerData?.data?.homes || [];
    } else {
      // Handle different data structures for useGetHomes - following HomesPage pattern
      if (allHomesData?.data) {
        return Array.isArray(allHomesData.data) ? allHomesData.data : allHomesData.data?.homes || [];
      }
      return [];
    }
  };

  // Get available owners data - try both patterns
  const getAvailableOwners = () => {
    // Try HomeOwnerPage pattern first
    if (homeOwnersData?.data && Array.isArray(homeOwnersData.data)) {
      return homeOwnersData.data;
    }
    // Try interface pattern 
    if (homeOwnersData?.data?.owners && Array.isArray(homeOwnersData.data.owners)) {
      return homeOwnersData.data.owners;
    }
    return [];
  };

  // Get available guests data
  const getAvailableGuests = () => {
    if (guestsData?.data && Array.isArray(guestsData.data)) {
      return guestsData.data;
    }
    return [];
  };

  const getSelectedHomeOwnerName = () => {
    if (selectionMode === "home-first" && selectedHomeId && allHomesData?.data) {
      const homes = Array.isArray(allHomesData.data) ? allHomesData.data : allHomesData.data?.homes || [];
      const selectedHome = homes.find(home => home._id === selectedHomeId);
      // Handle different homeOwnerId structures
      if (selectedHome?.homeOwnerId) {
        if (typeof selectedHome.homeOwnerId === 'string') {
          return selectedHome.homeOwnerId;
        } else if (selectedHome.homeOwnerId.fullname) {
          return selectedHome.homeOwnerId.fullname;
        }
      }
      return "Không xác định";
    }
    if (selectionMode === "owner-first" && selectedHomeOwnerId && getAvailableOwners().length > 0) {
      const selectedOwner = getAvailableOwners().find(owner => owner._id === selectedHomeOwnerId);
      return selectedOwner?.fullname || "Không xác định";
    }
    return "";
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-medium text-mainTextV1">
            Tạo hợp đồng thuê nhà mới
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
                {/* Selection Mode - Button Style */}
                <div className="space-y-4">
                  <Label className="text-secondaryTextV1 font-medium">
                    Phương thức chọn nhà
                  </Label>
                  <div className="flex space-x-3">
                    <Button
                      type="button"
                      variant={selectionMode === "owner-first" ? "default" : "outline"}
                      onClick={() => handleSelectionModeChange("owner-first")}
                      className="flex items-center space-x-2"
                    >
                      <Icon
                        path={mdiAccountTie}
                        size={0.8} />

                      <span>Chọn chủ nhà trước</span>
                    </Button>
                    <Button
                      type="button"
                      variant={selectionMode === "home-first" ? "default" : "outline"}
                      onClick={() => handleSelectionModeChange("home-first")}
                      className="flex items-center space-x-2"
                    >
                      <Icon
                        path={mdiHomeCity}
                        size={0.8} />
                      <span>Chọn nhà trước</span>
                    </Button>
                  </div>
                </div>

                {/* Home Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectionMode === "owner-first" && (
                    <div className="space-y-2">
                      <Label className="text-secondaryTextV1">
                        Chủ nhà <span className="text-mainDangerV1">*</span>
                      </Label>
                      <Select value={selectedHomeOwnerId} onValueChange={handleHomeOwnerSelect}>
                        <SelectTrigger className={`border-lightBorderV1 ${errors.homeId ? "border-mainDangerV1" : ""}`}>
                          <SelectValue placeholder="Chọn chủ nhà">
                            {selectedHomeOwnerId && getAvailableOwners().length > 0 && (() => {
                              const selectedOwner = getAvailableOwners().find(owner => owner._id === selectedHomeOwnerId);
                              return selectedOwner ? `${selectedOwner.fullname} (${selectedOwner.phone})` : "Chọn chủ nhà";
                            })()}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {isLoadingHomeOwners ? (
                            <SelectItem value="loading" disabled>
                              <div className="flex items-center space-x-2">
                                <IconLoader2 className="w-4 h-4 animate-spin" />
                                <span>Đang tải...</span>
                              </div>
                            </SelectItem>
                          ) : homeOwnersError ? (
                            <SelectItem value="error" disabled>
                              <div className="flex items-center space-x-2 text-red-500">
                                <span>Lỗi tải dữ liệu</span>
                              </div>
                            </SelectItem>
                          ) : getAvailableOwners().length > 0 ? (
                            getAvailableOwners().map((owner, index) => (
                              <>
                                <SelectItem key={owner._id} value={owner._id}>
                                  <div className="flex items-center space-x-3 py-1">
                                    <div className="flex-shrink-0">
                                      <div className="w-8 h-8 border rounded-full bg-slate-100 flex items-center justify-center">
                                        <Icon
                                          path={mdiAccountTie}
                                          size={0.8}
                                          className="text-slate-400"
                                        />
                                      </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="font-medium text-gray-900 truncate">
                                        {owner.fullname}
                                      </div>
                                      <div className="flex items-center text-sm text-mainTextV1">
                                        <IconPhone className="w-3 h-3 mr-1" />
                                        {owner.phone}
                                      </div>
                                    </div>
                                  </div>
                                </SelectItem>
                                {index < getAvailableOwners().length - 1 && <SelectSeparator />}
                              </>
                            ))
                          ) : (
                            <SelectItem value="no-data" disabled>
                              <span className="text-mainTextV1">Không có dữ liệu chủ nhà</span>
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label className="text-secondaryTextV1">
                      Nhà <span className="text-mainDangerV1">*</span>
                    </Label>
                    <Select
                      value={selectedHomeId}
                      onValueChange={handleHomeSelect}
                      disabled={selectionMode === "owner-first" && !selectedHomeOwnerId}
                    >
                      <SelectTrigger className={`border-lightBorderV1 ${errors.homeId ? "border-mainDangerV1" : ""}`}>
                        <SelectValue placeholder="Chọn nhà">
                          {selectedHomeId && getAvailableHomes().length > 0 && (() => {
                            const selectedHome = getAvailableHomes().find(home => home._id === selectedHomeId);
                            if (selectedHome) {
                              // Handle different home data structures
                              const homeName = selectedHome.name || selectedHome.address || 'Nhà không có tên';
                              const homeAddress = selectedHome.address || 'Không có địa chỉ';
                              return `${homeName} (${homeAddress})`;
                            }
                            return "Chọn nhà";
                          })()}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {(selectionMode === "owner-first" ? isLoadingHomesByOwner : isLoadingAllHomes) ? (
                          <SelectItem value="loading" disabled>
                            <div className="flex items-center space-x-2">
                              <IconLoader2 className="w-4 h-4 animate-spin" />
                              <span>Đang tải...</span>
                            </div>
                          </SelectItem>
                        ) : (selectionMode === "owner-first" ? homesByOwnerError : allHomesError) ? (
                          <SelectItem value="error" disabled>
                            <div className="flex items-center space-x-2 text-red-500">
                              <span>Lỗi tải dữ liệu</span>
                            </div>
                          </SelectItem>
                        ) : getAvailableHomes().length > 0 ? (
                          getAvailableHomes().map((home, index) => (
                            <>
                              <SelectItem key={home._id} value={home._id}>
                                <div className="flex items-center space-x-3 py-1">
                                  <div className="flex-shrink-0">
                                    <div className="w-8 h-8 border rounded-full bg-slate-100 flex items-center justify-center">
                                      <Icon
                                        path={mdiHomeCity}
                                        size={0.8}
                                        className="text-slate-400"
                                      />
                                    </div>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="font-medium text-gray-900 truncate">
                                      {home.name || home.address || 'Nhà không có tên'}
                                    </div>
                                    <div className="flex items-center justify-between text-sm text-mainTextV1">
                                      <div className="flex items-center">
                                        <IconMapPin className="w-3 h-3 mr-1" />
                                        <span className="truncate">{home.address || 'Không có địa chỉ'}</span>
                                      </div>
                                      {home.price && (
                                        <div className="flex items-center ml-2 text-blue-600 font-medium">
                                          <IconCurrencyDong className="w-3 h-3 mr-1" />
                                          {home.price.toLocaleString()}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </SelectItem>
                              {index < getAvailableHomes().length - 1 && <SelectSeparator />}
                            </>
                          ))
                        ) : (
                          <SelectItem value="no-data" disabled>
                            <span className="text-mainTextV1">
                              {selectionMode === "owner-first"
                                ? "Chưa có nhà nào cho chủ nhà này"
                                : "Không có nhà nào có sẵn"
                              }
                            </span>
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    {errors.homeId && (
                      <p className="text-sm text-mainDangerV1">{errors.homeId}</p>
                    )}
                  </div>

                  {/* Display selected home owner info when selecting home first */}
                  {selectionMode === "home-first" && selectedHomeId && (
                    <div className="space-y-2">
                      <Label className="text-secondaryTextV1">Chủ nhà</Label>
                      <Input
                        value={getSelectedHomeOwnerName()}
                        disabled
                        className="border-lightBorderV1 bg-gray-50"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label className="text-secondaryTextV1">
                      Khách hàng <span className="text-mainDangerV1">*</span>
                    </Label>
                    <Select value={selectedGuestId} onValueChange={handleGuestSelect}>
                      <SelectTrigger className={`border-lightBorderV1 ${errors.guestId ? "border-mainDangerV1" : ""}`}>
                        <SelectValue placeholder="Chọn khách hàng">
                          {selectedGuestId && getAvailableGuests().length > 0 && (() => {
                            const selectedGuest = getAvailableGuests().find(guest => guest._id === selectedGuestId);
                            return selectedGuest ? `${selectedGuest.fullname} (${selectedGuest.phone})` : "Chọn khách hàng";
                          })()}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {isLoadingGuests ? (
                          <SelectItem value="loading" disabled>
                            <div className="flex items-center space-x-2">
                              <IconLoader2 className="w-4 h-4 animate-spin" />
                              <span>Đang tải...</span>
                            </div>
                          </SelectItem>
                        ) : guestsError ? (
                          <SelectItem value="error" disabled>
                            <div className="flex items-center space-x-2 text-red-500">
                              <span>Lỗi tải dữ liệu</span>
                            </div>
                          </SelectItem>
                        ) : getAvailableGuests().length > 0 ? (
                          getAvailableGuests().map((guest, index) => (
                            <>
                              <SelectItem key={guest._id} value={guest._id}>
                                <div className="flex items-center space-x-3 py-1">
                                  <div className="flex-shrink-0">
                                    <div className="w-8 h-8 border rounded-full bg-slate-100 flex items-center justify-center">
                                      <Icon
                                        path={mdiAccount}
                                        size={0.8}
                                        className="text-slate-400"
                                      />
                                    </div>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="font-medium text-gray-900 truncate">
                                      {guest.fullname}
                                    </div>
                                    <div className="flex items-center text-sm text-mainTextV1">
                                      <IconPhone className="w-3 h-3 mr-1" />
                                      {guest.phone}
                                    </div>
                                  </div>
                                </div>
                              </SelectItem>
                              {index < getAvailableGuests().length - 1 && <SelectSeparator />}
                            </>
                          ))
                        ) : (
                          <SelectItem value="no-data" disabled>
                            <span className="text-mainTextV1">Không có dữ liệu khách hàng</span>
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    {errors.guestId && (
                      <p className="text-sm text-mainDangerV1">{errors.guestId}</p>
                    )}
                  </div>
                </div>

                {/* Contract Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dateStar" className="text-secondaryTextV1">
                      Ngày bắt đầu <span className="text-mainDangerV1">*</span>
                    </Label>
                    <div className="flex items-center space-x-2">
                      <DatePicker
                        date={formData.dateStar ? new Date(formData.dateStar) : undefined}
                        onDateChange={(date) => handleDateChange("dateStar", date)}
                        placeholder="Chọn ngày bắt đầu"
                      />
                      <Button
                        variant="outline"
                        onClick={() => handleDateChange("dateStar", new Date())}
                        className="flex-shrink-0"
                      >
                        Chọn hôm nay
                      </Button>
                    </div>
                    {errors.dateStar && (
                      <p className="text-sm text-mainDangerV1">{errors.dateStar}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration" className="text-secondaryTextV1">
                      Thời hạn (tháng) <span className="text-mainDangerV1">*</span>
                    </Label>
                    <Input
                      id="duration"
                      name="duration"
                      type="number"
                      min="1"
                      value={formData.duration}
                      onChange={handleChange}
                      placeholder="Nhập thời hạn"
                      className={`border-lightBorderV1 ${errors.duration ? "border-mainDangerV1" : ""}`}
                    />
                    {errors.duration && (
                      <p className="text-sm text-mainDangerV1">{errors.duration}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price" className="text-secondaryTextV1">
                      Giá thuê (VNĐ) <span className="text-mainDangerV1">*</span>
                    </Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      min="0"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="Nhập giá thuê"
                      className={`border-lightBorderV1 ${errors.price ? "border-mainDangerV1" : ""}`}
                    />
                    {errors.price && (
                      <p className="text-sm text-mainDangerV1">{errors.price}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deposit" className="text-secondaryTextV1">
                      Tiền đặt cọc (VNĐ)
                    </Label>
                    <Input
                      id="deposit"
                      name="deposit"
                      type="number"
                      min="0"
                      value={formData.deposit}
                      onChange={handleChange}
                      placeholder="Nhập tiền đặt cọc"
                      className="border-lightBorderV1"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="payCycle" className="text-secondaryTextV1">
                      Chu kỳ thanh toán (tháng) <span className="text-mainDangerV1">*</span>
                    </Label>
                    <Input
                      id="payCycle"
                      name="payCycle"
                      type="number"
                      min="1"
                      value={formData.payCycle}
                      onChange={handleChange}
                      placeholder="Nhập chu kỳ thanh toán"
                      className={`border-lightBorderV1 ${errors.payCycle ? "border-mainDangerV1" : ""}`}
                    />
                    {errors.payCycle && (
                      <p className="text-sm text-mainDangerV1">{errors.payCycle}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contractCode" className="text-secondaryTextV1">
                      Mã hợp đồng
                    </Label>
                    <Input
                      id="contractCode"
                      name="contractCode"
                      value={formData.contractCode}
                      onChange={handleChange}
                      placeholder="Nhập mã hợp đồng (tự động tạo nếu để trống)"
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
                ) : 'Tạo hợp đồng'}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}; 