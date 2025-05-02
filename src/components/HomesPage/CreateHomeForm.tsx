"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useCreateHome } from '@/hooks/useHome';
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
import { Textarea } from '@/components/ui/textarea';
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
  IconLoader2
} from '@tabler/icons-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

const formSchema = z.object({
  name: z.string().min(1, 'Tên căn hộ không được để trống'),
  address: z.string().min(1, 'Địa chỉ không được để trống'),
  area: z.coerce.number().min(1, 'Diện tích phải lớn hơn 0'),
  floor: z.coerce.number().min(1, 'Số tầng phải lớn hơn 0'),
  bedroom: z.coerce.number().min(0, 'Số phòng ngủ không được âm'),
  toilet: z.coerce.number().min(0, 'Số phòng tắm không được âm'),
  homeOwnerId: z.string().min(1, 'Chủ sở hữu không được để trống'),
  price: z.coerce.number().min(1, 'Giá thuê phải lớn hơn 0'),
  description: z.string().optional(),
  status: z.coerce.number().min(0).max(3),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateHomeFormProps {
  defaultHomeOwnerId?: string;
}

const CreateHomeForm = ({ defaultHomeOwnerId }: CreateHomeFormProps) => {
  const router = useRouter();
  const { mutate, isPending } = useCreateHome();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      address: '',
      area: 0,
      floor: 1,
      bedroom: 0,
      toilet: 0,
      homeOwnerId: defaultHomeOwnerId || '',
      price: 0,
      description: '',
      status: 1,
    },
  });

  const onSubmit = (values: FormValues) => {
    mutate(values, {
      onSuccess: (response) => {
        toast.success('Tạo căn hộ mới thành công!');
        router.push(`/homes/${response.data._id}`);
      },
      onError: (error) => {
        toast.error(`Lỗi: ${error.message || 'Không thể tạo căn hộ'}`);
      },
    });
  };

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
            <BreadcrumbPage>Tạo căn hộ mới</BreadcrumbPage>
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
              Tạo căn hộ mới
            </CardTitle>
          </CardHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                          <Input type="number" min="0" placeholder="Nhập giá thuê" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Địa chỉ</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập địa chỉ căn hộ" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <FormField
                    control={form.control}
                    name="area"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Diện tích (m²)</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" placeholder="Diện tích" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="floor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Số tầng</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" placeholder="Số tầng" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="bedroom"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phòng ngủ</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" placeholder="Số phòng ngủ" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="toilet"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phòng tắm</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" placeholder="Số phòng tắm" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="homeOwnerId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ID Chủ sở hữu</FormLabel>
                        <FormControl>
                          <Input placeholder="Nhập ID chủ sở hữu" {...field} />
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
                </div>
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mô tả</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Nhập mô tả chi tiết về căn hộ" 
                          className="min-h-[120px]" 
                          {...field} 
                        />
                      </FormControl>
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
                  className="bg-mainSuccessV1 hover:bg-mainSuccessHoverV1"
                  disabled={isPending}
                >
                  {isPending ? (
                    <>
                      <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang tạo...
                    </>
                  ) : 'Tạo căn hộ'}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </motion.div>
    </div>
  );
};

export default CreateHomeForm; 