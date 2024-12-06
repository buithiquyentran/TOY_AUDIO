import { createContext, useState,useRef,useEffect} from 'react';

export const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
    const [currentAudio, setCurrentAudio] = useState(null);
    const [currentPlaylist, setcurrentPlaylist] = useState(null);
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef();
    const [playlistUser, setPlaylistUser] = useState(null); 
    
    useEffect(() => {
        const savedAudio = localStorage.getItem('currentAudio');
        const savedPlaylist = localStorage.getItem('currentPlaylist');
        const savedSelectedPlaylist = localStorage.getItem('selectedPlaylist');
        
        if (savedAudio) {
            setCurrentAudio(JSON.parse(savedAudio)); // Khôi phục bài hát đã lưu
        }
        if (savedPlaylist) {
            setcurrentPlaylist(JSON.parse(savedPlaylist)); 
        }
        if (savedSelectedPlaylist) {
            setSelectedPlaylist(JSON.parse(savedSelectedPlaylist)); 
        }
    }, []);
    useEffect(() => {
        if (audioRef.current) {  // Chỉ thực hiện nếu audioRef đã được gán
            localStorage.setItem('currentAudio', JSON.stringify(currentAudio));
            localStorage.setItem('currentPlaylist', JSON.stringify(currentPlaylist));
            if (isPlaying) {
                audioRef.current.play();  // Phát nhạc
            } else {
                audioRef.current.pause();  // Tạm dừng nhạc
            }
        }
    },[currentAudio]);  
    useEffect(() => {
        if (selectedPlaylist) {  // Chỉ thực hiện nếu audioRef đã được gán
            localStorage.setItem('selectedPlaylist', JSON.stringify(selectedPlaylist));
        }
    },[selectedPlaylist]); 
    return (
        <AudioContext.Provider value={{ 
            currentAudio, setCurrentAudio,currentPlaylist, setcurrentPlaylist,isPlaying, setIsPlaying,audioRef ,playlistUser, setPlaylistUser, selectedPlaylist, setSelectedPlaylist
            }}>
        {children}
        </AudioContext.Provider>
    );
}; 