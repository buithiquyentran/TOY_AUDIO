import React, {useState} from 'react';
import './Avatar.css'
import Cookies from 'js-cookie';
const Avatar = ({ username,email}) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    // Lấy ký tự đầu tiên của tên người dùng
    const initial = username.charAt(0).toUpperCase();
    const toggleDropdown = () => {
      setDropdownOpen(!dropdownOpen);
    };

    const handleLogout = () => {
        Cookies.remove('user', { path: '/' }); // Xóa cookie 'user' trên toàn bộ ứng dụng
        window.location.reload();
    };

    return (
        <div className="user-dropdown">
            <div className="avatar-circle" onClick={toggleDropdown}>
                <span className="initial">{initial}</span>
            </div>
            {dropdownOpen && (
                <div className="dropdown">
                    <div className="user-info">
                        <div className="avatar-circle">
                            <span className="initial">{initial}</span>
                        </div>
                        <div>
                            <div className="username">{username}</div>
                            <div className="email">{email}</div>
                        </div>
                    </div>
                    <div className="dropdown-options">
                        <div className='dropdown-option'>Chuyển đổi tài khoản</div>
                        <div className='dropdown-option' onClick={handleLogout}>Đăng xuất</div>
                    </div>
                </div>)}
        </div>
    );
};

export default Avatar;
