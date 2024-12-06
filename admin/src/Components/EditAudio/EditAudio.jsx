import React, { useEffect, useState,useContext  } from 'react';
import axios from 'axios'; // Sử dụng axios để gửi yêu cầu tới backend
import {EditAudioContext} from '../../Context/EditAudioContext.jsx'
import './EditAudio.css'
const EditAudio = () => {
  const {editSelectAudio,setEditSelectAudio} = useContext(EditAudioContext);
  const [type, setType] = useState(null); 
  const [imageTemp, setimageTemp] = useState(null); 
  const [fileTemp, setfileTemp] = useState(null); 
  const [image, setImage] = useState(null); 
  const [file, setFile] = useState(null); 
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  useEffect(()=>{
    setType(editSelectAudio.type);
  },[editSelectAudio]);
  
     // Hàm xử lý khi người dùng thay đổi lựa chọn trong dropdown
  const handleTypeChange = (event) => {
    setType(event.target.value);
    setEditSelectAudio({ ...editSelectAudio, type: event.target.value });
  };

  const handleDelete = async () => {
    try {
      alert(editSelectAudio.id);  // Hiển thị ID của playlist
      await axios.delete(`http://localhost:5000/api/audios/${editSelectAudio.id}`);
      console.log()
      window.location.reload();
    } catch (error) {
      console.error('Error deleting audio:', error);
    }
  };
  const handleAdd= async () => {
    try {
        // Gọi API lấy ID của audio cuối cùng
        const lastAudioResponse = await fetch('http://localhost:5000/lastaudioid');
        const lastAudioData = await lastAudioResponse.json();
        let newId;
        if (lastAudioData && lastAudioData.id) {
            let lastAudioId = lastAudioData.id;
            let idNumber = (parseInt(lastAudioId.slice(1)) + 1).toString();
            while (idNumber.length < 4) {
                idNumber = '0' + idNumber;
            }
            newId = (editSelectAudio.type === 'podcast' ? 'P' : 'M') + idNumber;
        } else {
            newId = (editSelectAudio.type === 'podcast' ? 'P' : 'M') + '0001';
        }
  
        const imageUrl = await uploadImage();
        const fileUrl = await uploadFile();
  
        const response = await fetch('http://localhost:5000/addaudio', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }, 
            body: JSON.stringify({
                id: newId, // Truyền ID mới vào request
                name: editSelectAudio.name, 
                singer: editSelectAudio.singer,
                type: editSelectAudio.type,
                image: imageUrl ? imageUrl : editSelectAudio.image,
                file: fileUrl ? fileUrl : editSelectAudio.file,
            }), 
        });
  
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        } 
        const updatedPlaylist = await response.json();
        console.log('Audio đã cập nhật:', updatedPlaylist);
        window.location.reload();
    } catch (error) {
        console.error('Error updating audio:', error.message);
    }
  };
  
  const updateAudio = async () => {
    try {
        const imageUrl = await uploadImage();
        const fileUrl = await uploadFile();
        const response = await fetch(`http://localhost:5000/audio/${editSelectAudio.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json', // Đặt đúng Content-Type
            },
            body: JSON.stringify({ 
                name: editSelectAudio.name, 
                singer: editSelectAudio.singer,
                type: editSelectAudio.type,
                image: imageUrl?imageUrl:editSelectAudio.image,
                file: fileUrl?fileUrl:editSelectAudio.file,
            }), // Gửi dữ liệu JSON
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        } 
        const updatedAudio = await response.json(); // Parse response thành JSON
        console.log('Audio đã cập nhật:', updatedAudio);
        setimageTemp(null)
        window.location.reload();
        // Cập nhật danh sách audio hoặc giao diện nếu cần
    } catch (error) {
        console.error('Error updating audio:', error.message);
    }
  };
  const handleClose = () => {
    setEditSelectAudio(null);
    setEditVisible(false);
  };
  const handleReset = () => {
    setEditSelectAudio({}); 
  };

  // Hàm tìm kiếm
  const handleSearch = async () => {
    try {
      const response = await fetch(`http://localhost:5000/audio/search?query=${searchTerm}`);
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
    setEditSelectAudio(result) 
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
    formData.append('id', editSelectAudio.id); // Thêm ID của audio
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
  const uploadFile = async () => {
    if (!file) {
      console.error('No file to upload!');
      return;
    }
    const formData = new FormData();
    // Thêm các thông tin cần thiết vào FormData
    formData.append('id', editSelectAudio.id); // Thêm ID của audio
    formData.append('file', file); // Thêm file ảnh được chọn
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

      <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} type="text" id="searchInput" placeholder="Tìm kiếm audio..." onKeyPress={handleKeyPress} />
      
      {/* Search resultst */}
      {isDropdownVisible && searchResults.length > 0 && (
        <div className="dropdown-results">
          {searchResults.map((result) => (
            <div className="result-item" key={result.id} onClick={() => handleResultClick(result)}>
              {result.name} - {result.singer} {/* Hiển thị tên audio và nghệ sĩ */}
            </div>
          ))}
        </div>
      )}
        
      <div className='form-name border-top'>THÔNG TIN AUDIO</div>
      <form id="audioForm">
        <div className="section">     
          <label className="section-name" htmlFor="audioId">Id</label>
          <input type="text" id="audioId" disabled value={editSelectAudio?.id || ''} />
        </div>
        <div className="section">
          <label htmlFor="options" className='section-name'>Type</label>
          <select className='select' id="options" name="options"  value ={type} onChange={handleTypeChange}>
              <option value="music">Music</option>
              <option value="podcast">Podcast</option>
          </select>
        </div>
        <label className="section-name" htmlFor="audioName">Tên</label>
        <input 
          type="text" 
          id="audioName" 
          value={editSelectAudio?.name || ''} 
          onChange={(e) => setEditSelectAudio({ ...editSelectAudio, name: e.target.value })} 
        />

        <label className="section-name" htmlFor="artist">Ca sĩ/Podcaster</label>
        <input 
          type="text" 
          id="artist" 
          value={editSelectAudio?.singer || ''} 
          onChange={(e) => {
            const singerArray = e.target.value.split(',').map(singer => singer.trim());
            setEditSelectAudio({ ...editSelectAudio, singer: singerArray })
          }}
        />

        <div className="section">
          <label className="section-name" htmlFor="image">Image</label>
          
          {/* Preview ảnh hiện tại */}
          <div className="image-preview">
            <img src={imageTemp?imageTemp:editSelectAudio.image} alt="Preview" />
          </div>
          
          <input type="file" className='change-btn' onChange={(e) => handleFileChange(e, 'image')}/>
        </div>

        <div className="section">
          <label className="section-name" htmlFor="file">File</label>
          {/* Hiển thị tên file nếu có */}
          {editSelectAudio?.file && (
              <div className="image-preview">
                <audio src={fileTemp?fileTemp:editSelectAudio.file} controls style={{width: '190px',height: '30px'}}></audio>
              </div>
          )} 
          <input className='change-btn' type="file" id="file" onChange={(e) => handleFileChange(e, 'audio')}/>

          {/* <div className='change-btn' onChange={(e) => handleFileChange(e, 'image')}>Change</div> */}
        </div>
        <div className="control-btn">
          <div className='btn' type="button"onClick={handleAdd}>THÊM</div>
          <div className='btn' type="button" onClick={updateAudio}>LƯU</div>
          <div className='btn' type="button" onClick={handleDelete}>XÓA</div>
          <div className='btn' type="reset" onClick={handleReset}>RESET</div>
        </div>
    </form>

  </div>
  )
      
}

export default EditAudio;
