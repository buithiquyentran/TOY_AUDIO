const express = require("express");
const router = express.Router();
const {
  GetLastAudioId,
  Addaudio,
  GetAllAudios,
  DeleteAudio,
  UpdateView,
  GetSongs,
  GetPodcasts,
  GetAudio,
  UpdateAudio,
  SearchAudio,
} = require("../controllers/audioController");


router.get('/lastaudioid',GetLastAudioId)
router.post('/addaudio',Addaudio)
router.get('/allaudios',GetAllAudios)
router.delete('/:id',DeleteAudio)
router.put('/:id/view',UpdateView)
router.get('/songs',GetSongs) 
router.get('/podcasts',GetPodcasts)
router.get('/:audioId',GetAudio)

router.put('/:id', UpdateAudio)
router.get('/search',SearchAudio )

module.exports = router