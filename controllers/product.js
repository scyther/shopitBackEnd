const Product = require("../models/product");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const { validationResult } = require("express-validator");

exports.getProductById = (req, res, next, id) => {
	Product.findById(id)
		.populate("category")
		.exec((error, product) => {
			if (error) {
				return res.status(400).json({ error: "No Product Found" });
			}
			req.product = product;
			next();
		});
};

exports.createProduct = (req, res) => {
	errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(422).json({
			error: errors.array()[0].msg,
		});
	}
	const form = new formidable.IncomingForm();
	form.keepExtensions = true;

	form.parse(req, (error, fields, file) => {
		if (error) {
			return res.status(400).json({ error: "Form Not Read" });
		}

		const { name, price, description, category, stock } = fields;

		if (!name || !price || !description || !category || !stock) {
			return res.status(400).json({ error: "Enter All The fields" });
		}

		//TODO: Add Restrictions
		let product = new Product(fields);

		if (file.photo) {
			if (file.photo.size > 3000000) {
				return res.status(400).json({
					error: "Size is more than 3 MB",
				});
			}
			product.photo.data = fs.readFileSync(file.photo.path);
			product.photo.contentType = file.photo.type;
		}
		console.log(file.photo);
		product.save((error, product) => {
			if (error) {
				return res.status(400).json({
					// error: "Product Not Saved"
					error,
				});
			}
			res.json(product);
		});
	});
};

exports.getProduct = (req, res) => {
	req.product.photo = undefined;
	res.json(req.product);
};

exports.photo = (req, res, next) => {
	if (req.product.photo.data) {
		res.set("Content-Type", req.product.photo.contentType);
		return res.send(req.product.photo.data);
	}
	next();
};

exports.deleteProduct = (req, res) => {
	const product = req.product;
	product.remove((error, deletedProduct) => {
		if (error) {
			return res.status(400).json({ error: "Failed to delete product" });
		}
		res.json({ message: "Product Deleted Successfully", deletedProduct });
	});
};

exports.updateProduct = (req, res) => {
	errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(422).json({
			error: errors.array()[0].msg,
		});
	}
	const form = new formidable.IncomingForm();
	form.keepExtensions = true;

	form.parse(req, (error, fields, file) => {
		if (error) {
			return res.status(400).json({ error: "Form Not Read" });
		}

		//TODO: Add Restrictions
        let product = req.product
        product = _.extend(product,fields)

		if (file.photo) {
			if (file.photo.size > 3000000) {
				return res.status(400).json({
					error: "Size is more than 3 MB",
				});
			}
			product.photo.data = fs.readFileSync(file.photo.path);
			product.photo.contentType = file.photo.type;
		}
		console.log(file.photo);
		product.save((error, product) => {
			if (error) {
				return res.status(400).json({
					error: "Product Not updated",
					error,
				});
			}
			res.json(product);
		});
	});
};

exports.getAllProducts = (req,res) => {

let limit = req.query.limit ? parseInt(req.query.limit) : 8
let sortBy = req.query.sortBy ? req.query.sortBy : "_updatedAt"

    Product.find()
    .select("-photo")
    .populate("category")
    .limit(limit)
    .sort([[sortBy,"ascending"]])
    .exec((error,products) => {
        if(error){
            return res.status(400).json({error : "No Products"})
        }
        res.json(products)
    })
}

exports.getAllUniqueCategory = (req,res) => {
	Product.distinct("category",{},(error,category)=> {
		if(error){
			res.status(400).json({
				error : "No category Found"
			})
		}
		res.json(category)
	})
}

exports.updateStock = (req,res,next) => {
	const myoperations = req.body.order.products.map(prod =>{
		return {
			updateOne : {
				filter :{_id: prod._id},
				update :{$inc: {stock : - prod.count ,sold : + prod.count}}
			}
		}
	})
	
	Product.bulkWrite(myoperations,{},(error,products) => {
		if(error){
			return res.status(400).json({
				error : "Stock not updated"
			})
		}
		next()
	})
}