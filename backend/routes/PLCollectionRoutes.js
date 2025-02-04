const express = require("express")
const router = express.Router()
const {GetPlcollection,AddPLcollection,DeletePlcollection,GetAllplcollection,
    getAllplcollectionSongs,getAllplcollectionPodcasts,SearchPlcollection, UpdatePlcollection}
     = require('../controllers/plCollectionController') 

router.get('/plcollection/:plcollectionId',GetPlcollection)
router.post ('/addPLcollection',AddPLcollection)
router.delete('/api/plcollection/:id', DeletePlcollection)
router.get('/allplcollection', GetAllplcollection)
router.get('/allplcollection/songs', getAllplcollectionSongs)
router.get('/allplcollection/podcasts', getAllplcollectionPodcasts)
router.get('/plcollection/search', SearchPlcollection)
router.put('/plcollection/:id',UpdatePlcollection)
module.exports = router