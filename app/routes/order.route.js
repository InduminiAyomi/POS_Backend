module.exports = (app) => {
    
    const OrderController = require('../controllers/order.controller.js');

    // Create a new Order
    app.post('/addOrder', OrderController.addOrder);

    // Retrieve all Orders
    app.get('/allOrders', OrderController.getAllOrders);

    // Retrieve a single Order with orderId
    app.get('/order/:orderId', OrderController.getOrderById);

    // Update a Order with orderId
    // app.put('/order/:orderId', OrderController.updateOrderById);

    // Delete a Order with orderId
    app.delete('/deleteOrder/:orderId', OrderController.deleteOrderById);

    // Retrieve Orders with status
    app.get('/ordersByStatus/:status', OrderController.getOrdersByStatus);

    // Retrieve Order Items with orderId
    app.get('/itemsByOrderId/:orderId', OrderController.getItemsByOrderId);

    // Add new item to an order
    app.put('/addNewItem/:orderId', OrderController.addNewItem);

    // Remove item from an order
    app.put('/removeItem/:orderId/:itemId', OrderController.removeItem);

    // Change item quantity in an order
    // app.put('/changeItemQuantity/:orderId/:itemId/', OrderController.changeItemQuantity);

    // Increment item quantity by one
    app.put('/increaseItemQuantity/:orderId/:itemId', OrderController.increaseItemQuantity);

    // Decrement item quantity by one
    app.put('/decreaseItemQuantity/:orderId/:itemId', OrderController.decreaseItemQuantity);
    
}