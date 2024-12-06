import { React, useContext } from "react";
import { Link } from "react-router-dom";
import './Playlist.css';
import { AudioContext } from '../../Context/AudioContext';

const Playlist = (props) => {
  const { setSelectedPlaylist } = useContext(AudioContext);

  const handleClick = () => {
    setSelectedPlaylist(props);
  };

  return (
    <Link className="nav-link" to='/playlist_list'>
      <div className="playlist" onClick={handleClick}>
        <img src={props.image} alt={props.name} />
        <div className="playlist-name">{props.name}</div>
        <div className="n-songs">Tuyển tập ({props.songIds.length})</div>
      </div>
    </Link>
  );
};

export default Playlist;
