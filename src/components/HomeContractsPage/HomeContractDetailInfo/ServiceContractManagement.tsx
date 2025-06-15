"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  IconSettings, 
  IconPlus, 
  IconEdit, 
  IconTrash, 
  IconEye,
  IconCalendar,
  IconCurrencyDollar
} from '@tabler/icons-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useGetServiceContractsByHomeContract, useCreateServiceContract, useUpdateServiceContract, useDeleteServiceContract } from '@/hooks/useServiceContract';
import { useGetServices } from '@/hooks/useService';
import { toast } from 'react-toastify';

interface ServiceContractManagementProps {
  homeContractId: string;
  homeId: string;
  guestId: string;
  onRefresh?: () => void;
}

interface ServiceContractFormData {
  serviceId: string;
  dateStar: string;
  duration: number;
  price: number;
  payCycle: number;
}

const ServiceContractManagement = ({ homeContractId, homeId, guestId, onRefresh }: ServiceContractManagementProps) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedServiceContractId, setSelectedServiceContractId] = useState<string | null>(null);
  const [selectedServiceContract, setSelectedServiceContract] = useState<any>(null);
  const [formData, setFormData] = useState<ServiceContractFormData>({
    serviceId: '',
    dateStar: '',
    duration: 1,
    price: 0,
    payCycle: 1
  });

  const { data: serviceContractsData, isLoading, refetch } = useGetServiceContractsByHomeContract({ homeContractId });
  const { data: servicesData } = useGetServices();
  const { mutate: createServiceContractMutation, isPending: isCreating } = useCreateServiceContract();
  const { mutate: updateServiceContractMutation, isPending: isUpdating } = useUpdateServiceContract();
  const { mutate: deleteServiceContractMutation, isPending: isDeleting } = useDeleteServiceContract();

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(value);
  };

  const getStatusInfo = (status: number) => {
    switch (status) {
      case 0: return { text: "Đã hủy", color: "bg-red-100 text-red-800" };
      case 1: return { text: "Đang hoạt động", color: "bg-green-100 text-green-800" };
      case 2: return { text: "Đã kết thúc", color: "bg-gray-100 text-gray-800" };
      default: return { text: "Không xác định", color: "bg-gray-100 text-gray-800" };
    }
  };

  const getPayCycleText = (payCycle: number) => {
    switch (payCycle) {
      case 1: return "Hàng tháng";
      case 3: return "Hàng quý";
      case 6: return "6 tháng";
      case 12: return "Hàng năm";
      default: return `${payCycle} tháng`;
    }
  };

  const handleInputChange = (field: keyof ServiceContractFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      serviceId: '',
      dateStar: '',
      duration: 1,
      price: 0,
      payCycle: 1
    });
  };

  const handleCreateServiceContract = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.serviceId) {
      toast.error('Vui lòng chọn dịch vụ');
      return;
    }
    
    if (!formData.dateStar) {
      toast.error('Vui lòng chọn ngày bắt đầu');
      return;
    }
    
    if (!formData.duration || formData.duration <= 0) {
      toast.error('Vui lòng nhập thời hạn hợp lệ');
      return;
    }
    
    if (!formData.price || formData.price <= 0) {
      toast.error('Vui lòng nhập giá dịch vụ hợp lệ');
      return;
    }

    createServiceContractMutation(
      {
        homeId,
        serviceId: formData.serviceId,
        guestId,
        homeContractId,
        dateStar: formData.dateStar,
        duration: formData.duration,
        price: formData.price,
        payCycle: formData.payCycle
      },
      {
        onSuccess: (data) => {
          if (data.statusCode === 201) {
            toast.success('Tạo hợp đồng dịch vụ thành công');
            refetch();
            setIsCreateDialogOpen(false);
            resetForm();
            onRefresh?.();
          } else {
            toast.error('Tạo hợp đồng dịch vụ thất bại');
          }
        },
        onError: (error) => {
          toast.error(`Lỗi: ${error.message}`);
        }
      }
    );
  };

  const handleEditServiceContract = (serviceContract: any) => {
    setSelectedServiceContractId(serviceContract._id);
    setFormData({
      serviceId: serviceContract.serviceId,
      dateStar: serviceContract.dateStar.split('T')[0],
      duration: serviceContract.duration,
      price: serviceContract.price,
      payCycle: serviceContract.payCycle
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateServiceContract = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedServiceContractId) return;
    
    if (!formData.duration || formData.duration <= 0) {
      toast.error('Vui lòng nhập thời hạn hợp lệ');
      return;
    }
    
    if (!formData.price || formData.price <= 0) {
      toast.error('Vui lòng nhập giá dịch vụ hợp lệ');
      return;
    }

    updateServiceContractMutation(
      {
        params: { id: selectedServiceContractId },
        body: {
          duration: formData.duration,
          price: formData.price,
          payCycle: formData.payCycle
        }
      },
      {
        onSuccess: (data) => {
          if (data.statusCode === 200) {
            toast.success('Cập nhật hợp đồng dịch vụ thành công');
            refetch();
            setIsEditDialogOpen(false);
            setSelectedServiceContractId(null);
            resetForm();
            onRefresh?.();
          } else {
            toast.error('Cập nhật hợp đồng dịch vụ thất bại');
          }
        },
        onError: (error) => {
          toast.error(`Lỗi: ${error.message}`);
        }
      }
    );
  };

  const handleViewDetails = (serviceContract: any) => {
    setSelectedServiceContract(serviceContract);
    setIsDetailsDialogOpen(true);
  };

  const handleDeleteServiceContract = (serviceContractId: string) => {
    setSelectedServiceContractId(serviceContractId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteServiceContract = () => {
    if (!selectedServiceContractId) return;

    deleteServiceContractMutation(
      { id: selectedServiceContractId },
      {
        onSuccess: (data) => {
          if (data.statusCode === 200) {
            toast.success('Xóa hợp đồng dịch vụ thành công');
            refetch();
            setIsDeleteDialogOpen(false);
            setSelectedServiceContractId(null);
            onRefresh?.();
          } else {
            toast.error('Xóa hợp đồng dịch vụ thất bại');
          }
        },
        onError: (error) => {
          toast.error(`Lỗi: ${error.message}`);
        }
      }
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-4 border rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-6 w-20" />
              </div>
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  const serviceContracts = serviceContractsData?.data?.contracts || [];
  const services = servicesData?.data || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader className="flex items-center justify-between">
        Hợp đồng dịch vụ
            <Button onClick={() => {
              resetForm();
              setIsCreateDialogOpen(true);
            }}>
              <IconPlus className="h-4 w-4" />
              Thêm hợp đồng dịch vụ
            </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {serviceContracts.length === 0 ? (
            <div className="text-center py-8">
              <IconSettings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có hợp đồng dịch vụ nào</h3>
              <p className="text-gray-500 mb-4">Hãy tạo hợp đồng dịch vụ đầu tiên cho hợp đồng thuê nhà này</p>
              <Button onClick={() => {
                resetForm();
                setIsCreateDialogOpen(true);
              }}>
                <IconPlus className="h-4 w-4" />
                Thêm hợp đồng dịch vụ
              </Button>
            </div>
          ) : (
            serviceContracts.map((serviceContract: any, index: number) => {
              const statusInfo = getStatusInfo(serviceContract.status);
              const serviceName = services.find(s => s._id === serviceContract.serviceId)?.name || 'Dịch vụ không xác định';
              
              return (
                <motion.div
                  key={serviceContract._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <IconSettings className="h-5 w-5 text-blue-600" />
                      <div>
                        <h4 className="font-medium">{serviceName}</h4>
                        <p className="text-sm text-gray-500">
                          {formatCurrency(serviceContract.price)} / {getPayCycleText(serviceContract.payCycle)}
                        </p>
                        <p className="text-sm text-gray-500">
                          Thời hạn: {serviceContract.duration} tháng
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={statusInfo.color}>
                        {statusInfo.text}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(serviceContract)}
                        className="h-8 w-8 p-0"
                      >
                        <IconEye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditServiceContract(serviceContract)}
                        className="h-8 w-8 p-0"
                      >
                        <IconEdit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteServiceContract(serviceContract._id)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <IconTrash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400">
                    Bắt đầu: {new Date(serviceContract.dateStar).toLocaleDateString('vi-VN')} • 
                    Tạo: {new Date(serviceContract.createdAt).toLocaleDateString('vi-VN')}
                  </p>
                </motion.div>
              );
            })
          )}
        </CardContent>
      </Card>

      {/* Create Service Contract Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-md bg-mainBackgroundV1 border-lightBorderV1">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-mainTextV1">
              <IconPlus className="h-5 w-5" />
              Thêm hợp đồng dịch vụ
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateServiceContract} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="serviceId">Dịch vụ <span className="text-red-500">*</span></Label>
              <Select value={formData.serviceId} onValueChange={(value) => handleInputChange('serviceId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn dịch vụ..." />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service: any) => (
                    <SelectItem key={service._id} value={service._id}>
                      {service.name} ({service.unit})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateStar">Ngày bắt đầu <span className="text-red-500">*</span></Label>
              <Input
                id="dateStar"
                type="date"
                value={formData.dateStar}
                onChange={(e) => handleInputChange('dateStar', e.target.value)}
                disabled={isCreating}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Thời hạn (tháng) <span className="text-red-500">*</span></Label>
              <Input
                id="duration"
                type="number"
                min="1"
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', Number(e.target.value))}
                placeholder="Nhập thời hạn..."
                disabled={isCreating}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Giá dịch vụ <span className="text-red-500">*</span></Label>
              <Input
                id="price"
                type="number"
                min="0"
                value={formData.price}
                onChange={(e) => handleInputChange('price', Number(e.target.value))}
                placeholder="Nhập giá dịch vụ..."
                disabled={isCreating}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="payCycle">Chu kỳ thanh toán</Label>
              <Select value={formData.payCycle.toString()} onValueChange={(value) => handleInputChange('payCycle', Number(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Hàng tháng</SelectItem>
                  <SelectItem value="3">Hàng quý</SelectItem>
                  <SelectItem value="6">6 tháng</SelectItem>
                  <SelectItem value="12">Hàng năm</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)} disabled={isCreating}>
                Hủy
              </Button>
              <Button type="submit" disabled={isCreating}>
                {isCreating ? 'Đang tạo...' : 'Tạo hợp đồng'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Service Contract Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md bg-mainBackgroundV1 border-lightBorderV1">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-mainTextV1">
              <IconEdit className="h-5 w-5" />
              Cập nhật hợp đồng dịch vụ
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateServiceContract} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-duration">Thời hạn (tháng) <span className="text-red-500">*</span></Label>
              <Input
                id="edit-duration"
                type="number"
                min="1"
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', Number(e.target.value))}
                placeholder="Nhập thời hạn..."
                disabled={isUpdating}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-price">Giá dịch vụ <span className="text-red-500">*</span></Label>
              <Input
                id="edit-price"
                type="number"
                min="0"
                value={formData.price}
                onChange={(e) => handleInputChange('price', Number(e.target.value))}
                placeholder="Nhập giá dịch vụ..."
                disabled={isUpdating}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-payCycle">Chu kỳ thanh toán</Label>
              <Select value={formData.payCycle.toString()} onValueChange={(value) => handleInputChange('payCycle', Number(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Hàng tháng</SelectItem>
                  <SelectItem value="3">Hàng quý</SelectItem>
                  <SelectItem value="6">6 tháng</SelectItem>
                  <SelectItem value="12">Hàng năm</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={isUpdating}>
                Hủy
              </Button>
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? 'Đang cập nhật...' : 'Cập nhật'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Service Contract Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="sm:max-w-lg bg-mainBackgroundV1 border-lightBorderV1">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-mainTextV1">
              <IconEye className="h-5 w-5" />
              Chi tiết hợp đồng dịch vụ
            </DialogTitle>
          </DialogHeader>
          {selectedServiceContract && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-gray-600">Dịch vụ</Label>
                  <p className="font-medium">
                    {services.find(s => s._id === selectedServiceContract.serviceId)?.name || 'N/A'}
                  </p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Trạng thái</Label>
                  <Badge className={getStatusInfo(selectedServiceContract.status).color}>
                    {getStatusInfo(selectedServiceContract.status).text}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Giá dịch vụ</Label>
                  <p className="font-medium">{formatCurrency(selectedServiceContract.price)}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Chu kỳ thanh toán</Label>
                  <p className="font-medium">{getPayCycleText(selectedServiceContract.payCycle)}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Thời hạn</Label>
                  <p className="font-medium">{selectedServiceContract.duration} tháng</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Ngày bắt đầu</Label>
                  <p className="font-medium">
                    {new Date(selectedServiceContract.dateStar).toLocaleDateString('vi-VN')}
                  </p>
                </div>
              </div>
              <div className="pt-4 border-t">
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                  <div>
                    <Label className="text-xs">Ngày tạo</Label>
                    <p>{new Date(selectedServiceContract.createdAt).toLocaleString('vi-VN')}</p>
                  </div>
                  <div>
                    <Label className="text-xs">Cập nhật</Label>
                    <p>{new Date(selectedServiceContract.updatedAt).toLocaleString('vi-VN')}</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={() => setIsDetailsDialogOpen(false)}>
                  Đóng
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Service Contract Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md bg-mainBackgroundV1 border-lightBorderV1">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-mainTextV1">
              <IconTrash className="h-5 w-5 text-red-500" />
              Xác nhận xóa hợp đồng dịch vụ
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Bạn có chắc chắn muốn xóa hợp đồng dịch vụ này? Hành động này không thể hoàn tác.
            </p>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isDeleting}>
                Hủy
              </Button>
              <Button type="button" onClick={confirmDeleteServiceContract} disabled={isDeleting} className="bg-red-600 hover:bg-red-700 text-white">
                {isDeleting ? 'Đang xóa...' : 'Xóa'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default ServiceContractManagement; 