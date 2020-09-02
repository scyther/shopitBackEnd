const Category = require("../models/category");

exports.getCategoryById = (req, res, next, id) => {
	Category.findById(id).exec((error, category) => {
		if (error) {
			return res.status(400).json({ error: "Category Not Found" });
		}
		req.category = category;
		next();
	});
};

exports.createCategory = (req, res) => {
	const category = new Category(req.body);
	category.save((error, category) => {
		if (error) {
			return res.status(400).json({ error: "Category not Saved" });}
		res.json({ category: category });
	});
};

exports.getCategory = (req, res) => {
	res.json(req.category);
};

exports.getAllCategories = (req, res) => {
	Category.find().exec((error, categories) => {
		if (error) {
			return res.json({ error: "Not able to get Categories" });
		}
		res.json(categories);
	});
};

exports.updateCategory = (req, res) => {
	const category = req.category;
	category.name = req.body.name;
  
	category.save((err, updatedCategory) => {
	  if (err) {
		return res.status(400).json({
		  error: "Failed to update category"
		});
	  }
	  res.json(updatedCategory);
	});
  };

exports.removeCategory = (req, res) => {
	const category = req.category;
	category.remove((error, category) => {
		if (error) {
			return res.status(400).json({ error: "Failed to Delete", error });
		}
		res.json({
			result: `${category.name} successfully Removed`,
		});
	});
};
