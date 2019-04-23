module.exports = (app) => {
    
    const AuthController = require('../controllers/auth.controller.js');

    // Retrieve a single User with Username and Password
    app.post('/auth', AuthController.authenticate);
}