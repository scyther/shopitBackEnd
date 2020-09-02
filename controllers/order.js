const {Order, CartProduct } = require("../models/order")

exports.getOrderById = (req,res,next,id) => {
    Order.findById(id)
    .populate("products.product","name price")
    .exec((error,order) => {
        if(error || !order){
            return res.status(400).json({error : "No Order Found"})
        }
        req.order = order;
        next()
    })
}

exports.createOrder = (req,res) => {
    req.body.order.user = req.profile
    const order = new Order(req.body.order)
    order.save((error,order) => {
        if(error){
            return res.status(400).json({error : "Failed to save Order"})
        }
        res.json({order})
    })
}

exports.getAllOrders = (req,res) => {
    Order.find()
    .populate("user","_id name")
    .exec((error,order) => {
        if(error) {
            res.status(400).json({
                error : "No Orders Found"
            })
        }
        res.json(order)
    })
}

exports.getStatus = (req,res) =>{
    Order.findById(id).exec((error,order) =>{
        if(error || !order){
            res.status(400).json({
                error : "Not able to get status"
            })
        }
        res.json(order.status)
        res.json(Order.schema.path("status").enumValues)
    })
}

exports.updateStatus = (req,res) => {
    Order.update(
        {filter : {_id : req.body.order._id}},
        {$set : {status : req.body.order.status}},
        (error,order) => {
            if(error){
                res.status(400).json({error : "Failed to update Status"})
            }
            res.json(order)
        }
    )
}