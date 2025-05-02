"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useGetHomeDetail, useUpdateHome } from '@/hooks/useHome';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  IconHome,
  IconLoader2,
  IconInfoCircle
} from '@tabler/icons-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Skeleton } from '@/components/ui/skeleton';

const formSchema = z.object({
  name: z.string().min(1, 'Tên căn hộ không được để trống').optional(),
  price: z.coerce.number().min(1, 'Giá thuê phải lớn hơn 0').optional(),
  status: z.coerce.number().min(0).max(3).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface UpdateHomeFormProps {
  homeId: string;
}

const UpdateHomeForm = ({ homeId }: UpdateHomeFormProps) => {
  const router = useRouter();
  const { data: homeData, isLoading: isLoadingHome, error: homeError } = useGetHomeDetail({ id: homeId });
  const { mutate, isPending } = useUpdateHome();

  const home = homeData?.data;
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      price: 0,
      status: 0,
    },
  });

  useEffect(() => {
    if (home) {
      form.reset({
        name: home.name,
        price: home.price,
        status: home.status,
      });
    }
  }, [home, form]);

  const onSubmit = (values: FormValues) => {
    const updates: Record<string, any> = {};
    
    if (values.name !== home?.name) updates.name = values.name;
    if (values.price !== home?.price) updates.price = values.price;
    if (values.status !== home?.status) updates.status = values.status;
    
    if (Object.keys(updates).length === 0) {
      toast.info('Không có thông tin nào được thay đổi.');
      return;
    }

    mutate({
      params: { id: homeId },
      body: updates
    }, {
      onSuccess: () => {
        toast.success('Cập nhật căn hộ thành công!');
        router.push(`/homes/${homeId}`);
      },
      onError: (error) => {
        toast.error(`Lỗi: ${error.message || 'Không thể cập nhật căn hộ'}`);
      },
    });
  };

  if (isLoadingHome) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-8 w-64" />
        
        <Card className="border border-lightBorderV1">
          <CardHeader>
            <Skeleton className="h-8 w-1/3" />
          </CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-32 ml-auto" />
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (homeError || !home) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-mainCardV1 rounded-lg border border-lightBorderV1">
        <IconInfoCircle className="h-12 w-12 text-mainDangerV1 mb-4" />
        <h2 className="text-xl font-semibold text-mainTextV1 mb-2">Không thể tải thông tin căn hộ</h2>
        <p className="text-secondaryTextV1 mb-6">{homeError?.message || 'Đã xảy ra lỗi khi tải thông tin căn hộ'}</p>
        <Button 
          className="bg-mainTextHoverV1 hover:bg-mainTextHoverV1/90"
          onClick={() => router.push('/homes')}
        >
          Quay lại danh sách căn hộ
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Trang chủ</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/homes">Bất động sản</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/homes/${homeId}`}>{home.name}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Cập nhật</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="border border-lightBorderV1">
          <CardHeader>
            <CardTitle className="flex items-center text-xl font-semibold text-mainTextV1">
              <IconHome className="mr-2 h-5 w-5" />
              Cập nhật căn hộ
            </CardTitle>
          </CardHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-6">
                <div className="bg-mainBackgroundV1 p-4 rounded-sm mb-6 border border-lightBorderV1">
                  <p className="text-mainTextV1 flex items-center">
                    <IconInfoCircle className="h-5 w-5 mr-2 text-mainInfoV1" />
                    Bạn chỉ có thể cập nhật những thông tin dưới đây. Các thông tin khác không thể thay đổi.
                  </p>
                </div>
                
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên căn hộ</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập tên căn hộ" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Giá thuê (VNĐ)</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" placeholder="Nhập giá thuê" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trạng thái</FormLabel>
                      <Select 
                        onValueChange={(value) => field.onChange(parseInt(value))}
                        defaultValue={field.value.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn trạng thái" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="0">Không khả dụng</SelectItem>
                          <SelectItem value="1">Khả dụng</SelectItem>
                          <SelectItem value="2">Đang cho thuê</SelectItem>
                          <SelectItem value="3">Đang bảo trì</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              
              <CardFooter className="flex justify-end space-x-4 border-t border-lightBorderV1 pt-6">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={isPending}
                >
                  Hủy
                </Button>
                <Button 
                  type="submit"
                  className="bg-mainWarningV1 hover:bg-mainWarningHoverV1"
                  disabled={isPending}
                >
                  {isPending ? (
                    <>
                      <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang cập nhật...
                    </>
                  ) : 'Cập nhật'}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </motion.div>
    </div>
  );
};

export default UpdateHomeForm; 