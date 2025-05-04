import cookies from "js-cookie";

/**
 * Kiểm tra xem người dùng có được xác thực không bằng cách kiểm tra cả cookies và localStorage
 * @returns {boolean} - Trả về true nếu người dùng đã xác thực, ngược lại là false
 */
export const isAuthenticated = (): boolean => {
  const cookieToken = cookies.get("accessToken");
  let localStorageToken = null;

  // Chỉ kiểm tra localStorage ở client-side
  if (typeof window !== "undefined") {
    try {
      // Kiểm tra token trong localStorage dưới dạng chuỗi JSON
      const tokenString = localStorage.getItem("token");
      if (tokenString) {
        const tokenObj = JSON.parse(tokenString);
        localStorageToken = tokenObj.token || tokenObj;
      }
      
      // Kiểm tra token trực tiếp trong localStorage
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        localStorageToken = accessToken;
      }
    } catch (error) {
      console.error("Lỗi khi đọc token từ localStorage:", error);
    }
  }

  return !!cookieToken || !!localStorageToken;
};

/**
 * Kiểm tra profile API response có hợp lệ không
 * @param profileData - Dữ liệu profile trả về từ API
 * @returns {boolean} - Trả về true nếu profile hợp lệ, false nếu nhận lỗi 401
 */
export const isValidProfileResponse = (profileData: any): boolean => {
  if (!profileData) return false;
  
  // Kiểm tra lỗi 401 Unauthorized
  if (profileData.statusCode === 401) return false;
  
  return true;
};

/**
 * Kiểm tra xác thực và chuyển hướng nếu chưa đăng nhập
 * @param {Function} redirectFn - Hàm chuyển hướng (thường là router.replace)
 * @param {any} profileData - Dữ liệu profile từ API (tùy chọn)
 * @returns {boolean} - Trạng thái xác thực
 */
export const checkAuthAndRedirect = (
  redirectFn: (path: string) => void, 
  profileData?: any
): boolean => {
  // Kiểm tra profile response trước
  if (profileData && profileData.statusCode === 401) {
    // Xóa token không hợp lệ trước khi chuyển hướng
    clearAuthData();
    redirectFn("/login");
    return false;
  }
  
  // Kiểm tra token
  const isAuth = isAuthenticated();
  if (!isAuth) {
    redirectFn("/login");
    return false;
  }
  
  return true;
};

/**
 * Xóa tất cả thông tin xác thực khỏi ứng dụng (đăng xuất)
 */
export const clearAuthData = (): void => {
  cookies.remove("accessToken");
  
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    localStorage.removeItem("userProfile");
  }
}; 