import React, { useEffect, useState,useContext  } from 'react';
import axios from 'axios'; 
import './EditPlaylistCollection.css' 
import {EditAudioContext} from '../../Context/EditAudioContext.jsx'
import DropdownItemName from '../DropdownItemName/DropdownItemName.jsx';
const EditPlaylistCollection = () => {
  const { editSelectPlCollection, setEditSelectPlCollection} = useContext(EditAudioContext);
  const [type, setType] = useState(null);  
  const [fileIds, setFileIds] = useState([]); 
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [audios, setAudios] = useState([]);

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
  useEffect(() => {
    const fetchData= async () => {
          setType(editSelectPlCollection.type)
          setFileIds(editSelectPlCollection.playlistIds?editSelectPlCollection.playlistIds:[])
        try {
          if (editSelectPlCollection.playlistIds?.length == 0 | editSelectPlCollection.playlistIds==null) {
              console.error('No song IDs found in playlists');
              setAudios([]); 
              return;
          }
          // Tạo các promise để gọi API lấy chi tiết các bài hát
          const songPromises = editSelectPlCollection.playlistIds.map(songId =>
              axios.get(`http://localhost:5000/playlists/${songId}`)
          );
          // Chờ tất cả promise hoàn thành và lấy kết quả
          const songResponses = await Promise.all(songPromises);
          // Lưu thông tin các bài hát vào state
          const audiosData = songResponses.map(response => response.data);
          setAudios(audiosData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    fetchData();
  }, [editSelectPlCollection]);
 
  const handleAddAudio = (playlistId) => {
    const newFileIds= [...fileIds, playlistId];
    setFileIds(newFileIds);
    setEditSelectPlCollection(prev => ({
      ...prev,
      playlistIds: newFileIds,
    }));
    // fetchData();
  };
  const handleDeleteAudio = (id) => {
    const newFileIds = fileIds.filter((fileId) => fileId !== id);
    setFileIds(fileIds.filter((fileId) => fileId !== id));
    setEditSelectPlCollection(prev => ({
      ...prev,
      playlistIds: newFileIds,
    }));
    fetchData()
  };

  const handleTypeChange = (event) => {
    setType(event.target.value);
    setEditSelectPlCollection({ ...editSelectPlCollection, type: event.target.value });
  };

  const handleDelete = async () => {
    try {
      const confirmed = window.confirm(
        `Bạn có chắc chắn muốn xóa playlist collection ${editSelectPlCollection.name}?`
      );
      if (confirmed) {
        // Gửi yêu cầu xóa tới backend
        await axios.delete(`http://localhost:5000/api/plcollection/${editSelectPlCollection.id}`, {
          data: { username: editSelectPlCollection.username }, // Gửi username để backend kiểm tra quyền
        });
        alert('Xóa thành công!');
        // window.location.reload();
      }
    } catch (error) {
      console.error('Error deleting playlist collection:', error);
      alert('Không thể xóa. Vui lòng thử lại.');
    }
  };
  
  const handleAdd= async () => {
    try {
        const response = await fetch('http://localhost:5000/addPLcollection', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Đặt đúng Content-Type
            },
            body: JSON.stringify({
                name: editSelectPlCollection.name, 
                username: editSelectPlCollection.username,
                type: type,
                playlistIds: fileIds,
            }), 
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        } 
        const updatedPlaylist = await response.json(); // Parse response thành JSON
        console.log('Audio đã cập nhật:', updatedPlaylist);
        window.location.reload();
    } catch (error) {
        console.error('Error updating audio:', error.message);
    }
  };
  
  const handleClose = () => {
    setEditSelectPlCollection(null);
  };
  const handleReset = () => {
    setEditSelectPlCollection({});
    setFileIds([])
    setAudios(null)
  };

  // Hàm tìm kiếm
  const handleSearch = async () => {
    try {
      const response = await fetch(`http://localhost:5000/plcollection/search?query=${searchTerm}`);
      const data = await response.json();
      setSearchResults(data);  // Cập nhật kết quả tìm kiếm
      setDropdownVisible(data.length > 0); // Hiển thị dropdown nếu có kết quả
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  // Xử lý khi người dùng nhấn phím Enter
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();  // Gọi hàm tìm kiếm khi nhấn Enter
    }
  };

  const handleResultClick = (result) => {
    setEditSelectPlCollection(result) 
    setSearchTerm(result.name); 
    setDropdownVisible(false); // Ẩn dropdown
  };

  const updatePlaylist = async () => {
    try {
        const response = await fetch(`http://localhost:5000/plcollection/${editSelectPlCollection.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json', // Đặt đúng Content-Type
            },
            body: JSON.stringify({
                name: editSelectPlCollection.name, 
                username: editSelectPlCollection.username,
                type: editSelectPlCollection.type,
                playlistIds: fileIds,
            }), 
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        } 
        const updatedPlaylist = await response.json(); // Parse response thành JSON
        console.log('Audio đã cập nhật:', updatedPlaylist);
        window.location.reload();
    } catch (error) {
        console.error('Error updating audio:', error.message);
    }
  };
  
  return (
    <div class="form-section">
      <i class="fa fa-window-close close" aria-hidden="true" onClick={()=>handleClose()}></i>

      <div className='form-name'>TÌM KIẾM</div>

      <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} type="text" id="searchInput" placeholder="Tìm kiếm playlist..." onKeyPress={handleKeyPress} />
      
      {/* Search resultst */}
      {isDropdownVisible && searchResults.length > 0 && (
        <div className="dropdown-results">
          {searchResults.map((result) => (
            <div className="result-item" key={result.id} onClick={() => handleResultClick(result)}>
              {result.name} - {result.username}
            </div>
          ))}
        </div>
      )}
        
      <div className='form-name border-top'>THÔNG TIN PLAYLIST COLLECTION</div>
      <form id="audioForm">
        <div className="section">     
          <label className="section-name" htmlFor="audioId">Id</label>
          <input type="text" id="audioId" disabled value={editSelectPlCollection?.id || ''} />
        </div>
        <div className="section">
          <label htmlFor="options" className='section-name'>Type</label>
          <select className='select' id="options" name="options" value ={type} onChange={handleTypeChange}>
              <option value="all">All</option>
              <option value="music">Music</option>
              <option value="podcast">Podcast</option>
          </select>
        </div>
        <label className="section-name" htmlFor="audioName">Tên</label>
        <input 
          type="text" 
          id="audioName" 
          value={editSelectPlCollection?.name || ''} 
          onChange={(e) => setEditSelectPlCollection({ ...editSelectPlCollection, name: e.target.value })} 
        />

        <label className="section-name" htmlFor="artist">Username</label>
        <input 
          type="text" 
          id="artist" 
          disabled
          value={editSelectPlCollection?.username || user?.username} 
          // onChange={(e) => setEditSelectPlCollection({ ...editSelectPlCollection, username: e.target.value })} 
         />
        <DropdownItemName
          audios={audios}
          onAddAudio={handleAddAudio}
          onDeleteAudio={handleDeleteAudio}
          type='Playlist'
        />
        
        <div className="control-btn">
          <div className='btn' type="button" onClick={handleAdd}>THÊM</div>
          <div className='btn' type="button" onClick={updatePlaylist}>LƯU</div>
          <div className='btn' type="button" onClick={handleDelete}>XÓA</div>
          <div className='btn' type="reset"  onClick={handleReset}>RESET</div>
        </div>
      </form>
      
    </div>
  )
      
}

export default EditPlaylistCollection;
