var express = require("express");
var router = express.Router();
const {check} = require('express-validator')
const {signOut ,signUp, signIn,isSignedIn} = require('../controllers/auth')


router.post("/signUp",[
    check("name").isLength({min : 3}).withMessage("Name should have more than 3 characters"),
    check("password").isLength({min : 3}).withMessage("Password should have more than 3 characters"),
    check("email").isEmail().withMessage("Enter Correct Email ID")
], signUp)

router.post("/signIn",[
    check("password").isLength({min : 3}).withMessage("Password should have more than 3 characters"),
    check("email").isEmail().withMessage("Enter Correct Email ID")
],signIn)

router.get("/testRoute",isSignedIn,(req,res) => {
    res.json(req.auth)
})

router.get("/signOut", signOut);

module.exports = router;
