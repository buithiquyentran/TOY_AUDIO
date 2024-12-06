import React, { useState, useEffect} from "react";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import logo from '../../../logo.png'
import Avatar from '../Avatar/Avatar'

import './Navbar.css'
const Navbar = ()=>{
    const [user, setUser] = useState(null);
    function getUserFromCookie() {
        const cookieValue = document.cookie
        .split('; ')
        .find((row) => row.startsWith('user='))
        ?.split('=')[1];
        return cookieValue ? JSON.parse(cookieValue) : null;
    }
    useEffect(() => {
        const userFromCookie = getUserFromCookie();
        setUser(userFromCookie);
    },[]);
    
    
    const navigate = useNavigate(); // Dùng để điều hướng người dùng
    return (
        <nav className="navbar">
            <div className="navbar-l">
                <a href="/" className="navbar-brand">
                    <img width="50" height="50" className="d-inline-block mr-8" src={logo} alt=""/>
                    Admin ToyAudio
                </a>
            </div> 
            <div className="nav-note">Bạn đang đăng nhập với vai trò admin</div>
            <div className="navbar-r">
               {user && <Avatar username={user.username} email={user.email}/>}
               {user && <span className="user-name">{user.username} </span> }
            </div>

        </nav>
    )
}
export default Navbar

