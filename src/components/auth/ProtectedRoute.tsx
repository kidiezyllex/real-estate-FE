"use client";

import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isLoading, isAuth, checkAndRedirect, profileData } = useAuth();

  useEffect(() => {
    // Nếu API trả về lỗi 401 hoặc không có token hợp lệ, chuyển hướng về trang đăng nhập
    if (!isLoading && !isAuth) {
      checkAndRedirect();
    }
  }, [isLoading, isAuth, checkAndRedirect, profileData]);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Đang tải...</div>;
  }

  // Nếu không được xác thực, không hiển thị nội dung
  if (!isAuth) {
    return null;
  }

  // Người dùng đã được xác thực
  return <>{children}</>;
} 