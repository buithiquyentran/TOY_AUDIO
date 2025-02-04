import React, { useState, useEffect,useContext } from 'react';
import axios from 'axios';
import './ListAudios.css';
import EditAudio from '../../Components/EditAudio/EditAudio';

import {EditAudioContext} from '../../Context/EditAudioContext.jsx'
import { BiTab } from 'react-icons/bi';

const ListAudios = () => {
  const [audios, setAudios] = useState([]);
  const {editSelectAudio,setEditSelectAudio} = useContext(EditAudioContext);
  const [activeTab, setActiveTab] = useState('all'); // Thêm state để quản lý tab
 
  // Fetch audio data
  useEffect(() => { 
    fetchAll();
  }, []);
  const fetchAll = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/audios/allaudios'); // API lấy danh sách audios
      setAudios(response.data);
    } catch (error) {
      console.error('Error fetching audios:', error);
    }
  };
  const fetchMusics= async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/audios/songs'); // API lấy danh sách audios
      setAudios(response.data);
    } catch (error) {
      console.error('Error fetching audios:', error);
    }
  };
  const fetchPodcasts= async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/audios/podcasts'); // API lấy danh sách audios
      setAudios(response.data);
    } catch (error) {
      console.error('Error fetching audios:', error);
    }
  };
  
  function formatDate(isoDate) {
    const date = new Date(isoDate);
    return date.toLocaleDateString('vi-VN'); // Format theo kiểu Việt Nam: ngày/tháng/năm
  }
  const handleSelectAudio = (audio) => {
    setEditSelectAudio(audio);
  };
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === 'music') {
      fetchMusics();
    } else if (tab === 'podcast') {
      fetchPodcasts();
    }
    else {
      fetchAll()
    }
  };
  const handleExport = async () => {
    try {
      // Gọi API để xuất file Excel, sử dụng params để gửi dữ liệu
      const response = await axios.get("http://localhost:5000/export", {
        responseType: "blob", 
        params: {
          type: 'audio', // Gửi type dưới dạng query parameter
          sort: activeTab // Gửi tab dưới dạng query parameter
        }
      });
  
      // Tạo URL từ blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
  
      // Tạo một thẻ <a> để tải file
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${activeTab}audios.xlsx`); // Đặt tên file
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error exporting file:", error);
    }
  };
  

  return (
    <div className="body">
      <div className="list-audios-section ">
        <div className="btn-section">
          <div className="sort">
            <span
              className={`list-audios-btn ${activeTab == 'all' ? 'active' : ''}`}
              onClick={() => handleTabClick('all')}
            >
                Tất cả
            </span>
            <span
            className={`list-audios-btn ${activeTab == 'music' ? 'active' : ''}`}
            onClick={() => handleTabClick('music')}
            >
              Nhạc
            </span>
            <span 
              className={`list-audios-btn ${activeTab == 'podcast' ? 'active' : ''}`}
              onClick={() => handleTabClick('podcast')}
            >
              Podcasts
            </span>
          </div>
          <div className="list-audios-btn export-btn"
            onClick={() => handleExport()}
          >
            Xuất file
          </div>
        </div>
        <table className='list-audios'>
          <thead> 
            <tr>
              <th>STT</th>
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
            {audios.map((audio,index) => (
              <tr 
                key={audio.id}
                className={`audio ${editSelectAudio && editSelectAudio.id === audio.id ? 'selected' : ''}`}
                onClick={() => handleSelectAudio(audio)}
              >
                <td>{index + 1}</td>

                <td>{audio.id}</td>
                <td className='audio-name'>{audio.name}</td>
                <td className='audio-name'>{audio.singer}</td>
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
      <div>
        {editSelectAudio && <EditAudio/>}
      </div>
    </div>
  );
};

export default ListAudios;
