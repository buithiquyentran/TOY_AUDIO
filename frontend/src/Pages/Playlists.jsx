import React, { useEffect, useState } from "react";
import axios from 'axios';
import Playlist from "../Components/Playlist/Playlist";
const Playlists = ()=>{
    const [playlists, setPlaylists] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/playlists/allplaylists'); // Gọi API ở backend
                const playlistSystem = response.data.filter(playlist => playlist.username === 'B2113345' && playlist.type !=='all');  // playlists cua admin          
                setPlaylists(playlistSystem); // Lưu dữ liệu vào state
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }; 

        fetchData();
    }, []);
    return ( 
        <div className="playlists-page">
            {playlists.map ((playlist,index)=>{
                return (<Playlist key={index} {...playlist}/>)
            })}
            
        </div>
    )
}
export default Playlists