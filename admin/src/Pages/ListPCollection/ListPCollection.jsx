import React, { useState, useEffect,useContext } from 'react';
import axios from 'axios';
import './ListPCollection.css'
import EditPlaylistCollection from '../../Components/EditPlaylistCollection/EditPlaylistCollection';
import {EditAudioContext} from '../../Context/EditAudioContext.jsx'

const ListPCollection = () => {
  const [playlists, setPlaylists] = useState([]);
  const { editSelectPlCollection, setEditSelectPlCollection} = useContext(EditAudioContext);
  const [activeTab, setActiveTab] = useState('all'); // Thêm state để quản lý tab
 
  // Fetch audio data
  useEffect(() => { 
    fetchAll();
  }, []);
  const fetchAll= async () => {
    try {
      const response = await axios.get('http://localhost:5000/allplcollection'); // API lấy danh sách audios
      setPlaylists(response.data);
    } catch (error) {
      console.error('Error fetching audios:', error);
    }
  };
  const fetchMusics= async () => {
    try {
      const response = await axios.get('http://localhost:5000/allplcollection/songs'); // API lấy danh sách audios
      setPlaylists(response.data);
    } catch (error) {
      console.error('Error fetching audios:', error);
    }
  };
  const fetchPodcasts= async () => {
    try {
      const response = await axios.get('http://localhost:5000/allplcollection/podcasts'); // API lấy danh sách audios
      setPlaylists(response.data);
    } catch (error) {
      console.error('Error fetching audios:', error);
    }
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

  function formatDate(isoDate) {
    const date = new Date(isoDate);
    return date.toLocaleDateString('vi-VN'); // Format theo kiểu Việt Nam: ngày/tháng/năm
  }
  const handleSelectPlaylist = (playlist) => {
    setEditSelectPlCollection(playlist);
  };
  const handleExport = async () => {
    try {
      // Gọi API để xuất file Excel, sử dụng params để gửi dữ liệu
      const response = await axios.get("http://localhost:5000/export", {
        responseType: "blob", 
        params: {
          type: 'plcollection', // Gửi type dưới dạng query parameter
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
      <div className="list-audios-section">
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
              <th>Username</th>
              <th>Type</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {playlists.map((playlist,index) => (
              <tr 
                key={playlist.id}
                className={`audio ${editSelectPlCollection && editSelectPlCollection.id === playlist.id ? 'selected' : ''}`}
                onClick={() => handleSelectPlaylist(playlist)}
              >
                <td>{index+1}</td>
                
                <td>{playlist.id}</td>
                <td className='audio-name'>{playlist.name}</td>
                <td className='audio-name'>{playlist.username}</td>
                <td>{playlist.type}</td>
                <td className='date'>{formatDate(playlist.date)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        {editSelectPlCollection && <EditPlaylistCollection/>}
      </div>
    </div>
  );
};

export default ListPCollection;
