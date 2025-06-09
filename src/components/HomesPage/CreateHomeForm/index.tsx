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
  Card, 
  CardContent, 
  CardFooter, 
} from '@/components/ui/card';
import {
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
import { Checkbox } from '@/components/ui/checkbox';
import { ICreateHomeBody } from '@/interface/request/home';
import { useGetHomeOwners } from '@/hooks/useHomeOwner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const formSchema = z.object({
  address: z.string().min(1, 'Địa chỉ không được để trống'),
  homeOwnerId: z.string().min(1, 'Chủ sở hữu không được để trống'),
  district: z.string().min(1, 'Quận/Huyện không được để trống'),
  ward: z.string().min(1, 'Phường/Xã không được để trống'),
  building: z.string().min(1, 'Tòa nhà không được để trống'),
  apartmentNv: z.string().min(1, 'Số căn hộ không được để trống'),
  active: z.boolean(),
  note: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateHomeFormProps {
  defaultHomeOwnerId?: string;
}

const CreateHomeForm = ({ defaultHomeOwnerId }: CreateHomeFormProps = {}) => {
  const router = useRouter();
  const { mutate, isPending } = useCreateHome();
  const {data: allHomeOwners} = useGetHomeOwners();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: '',
      homeOwnerId: defaultHomeOwnerId || '',
      district: '',
      ward: '',
      building: '',
      apartmentNv: '',
      active: true,
      note: '',
    },
  });

  const onSubmit = (values: FormValues) => {
    const payload: ICreateHomeBody = {
      address: values.address,
      homeOwnerId: values.homeOwnerId as any,
      district: values.district,
      ward: values.ward,
      building: values.building,
      apartmentNv: values.apartmentNv,
      active: values.active,
      note: values.note || '',
    };

    mutate(payload, {
      onSuccess: (response) => {
        toast.success('Tạo căn hộ mới thành công!');
        router.push(`/admin/homes`);
      },
      onError: (error) => {
        toast.error(`Lỗi: ${error.message || 'Không thể tạo căn hộ'}`);
      },
    });
  };

  return (
    <div className="space-y-8 bg-mainCardV1 p-6 rounded-lg border border-lightBorderV1">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/homes">Quản lý căn hộ</BreadcrumbLink>
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
        <Card className="border border-lightBorderV1 bg-mainBackgroundV1">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-mainTextV1">Địa chỉ</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập địa chỉ căn hộ" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="district"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-mainTextV1">Quận/Huyện</FormLabel>
                        <FormControl>
                          <Input placeholder="Nhập quận/huyện" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="ward"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-mainTextV1">Phường/Xã</FormLabel>
                        <FormControl>
                          <Input placeholder="Nhập phường/xã" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="building"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-mainTextV1">Tòa nhà</FormLabel>
                        <FormControl>
                          <Input placeholder="Nhập tên tòa nhà" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="apartmentNv"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-mainTextV1">Số căn hộ</FormLabel>
                        <FormControl>
                          <Input placeholder="Nhập số căn hộ" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="homeOwnerId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-mainTextV1">Chọn chủ nhà</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={isPending}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn chủ nhà" />
                          </SelectTrigger>
                          <SelectContent>
                            {(allHomeOwners?.data as any)?.map((owner: any) => (
                              <SelectItem key={owner._id} value={owner._id}>
                                {owner.fullname} {owner.phone ? `- ${owner.phone}` : ""}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-white">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none" >
                        <FormLabel className="text-mainTextV1">Trạng thái hoạt động</FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Chọn nếu căn hộ đang hoạt động và có thể cho thuê
                        </p>
                      </div>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="note"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-mainTextV1">Ghi chú</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Nhập ghi chú về căn hộ (nếu có)" 
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