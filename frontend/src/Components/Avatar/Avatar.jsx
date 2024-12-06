import React, {useState} from 'react';
import './Avatar.css'
const Avatar = (user) => {
    // Lấy ký tự đầu tiên của tên người dùng
    const initial = user.username.charAt(0).toUpperCase();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => {
      setDropdownOpen(!dropdownOpen);
    };
  
    const handleLogout = () => {
      localStorage.removeItem('user');
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
                            <div className="username">{user.username}</div>
                            <div className="email">{user.email}</div>
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
