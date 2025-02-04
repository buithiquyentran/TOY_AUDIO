import React, { useEffect, useState,useContext } from 'react';
import axios from 'axios';

import './PlaylistList.css'; 
import { AudioContext } from '../../Context/AudioContext'
import HomeYouMayLike from '../../Components/HomeYouMayLike/HomeYouMayLike'
import Audio from '../../Components/Audio/Audio'
const PlaylistList = () => {
  const {selectedPlaylist, setcurrentPlaylist } = useContext(AudioContext);
  const [audios, setAudios] = useState([]);
  const handleCurrentPlaylist = (p) =>{
      setcurrentPlaylist (p)
    //   alert(p.name)
  }
  useEffect(() => {
    const fetchData = async () => {
        try {
            const allSongIds = selectedPlaylist.songIds || [];
            if (allSongIds.length === 0) {
                console.error('No song IDs found in playlists');
                return;
            }
            // Tạo các promise để gọi API lấy chi tiết các bài hát
            const songPromises = allSongIds.map(async songId => {
                try {
                    const response = await axios.get(`http://localhost:5000/api/audios/${songId}`)
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
}, [selectedPlaylist]);
  return (
    <div>
      <div className="home-section-title">
          <div className="section-title"> {selectedPlaylist && selectedPlaylist.name}</div>
      </div>
      <div className="" onClick={() => handleCurrentPlaylist(selectedPlaylist)}>
          {audios.length > 0 ? (
             audios.map((audio, index) => (
                  <Audio key={index} {...audio} />
              ))
          ) : (
              <div>Không có audio nào được tìm thấy</div>
          )}
      </div>
    </div>
  );
};

export default PlaylistList;
