const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const cartProductSchema = new mongoose.Schema({
	product: {
		type: ObjectId,
		ref: "Product",
	},
	name: String,
	count: Number,
	price: Number,
});

const CartProduct = mongoose.model("cartProduct", cartProductSchema);

const orderSchema = new mongoose.Schema(
	{
		products: [cartProductSchema],
		transactionID: {},
		amount: { type: Number, required: true },
		updated: Date,
		status : {
			type: String,
			default: "Received",
			enum: ["Cancelled","Received","Processing","Shipped","Delevered"]
		},
		address: String,
		user: {
			type: ObjectId,
			ref: "User",
		},
	},
	{ timestamps: true }
);

const Order = mongoose.model("order", orderSchema);

module.exports = { Order, CartProduct };
