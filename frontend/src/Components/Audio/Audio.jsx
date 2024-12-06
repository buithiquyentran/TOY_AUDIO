import React, { useEffect, useState,useContext } from 'react';

import './Audio.css'
import { AudioContext } from '../../Context/AudioContext'

const Audio = (props)=>{
    const { setCurrentAudio, setIsPlaying,currentPlaylist, setcurrentPlaylist } = useContext(AudioContext);
    const [duration, setDuration] = useState(null);
    const handlePlayAudio = (audio) => {
        setCurrentAudio(audio);  // Cập nhật bài hát hiện tại
        setIsPlaying(true)  
    };
    
    useEffect(() => {
        const file = new window.Audio(props.file);
        file.onloadedmetadata = () => {
            // Khi metadata của file được tải, lấy duration
            const durationInSeconds = file.duration;
            const minutes = Math.floor(durationInSeconds / 60);
            const seconds = Math.floor(durationInSeconds % 60);
            setDuration(`${minutes}:${seconds < 10 ? "0" + seconds : seconds}`); // Định dạng phút:giây
        };

        return () => {   
            // Cleanup đối tượng file để tránh rò rỉ bộ nhớ
            file.src = "";
        };
    }, []); 

    return (
        <div className="audio" onClick={() => {handlePlayAudio(props)}}>
            <img src={props.image}/>
            <div className="audio-info">
                <div className="audio-info-item text-uppercase">
                    {props.name} 
                </div>
                <div className="audio-info-item">
                    {props.singer.reduce ((previousValue, currentValue)=>{
                    return previousValue ?(previousValue +' x '+ currentValue): currentValue},'')}
                </div>
            </div>
            <div className='duration'>{duration}</div>
        </div>
    )
}
export default Audio