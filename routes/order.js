const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const { updateStock } = require("../controllers/product");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const { getUserById, pushOrderInPurchaseList } = require("../controllers/user");
const {
	getOrderById,
	createOrder,
    getAllOrders,
    getStatus,
    updateStatus
} = require("../controllers/order");

router.param("orderId", getOrderById);
router.param("userId", getUserById);

//create
router.post(
	"/order/create/:userId",
	isSignedIn,
	isAuthenticated,
	pushOrderInPurchaseList,
	updateStock,
	createOrder
);

//read
router.get(
	"/order/getAll/:userId",
	isSignedIn,
	isAuthenticated,
	isAdmin,
	getAllOrders
);

//status
router.get(
	"/order/status/:orderId",
	isSignedIn,
	isAuthenticated,
	isAdmin,
	getStatus
);

router.put(
	"/order/:orderID/updateStatus/:userID",
	isSignedIn,
	isAuthenticated,
	isAdmin,
	updateStatus
);

module.exports = router;
