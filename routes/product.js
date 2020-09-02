const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const { getProductById, createProduct ,getProduct,photo,updateProduct,deleteProduct,getAllProducts} = require("../controllers/product");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const { getUserById } = require("../controllers/user");

//Params
router.param("userId", getUserById);
router.param("productId", getProductById);

//Routes

//Create
router.post(
	"/product/create/:userId",
	isSignedIn,
	isAuthenticated,
	isAdmin,
	// [
	// 	body("name", "name should be more than 3 characters").isLength({ min: 3 }),
	// 	body("price", "Price should Be numeric").isNumeric(),
	// 	body("description", "Description can Contain 1000 Characters").isLength({max: 1000}),
	// 	body("stock", "Stock should be numeric").isNumeric()
	// ],
	createProduct
);


//read
router.get("/product/:productId",getProduct)
router.get("/product/photo/:productId",photo)


//delete
router.delete("/product/:productId/:userId",isSignedIn,isAuthenticated, isAdmin,deleteProduct)

//update
router.put("/product/:productId/:userId",isSignedIn,isAuthenticated, isAdmin,updateProduct)

//lisiting
router.get("/products",getAllProducts)



module.exports = router;
