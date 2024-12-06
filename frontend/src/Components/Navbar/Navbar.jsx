import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Avatar from '../Avatar/Avatar';
import logo from '../Assets/images/logo.png';
import './Navbar.css';

const Navbar = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate(); // To navigate users
    const [searchQuery, setSearchQuery] = useState("");
    // const [searchResults, setSearchResults] = useState([]);
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSearch();  // Gọi hàm tìm kiếm khi nhấn Enter
        }
      }; 
      const handleSearch = async () => {
        try {
            if (!searchQuery.trim()) {
                alert("Vui lòng nhập từ khóa tìm kiếm!");
                return;
            }
            navigate(`/search?query=${searchQuery}`);
        } catch (error) {
            console.error('Error navigating to search page:', error);
        }
    };
    
    
    
    // Fetch user data from localStorage safely
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
            } catch (error) {
                console.error("Error parsing user data:", error);
            }
        }
    }, []);

    const handleRegisterRedirect = () => {
        navigate('/register'); // Redirect to the register page
    };

    const handleLogInRedirect = () => {
        navigate('/login'); // Redirect to the login page
    };

    return (
        <nav className="navbar navbar-expand-lg">
            <div className="navbar-l">
                <a href="/" className="navbar-brand">
                    <img
                        width="50"
                        height="50"
                        className="d-inline-block mr-8"
                        src={logo}
                        alt="Logo"
                    /> 
                    ToyAudio
                </a>
            </div>

            <div className="collapse navbar-collapse">
                <ul className="navbar-nav">
                    <li><Link className="nav-link" to='/'>Trang chủ</Link></li>
                    <li><Link className="nav-link" to='/music'>Nhạc</Link></li>
                    <li><Link className="nav-link" to='/podcasts'>Podcasts</Link></li>
                    <li><Link className="nav-link" to='/playlists'>Danh sách phát</Link></li>
                </ul>
            </div>
            <div className="navbar-r">
                <div className="d-flex">
                    <input
                        className="form-control mr-8"
                        type="text"
                        placeholder="Hôm nay nghe gì nào?"
                        aria-label="Search"
                        value={searchQuery} 
                        onChange={(e) => setSearchQuery(e.target.value)} 
                        onKeyPress={handleKeyPress}
                    />
                    <button className="btn btn-submit" type="submit" onClick={handleSearch}>Go</button>
                </div>
                {user ? (
                    <div className="d-flex">
                        <Avatar {...user} />
                        {user && <span className="user-name">{user.username} </span> }
                    </div>
                ) : (
                    <div className="login-section">
                        <div className="login" onClick={handleLogInRedirect}>Login</div>
                        <div className="login" onClick={handleRegisterRedirect}>Register</div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
