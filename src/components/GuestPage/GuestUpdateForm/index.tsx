"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetGuestDetail, useUpdateGuest } from "@/hooks/useGuest";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { IUpdateGuestBody } from "@/interface/request/guest";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { IconArrowLeft, IconLoader2 } from "@tabler/icons-react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
export default function GuestEditPage() {
    const params = useParams();
    const router = useRouter();
    const guestId = params.id as string;

    const [formData, setFormData] = useState<IUpdateGuestBody>({
        fullname: "",
        phone: "",
        note: "",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const { data: guestData, isLoading, error } = useGetGuestDetail({
        id: guestId
    });

    const { mutate: updateGuestMutation, isPending: isUpdating } = useUpdateGuest();

    useEffect(() => {
        if (error) {
            toast.error("Không thể tải thông tin khách hàng");
            router.push("/admin/guest");
        }
    }, [error, router]);

    useEffect(() => {
        if (guestData?.data) {
            setFormData({
                fullname: guestData.data.fullname,
                phone: guestData.data.phone,
                note: guestData.data.note,
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

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.fullname?.trim()) newErrors.fullname = "Họ tên không được để trống";
        if (!formData.phone?.trim()) newErrors.phone = "Số điện thoại không được để trống";

        if (formData.phone && !/^(0|\+84)[3|5|7|8|9][0-9]{8}$/.test(formData.phone)) {
            newErrors.phone = "Số điện thoại không hợp lệ";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
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
                        router.push(`/admin/guest/${guestId}`);
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

    const handleCancel = () => {
        router.push(`/admin/guest/${guestId}`);
    };

    if (isLoading) {
        return (
            <div className="p-4 md:p-8 bg-mainBackgroundV1 min-h-screen">
                <div className="mb-6 h-8">
                    <Skeleton className="h-8 w-64" />
                </div>
                <Card className="p-6">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-24 w-full" />
                        </div>
                        <div className="flex justify-end gap-4">
                            <Skeleton className="h-10 w-24" />
                            <Skeleton className="h-10 w-24" />
                        </div>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 bg-mainBackgroundV1 min-h-screen">
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >

                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/admin/users/guests">Quản lý khách hàng</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Chỉnh sửa thông tin</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>


                <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleCancel}
                            className="text-mainTextV1 hover:text-mainTextHoverV1 p-0 h-auto"
                        >
                            <IconArrowLeft className="h-5 w-5 mr-1" />
                        </Button>
                        <h1 className="text-2xl font-medium text-mainTextV1">
                            Chỉnh sửa thông tin khách hàng
                        </h1>
                    </div>

                    <Card className="shadow-sm border border-lightBorderV1">
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                        className={`border-lightBorderV1 ${errors.fullname ? "border-mainDangerV1" : ""
                                            }`}
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
                                        className={`border-lightBorderV1 ${errors.phone ? "border-mainDangerV1" : ""
                                            }`}
                                    />
                                    {errors.phone && (
                                        <p className="text-sm text-mainDangerV1">{errors.phone}</p>
                                    )}
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

                            <div className="flex justify-end gap-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleCancel}
                                    disabled={isUpdating}
                                    className="border-lightBorderV1 text-secondaryTextV1"
                                >
                                    Hủy
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isUpdating}
                                    className="bg-mainTextHoverV1 hover:bg-primary/90 text-white"
                                >
                                    {isUpdating ? (
                                        <IconLoader2 className="h-4 w-4 animate-spin mr-2" />
                                    ) : null}
                                    Lưu thay đổi
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            </motion.div>
        </div>
    );
} 