import React, { useEffect, useState, useContext } from "react";
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate, useLocation  } from "react-router-dom";
import { BiSolidPlaylist } from "react-icons/bi";
import { GrAdd } from "react-icons/gr";
import { FiSearch } from "react-icons/fi";
import { LuListMusic } from "react-icons/lu";
import './Sidebar.css';
import { AudioContext } from '../../Context/AudioContext'

const Sidebar = () => {
    const {setPlaylistUser} = useContext(AudioContext);
    const [isOpen, setIsOpen] = useState(false);
    const [userCollection, setUserCollection] = useState(null);
    const [playlists, setPlaylists] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    let user = null; // Khởi tạo user với giá trị mặc định
    try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            user = JSON.parse(storedUser); // Chỉ parse nếu có dữ liệu
        }
    } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
    }
    const handleToggle = () => {
        setIsOpen(!isOpen); // Mở/Đóng modal
        if (user){
            setPlaylistUser(null);
            navigate('/create_playlist');
        }
    };

    const handleCreatePL = () => {
        if (!user) {
            navigate('/login'); // Điều hướng đến trang đăng nhập nếu chưa đăng nhập
        }
    };
    useEffect(() => {
        // Khi pathname thay đổi, kiểm tra xem có phải là "/create_playlist" không
        if (location.pathname !== '/create_playlist') {
            setPlaylistUser(null); // Đặt PlaylistUser thành null nếu không phải trang /create_playlist
        }
    }, [location.pathname, setPlaylistUser]);
    const handleDeletePlaylist = async(id)=>{
        try {
            await axios.delete(`http://localhost:5000/api/playlist/${id}`);
            // fetchData();
          } catch (error) {
            console.error('Error deleting audio:', error);
          }
    }
    useEffect(() => {
        const fetchData = async () => {
            try {
                const storedUser = localStorage.getItem('user');
                let user = null;
                if (storedUser) {
                    user = JSON.parse(storedUser); // Chỉ parse nếu có dữ liệu
                }
                const response = await axios.get('http://localhost:5000/allplcollection');
                const playlistSystem = response.data.find(
                    (playlistCl) => playlistCl.username === user?.username
                );
                if (playlistSystem) {
                    setUserCollection(playlistSystem.playlistIds);
    
                    // Sử dụng Promise.all để gọi API cho tất cả playlistIds
                    const playlistRequests = playlistSystem.playlistIds?.map((plId) =>
                        axios.get(`http://localhost:5000/playlists/${plId}`)
                    );
                    
                    const playlistData = await Promise.all(playlistRequests); // Đợi tất cả lời gọi API
    
                    const playlists = playlistData.map((res) => res.data);
                    setPlaylists(playlists);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);
    
    return (
        <div className="sidebar">
            <div className="sidebar-head">
                <BiSolidPlaylist className="lib-icon lib-icon-1" />Thư viện
                <GrAdd className="lib-icon lib-icon-add" />
                <FontAwesomeIcon icon={faArrowRight} className="lib-icon lib-icon-arrow" />
            </div>

            {/* Trạng thái chưa đăng nhập/ chưa từng tạo playlist */}
            {!userCollection && (
                <div className="createPL-container">
                    <div>Tạo danh sách phát đầu tiên của riêng bạn</div>
                    <div className="btn-playlist" onClick={handleToggle}>
                        Tạo danh sách phát
                    </div>

                    {(!user && isOpen)? (
                        <div className="create-playlist">
                            <div className="create-playlist-head">Tạo danh sách phát</div>
                            <div>Đăng nhập để tạo playlists</div>
                            <div className="create-playlist-nav">
                                <div className="create-playlist-cancle" onClick={handleToggle}>
                                    Để sau
                                </div>
                                <div className="create-playlist-login" onClick={handleCreatePL}>
                                    Đăng nhập
                                </div>
                            </div>
                        </div>
                    ): ()=> {setPlaylistUser(null);navigate('/create_playlist');}}
                </div>
            )}

            {/* Hiển thị playlists người dùng đã tạo */}
            {playlists.length !== 0 && (
                <div>
                    <button type="button" className="btn-playlist" 
                    onClick={()=> {navigate('/create_playlist'); setPlaylistUser(null);}}>
                        Tạo danh sách phát
                    </button>
                    <div className="sidebar-search">
                        <FiSearch className="lib-icon-1" />
                        <LuListMusic className="lib-icon-1 lib-icon-r" />
                    </div>
                    <div className="playlist-list">
                        {playlists.map((playlist) => (
                            <div className="playlist-container">
                                <div className="playlist-sb" onClick={() => {setPlaylistUser(playlist);navigate('/create_playlist')}}>
                                    <img
                                        className="playlist-img"
                                        src={playlist.image}
                                        alt={playlist.name}
                                    />
                                    <div className="playlist-desc">
                                        <div className="audio-info-item">{playlist.name}</div>
                                        <div className="playlist-desc-au">
                                            {playlist.username === 'B2113345'
                                                ? 'ToyAudio'
                                                : playlist.username}
                                        </div>
                                    </div>
                                
                                </div>
                                <i 
                                    className="fa fa-window-close de-pl" 
                                    aria-hidden="true" 
                                    onClick={() => {
                                        const confirmed = window.confirm("Bạn có chắc chắn muốn xóa playlist này?");
                                        if (confirmed) {
                                            handleDeletePlaylist(playlist.id);
                                        }
                                    }}
                                ></i>
                            </div>
                            
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Sidebar;
