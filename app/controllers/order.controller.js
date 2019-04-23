const OrderModel = require('../models/order.model.js');
const ItemModel = require('../models/item.model.js');

// Create and Save a new Order
exports.addOrder = (req, res) => {
    // Validate request
    if(!(req.body.createdBy && req.body.status)) {
        return res.status(400).send({
            message: "Order creator and status can not be empty"
        });
    }

    // Create a Order
    const order = new OrderModel({
        createdBy: req.body.createdBy,
        status: req.body.status,
        items: req.body.items
    });

    // Save Order in the database
    order.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Order."
        });
    });
};

// Retrieve and return all orders from the database.
exports.getAllOrders = (req, res) => {
    OrderModel.find()
    .then(orders => {
        res.send(orders);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving orders."
        });
    });
};

// Find a single order with a orderId
exports.getOrderById = (req, res) => {

    OrderModel.findById(req.params.orderId)
    .populate('items.id')
    .then(order => {
        if(!order) {
            return res.status(404).send({
                message: "Order not found with id " + req.params.orderId
            });            
        }
        res.send(order);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Order not found with id " + req.params.orderId
            });                
        }
        return res.status(500).send({
            message: "Error retrieving order with id " + req.params.orderId
        });
    });
};

// Update a order identified by the orderId in the request
// exports.updateOrderById = (req, res) => {
//     // Validate Request
//     if(!(req.body.createdBy && req.body.status)) {
//         return res.status(400).send({
//             message: "Order creator and sattus can not be empty"
//         });
//     }

//     // Find note and update it with the request body
//     OrderModel.findByIdAndUpdate(req.params.orderId, {
//         createdBy: req.body.createdBy,
//         status: req.body.status,
//         items: req.body.items
//     }, {new: true})
//     .then(order => {
//         if(!order) {
//             return res.status(404).send({
//                 message: "Item not found with id " + req.params.orderId
//             });
//         }
//         res.send(order);
//     }).catch(err => {
//         if(err.kind === 'ObjectId') {
//             return res.status(404).send({
//                 message: "Item not found with id " + req.params.orderId
//             });                
//         }
//         return res.status(500).send({
//             message: "Error updating item with id " + req.params.orderId
//         });
//     });
// };

// Delete a order with the specified _id in the request
exports.deleteOrderById = (req, res) => {

    OrderModel.findByIdAndRemove(req.params.orderId)
    .then(order => {
        if(!order) {
            return res.status(404).send({
                message: "Order not found with id " + req.params.orderId
            });
        }
        res.send({message: "Order deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Order not found with id " + req.params.orderId
            });                
        }
        return res.status(500).send({
            message: "Could not delete order with id " + req.params.orderId
        });
    });

};

// Retrieve Orders with status
exports.getOrdersByStatus = (req, res) => {

    if(!(req.params.status=='open' || req.params.status=='closed')){
        return res.status(400).send({
            message: "Wrong status type"
        })
    }

    OrderModel.find({status: req.params.status})
    .populate('items.id')
    .then(order => {
        res.send(order);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Order not found with status " + req.params.status
            });                
        }
        return res.status(500).send({
            message: "Error retrieving order with status " + req.params.status
        });
    });
};

// Retrieve Items with orderId
exports.getItemsByOrderId = (req, res) => {

    OrderModel.findById(req.params.orderId)
    .populate('items.id')
    .select('items')
    .then(order => {
        if(!order) {
            return res.status(404).send({
                message: "Order not found with id " + req.params.orderId
            });            
        }
        res.send(order);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Order not found with id " + req.params.orderId
            });                
        }
        return res.status(500).send({
            message: "Error retrieving order with id " + req.params.orderId
        });
    });
};


// Add new item to an order
exports.addNewItem = (req, res) => {
    // Validate Request
    if(!(req.body.id && req.body.quantity)) {
        return res.status(400).send({
            message: "Item id and quantity can not be empty"
        });
    }
  
    var newItem = {
        id:req.body.id,
        quantity:req.body.quantity
    }

    // Find note and update it with the request body
    const addNewItem = OrderModel.findByIdAndUpdate(req.params.orderId, {
                            $push: {items: newItem}
                        },{ new:true })
                        .populate('items.id')

    // Find item and decrease available quantity
    const changeItem = ItemModel.findOneAndUpdate( {_id: req.body.id}, {
                            $inc: { "quantity" : -1 }
                        },{new: true})

    
    Promise.all([addNewItem, changeItem])
    .then(result => {
        res.send(result)
    }).catch(err => {
        console.log(err)
        res.send(err)
    });
};

// Remove item from an order
exports.removeItem = (req, res) => {
    // Validate Request
    if(!(req.params.orderId && req.params.itemId)) {
        return res.status(400).send({
            message: "OrderId and ItemId can not be empty"
        });
    }

    var item = {_id:req.params.itemId}

    // Find order and remove item
    const changeOrder = OrderModel.findByIdAndUpdate(req.params.orderId, {
        $pull: {items: item}
    },{new: true})
    .populate('items.id')

    // Find item and add removed quantity
    const changeItem = ItemModel.findOneAndUpdate( {_id: req.body.refId}, {
        $inc: { "quantity" : req.body.quantity }
    },{new: true})

    Promise.all([changeOrder, changeItem])
    .then(result => {
        // console.log("@@@@@@@@@@@@@@result",result)
        res.send(result)
    }).catch(err => {
        console.log(err)
        res.send(err)
    });
};

// Change item quantity in an order
// exports.changeItemQuantity = (req, res) => {
// };

 // Increment item quantity by one
exports.increaseItemQuantity = (req, res) => {

    // Validate Request
    if(!(req.params.orderId && req.params.itemId && req.body.quantity)) {
        return res.status(400).send({
            message: "OrderId, ItemId and Quantity can not be empty"
        });
    }

    // Find order and increase item quantity
    const changeOrder = OrderModel.findOneAndUpdate( {_id: req.params.orderId}, {
                            $set: { "items.$[elem].quantity" : req.body.quantity }
                        },{ arrayFilters: [ { "elem._id": req.params.itemId}], new: true})
                        .populate('items.id')

    // Find item and decrease available quantity
    const changeItem = ItemModel.findOneAndUpdate( {_id: req.body.refId}, {
                            $inc: { "quantity" : -1 }
                        },{new: true})

    Promise.all([changeOrder, changeItem])
    .then(result => {
        res.send(result)
    }).catch(err => {
        console.log(err)
        res.send(err)
    });

};


// Decrement item quantity by one
exports.decreaseItemQuantity = (req, res) => {

    // Validate Request
    if(!(req.params.orderId && req.params.itemId && req.body.quantity)) {
        return res.status(400).send({
            message: "OrderId, ItemId and Quantity can not be empty"
        });
    }

    // Find order and decrease item quantity
    const changeOrder = OrderModel.findOneAndUpdate({_id: req.params.orderId}, {
                            $set: { "items.$[elem].quantity" : req.body.quantity }
                        },{ arrayFilters: [ { "elem._id": req.params.itemId}], new: true})
                        .populate('items.id')

    // Find item and increase available quantity
    const changeItem = ItemModel.findOneAndUpdate( {_id: req.body.refId}, {
                            $inc: { "quantity" : 1 }
                        },{new: true})

    Promise.all([changeOrder, changeItem])
    .then(result => {
        res.send(result)
    }).catch(err => {
        console.log(err)
        res.send(err)
    });

};