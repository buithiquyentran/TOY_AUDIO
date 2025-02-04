import React, { useRef, useState, useContext, useEffect  } from "react";
import axios from 'axios';

import { AudioContext } from '../../Context/AudioContext'
import Audio from '../Audio/Audio'

import './NowPlaying.css' 


const NowPlaying = () => {
    const { currentAudio, setCurrentAudio, currentPlaylist, isPlaying, setIsPlaying, audioRef } = useContext(AudioContext);
    const [isRepeat, setIsRepeat] = useState(false);
    const [isRandom, setIsRandom] = useState(false);
    const [audios, setAudios] = useState([]);
    const progressRef = useRef(null); // Tạo ref cho thanh tiến độ
    const [currentTime, setCurrentTime] = useState(0); // Thời gian hiện tại
    const [duration, setDuration] = useState(0); // Thời lượng audio
    const [rotation, setRotation] = useState(0); // Góc quay của đĩa
    const animationRef = useRef(null); // Lưu tham chiếu animation
    useEffect(() => {
        const fetchData = async () => {
            try {
                const allSongIds = currentPlaylist.songIds || [];
                if (allSongIds.length === 0) {
                    console.error('No song IDs found in playlists');
                    return;
                }
                const songPromises = allSongIds.map(songId =>
                    axios.get(`http://localhost:5000/api/audios/${songId}`)
                );
                const songResponses = await Promise.all(songPromises);
                const audiosData = songResponses.map(response => response.data);
                setAudios(audiosData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();

    }, [currentPlaylist]);
    // Hàm cập nhật góc quay
    const rotateDisc = () => {
        setRotation((prev) => prev + 0.4); // Tăng góc quay
        animationRef.current = requestAnimationFrame(rotateDisc);
    };
    // Hàm phát/tạm dừng nhạc
    const togglePlayPause = () => {
        if (isPlaying) {
            audioRef.current.pause();
            cancelAnimationFrame(animationRef.current); // Dừng hiệu ứng quay
        } else {
            audioRef.current.play();
            animationRef.current = requestAnimationFrame(rotateDisc); // Bắt đầu quay
        }
        setIsPlaying(!isPlaying);
    };
    
    const handleRepeat = () => setIsRepeat(!isRepeat);
    const handleRandom = () => setIsRandom(!isRandom);

    const handleNext = () => {
        if (audios.length === 0) {
            // alert('troi oi')
            return; // Kiểm tra nếu danh sách rỗng
        }
        let nextIndex;
        if (isRandom) {
            do {
                nextIndex = Math.floor(Math.random() * audios.length);
            } while (audios[nextIndex].id === currentAudio.id); 
        } else {
            const currentIndex = audios.findIndex(audio => audio.id === currentAudio.id);
            nextIndex = (currentIndex + 1) % audios.length; 
        }
        
        setCurrentAudio(audios[nextIndex]);
        setIsPlaying(true); // Đảm bảo phát bài hát mới
    };
    
    const handlePrev = () => {
        let prevIndex = isRandom ? Math.floor(Math.random() * audios.length) : (audios.findIndex(audio => audio.id === currentAudio.id) - 1 + audios.length) % audios.length;
        setCurrentAudio(audios[prevIndex]);
        setIsPlaying(true);
    };
    const handlePlay = async () => {
        try {
          await fetch(`http://localhost:5000/api/audios/${currentAudio.id}/view`, {
            method: 'PUT',
          });
        } catch (error) {
          console.error('Error updating view count:', error);
        }
    };

    const handleClose = () => {
        setCurrentAudio(null);
    };
   
    useEffect(() => {
        const handleEnded = () => {
            console.log("Audio ended");
            if (audioRef.current) {
                if (isRepeat) {
                    audioRef.current.currentTime = 0;
                    audioRef.current.play();
                } else {
                    handleNext(); // Đảm bảo luôn lấy phiên bản mới nhất
                }
            }
        };
    
        if (audioRef.current) {
            console.log("EventListener added");
            audioRef.current.addEventListener("ended", handleEnded);
        }
        return () => {
            if (audioRef.current) {
                console.log("EventListener removed");
                audioRef.current.removeEventListener("ended", handleEnded);
            }
        };
    }, [currentAudio, audios, isRepeat, isRandom]); // Đảm bảo phụ thuộc được cập nhật
    
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const updateProgress = () => {
            const progressPercent = Math.floor((audio.currentTime / audio.duration) * 100);
            if (progressRef.current) {
                progressRef.current.value = progressPercent;
                progressRef.current.style.background = `linear-gradient(to right, var(--primary-color) ${progressPercent}%, #D3D3D3 ${progressPercent}%)`;
            }
        };

        audio.addEventListener("timeupdate", updateProgress);

        return () => {
            audio.removeEventListener("timeupdate", updateProgress);
        };
    }, [audioRef]);

    // Xử lý tua bài hát khi người dùng kéo thanh tiến độ
    const handleProgressChange = () => {
        const audio = audioRef.current;
        if (audio && progressRef.current) {
            const seekTime = (progressRef.current.value / 100) * audio.duration;
            audio.currentTime = seekTime;
        }
    };
    useEffect(() => {
        const audio = audioRef.current;

        // Cập nhật thời lượng audio khi metadata được load
        const handleLoadedMetadata = () => {
            setDuration(audio.duration);
        };

        // Cập nhật thời gian hiện tại khi audio phát
        const handleTimeUpdate = () => {
            setCurrentTime(audio.currentTime);
        };

        // Lắng nghe sự kiện
        audio.addEventListener("loadedmetadata", handleLoadedMetadata);
        audio.addEventListener("timeupdate", handleTimeUpdate);

        // Cleanup khi component bị unmount
        return () => {
            audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
            audio.removeEventListener("timeupdate", handleTimeUpdate);
        };
    }, [currentAudio]);

    // Hàm định dạng thời gian (giây -> phút:giây)
    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
    };
    return (
        <div className="nowplaying">
            <i className="fa fa-window-close close" aria-hidden="true" onClick={() => {handleClose()}}></i>
            <div className="dashboard">
                <header>
                    <h4>Now playing:</h4>
                    <h2 className="playing-song-name">{currentAudio.name}</h2>
                </header>
                <div className="cd">
                    <div
                        className="cd-thumb"
                        style={{
                            backgroundImage: `url(${currentAudio.image})`,
                            transform: `rotate(${rotation}deg)`
                        }}
                    ></div>
                </div>
                <div className="control">
                    <div className="btn btn-repeat" onClick={handleRepeat} style={{ color: isRepeat ? 'var(--primary-color)' :'#8a6e1e' }}>
                        <i className="fas fa-redo"></i>
                        {isRepeat && <div className="dot"></div>}
                    </div>
                    <div className="btn btn-prev" onClick={handlePrev}>
                        <i className="fas fa-step-backward"></i>
                    </div>
                    <div className="btn btn-toggle-play" onClick={togglePlayPause}>
                        <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
                    </div>
                    <div className="btn btn-next" onClick={handleNext}>
                        <i className="fas fa-step-forward"></i>
                    </div>
                    <div className="btn btn-random" onClick={handleRandom} style={{ color: isRandom ? 'var(--primary-color)' :'#8a6e1e' }}>
                        <i className="fas fa-random"></i>
                        {isRandom && <div className="dot"></div>}
                    </div>
                </div>
                <div className="time-controls">
                    <span className="time">{formatTime(currentTime)}</span>
                    <input 
                        id="progress" 
                        className="progress" 
                        type="range" 
                        ref={progressRef} 
                        defaultValue="0" 
                        step="1" 
                        min="0" 
                        max="100" 
                        onInput={handleProgressChange} // Thêm sự kiện khi thay đổi
                    />
                    <span className="time">{formatTime(duration)}</span>
                </div>
                <audio ref={audioRef} onPlay={handlePlay} src={currentAudio.file} controls={false} autoPlay={false} />
            </div>
            <div className="container-grid nowplaying-playlist">
                <h5>Danh sách phát</h5>
                {audios.length > 0 ? (
                    audios.map((audio, index) => (
                        <Audio key={index} {...audio} onClick={() => setCurrentAudio(audio)}/>
                    ))
                    ) : (
                        <div>Không có audio nào được tìm thấy</div>
                )}
            </div>
            <div className="padding-60"></div>
        </div>
    );
}
export default NowPlaying;
