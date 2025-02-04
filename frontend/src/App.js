import { useState,useContext } from 'react';
import {BrowserRouter, Routes, Route, useLocation} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { All, Music, Podcasts, Playlists,CreatePlaylist, PlaylistList, Search} from './Pages';
import Navbar from './Components/Navbar/Navbar';
import Sidebar from './Components/Sidebar/Sidebar';
import Login from './Components/Login/Login';
import Register from './Components/Register/Register'; 

import Footer from './Components/Footer/Footer';
import NowPlaying from './Components/NowPlaying/NowPlaying';
import { AudioProvider, AudioContext } from './Context/AudioContext';
import './App.css';

function AppContent() {
  const location = useLocation(); // Sử dụng useLocation để kiểm tra đường dẫn hiện tại
  const {currentAudio}= useContext(AudioContext);

  // Kiểm tra nếu đường dẫn hiện tại là /login hoặc register
  const isLoginPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div>
      {!isLoginPage && <Navbar/>}
      <div className='d-flex w-100 body'>
        {!isLoginPage && <Sidebar />}
        <div className={`pages ${!isLoginPage && currentAudio ? "has-nowplaying" : ""}`}>
          <Routes> 
            <Route path='/' element={<All />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/music' element={<Music />}>
              {/* <Route path=':musicId' element={<Music />} /> */}
            </Route>
            <Route path='/podcasts' element={<Podcasts />}>
              {/* <Route path=':podcastId' element={<Podcasts />} /> */}
            </Route>
            <Route path='/playlists' element={<Playlists />}>
            </Route>
            <Route path='/create_playlist' element={<CreatePlaylist />}>
            </Route>
            <Route path='/playlist_list' element={<PlaylistList />}>
            </Route>
            <Route path='/search' element={<Search />}>
            </Route>
          </Routes>
        </div>
        {!isLoginPage && currentAudio && <NowPlaying />}
      </div>
      {!isLoginPage && <Footer />}
    </div>
  );
}
const App = () => (
  <AudioProvider>
      <AppContent/>
  </AudioProvider>
);

export default App;

