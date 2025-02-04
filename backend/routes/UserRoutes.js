const express = require("express")
const router = express.Router()
const {AddUser,deleteUser,GetUser,GetAllusers,GetUsersWithRole} = require("../controllers/userController") 
router.post ('/adduser',AddUser)
router.delete('/api/user/:id',deleteUser)
router.get('/users/:param', GetUser)
router.get('/allusers', GetAllusers)
router.get('/', GetUsersWithRole)
module.exports = router