var express = require("express");
var router = express.Router();
const {
	getCategoryById,
	getAllCategories,
	createCategory,
	getCategory,
	updateCategory,
	removeCategory,
} = require("../controllers/category");
const { isAuthenticated, isSignedIn, isAdmin } = require("../controllers/auth");
const { getUserById} = require("../controllers/user");

//Params
router.param("userID", getUserById);
router.param("categoryID", getCategoryById);

//routes
//create
router.post(
	"/category/create/:userID",
	isSignedIn,
	isAuthenticated,
	isAdmin,
	createCategory
);

//read
router.get("/category/:categoryID", getCategory);
router.get("/categories", getAllCategories);

//update
router.put(
	"/category/:categoryID/:userID",
	isSignedIn,
	isAuthenticated,
	isAdmin,
	updateCategory
);

//delete
router.delete(
	"/category/:categoryID/:userID",
	isSignedIn,
	isAuthenticated,
	isAdmin,
	removeCategory
);

module.exports = router;
