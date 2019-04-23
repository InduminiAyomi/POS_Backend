const mongoose = require('mongoose');

var OrderSchema = new mongoose.Schema({
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status:{
        type: String,
        enum: ['open','closed'],
        required: true
    },
    items: [{
        id: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Item',
            required: true
        },
        quantity: {
            type: Number,
            required: true
        }
    }]
},{
    timestamps: true
});

module.exports = mongoose.model('Order', OrderSchema);