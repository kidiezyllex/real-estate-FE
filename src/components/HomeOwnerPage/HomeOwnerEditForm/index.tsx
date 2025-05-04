"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGetHomeOwnerDetail, useUpdateHomeOwner } from "@/hooks/useHomeOwner";
import { IUpdateHomeOwnerBody } from "@/interface/request/homeOwner";
import { toast } from "react-toastify";
import { IconLoader2, IconArrowLeft } from "@tabler/icons-react";
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from "@/components/ui/skeleton";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
interface HomeOwnerEditFormProps {
    homeOwnerId: string;
}

const HomeOwnerEditForm = ({ homeOwnerId }: HomeOwnerEditFormProps) => {
    const router = useRouter();
    const [formData, setFormData] = useState<IUpdateHomeOwnerBody>({
        phone: "",
        bankAccount: "",
        bankName: "",
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const { data: homeOwnerData, isLoading: isLoadingHomeOwner } = useGetHomeOwnerDetail({
        id: homeOwnerId
    });

    const { mutate: updateHomeOwnerMutation, isPending } = useUpdateHomeOwner();

    useEffect(() => {
        if (homeOwnerData?.data?.owner) {
            const { phone, bankAccount, bankName } = homeOwnerData.data.owner;
            setFormData({
                phone: phone || "",
                bankAccount: bankAccount || "",
                bankName: bankName || "",
            });
        }
    }, [homeOwnerData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
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

        updateHomeOwnerMutation(
            {
                params: { id: homeOwnerId },
                body: formData
            },
            {
                onSuccess: (data) => {
                    if (data.statusCode === 200 || data.statusCode === 201) {
                        toast.success("Cập nhật chủ nhà thành công!");
                        router.push(`/admin/users/home-owners/${homeOwnerId}`);
                    } else {
                        toast.error("Cập nhật chủ nhà thất bại");
                    }
                },
                onError: (error) => {
                    toast.error(`Lỗi: ${error.message}`);
                }
            }
        );
    };

    if (isLoadingHomeOwner) {
        return (
            <div className="space-y-8 bg-mainCardV1 p-6 rounded-lg border border-lightBorderV1">
                <Skeleton className="h-10 w-full max-w-md" />
                <div className="space-y-6">
                    <Card>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[...Array(3)].map((_, index) => (
                                    <div key={index} className="space-y-2">
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-10 w-full" />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                        <CardFooter className="border-t border-lightBorderV1 pt-6">
                            <div className="flex justify-end w-full gap-4">
                                <Skeleton className="h-10 w-24" />
                                <Skeleton className="h-10 w-36" />
                            </div>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        );
    }

    const homeOwner = homeOwnerData?.data?.owner;
    if (!homeOwner) {
        return (
            <div className="space-y-8 bg-mainCardV1 p-6 rounded-lg border border-lightBorderV1">
                <p className="text-mainDangerV1">Không tìm thấy thông tin chủ nhà</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 bg-mainCardV1 p-6 rounded-lg border border-lightBorderV1">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/admin/users/home-owners">Quản lý chủ nhà</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Chỉnh sửa thông tin</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <Card className="border border-lightBorderV1 bg-mainBackgroundV1">
                    <CardContent className="pt-6">
                        <div className="flex items-center mb-6">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => router.back()}
                                className="text-mainTextV1 hover:text-mainTextHoverV1 p-0 h-auto"
                            >
                                <IconArrowLeft className="h-5 w-5 mr-1" />
                            </Button>
                            <h1 className="text-xl font-medium text-mainTextV1">
                                Chỉnh sửa thông tin chủ nhà: {homeOwner.fullname}
                            </h1>
                        </div>

                        <form id="homeowner-edit-form" onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="fullname" className="text-secondaryTextV1">
                                        Họ tên
                                    </Label>
                                    <Input
                                        id="fullname"
                                        name="fullname"
                                        value={homeOwner.fullname}
                                        disabled
                                        className="border-lightBorderV1 bg-gray-100 text-gray-500"
                                    />
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
                                        value={homeOwner.email}
                                        disabled
                                        className="border-lightBorderV1 bg-gray-100 text-gray-500"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="citizenId" className="text-secondaryTextV1">
                                        Số CMND/CCCD
                                    </Label>
                                    <Input
                                        id="citizenId"
                                        name="citizenId"
                                        value={homeOwner.citizenId}
                                        disabled
                                        className="border-lightBorderV1 bg-gray-100 text-gray-500"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="bankAccount" className="text-secondaryTextV1">
                                        Số tài khoản
                                    </Label>
                                    <Input
                                        id="bankAccount"
                                        name="bankAccount"
                                        value={formData.bankAccount}
                                        onChange={handleChange}
                                        placeholder="Nhập số tài khoản"
                                        className="border-lightBorderV1"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="bankName" className="text-secondaryTextV1">
                                        Tên ngân hàng
                                    </Label>
                                    <Input
                                        id="bankName"
                                        name="bankName"
                                        value={formData.bankName}
                                        onChange={handleChange}
                                        placeholder="Nhập tên ngân hàng"
                                        className="border-lightBorderV1"
                                    />
                                </div>
                            </div>
                        </form>
                    </CardContent>

                    <CardFooter className="flex justify-end space-x-4 border-t border-lightBorderV1 pt-6">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.back()}
                            disabled={isPending}
                            className="border-lightBorderV1 text-mainTextV1"
                        >
                            Hủy
                        </Button>
                        <Button
                            type="submit"
                            form="homeowner-edit-form"
                            disabled={isPending}
                            className="bg-mainTextHoverV1 hover:bg-primary/90 text-white"
                        >
                            {isPending ? (
                                <>
                                    <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Đang cập nhật...
                                </>
                            ) : "Cập nhật"}
                        </Button>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    );
};

export default HomeOwnerEditForm; 