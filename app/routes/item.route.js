module.exports = (app) => {
    
    const ItemController = require('../controllers/item.controller.js');

    // Create a new Item
    app.post('/addItem', ItemController.addItem);

    // Retrieve all Items
    app.get('/allItems', ItemController.getAllItems);

    // Retrieve a single Item with itemId
    app.get('/item/:itemId', ItemController.getItemById);

    // Update a Item with itemId
    app.put('/updateItem/:itemId', ItemController.updateItemById);

    // Delete a Item with itemId
    app.delete('/deleteItem/:itemId', ItemController.deleteItemById);

    // Change Item Quantity
    app.put('/changeItemQuantity/:itemId', ItemController.changeItemQuantity);
}