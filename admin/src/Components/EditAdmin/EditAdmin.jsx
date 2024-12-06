import React, { useEffect, useState, useContext  } from 'react';
import './EditAdmin.css'
import {EditAudioContext} from '../../Context/EditAudioContext.jsx'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeftRotate, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'; 

const EditAdmin = () => {
  const [email, setEmail] = useState('');
  const [username,setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPwd, setconfirmPwd] = useState('');
  const { activeTab, setActiveTab} = useContext(EditAudioContext);
  
  const handleClose = () => {
    setActiveTab('User');
  };
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev); // Đảo trạng thái hiển thị mật khẩu
  };
  const handleAdd = (e) => {
    e.preventDefault(); // Ngăn chặn hành vi submit mặc định của form

    // Kiểm tra nếu thiếu bất kỳ trường nào
    if (!email || !username || !password || !confirmPwd) {
      alert('Please fill in all fields')
      return;
    }
  
    // Kiểm tra mật khẩu và xác nhận mật khẩu
    if (password !== confirmPwd) {
      alert('Passwords do not match');
      return;
    }
  
    // Nếu tất cả đều hợp lệ, gửi yêu cầu đăng ký
    const newUser = {
      email,
      username,
      password,
      isAdmin : true
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
        alert('Registration successful!');
        return response.json(); 
      })
      .catch((error) => {
        console.error('Error registering user:', error);
        alert(error.message); // Hiển thị lỗi chính xác từ server
      });
  };
  const handleReset = () => {
    setEmail('');
    setUsername('');
    setShowPassword(false);
    setPassword('');
    setconfirmPwd(''); 
  };

    return (
    <div class="form-section">
      <i class="fa fa-window-close close" aria-hidden="true" 
        onClick={()=>handleClose()}
      ></i>
      <div className='form-name border-top'>THÊM TÀI KHOẢN ADMIN</div>
      <form id="audioForm">
        <div className="section">     
          <label className="section-name" htmlFor="audioId">Email</label>
          <input 
            type="email" 
            placeholder="email@domain.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
            required
          />
        </div>
        <label className="section-name" htmlFor="artist">Username</label>
        <input 
          type="text" 
          placeholder="Nhập username " 
          value = {username}
          onChange={(e) => setUsername(e.target.value)} 
          required
        />
        <div className="input-container">
          <label className="section-name" htmlFor="artist">Tạo mật khẩu</label>
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
                <label className="section-name" htmlFor="artist">Nhập lại mật khẩu</label>
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
        <div className="control-btn">
          <div className='btn w50' type="button" 
            onClick={handleAdd}
          >THÊM</div>
      
          <div className='btn w50' type="reset"   
            onClick={handleReset}
          >RESET</div>
        </div>
      </form>
      
    </div>
  )
}

export default EditAdmin