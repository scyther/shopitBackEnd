const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const productSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
			unique: true,
			maxlength: 32,
		},
		photo: {
			data: Buffer,
			contentType: String,
		},
		price: {
			type: Number,
			maxlength: 24,
			trim: true,
			required: true,
		},
		description: {
			type: String,
			required: true,
			maxlength: 2000,
		},
		category: {
            type: ObjectId,
            ref: "Category",
            required: true},
		stock: {
			type: Number,
		},
		sold: {
			type: Number,
			default: 0,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
