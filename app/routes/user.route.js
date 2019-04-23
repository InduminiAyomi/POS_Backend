module.exports = (app) => {
    
    const UserController = require('../controllers/user.controller.js');

    // Create a new User
    app.post('/addUser', UserController.create);

    // Retrieve all Users
    app.get('/allUsers', UserController.findAll);

    // Delete a User with username
    app.delete('/deleteUser/:userId', UserController.delete);

}