import { createContext, useState,useEffect} from 'react';

export const EditAudioContext = createContext();

export const EditAudioProvider = ({ children }) => {
    const [editSelectAudio, setEditSelectAudio] = useState(null);
    const [editSelectPlaylist, setEditSelectPlaylist] = useState(null);
    const [editSelectPlCollection, setEditSelectPlCollection] = useState(null);
    const [activeTab, setActiveTab] = useState('User'); // Thêm state để quản lý tab


    // Khôi phục dữ liệu từ localStorage khi component được mount
    useEffect(() => {
        const savedEditAudio = localStorage.getItem('editSelectAudio');
        if (savedEditAudio) {
            setEditSelectAudio(JSON.parse(savedEditAudio)); // Khôi phục audio đang edit    
        }
        const savedEditPlaylist = localStorage.getItem('editSelectPlaylist');
        if (savedEditPlaylist) {
            setEditSelectPlaylist(JSON.parse(savedEditPlaylist)); // Khôi phục audio đang edit    
        }
        const savedEditPlCollection = localStorage.getItem('editSelectPlCollection');
        if (savedEditPlCollection) {
            setEditSelectPlCollection(JSON.parse(savedEditPlCollection)); // Khôi phục audio đang edit    
        }
        const savedActiveTab = localStorage.getItem('activeTab');
        if (savedActiveTab) {
            setActiveTab(JSON.parse(savedActiveTab)); // Khôi phục audio đang edit    
        }
    }, []);

    useEffect(() => {
        if (editSelectAudio) {
            localStorage.setItem('editSelectAudio', JSON.stringify(editSelectAudio));
        }
    }, [editSelectAudio]);
    useEffect(() => {
        if (editSelectPlaylist) {
            localStorage.setItem('editSelectPlaylist', JSON.stringify(editSelectPlaylist));
        }
    }, [editSelectPlaylist]);
    useEffect(() => {
        if (editSelectPlCollection) {
            localStorage.setItem('editSelectPlCollection', JSON.stringify(editSelectPlCollection));
        }
    }, [editSelectPlCollection]);
    useEffect(() => {
        if (activeTab) {
            localStorage.setItem('activeTab', JSON.stringify(activeTab));
        }
    }, [activeTab]);
    return (
        <EditAudioContext.Provider value={{editSelectAudio, setEditSelectAudio, editSelectPlaylist, setEditSelectPlaylist,editSelectPlCollection, setEditSelectPlCollection,activeTab, setActiveTab}}>
        {children}
        </EditAudioContext.Provider>
    );
}; 