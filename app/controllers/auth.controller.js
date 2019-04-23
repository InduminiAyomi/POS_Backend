const UserModel = require('../models/user.model.js');
var empty = require('is-empty');

// Find a single user with username and password
exports.authenticate = (req, res) => {
    // console.log("***************")
    if(!(req.body.username && req.body.password)) {
        return res.status(400).send({
            message: "Username or Password can not be empty"
        });
    }
    // console.log("user@@@@@@@")

    UserModel.find({username: req.body.username, password: req.body.password})
    .then(user => {
        if(empty(user)){
            return res.status(404).send({
                message: "Username or/both Password is incorrect"
            })
        }
        // console.log("user",user)
        res.send(!empty(user));
    }).catch(err => {
        if(err.kind === 'ObjectId'){
            return res.status(404).send({
                message: "Username or Password is incorrect"
            })
        }
        return res.status(500).send({
            message: "Error occured while retrieving user"
        })
    });
};