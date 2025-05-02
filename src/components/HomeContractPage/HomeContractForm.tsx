import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { IconUserCircle, IconHome, IconCalendar, IconCoin, IconCashBanknote } from '@tabler/icons-react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { ICreateHomeContractBody, IUpdateHomeContractBody } from '@/interface/request/homeContract';
import { IHomeContractDetail } from '@/interface/response/homeContract';

const formSchema = z.object({
  guestId: z.string().min(1, 'Vui lòng chọn khách hàng'),
  homeId: z.string().min(1, 'Vui lòng chọn căn hộ'),
  duration: z.coerce.number().min(1, 'Thời hạn phải ít nhất 1 tháng'),
  payCycle: z.coerce.number().min(1, 'Vui lòng chọn kỳ thanh toán'),
  renta: z.coerce.number().min(1, 'Tiền thuê phải lớn hơn 0'),
  dateStar: z.date({
    required_error: 'Vui lòng chọn ngày bắt đầu',
  }),
  deposit: z.coerce.number().min(0, 'Tiền đặt cọc không được âm'),
  status: z.coerce.number(),
});

interface HomeContractFormProps {
  isEditing?: boolean;
  initialData?: IHomeContractDetail;
  customers?: { id: string; name: string }[];
  homes?: { id: string; name: string }[];
  onSubmit: (data: ICreateHomeContractBody | IUpdateHomeContractBody) => void;
}

const HomeContractForm: React.FC<HomeContractFormProps> = ({
  isEditing = false,
  initialData,
  customers = [],
  homes = [],
  onSubmit,
}) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultValues = {
    guestId: initialData?.guestId._id || '',
    homeId: initialData?.homeId._id || '',
    duration: initialData?.duration || 12,
    payCycle: initialData?.payCycle || 1,
    renta: initialData?.renta || 0,
    dateStar: initialData ? new Date(initialData.dateStar) : new Date(),
    deposit: initialData?.deposit || 0,
    status: initialData?.status || 0,
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  useEffect(() => {
    if (isEditing && initialData) {
      form.reset({
        guestId: initialData.guestId._id,
        homeId: initialData.homeId._id,
        duration: initialData.duration,
        payCycle: initialData.payCycle,
        renta: initialData.renta,
        dateStar: new Date(initialData.dateStar),
        deposit: initialData.deposit,
        status: initialData.status,
      });
    }
  }, [isEditing, initialData, form]);

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      const formattedValues = {
        ...values,
        dateStar: format(values.dateStar, 'yyyy-MM-dd'),
      };
      
      await onSubmit(formattedValues);
      toast.success(isEditing ? 'Cập nhật hợp đồng thành công' : 'Tạo hợp đồng thành công');
      router.push('/admin/contracts/home');
    } catch (error) {
      toast.error('Có lỗi xảy ra. Vui lòng thử lại sau.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-mainCardV1 border-lightBorderV1">
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="guestId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-mainTextV1">Khách hàng</FormLabel>
                        <Select 
                          disabled={isEditing || isSubmitting} 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="border-lightBorderV1">
                              <SelectValue placeholder="Chọn khách hàng" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {customers.map((customer) => (
                              <SelectItem key={customer.id} value={customer.id}>
                                {customer.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="homeId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-mainTextV1">Căn hộ</FormLabel>
                        <Select 
                          disabled={isEditing || isSubmitting} 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="border-lightBorderV1">
                              <SelectValue placeholder="Chọn căn hộ" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {homes.map((home) => (
                              <SelectItem key={home.id} value={home.id}>
                                {home.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-mainTextV1">Thời hạn (tháng)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mainTextV1">
                              <IconCalendar size={20} />
                            </span>
                            <Input
                              className="pl-10 border-lightBorderV1"
                              type="number"
                              {...field}
                              disabled={isSubmitting}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="payCycle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-mainTextV1">Kỳ thanh toán</FormLabel>
                        <Select 
                          disabled={isSubmitting} 
                          onValueChange={(value) => field.onChange(parseInt(value))} 
                          defaultValue={field.value.toString()}
                        >
                          <FormControl>
                            <SelectTrigger className="border-lightBorderV1">
                              <SelectValue placeholder="Chọn kỳ thanh toán" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1">Hàng tháng</SelectItem>
                            <SelectItem value="3">Hàng quý</SelectItem>
                            <SelectItem value="6">Nửa năm</SelectItem>
                            <SelectItem value="12">Hàng năm</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="renta"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-mainTextV1">Tiền thuê</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mainTextV1">
                              <IconCoin size={20} />
                            </span>
                            <Input
                              className="pl-10 border-lightBorderV1"
                              type="number"
                              {...field}
                              disabled={isSubmitting}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="deposit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-mainTextV1">Tiền đặt cọc</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mainTextV1">
                              <IconCashBanknote size={20} />
                            </span>
                            <Input
                              className="pl-10 border-lightBorderV1"
                              type="number"
                              {...field}
                              disabled={isSubmitting}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="dateStar"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="text-mainTextV1">Ngày bắt đầu</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "pl-3 text-left font-normal border-lightBorderV1",
                                  !field.value && "text-muted-foreground"
                                )}
                                disabled={isSubmitting}
                              >
                                <IconCalendar className="mr-2 h-4 w-4 text-mainTextV1" />
                                {field.value ? (
                                  format(field.value, "dd/MM/yyyy", { locale: vi })
                                ) : (
                                  <span>Chọn ngày</span>
                                )}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date < new Date(new Date().setHours(0, 0, 0, 0))
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {isEditing && (
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-mainTextV1">Trạng thái</FormLabel>
                          <Select 
                            disabled={isSubmitting} 
                            onValueChange={(value) => field.onChange(parseInt(value))} 
                            defaultValue={field.value.toString()}
                          >
                            <FormControl>
                              <SelectTrigger className="border-lightBorderV1">
                                <SelectValue placeholder="Chọn trạng thái" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="0">Chờ xác nhận</SelectItem>
                              <SelectItem value="1">Đang hiệu lực</SelectItem>
                              <SelectItem value="2">Hết hạn</SelectItem>
                              <SelectItem value="3">Đã hủy</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="border-lightBorderV1 text-secondaryTextV1 hover:text-secondaryTextV1 hover:bg-gray-50"
                  onClick={() => router.push('/admin/contracts/home')}
                  disabled={isSubmitting}
                >
                  Hủy
                </Button>
                <Button 
                  type="submit" 
                  className="bg-mainTextHoverV1 hover:bg-purple-600 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Đang xử lý...' : isEditing ? 'Cập nhật' : 'Tạo hợp đồng'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default HomeContractForm; 