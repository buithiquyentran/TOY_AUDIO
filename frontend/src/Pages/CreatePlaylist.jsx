import React, { useState,useEffect,useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";
import { FiTrash} from 'react-icons/fi'; // Import icon thùng rác
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { AudioContext } from '../Context/AudioContext'
import Audio from '../Components/Audio/Audio'

const CreatePlaylist = () => {
  const {playlistUser,setPlaylistUser} = useContext(AudioContext);
  const [playlistName, setPlaylistName] = useState("Danh Sách Phát Của Tôi");
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);
  const [audios, setAudios] = useState([]);
  const [image, setImage] = useState(null); 
  const [fileIds, setFileIds] = useState([]); 
  const navigate = useNavigate(); // To navigate users
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [toggle, setToggle] = useState(false);

  // Fetch user data from localStorage safely
  useEffect(() => {
    // if (playlistUser){
      setImage(playlistUser?.image?playlistUser.image:null)
      setFileIds(playlistUser?.songIds?playlistUser.songIds:[])
      setPlaylistName(playlistUser?.name?playlistUser.name:playlistName)
    // }
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
        try {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
        } catch (error) {
            console.error("Error parsing user data:", error);
        }
    }

  }, [playlistUser]);
  useEffect(() => {
    const fetchData = async () => {
        try {
            if (!fileIds || fileIds.length === 0) {
                setAudios([]); 
                console.error('No song IDs found in playlist');
                return;
            }
            const songPromises = fileIds.map(async (songId) => {
                try {
                    const response = await axios.get(`http://localhost:5000/api/audios/${songId}`);
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
  }, [fileIds]);

  const handleAddAudio = (audioId) => {
    const newFileIds = [...(fileIds || []), audioId];
    setFileIds(newFileIds);
    setSearchQuery(""); 
  };
  const handleDeleteAudio = (id) => {
    const newFileIds = fileIds.filter((fileId) => fileId !== id);
    setFileIds(newFileIds);
  };
  const handleToggle = ()=>{
    setToggle(!toggle)

  }
    // Hàm tìm kiếm
  const handleSearch = async () => {
    // setToggle(!toggle)
    try {
      const response = await fetch(`http://localhost:5000/api/audios/search?query=${searchQuery}`);
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Error fetching search results:', error);
    } 
  };
  const updatePlaylist = async () => {
    try {
        const response = await fetch(`http://localhost:5000/api/playlists/${playlistUser.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json', // Đặt đúng Content-Type
            },
            body: JSON.stringify({
                name: playlistName, 
                username: playlistUser.username,
                type: playlistUser.type,
                songIds: fileIds,
            }), 
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        } 
        const updatedPlaylist = await response.json(); // Parse response thành JSON
        setPlaylistUser(updatedPlaylist); 

        console.log('Audio đã cập nhật:', updatedPlaylist);
        window.location.reload();
    } catch (error) {
        console.error('Error updating audio:', error.message);
    }
  };
  const handleCreatePlaylist = async () => {
    if (playlistUser) {
      await updatePlaylist();
      return;
    }
    try {
      // Tạo playlist mới
      const playlistOfUser = await axios.post('http://localhost:5000/api/playlists/addplaylist', {
        name: playlistName,
        image: audios[0]?.image || null,
        username: user.username,
        songIds: fileIds, 
      });
  
      if (playlistOfUser.data.success) {
        // Hàm kiểm tra sự tồn tại của playlist collection
        const playlistCollectionExists = async () => {
          try {
            const encodedUsername = encodeURIComponent(user.username);
            const url = `http://localhost:5000/api/plcollections/${encodedUsername}`;
            const response = await axios.get(url);
            return response.data;  // Trả về dữ liệu collection nếu tồn tại
          } catch (error) {
            console.warn(`playlist collection ${user.username} not found, skipping...`);
            return null;  // Trả về null nếu collection không tồn tại
          }
        };
  
        // Kiểm tra sự tồn tại của playlist collection
        const collectionData = await playlistCollectionExists();
        
        if (!collectionData) {
          
          // Nếu collection chưa tồn tại, tạo mới
          try {
            await fetch('http://localhost:5000/api/plcollection/addPLcollection', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                name: `Playlist collection of ${user.username}`,
                username: user.username,
                type: 'all',
                playlistIds: [playlistOfUser.data.id] // Thêm ID của playlist vừa tạo
              }), 
            });
          } catch (error) {
            console.error('Error creating playlist collection:', error.message);
          }
        } else {
          // Nếu collection tồn tại, thêm playlist ID mới vào
          console.log('response.data.id',playlistOfUser.data.id)
          
          try {
            await axios.put(`http://localhost:5000/api/plcollections/${collectionData.id}`, {
              name:collectionData.name,
              username:collectionData.username,
              type:collectionData.type,
              playlistIds: [...collectionData.playlistIds,playlistOfUser.data.id]// ID của playlist vừa tạo
            });
          } catch (error) {
            console.error('Error updating playlist collection:', error.message);
          }
        }
        // Cập nhật playlistUser sau khi tạo thành công
        setPlaylistUser({
          id: playlistOfUser.data.id,
          name: playlistName,
          image: audios[0]?.image || null,
          username: user.username,
          songIds: fileIds,
        });
      } else {
        setMessage('Failed to create playlist');
      }
      window.location.reload();
    } catch (error) {
      console.error('Error creating playlist:', error);
      setMessage('Error creating playlist');
    }
  };
  

  const [isEditing, setIsEditing] = useState(false);

  // Hàm xử lý khi tên danh sách phát thay đổi
  const handleNameChange = (event) => {
    setPlaylistName(event.target.value);
  };

  // Hàm xử lý khi người dùng nhấn Enter hoặc click ra ngoài
  const handleBlur = () => {
    setIsEditing(false);
  };
  // Hàm xử lý khi nhấp vào tên để bắt đầu chỉnh sửa
  const handleEditClick = () => {
    setIsEditing(true);
  };
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
        handleSearch();  // Gọi hàm tìm kiếm khi nhấn Enter
    }
  };  
  return (
    <div className="user-create-playlist">
        <div className="user_create_head">
            <img src={`${process.env.PUBLIC_URL}/create_playlist.jpg`} alt="Create Playlist" />
            {isEditing ? (
            // Hiển thị input khi đang chỉnh sửa
            <input className="user-create-name"
              type="text"
              value={playlistName}
              onChange={handleNameChange}
              onBlur={handleBlur} // Thoát chế độ chỉnh sửa khi mất focus
              onKeyDown={(event) => {
                if (event.key === "Enter") handleBlur(); // Thoát khi nhấn Enter
              }}
              autoFocus
            />
          ) : (
            // Hiển thị tiêu đề khi không chỉnh sửa, và cho phép nhấp để chỉnh sửa
            <h2 className="user-create-name" onClick={handleEditClick}>
              {playlistName}
            </h2>
          )}
        </div>

        <div className="container-grid">
          {audios.length !=0 ? audios.map((audio, index) => {
            return (
                <div key={index} className="grid-item audio-cpl"> 
                    <Audio {...audio}/>
                    <i className="fa fa-window-close de-audio" aria-hidden="true" onClick={()=>handleDeleteAudio(audio.id)}></i>

                  </div>
            );
          }): <div> Chưa audio nào được thêm </div>}
        </div>
        
        {audios.length !== 0 && <span className='btn-create-playlist' onClick={handleCreatePlaylist}>Lưu</span>}
        <input
            type="text"
            placeholder="Tìm bài hát và tập podcast"
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
            className='audio-for-cpl' 
            onKeyPress={handleKeyPress}
        />
        <span onClick={()=>{handleToggle();handleSearch();}} className='search-btn'>
          Tìm kiếm
          <span>
            {toggle?<FaChevronDown/>:<FaChevronUp/>}
          </span>
        </span>

        {toggle && <div className="search-results">
            {searchResults.map((audio) => (
                <div key={audio.id} className ='add-audio'>
                    <div className='add-name'>{audio.name}</div>
                    <div className="add-singer">{audio.singer.reduce ((previousValue, currentValue)=>{
                      return  previousValue ?(previousValue +' x '+ currentValue): currentValue},'')}
                    </div>
                    <div className = 'add' onClick={() => handleAddAudio(audio.id)}>Thêm</div>
                </div>
            ))}
        </div>} 
        {message && <p>{message}</p>}
    </div>
  );
  };

export default CreatePlaylist;
