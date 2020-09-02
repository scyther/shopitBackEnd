const User = require("../models/user");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const expressJwt = require('express-jwt')


exports.signUp = (req, res) => {
	errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(422).json({
			error: errors.array()[0].msg,
		});
	}
	const user = new User(req.body);
	user.save((error, user) => {
		if (error) {
			return res.status(400).json({
				error: "Not able to save user in DB",
			});
		}
		res.json({
			name: user.name,
			email: user.email,
			_id: user._id,
		});
	});
};

exports.signIn = (req, res) => {
	errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(422).json({
			error: errors.array()[0].msg,
		});
	}
	const { email, password } = req.body;
	User.findOne({ email: email }, (error, user) => {
		if (error || !user) {
			return res.status(400).json({ error: "User not found" });
		} else {
			if (!user.authentication(password)) {
				return res.status(402).json({ error: "Email and password dont match" });
			} else {
				//CREATE TOKEN
				const token = jwt.sign({ _id: user._id }, process.env.SECRET);

				//SEND COOKIE
				res.cookie("token", token);
				const Secure = user.authentication(password)

				//SEND RESPONSE TO FRONT EMD
				const { _id, email, name, role,encrypted_password} = user;
				res.json({ token, user: { _id, email, name, role ,encrypted_password, Secure} });
			}
		}
	});
};

exports.signOut = (req, res) => {
	res.clearCookie("token")
	res.json({
		message: "USer Signed Out Successfully",
	});
};

// PROTECTED ROUTES
exports.isSignedIn = expressJwt({
	secret: process.env.SECRET,
	userProperty : "auth"
})

// CUSTOM MIDDLEWARE
exports.isAuthenticated = (req, res,next) => {
	let checker = req.profile && req.auth && req.profile._id == req.auth._id
	if (!checker) {
		res.status(403).json({
			error : "ACESS DENIED"
		})
	}
	next()
}
exports.isAdmin = (req, res,next) => {
	if(req.profile.role === 0){
		res.status(403).json({
			error : "You are not an admin"
		})
	}
	next()
}