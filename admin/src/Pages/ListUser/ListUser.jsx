import React, { useEffect, useState, useContext  } from 'react';
import axios from 'axios';
import './ListUser.css';
import { FiTrash } from 'react-icons/fi';
import {EditAudioContext} from '../../Context/EditAudioContext.jsx'
import EditAdmin from '../../Components/EditAdmin/EditAdmin';

const ListUser = () => {
  const [users, setUsers] = useState([]);
  const [admin, setAdmin] = useState(false);
  const {activeTab, setActiveTab} = useContext(EditAudioContext);
  const [user, setUser] = useState(null);
  function getUserFromCookie() {
    const cookieValue = document.cookie
    .split('; ')
    .find((row) => row.startsWith('user='))
    ?.split('=')[1];
    return cookieValue ? JSON.parse(cookieValue) : null;
  }
  useEffect(() => {
    const userFromCookie = getUserFromCookie();
    setUser(userFromCookie);
  },[]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async (isAdmin = false) => {
    try {
      const response = await fetch(`http://localhost:5000/users?isAdmin=${isAdmin}`);
      const users = await response.json();
      setUsers(users);
      setAdmin(false)
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchAdmins = async (isAdmin = true) => {
    try {
      const response = await fetch(`http://localhost:5000/users?isAdmin=${isAdmin}`);
      const users = await response.json();
      setUsers(users);
      setAdmin(true)

    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === 'User') {
      fetchUsers(false);
    } else {
      fetchAdmins(true);
    }
  };

  const handleDelete = async (u) => {
    const confirmDelete = confirm(`Bạn có chắc muốn xóa user ${u.id}?`);
    if (!confirmDelete) return;
    try {
      await axios.delete(`http://localhost:5000/api/user/${u.id}`);
      window.location.reload();
    } catch (error) {
      console.error('Error deleting audio:', error);
    }
  };

  return (
    <div className= "body with-edit-audio">
      <div className="list-audios-section">
        <div className="btn-section">
            <div className="sort">
              <span
                className={`list-audios-btn ${activeTab === 'User' ? 'active' : ''}`}
                onClick={() => handleTabClick('User')}
              >
                  User
              </span>
              <span
                className={`list-audios-btn ${activeTab === 'Admin' ? 'active' : ''}`}
                onClick={() => handleTabClick('Admin')}
              >
                Admin
              </span>
              {user?.isSuperAdmin == true && <span
                className={`list-audios-btn ${activeTab === 'AddAdmin' ? 'active' : ''}`}
                onClick={() => handleTabClick('AddAdmin')}
              >Thêm tài khoản admin</span>}
 
            </div>
            <div className="list-audios-btn export-btn">
              Xuất file
            </div>
        </div>
        
        <table className="list-audios">
          <thead>
            <tr>
              <th>STT</th>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users &&
              users.map((u,index) => (
                <tr
                  key={u.id}
                  className = 'audio'
                >
                  <td>{index + 1}</td>
                  <td>{u.id}</td>
                  <td className="audio-name">{u.username}</td>
                  <td className="audio-name">{u.email}</td>
                  
                  <td className="date">{new Date(u.date).toLocaleDateString('vi-VN')}</td>
                  <td>
                  {(user?.isSuperAdmin == false) ? (
                    <FiTrash className="icon" title="Bạn không thể xóa tài khoản admin" style={{ color: '#ccc', cursor: 'not-allowed' }} />
                  ) : (
                    <FiTrash className="icon" onClick={()=>handleDelete(u)} title="Xóa tài khoản"  />
                  )}
                </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <div>
        {activeTab == 'AddAdmin' && <EditAdmin/>}
      </div>
    </div>
  );
};

export default ListUser;
