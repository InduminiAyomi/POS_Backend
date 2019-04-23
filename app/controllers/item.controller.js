const ItemModel = require('../models/item.model.js');

// Create and Save a new Item
exports.addItem = (req, res) => {
    // Validate request
    if(!(req.body.name && req.body.unitPrice && req.body.quantity)) {
        return res.status(400).send({
            message: "Item name, unit price or quantity can not be empty"
        });
    }

    // Create a Item
    const item = new ItemModel({
        name: req.body.name,
        unitPrice: req.body.unitPrice,
        quantity: req.body.quantity
    });

    // Save Item in the database
    item.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        console.log(err)
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Item."
        });
    });
};

// Retrieve and return all items from the database.
exports.getAllItems = (req, res) => {
    ItemModel.find()
    .then(users => {
        res.send(users);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving items."
        });
    });
};

// Find a single item with a itemId
exports.getItemById = (req, res) => {
    ItemModel.findById(req.params.itemId)
    .then(item => {
        if(!item) {
            return res.status(404).send({
                message: "Item not found with id " + req.params.itemId
            });            
        }
        res.send(item);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Item not found with id " + req.params.itemId
            });                
        }
        return res.status(500).send({
            message: "Error retrieving item with id " + req.params.itemId
        });
    });
};

// Update a item identified by the _id in the request
exports.updateItemById = (req, res) => {
    // Validate Request
    if(!(req.body.name && req.body.unitPrice && req.body.quantity)) {
        return res.status(400).send({
            message: "Item name, unit price or quantity can not be empty"
        });
    }

    // Find note and update it with the request body
    ItemModel.findByIdAndUpdate(req.params.itemId, {
        name: req.body.name,
        unitPrice: req.body.unitPrice,
        quantity: req.body.quantity
    }, {new: true})
    .then(item => {
        if(!item) {
            return res.status(404).send({
                message: "Item not found with id " + req.params.itemId
            });
        }
        res.send(item);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Item not found with id " + req.params.itemId
            });                
        }
        return res.status(500).send({
            message: "Error updating item with id " + req.params.itemId
        });
    });

};

// Delete a item with the specified _id in the request
exports.deleteItemById = (req, res) => {
    ItemModel.findByIdAndRemove(req.params.itemId)
    .then(item => {
        if(!item) {
            return res.status(404).send({
                message: "Item not found with id " + req.params.itemId
            });
        }
        res.send({message: "Item deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Item not found with id " + req.params.itemId
            });                
        }
        return res.status(500).send({
            message: "Could not delete item with id " + req.params.itemId
        });
    });
};


// Change Item Quantity
exports.changeItemQuantity = (req, res) => {
    // Validate Request
    if(!req.body.quantity) {
        return res.status(400).send({
            message: "Item quantity can not be empty"
        });
    }

    // Find note and update it with the request body
    ItemModel.findByIdAndUpdate(req.params.itemId, {
        quantity: req.body.quantity
    }, {new: true})
    .then(item => {
        if(!item) {
            return res.status(404).send({
                message: "Item not found with id " + req.params.itemId
            });
        }
        res.send(item);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Item not found with id " + req.params.itemId
            });                
        }
        return res.status(500).send({
            message: "Error updating item with id " + req.params.itemId
        });
    });

};
