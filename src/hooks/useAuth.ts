"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useGetUserProfile } from "./useUser";
import { isAuthenticated, isValidProfileResponse } from "@/utils/auth";
import { useUser } from "@/context/useUserContext";
import cookies from "js-cookie";
import { useMutation } from '@tanstack/react-query';
import { login, register } from '@/api/auth';
import { ILoginBody, IRegisterBody } from '@/interface/request/auth';
import { ILoginResponse, IRegisterResponse } from '@/interface/response/auth';

/**
 * Hook kiểm tra xác thực trong ứng dụng
 * @returns {{
 *   isLoading: boolean,
 *   isAuth: boolean,
 *   checkAndRedirect: () => void,
 *   profileData: any
 * }}
 */
export const useAuth = () => {
  const router = useRouter();
  const { isAuthenticated: userContextAuth } = useUser();
  const { data: profileData, error: profileError, isError } = useGetUserProfile();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  // Kiểm tra xác thực và cập nhật state
  useEffect(() => {
    // Nếu API trả về lỗi 401 rõ ràng
    if (profileData && profileData.statusCode === 401) {
      // Xóa token không hợp lệ
      cookies.remove("accessToken");
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("accessToken");
      }
      setIsAuth(false);
      setIsLoading(false);
      return;
    }
    
    // Kiểm tra token từ cookies/localStorage
    const hasToken = isAuthenticated();
    
    // Đã xác thực nếu có token
    setIsAuth(hasToken);
    setIsLoading(false);
  }, [profileData, userContextAuth, isError]);

  // Chuyển hướng về trang đăng nhập nếu không xác thực
  const checkAndRedirect = useCallback(() => {
    if (!isAuth && !isLoading) {
      router.replace("/login");
    }
  }, [isAuth, isLoading, router]);

  return {
    isLoading,
    isAuth,
    checkAndRedirect,
    profileData
  };
};

export const useLogin = () => {
  return useMutation<ILoginResponse, Error, ILoginBody>({
    mutationFn: login,
  });
};

export const useRegister = () => {
  return useMutation<IRegisterResponse, Error, IRegisterBody>({
    mutationFn: register,
  });
}; 