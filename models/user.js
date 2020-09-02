const mongoose = require("mongoose");
const crypto = require("crypto");
const uuidv1 = require("uuid/v1");
const schema = mongoose.Schema;

var userSchema = new schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
			maxlength: 30,
		},
		lastName: {
			type: String,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			trim: true,
			unique: true,
		},
		encrypted_password: {
			type: String,
			required: true,
		},
		salt: String,
		purchases: {
			type: Array,
			default: [],
		},
		role: {
			type: Number,
			default: 0,
		},
	},
	{ timestamps: true }
);

userSchema
	.virtual("password")
	.set(function (password) {
		this._password = password;
		this.salt = uuidv1();
		this.encrypted_password = this.securePassword(password);
	})
	.get(function () {
		return this._password;
	});

userSchema.methods = {
	authentication: function (plainPassword) {
		return this.securePassword(plainPassword) === this.encrypted_password;
	},
	securePassword: function (plainPassword) {
		if (!plainPassword) return "";
		try {
			return crypto
				.createHmac("sha256", this.salt)
				.update(plainPassword)
				.digest("hex");
		} catch (err) {
			return "";
		}
	},
};
module.exports = mongoose.model("User", userSchema);
