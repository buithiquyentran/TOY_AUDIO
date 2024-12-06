import React, { useEffect, useState,useContext  } from 'react';
import axios from 'axios'; 
import './EditPlaylist.css' 
import {EditAudioContext} from '../../Context/EditAudioContext.jsx'
import DropdownItemName from '../DropdownItemName/DropdownItemName.jsx';
const EditPlaylist = () => {
  const {editSelectPlaylist,setEditSelectPlaylist} = useContext(EditAudioContext);
  const [type, setType] = useState(null); 
  const [imageTemp, setimageTemp] = useState(null); 
  const [image, setImage] = useState(null); 
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
    const fetchData = async () => {
        try {
            setType(editSelectPlaylist.type)
            setImage(editSelectPlaylist.image)
            setFileIds(editSelectPlaylist.songIds)

            if (!editSelectPlaylist.songIds || editSelectPlaylist.songIds.length === 0) {
                setAudios([]); 
                console.error('No song IDs found in playlist');
                return;
            }

            const songPromises = editSelectPlaylist.songIds.map(async (songId) => {
                try {
                    const response = await axios.get(`http://localhost:5000/audios/${songId}`);
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
  }, [editSelectPlaylist]);

  const handleAddAudio = (audioId) => {
    let newFileIds = []; // Sử dụng `let` để cho phép gán lại
    if (!fileIds) {
        newFileIds = [audioId];
    } else {
        newFileIds = [...fileIds, audioId];
    }
    setFileIds(newFileIds); // Cập nhật danh sách file IDs
    setEditSelectPlaylist((prev) => ({
        ...prev,
        songIds: newFileIds, // Cập nhật danh sách bài hát trong playlist
    }));
    // fetchData() // Chỉ gọi nếu cần làm mới dữ liệu từ server
};


  const handleDeleteAudio = (id) => {
    const newFileIds = fileIds.filter((fileId) => fileId !== id);
    setFileIds(newFileIds);
    setAudios(audios.filter((audio) => audio.id !== id));
    setEditSelectPlaylist(prev => ({
      ...prev,
      songIds: newFileIds,
    }));
    // fetchData();
  };

  const handleTypeChange = (event) => {
    setType(event.target.value);
    // setEditSelectPlaylist({ ...editSelectPlaylist, type: event.target.value });
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/playlist/${editSelectPlaylist.id}`);
      window.location.reload();

    } catch (error) {
      console.error('Error deleting audio:', error);
    }
  };

  const handleClose = () => {
    setEditSelectPlaylist(null);
  };
  const handleReset = () => {
    setEditSelectPlaylist({});
    setFileIds([]);
    setAudios([])
    setType(null);
    setImage(null);
  };

  // Hàm tìm kiếm
  const handleSearch = async () => {
    try {
      const response = await fetch(`http://localhost:5000/playlist/search?query=${searchTerm}`);
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
    setEditSelectPlaylist(result) 
    setSearchTerm(result.name); 
    setDropdownVisible(false); // Ẩn dropdown
  };

  const uploadImage = async () => {
    if (!image) {
      console.error('No image to upload!');
      return;
    }
    const formData = new FormData();
    // Thêm các thông tin cần thiết vào FormData
    formData.append('id',editSelectPlaylist.id); // Thêm ID của audio
    formData.append('file', image); // Thêm file ảnh được chọn
    try {
        const response = await fetch(`http://localhost:5000/upload`, {
            method: 'POST',
            body: formData // Gửi FormData thay vì JSON
        });

        if (!response.ok) {
            throw new Error(`Upload image error! status: ${response.status}`);
        }
        const data = await response.json(); // Nếu cần phản hồi từ server
        console.log('Image uploaded successfully:', data);
        return data.file_url;

        // Cập nhật danh sách audio hoặc giao diện nếu cần
    } catch (error) {
        console.error('Error uploading image:', error.message);
    }
  };
  const handleAdd= async () => {
    try {
        // Gọi API lấy ID của audio cuối cùng
        const lastAudioResponse = await fetch('http://localhost:5000/lastplaylistid');
        const lastAudioData = await lastAudioResponse.json();
        let newId;
        if (lastAudioData && lastAudioData.id) {
            let lastAudioId = lastAudioData.id;
            let idNumber = (parseInt(lastAudioId.slice(2)) + 1).toString();
            while (idNumber.length < 3) {
                idNumber = '0' + idNumber;
            }
            newId = "PL" + idNumber;
        } else {
            newId = "PL" + '0001';
        }
        const imageUrl = await uploadImage();
        const response = await fetch('http://localhost:5000/addplaylist', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Đặt đúng Content-Type
            },
            body: JSON.stringify({
                id: newId, // Truyền ID mới vào request
                name:editSelectPlaylist?.name, 
                username:editSelectPlaylist?.username,
                type:type,
                image: imageUrl ? imageUrl : image,
                songIds:fileIds?fileIds:[],
            }), 
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        } 
        // const updatedPlaylist = await response.json(); // Parse response thành JSON
        // console.log('Audio đã cập nhật:', updatedPlaylist);
        window.location.reload();
    } catch (error) {
        console.error('Error updating audio:', error.message);
    }
  };
  const handleUpdate = async () => {
    try {
        const imageUrl = await uploadImage();
        console.log(imageUrl)
        const response = await fetch(`http://localhost:5000/playlist/${editSelectPlaylist.id}`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json', // Đặt đúng Content-Type
            },
            body: JSON.stringify({
                name: editSelectPlaylist.name, 
                username: editSelectPlaylist.username,
                type:type,
                image: imageUrl?imageUrl:image,
                songIds: fileIds,
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        } 
        const updatedPlaylist = await response.json(); // Parse response thành JSON
        console.log('Audio đã cập nhật:', updatedPlaylist);
        setimageTemp(null)
        // fetchData()
        window.location.reload();
    } catch (error) {
        console.error('Error updating audio:', error.message);
    }
  };
  const handleFileChange = (e, filename) => {
    const f = e.target.files[0];
    if (!f) {
      console.error('No file selected!');
      return;
    }
    // Kiểm tra loại file dựa trên mime type
    const fileType = f.type;
    console.log('fileType',fileType)
    const fileUrl = URL.createObjectURL(f); // Tạo URL cho ảnh
    if (fileType.startsWith('image/')) {
      console.log('Selected file is an image');
      setimageTemp(fileUrl);
      setImage(f)
    } else if (fileType.startsWith('audio/')) {
      console.log('Selected file is an audio');
      setfileTemp(fileUrl)
      setFile (f)
    } else {
      console.error('Unsupported file type');
    }
    console.log('Selected file:', f); // Kiểm tra file đã được chọn
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
        
      <div className='form-name border-top'>THÔNG TIN PLAYLIST</div>
      <form id="audioForm">
        <div className="section">     
          <label className="section-name" htmlFor="audioId">Id</label>
          <input type="text" id="audioId" disabled value={editSelectPlaylist?.id || ''} />
        </div>
        <div className="section">
          <label htmlFor="options" className='section-name'>Type</label>
          <select className='select' id="options" name="options"  value ={type} onChange={handleTypeChange}>
            <option value="all">All</option>
              <option value="music">Music</option>
              <option value="podcast">Podcast</option>
          </select>
        </div>
        <label className="section-name" htmlFor="audioName">Tên</label>
        <input 
          type="text" 
          id="audioName" 
          value={editSelectPlaylist?.name || ''} 
          onChange={(e) => setEditSelectPlaylist({ ...editSelectPlaylist, name: e.target.value })} 
        />

        <label  className="section-name" htmlFor="artist">Username</label>
        <input 
          type="text" 
          id="artist" 
          disabled
          value={editSelectPlaylist?.username || user?.username} 
          // onChange={(e) => setEditSelectPlaylist({ ...editSelectPlaylist, username: e.target.value })} 
         />

        <div className="section">
          <label className="section-name" htmlFor="image">Image</label>
          
          {/* Preview ảnh hiện tại */}
          <div className="image-preview">
            <img src={imageTemp?imageTemp:editSelectPlaylist.image} alt="Preview" />
          </div>
          <input type="file" className='change-btn' onChange={(e) => handleFileChange(e, 'image')}/>
          
        </div>

        <DropdownItemName
          audios={audios}
          onAddAudio={handleAddAudio}
          onDeleteAudio={handleDeleteAudio}
          type='Audio'
        />
        
        <div className="control-btn">
          <div className='btn' type="button"  onClick={handleAdd}>THÊM</div>
          <div className='btn' type="button" onClick={handleUpdate}>LƯU</div>
          <div className='btn' type="button" onClick={handleDelete}>XÓA</div>
          <div className='btn' type="reset" onClick={handleReset}>RESET</div>
        </div>
      </form>
      
  </div>
  )
      
}

export default EditPlaylist;
