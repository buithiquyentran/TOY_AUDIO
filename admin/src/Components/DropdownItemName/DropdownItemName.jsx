import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import './DropdownItemName.css';
import { FiTrash} from 'react-icons/fi'; // Import icon thùng rác
import { GrAdd } from "react-icons/gr";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const DropdownItemName = ({ audios, onAddAudio, onDeleteAudio, type }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showSearchBar, setShowSearchBar] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [toggle, setToggle] = useState(false);

    const toggleDropdown = () => setIsOpen(!isOpen);
    const handleSearch = async () => {
        try {
          const response = await fetch(`http://localhost:5000/${type}/search?query=${searchQuery}`);
          const data = await response.json();
          setSearchResults(data); 
        } catch (error) {
          console.error('Error fetching search results:', error);
        } 
    };
    const handleToggle = ()=>{
        setToggle(!toggle)
    
      }
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSearch();  // Gọi hàm tìm kiếm khi nhấn Enter
        }
    };
    const handleAddSearchAudio = (audio) => {
        onAddAudio(audio.id);
        setSearchQuery(""); // Xóa nội dung tìm kiếm
        // setSearchResults([]); // Xóa kết quả tìm kiếm
    };
     // Xử lý khi người dùng nhấn phím Enter
   
    return (
        <div className="dropdown_singIds">
            <div onClick={toggleDropdown} className="form-name">
                {`Danh Sách Các ${type}`}
            </div>
            {isOpen && (
                <div className="">
                    <div className="list-item">
                        {audios && audios.map((audio) => (
                            <li key={audio.id} className="list-item-id">
                                <span>{audio ? audio.name : 'Unknown Audio'}</span>
                                <span onClick={() => onDeleteAudio(audio.id)}> <FiTrash className='icon'/> </span>
                            </li>
                        ))}
                        <div className='add-item'>
                            <GrAdd className="lib-icon lib-icon-add icon" onClick={() => setShowSearchBar(!showSearchBar)}/>
                            <span className="search-bar">
                                <input 
                                    type="text" 
                                    value={searchQuery} 
                                    onChange={(e) => setSearchQuery(e.target.value)} 
                                    placeholder="Thêm bài hát" 
                                    onKeyPress={handleKeyPress}
                                />
                                {/* <div onClick={handleSearch}>Tìm kiếm</div> */}
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
                                            <div className = 'add' onClick={() => handleAddSearchAudio(audio)}>Thêm</div>
                                        </div>
                                    ))}
                                </div>}
                            </span>
                        
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default DropdownItemName;
