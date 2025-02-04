const express = require("express");
const app = express();
const cors = require('cors')
const audioRoutes = require("./routes/audioRoutes")
const playlistRoutes = require("./routes/playlistRoutes")
const plCollectionRoutes = require("./routes/PLCollectionRoutes")
const UserRoutes = require("./routes/UserRoutes")
app.use(express.json())
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true, // Cho phép gửi và nhận cookies
}));
// Static file server
app.use("/images", express.static("upload/images"));
app.use("/audios", express.static("upload/audios"));
// Audio
app.use('/api/audios', audioRoutes);        // Route của audio
app.use('/api/playlists', playlistRoutes); // Route của playlist
app.use('/api/plcollections', plCollectionRoutes); // Route của PLCollection
app.use('/api/users', UserRoutes);  

module.exports = app; 