const mongoose = require('mongoose');

var ItemSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    unitPrice: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }
},{
    timestamps: true
});

module.exports = mongoose.model('Item', ItemSchema);