import React, { useState, useEffect,useContext } from 'react';
import axios from 'axios';
import './ListAudios.css'
import EditAudio from '../EditAudio/EditAudio';
import {EditAudioContext} from '../../Context/EditAudioContext.jsx'
const ListAudios = () => {
  const [audios, setAudios] = useState([]);
  // const [selectedAudio, setEditSelectAudio] = useState(null);
  const {editSelectAudio,setEditSelectAudio} = useContext(EditAudioContext);

  // Fetch audio data
  useEffect(() => { 
    fetchAudios(editSelectAudio);
  }, []);
  const fetchAudios = async () => {
    try {
      const response = await axios.get('http://localhost:5000/allaudios'); // API lấy danh sách audios
      setAudios(response.data);
    } catch (error) {
      console.error('Error fetching audios:', error);
    }
  };
  
  function formatDuration(duration) {
    // Lấy phần phút và giây từ giá trị thập phân
    const minutes = Math.floor(duration); // Phần nguyên là phút
    const seconds = Math.round((duration - minutes) * 60); // Phần thập phân đổi ra giây
  
    // Đảm bảo giây luôn hiển thị 2 chữ số (ví dụ: 3:09 thay vì 3:9)
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
  
    return `${minutes}:${formattedSeconds}`;
  }
  function formatDate(isoDate) {
    const date = new Date(isoDate);
    return date.toLocaleDateString('vi-VN'); // Format theo kiểu Việt Nam: ngày/tháng/năm
  }
  const handleSelectAudio = (audio) => {
    setEditSelectAudio(audio);
  };
  

  return (
    <div className="d-flex w-100">
      <div className="list-audios-section">
        <span className='list-audios-btn'>Nhạc</span>
        <span className='list-audios-btn'>Podcasts</span>
        <table className='list-audios'>
          <thead> 
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Singer</th>
              <th>Image</th>
              <th>File</th>
              <th>Date</th>
              <th>View</th>
            </tr>
          </thead>
          <tbody>
            {audios.map((audio) => (
              <tr 
                key={audio.id}
                className={`audio ${editSelectAudio && editSelectAudio.id === audio.id ? 'selected' : ''}`}
                onClick={() => handleSelectAudio(audio)}
              >
                <td>{audio.id}</td>
                <td className='audio-name'>{audio.name}</td>
                {/* <td>{audio.type}</td> */}
                <td className='audio-name'>{audio.singer}</td>
                {/* <td>{formatDuration(audio.duration)}</td> */}
                <td className='image'>
                  <img src={audio.image} alt="" />
                </td>
                <td className='audio'>
                  <audio src={audio.file} controls></audio>
                </td>
                <td className='date'>{formatDate(audio.date)}</td>
                <td className='date'>{audio.view}</td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* {editSelectAudio && <EditAudio/>} */}
      
    </div>
  );
};

export default ListAudios;
