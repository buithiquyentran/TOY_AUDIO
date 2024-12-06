import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
const ProtectedRoute = ({ children }) => {
    // Lấy thông tin người dùng từ localStorage hoặc cookie
    // const user = JSON.parse(localStorage.getItem('user') || '{}');
    // Lấy cookie
    const userCookie = Cookies.get('user');
    const user = userCookie ? JSON.parse(userCookie) : {};
    console.log(user);
    // Kiểm tra xem người dùng có phải admin không
    if (!user || !user.isAdmin) {
        // Nếu không phải admin, điều hướng về trang đăng nhập
        // return <Navigate to="http://localhost:3000/login" replace />;
        window.location.href = 'http://localhost:3000/login';
    }

    // Nếu là admin, hiển thị nội dung
    return children;
};

export default ProtectedRoute;
