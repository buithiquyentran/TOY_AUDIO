import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css'; // Em sẽ cần tạo file CSS để tùy chỉnh giao diện
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeftRotate, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'; 
const Register = () => {
    const [email, setEmail] = useState('');
    const [username,setUsername] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPwd, setconfirmPwd] = useState('');
    const [isUsernameTaken, setIsUsernameTaken] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Dùng để điều hướng người dùng
    // Hàm kiểm tra tên đăng nhập
    // const checkUsername = async (username) => {
    //     try {
    //     const response = await fetch(`http://localhost:5000/api/check-username username=${username}`);
    //     const data = await response.json();
    //     setIsUsernameTaken(data.isTaken);
    //     } catch (error) {
    //     console.error('Error checking username:', error);
    //     }
    // };
    const handleSubmit = (e) => {
        e.preventDefault(); // Ngăn chặn hành vi submit mặc định của form
      
        // Kiểm tra nếu thiếu bất kỳ trường nào
        if (!email || !username || !password || !confirmPwd) {
          setError('Please fill in all fields');
          return;
        }
      
        // Kiểm tra mật khẩu và xác nhận mật khẩu
        if (password !== confirmPwd) {
          setError('Passwords do not match');
          alert('Passwords do not match');
          return;
        }
      
        // Nếu tất cả đều hợp lệ, gửi yêu cầu đăng ký
        const newUser = {
          email,
          username,
          password,
          isAdmin: false
        };
        console.log('Submitting user:', newUser);
      
        // Gửi request đến server (sử dụng fetch API)
        fetch('http://localhost:5000/adduser', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newUser),
        })
          .then(async response => {
            // Kiểm tra mã trạng thái HTTP
            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.message || 'Failed to register');
            }
            return response.json(); 
          })
          .then(data => {
            localStorage.setItem('user',JSON.stringify(data.user))
            alert('Registration successful!');
            navigate('/', { replace: true });
          })
          .catch((error) => {
            console.error('Error registering user:', error);
            setError(error.message);
            alert(error.message); // Hiển thị lỗi chính xác từ server
          });
      };
      
    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev); // Đảo trạng thái hiển thị mật khẩu
    };
    const handleLogInRedirect = () => {
        navigate('/login'); // Điều hướng tới trang đăng ký
    };
  return (
    <div className="register-container">
        <div className="register-box">
            <h1 className="register-title">Đăng ký để nghe nhiều hơn</h1>
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
                <label>Tên đăng nhập</label>
                <input 
                type="text" 
                placeholder="Nhập username " 
                value={username}
                onChange={(e) => setUsername(e.target.value)} 
                required
                />
            </div>
            <div className="input-container">
                <label>Tạo mật khẩu</label>
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
            <div className="input-container">
                <label>Nhập lại mật khẩu</label>
                <div className="password-container">
                    <input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="Enter your password" 
                        value={confirmPwd}
                        onChange={(e) => setconfirmPwd(e.target.value)} 
                        required
                        
                    />
                    <span onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }}>
                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                    </span>
            </div>
            </div>
            <button type="submit" className="register-btn">Register</button>
            </form>
            <div>Bạn đã có tài khoản? <span onClick={handleLogInRedirect} className="register-f">Đăng nhập tại đây</span></div>
        </div>
    </div>
  );
};
export default Register;
