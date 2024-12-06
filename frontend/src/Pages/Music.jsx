import React, { useEffect, useState} from 'react';
import axios from 'axios';
import Audio from '../Components/Audio/Audio'
import HomeYouMayLike from '../Components/HomeYouMayLike/HomeYouMayLike'

const Music =  ()=>{
    const [audios, setAudios] = useState([]);
    const [playlists, setPlaylists] = useState([]);
    // Gọi API từ backend để lấy dữ liệu
    useEffect(() => {
        const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:5000/allaudios'); 
            const songs = response.data.filter(audio => audio.id.startsWith('M'));            
            setAudios(songs); 

            const response1 = await axios.get('http://localhost:5000/allplaylists'); 
            const  pls= response1.data.filter(pl => pl.type ==='music');            
            setPlaylists(pls); 

        } catch (error) {
            console.error('Error fetching data:', error);
        }
        };
        fetchData();
    }, []);
    return (
        <div>
            <div>
                {playlists.map((playlist, index) => {
                    return (
                        <div key={index}> 
                            <HomeYouMayLike playlist = {playlist}/>
                        </div>
                    );
                })}
            </div>
            <div className="container-grid"> 
                {audios.map((audio, index) => {
                    return (
                        <div key={index} className="grid-item"> 
                            <Audio {...audio}/>
                        </div>
                    );
                })}
            </div>
        </div>
    )
}
export default Music