// import React from 'react'
// import { Link, useNavigate } from "react-router-dom";
// import './Sidebar.css'
// const Sidebar = () => {
  
//   return (
//     <div className='sidebar'>
//         <Link className="sidebar-link active" to='/'>Audios</Link>
//         <Link className="sidebar-link" to='/listplaylists'>Playlists</Link>
//         <div className="sidebar-link">Tập hợp playlists</div>
//         <div className="sidebar-link">Tài khoản</div>
//         <div className="sidebar-link">Thống kê</div>
//         <div className="sidebar-link">Xuất file excel</div>
//     </div>
//   ) 
// }

// export default Sidebar
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className='sidebar'>
      <Link 
        className={`sidebar-link ${location.pathname === '/' ? 'active' : ''}`} 
        to='/'
      >
        Audios
      </Link>
      <Link 
        className={`sidebar-link ${location.pathname === '/playlists' ? 'active' : ''}`} 
        to='/playlists'
      >
        Playlists
      </Link>
      <Link 
        className={`sidebar-link ${location.pathname === '/plcollection' ? 'active' : ''}`} 
        to='/plcollection'
      >
        Tập hợp playlists
      </Link>
      <Link 
        className={`sidebar-link ${location.pathname === '/users' ? 'active' : ''}`} 
        to='/users'
      >
        Tài khoản
      </Link>
      <Link 
        className={`sidebar-link ${location.pathname === '/thongke' ? 'active' : ''}`} 
        to='/'
      >
        Thống kê
       
      </Link>
     
    </div>
  );
}

export default Sidebar;
