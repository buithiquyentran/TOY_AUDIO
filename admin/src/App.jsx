import React, { useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './Components/Navbar/Navbar';
import Sidebar from './Components/Sidebar/Sidebar';
import ListAudios from './Pages/ListAudios/ListAudios';
import ListPlaylists from './Pages/ListPlaylists/ListPlaylists';
import ListPCollection from './Pages/ListPCollection/ListPCollection';
import ListUser from './Pages/ListUser/ListUser';
import ProtectedRoute from './ProtectedRoute.jsx';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { EditAudioProvider,EditAudioContext} from './Context/EditAudioContext.jsx';

const AppContent = () => {
  const {editSelectAudio,editSelectPlaylist,editSelectPlCollection, activeTab} = useContext(EditAudioContext);
  const location = useLocation(); 
  const EditAudioPage = location.pathname === '/' && editSelectAudio;
  const EditPlaylistPage = location.pathname === '/playlists' && editSelectPlaylist;
  const EditPlCPage = location.pathname === '/plcollection' && editSelectPlCollection;
  const EditAdminCPage = location.pathname === '/users' && activeTab == 'AddAdmin';

  return (
    <div>
      <Navbar />
      <Sidebar />
      <div className="body">
        <div className={`pages ${(EditAudioPage || EditPlaylistPage || EditPlCPage || EditAdminCPage)  ? 'with-edit-audio' : ''}`}>
          <Routes>
            <Route path="/" element={<ListAudios />}/>
            <Route path="/playlists" element={<ListPlaylists/>} />
            <Route path="/plcollection" element={<ListPCollection/>} />
            <Route path="/users" element={<ListUser/>} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

const App = () => (
  <ProtectedRoute>
    <EditAudioProvider>
        <AppContent/>
    </EditAudioProvider>
  </ProtectedRoute>
);

export default App;
