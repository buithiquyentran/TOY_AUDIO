import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './HomeSection.css'
import Playlist from '../Playlist/Playlist'
const HomeSection = (props)=>{
    const [playlists, setPlaylists] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const playlistIds = props.playlistIds
                // Tạo các promise để gọi API lấy chi tiết các playlists
                const PLPromises = playlistIds.map(playlistId =>
                    axios.get(`http://localhost:5000/playlists/${playlistId}`)
                );
                // Chờ tất cả promise hoàn thành và lấy kết quả
                const PLResponses = await Promise.all(PLPromises);
                // Lưu thông tin các bài hát vào state
                const PLData = PLResponses.map(response => response.data);
                setPlaylists(PLData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);
    return (
        <div className="home-section">
            <div className="home-section-title">
                <div className="section-title"> {props.name}</div>
                <div className="show-all">Hiển thị tất cả </div>
            </div>
            <div className='collection'>
                {playlists.length > 0 ? (
                        playlists.map((playlist, index) => (
                            <Playlist key={index} {...playlist} />
                        ))
                    ) : (
                        <div>Không tìm thấy playlists nào</div>
                    )}
                
            </div>
        </div>
    )
}
export default HomeSection
