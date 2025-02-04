import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Audio from '../Components/Audio/Audio'

const Search = () => {
    const location = useLocation();
    const [searchResults, setSearchResults] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        // Lấy query từ URL
        const params = new URLSearchParams(location.search);
        const query = params.get("query");
        setSearchQuery(query);

        if (query) {
            fetchSearchResults(query);
        }
    }, [location.search]);

    const fetchSearchResults = async (query) => {
        try {
            const response = await fetch(`http://localhost:5000/api/audios/search?query=${query}`);
            const data = await response.json();
            setSearchResults(data); // Lưu kết quả vào state
        } catch (error) {
            console.error("Error fetching search results:", error);
        }
    };

    return (
        <div>
            <h1 className="search-query">Kết quả tìm kiếm cho: "{searchQuery}"</h1>
            {searchResults.length > 0 ? (
                searchResults.map((audio, index) => (
                    <Audio key={index} {...audio} />
                ))
                ) : (
                    <div>Không có audio nào được tìm thấy</div>
            )}
        </div>
    );
};

export default Search;
