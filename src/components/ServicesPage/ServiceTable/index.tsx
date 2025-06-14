"use client";

import { motion } from 'framer-motion';
import { IconEye, IconEdit, IconTrash, IconSettings } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { IService } from '@/interface/response/service';

interface ServiceTableProps {
  services: IService[];
  isLoading: boolean;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const ServiceTable = ({ services, isLoading, onView, onEdit, onDelete }: ServiceTableProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, index) => (
          <Card key={index} className="border border-lightBorderV1">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-6 w-1/3" />
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!services || services.length === 0) {
    return (
      <Card className="border border-lightBorderV1">
        <CardContent className="p-12 text-center">
          <IconSettings className="h-12 w-12 text-mainTextV1 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium text-mainTextV1 mb-2">Không có dịch vụ nào</h3>
          <p className="text-secondaryTextV1">Chưa có dịch vụ nào được tạo. Hãy thêm dịch vụ đầu tiên.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {services.map((service, index) => (
        <motion.div
          key={service._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card className="border border-lightBorderV1 hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <IconSettings className="h-5 w-5 text-mainTextV1" />
                    <h3 className="text-lg font-semibold text-mainTextV1">{service.name}</h3>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-secondaryTextV1">
                    <span>Đơn vị: <span className="font-medium">{service.unit}</span></span>
                    <span>•</span>
                    <span>Tạo: {new Date(service.createdAt).toLocaleDateString('vi-VN')}</span>
                  </div>
                  {service.description && (
                    <p className="text-secondaryTextV1 text-sm mt-2 line-clamp-2">
                      {service.description}
                    </p>
                  )}
                </div>
                
                <div className="flex gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onView(service._id)}
                    className="h-8 w-8 p-0"
                  >
                    <IconEye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(service._id)}
                    className="h-8 w-8 p-0"
                  >
                    <IconEdit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(service._id)}
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <IconTrash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default ServiceTable; 