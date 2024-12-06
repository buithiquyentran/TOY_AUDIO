import React, { useEffect, useState,useContext } from 'react';
import axios from 'axios';
import './HomeYouMayLike.css'
import Audio from '../Audio/Audio'
import { AudioContext } from '../../Context/AudioContext'

const HomeYouMayLike = ({playlist})=>{
    const [audios, setAudios] = useState([]);
    const {setcurrentPlaylist } = useContext(AudioContext);
    const [showAll, setShowAll] = useState(false);
    const handleCurrentPlaylist = (p) =>{
        setcurrentPlaylist (p)
        // alert(p.name)
    }
    useEffect(() => {
        const fetchData = async () => {
            try {
                const allSongIds = playlist.songIds || [];
                if (allSongIds.length === 0) {
                    console.error('No song IDs found in playlists');
                    return;
                }
                // Tạo các promise để gọi API lấy chi tiết các bài hát
                const songPromises = allSongIds.map(async songId => {
                    try {
                        const response = await axios.get(`http://localhost:5000/audios/${songId}`)
                        return response.data;  // Trả về dữ liệu bài hát nếu tồn tại
                    } catch (error) {
                        console.warn(`Song ID ${songId} not found, skipping...`);  // Bỏ qua bài hát không tồn tại
                        return null;  // Trả về null nếu bài hát không tồn tại
                    }
                });
                const songResponses = await Promise.all(songPromises);
                const audiosData = songResponses.filter(audio => audio !== null); // Loại bỏ các phần tử null
                setAudios(audiosData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [playlist]);

    return (
        <div>
            <div className="home-section-title">
                <div className="section-title"> {playlist && playlist.name}</div>
                <div className="show-all" onClick={() => setShowAll(!showAll)}>
                    {showAll ? "Ẩn bớt" : "Hiển thị tất cả"}
                </div>
            </div>
            <div className="container-grid" onClick={() => handleCurrentPlaylist(playlist)}>
                {audios.length > 0 ? (
                    (showAll ? audios : audios.slice(0, 6)).map((audio, index) => (
                        <Audio key={index} {...audio} />
                    ))
                ) : (
                    <div>Không có audio nào được tìm thấy</div>
                )}
            </div>
        </div>
    )
}
export default HomeYouMayLike
