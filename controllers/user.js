const User = require("../models/user");
const { Order } = require("../models/order");

// exports.listUsers = (req,res) => {
//     User.find().exec((err,users)=>{
//         if(err || !users){
//             return res.status(400).json(
//                     { "error" : "No users" }
//                 )
//         }
//         res.json({
//             users
//         })
//     })
// }

exports.getUserById = (req, res, next, id) => {
	User.findById(id).exec((error, user) => {
		if (error || !user) {
			return res.status(400).json({
				error: "User not found",
			});
		}
		req.profile = user;
		next();
	});
};

exports.getUser = (req, res) => {
	req.profile.salt = undefined;
	req.profile.encrypted_password = undefined;
	req.profile.createdAt = undefined;
	req.profile.updatedAt = undefined;
	return res.json({ user: req.profile });
};

exports.updateUser = (req, res) => {
	User.findByIdAndUpdate(
		{ _id: req.profile._id },
		{ $set: req.body },
		{ new: true, useFindAndModify: false },
		(error, user) => {
			if (error || !user) {
				return res.status(400).json({
					error: "Update not Succesful",
					error,
				});
			}
			user.salt = undefined;
			user.encrypted_password = undefined;
			user.createdAt = undefined;
			user.updatedAt = undefined;
			return res.json(user);
		}
	);
};

exports.userPurchaseList = (req, res) => {
	Order.find({ user: req.profile._id })
		.populate("user", "_id name")
		.exec((error, order) => {
			if (error) {
				return res.status(400).json({ error: "No orders Yet" });
			}
			return res.json({ order });
		});
};

exports.pushOrderInPurchaseList = (req, res, next) => {
	let purchases = [];
	req.body.order.products.forEach((Product) => {
		purchases.push({
			_id: product._id,
			name: product.name,
			description: product.description,
			category: product.category,
			quantity: req.body.cartProduct.count,
			amount: req.body.order.amount,
			transactionID: req.body.order.transactionID,
		});
		User.findOneAndUpdate(
			{ _id: req.profile._id },
			{ $push: { purchases: purchases } },
			{ new: true },
			(error, purchases) => {
				if(error){
					return res.status(400).json({error: "Unable to save purchase List"})
				}
				next();
			}
		);
	});
};
