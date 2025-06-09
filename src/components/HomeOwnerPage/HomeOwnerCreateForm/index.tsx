"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useCreateHomeOwner } from "@/hooks/useHomeOwner";
import { ICreateHomeOwnerBody } from "@/interface/request/homeOwner";
import { toast } from "react-toastify";
import { IconLoader2, IconArrowLeft } from "@tabler/icons-react";
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

const HomeOwnerCreateForm = () => {
    const router = useRouter();
    const [formData, setFormData] = useState<ICreateHomeOwnerBody>({
        fullname: "",
        phone: "",
        email: "",
        citizenId: "",
        citizen_date: "",
        citizen_place: "",
        birthday: "",
        address: "",
        bankAccount: "",
        bankName: "",
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const { mutate: createHomeOwnerMutation, isPending } = useCreateHomeOwner();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.fullname.trim()) newErrors.fullname = "Họ tên không được để trống";
        if (!formData.phone.trim()) newErrors.phone = "Số điện thoại không được để trống";
        if (!formData.citizenId.trim()) newErrors.citizenId = "Số CMND/CCCD không được để trống";
        if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
            newErrors.email = "Email không hợp lệ";
        }
        if (formData.phone && !/^(0|\+84)[3|5|7|8|9][0-9]{8}$/.test(formData.phone)) {
            newErrors.phone = "Số điện thoại không hợp lệ";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        createHomeOwnerMutation(formData, {
            onSuccess: (data) => {
                if (data.statusCode === 200 || data.statusCode === 201) {
                    toast.success("Tạo chủ nhà thành công!");
                    router.push("/admin/users/home-owners");
                } else {
                    toast.error("Tạo chủ nhà thất bại");
                }
            },
            onError: (error) => {
                toast.error(`Lỗi: ${error.message}`);
            }
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
                        <BreadcrumbLink href="/admin/users/home-owners">Quản lý chủ nhà</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Tạo chủ nhà mới</BreadcrumbPage>
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
                                Tạo chủ nhà mới
                            </h1>
                        </div>
                        <form id="homeowner-create-form" onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                        className={`border-lightBorderV1 ${errors.fullname ? "border-mainDangerV1" : ""}`}
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
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Nhập email"
                                        className={`border-lightBorderV1 ${errors.email ? "border-mainDangerV1" : ""}`}
                                    />
                                    {errors.email && (
                                        <p className="text-sm text-mainDangerV1">{errors.email}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="citizenId" className="text-secondaryTextV1">
                                        Số CMND/CCCD <span className="text-mainDangerV1">*</span>
                                    </Label>
                                    <Input
                                        id="citizenId"
                                        name="citizenId"
                                        value={formData.citizenId}
                                        onChange={handleChange}
                                        placeholder="Nhập số CMND/CCCD"
                                        className={`border-lightBorderV1 ${errors.citizenId ? "border-mainDangerV1" : ""}`}
                                    />
                                    {errors.citizenId && (
                                        <p className="text-sm text-mainDangerV1">{errors.citizenId}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="citizen_date" className="text-secondaryTextV1">
                                        Ngày cấp
                                    </Label>
                                    <Input
                                        id="citizen_date"
                                        name="citizen_date"
                                        type="date"
                                        value={formData.citizen_date}
                                        onChange={handleChange}
                                        className="border-lightBorderV1"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="citizen_place" className="text-secondaryTextV1">
                                        Nơi cấp
                                    </Label>
                                    <Input
                                        id="citizen_place"
                                        name="citizen_place"
                                        value={formData.citizen_place}
                                        onChange={handleChange}
                                        placeholder="Nhập nơi cấp"
                                        className="border-lightBorderV1"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="birthday" className="text-secondaryTextV1">
                                        Ngày sinh
                                    </Label>
                                    <Input
                                        id="birthday"
                                        name="birthday"
                                        type="date"
                                        value={formData.birthday}
                                        onChange={handleChange}
                                        className="border-lightBorderV1"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="address" className="text-secondaryTextV1">
                                        Địa chỉ
                                    </Label>
                                    <Input
                                        id="address"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        placeholder="Nhập địa chỉ"
                                        className="border-lightBorderV1"
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
                            form="homeowner-create-form"
                            disabled={isPending}
                            className="bg-mainTextHoverV1 hover:bg-primary/90 text-white"
                        >
                            {isPending ? (
                                <>
                                    <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Đang tạo...
                                </>
                            ) : "Tạo chủ nhà"}
                        </Button>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    );
};

export default HomeOwnerCreateForm; 