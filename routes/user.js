const express = require('express')
const router = express.Router()
const {getUserById,getUser,updateUser,userPurchaseList} = require('../controllers/user')
const { isSignedIn, isAuthenticated } = require('../controllers/auth')


router.param("userID",getUserById)
router.get("/user/:userID",isSignedIn,isAuthenticated,getUser)
// router.get("/listAll",listUsers)
router.put("/user/:userID",isSignedIn,isAuthenticated,updateUser)
router.get("/user/orders/:userID",isSignedIn,isAuthenticated,userPurchaseList)

module.exports = router