import React, { useEffect, useState } from 'react';
import axios from 'axios';

import HomeYouMayLike from '../Components/HomeYouMayLike/HomeYouMayLike'
import HomeSection from '../Components/HomeSection/HomeSection'

const All = ()=>{
    const [plcs, setPlcs] = useState([]);
    const [playlist, setPlaylist] = useState([]);

    // Gọi API từ backend để lấy dữ liệu
    useEffect(() => {
        const fetchData = async () => {
        try {
            const PlcResponse = await axios.get('http://localhost:5000/allplcollection');
            const admins = await axios.get(`http://localhost:5000/users?isAdmin=true`);
            // Lọc các playlist có username thuộc danh sách adminUsernames
            const adminUsernames = admins.data.map(admin => admin.username);

            const adminCollections = PlcResponse.data.filter(plc => adminUsernames.includes(plc.username));

            setPlcs(adminCollections); // Lưu dữ liệu vào state

            const response1 = await axios.get('http://localhost:5000/allplaylists'); // Gọi API ở backend
            const  pls= response1.data.filter(pl => pl.name ==='Có thể bạn muốn nghe');            
            setPlaylist(pls[0]); // Lưu dữ liệu vào state
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        };
    fetchData();
    }, []);
    return (
        <div className="home-page">
            <HomeYouMayLike playlist = {playlist} />
            {plcs.map ((plc,index)=>{
                return (<HomeSection key={index} {...plc}/>)
            })}
        </div>
    )
}
export default All 
