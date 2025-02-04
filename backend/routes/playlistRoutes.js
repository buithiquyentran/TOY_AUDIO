const express = require("express")
const router = express.Router()
const {GetLastplaylistId,AddPlaylist,DeletePlaylist,GetAllPlaylists,GetPlaylists,GetAllPlaylistSongs,
    GetAllPlaylistPodcasts, SearchPlaylist, UpdatePlaylist} 
    = require("../controllers/playlistController")

router.get('/lastplaylistid',GetLastplaylistId)
router.post('/addplaylist',AddPlaylist )
router.delete('/:id',DeletePlaylist)
router.get('/allplaylists',GetAllPlaylists )
router.get('/:id',GetPlaylists)
router.get('/allplaylists/songs',GetAllPlaylistSongs)
router.get('/allplaylists/podcasts',GetAllPlaylistPodcasts)
router.get('/search',SearchPlaylist)
router.put('/:id', UpdatePlaylist)
module.exports = router