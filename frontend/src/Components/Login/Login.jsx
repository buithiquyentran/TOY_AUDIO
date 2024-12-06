import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Em sẽ cần tạo file CSS để tùy chỉnh giao diện
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'; 
const Login = () => {
    const [email, setEmail] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate(); // Dùng để điều hướng người dùng
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Gửi yêu cầu đăng nhập tới backend
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }), // Gửi email và password
            });
            const data = await response.json();
            if (response.ok) {
                // Nếu đăng nhập thành công
                localStorage.setItem('user',JSON.stringify(data.user))
                if (data.user.isAdmin) {
                    document.cookie = `user=${JSON.stringify(data.user)}; path=/;`;
                    window.location.href = 'http://localhost:5173/';
                } else {
                    navigate('/', { replace: true });
                }
                
            } else {
                // Nếu đăng nhập thất bại, hiển thị thông báo lỗi
                // setErrorMessage(data.message);
                alert(data.message)
            }
        } catch (error) {
            console.error('Error logging in:', error);
            setErrorMessage('There was an error. Please try again later.');
        }
    };
    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev); // Đảo trạng thái hiển thị mật khẩu
    };
    // Điều hướng đến trang đăng ký
    const handleRegisterRedirect = () => {
        navigate('/register'); // Điều hướng tới trang đăng ký
    };

  return (
    <div className="login-container">
        <div className="login-box">
            <h1 className="login-title">Đăng nhập vào ToyAudio</h1>
            <form onSubmit={handleSubmit}>
            <div className="input-container">
                <label>Email</label>
                <input 
                type="email" 
                placeholder="email@domain.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)} 
                required
                />
            </div>
            <div className="input-container">
                <label>Password</label>
                <div className="password-container">
                    <input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="Enter your password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} 
                        required
                        
                    />
                    <span onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }}>
                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                    </span>
            </div>
                </div>
            <button type="submit" className="login-btn">Login</button>
            </form>
            <div className="login-f">Quên mật khẩu của bạn</div>
            <div>Bạn chưa có tài khoản? <span onClick={handleRegisterRedirect} className="login-f">Đăng ký ToyAudio</span></div>
        </div>
    </div>
  );
};

export default Login;
