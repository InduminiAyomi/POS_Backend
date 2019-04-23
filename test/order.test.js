process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let Order = require('../app/models/order.model');
let Item = require('../app/models/item.model');
let User = require('../app/models/user.model');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../app');
let should = chai.should();

chai.use(chaiHttp);

expect = chai.expect;
chai.use(require('chai-like'));
chai.use(require('chai-things'));

describe('Orders', () => {
    let item1, item2, user1;

    beforeEach((done) => {
        Order.remove({}, (err) => { 
            done();     
        });          
    })

    before(async (done) => {

        var promises = [
            Order.remove().exec(),
            Item.remove().exec(),
            User.remove().exec()
        ];

        Promise.all(promises)
        .then(function () {
            done();
        })

        let testItem1 = new Item({name: "Latte", unitPrice: 2.99 , quantity: 20})
        let testItem2 = new Item({name: "Capuccino", unitPrice: 3.99 , quantity: 15})

        let testUser1 = new User({username: "admin", password: "admin"})

        item1 = await testItem1.save()
        item2 = await testItem2.save()
        user1 = await testUser1.save()

    } )

    // Test the /POST route
    describe('/POST order', () => {
        it('it should POST a new order', (done) => {
            let order = {
                createdBy: user1._id,
                status: "open",
                items: [{
                        id: item1._id,
                        quantity: 2
                    },
                    {
                        id: item2._id,
                        quantity: 3
                    }]
            }
            chai.request(app)
                .post('/addOrder')
                .send(order)
                .end((err, res) => {
                      res.should.have.status(200);
                      res.body.should.be.a('object');
                      res.body.should.have.property('createdBy');
                      res.body.should.have.property('status');
                      res.body.should.have.property('items');
                  done();
                });
        });
    });

    // Test the /GET route
    describe('/GET orders', () => {
        it('it should GET all the orders', (done) => {
        chai.request(app)
            .get('/allOrders')
            .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(0);
                done();
            });
        });
    });

    // Test the /GET/:orderId route
    describe('/GET/:orderId order', () => {
        it('it should GET a order by the given id', (done) => {
            let order = new Order({ 
                createdBy: user1._id,
                status: "open",
                items: [{
                        id: item1._id,
                        quantity: 4
                    },
                    {
                        id: item2._id,
                        quantity: 2
                    }]
            });
            order.save((err, order) => {
                chai.request(app)
            .get('/order/' + order.id)
            .send(order)
            .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('createdBy');
                    res.body.should.have.property('status');
                    res.body.should.have.property('items');
                    res.body.should.have.property('_id').eql(order.id);
                done();
            });
            });
        });
    });


    // Test the /DELETE/:orderId route
    describe('/DELETE/:orderId order', () => {
        it('it should DELETE a order given the id', (done) => {
            let order = new Order({ 
                createdBy: user1._id,
                status: "open",
                items: [{
                        id: item1._id,
                        quantity: 4
                    },
                    {
                        id: item2._id,
                        quantity: 2
                    }]
            });
            order.save((err, order) => {
                    chai.request(app)
                    .delete('/deleteOrder/' + order._id)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('message').eql('Order deleted successfully!');
                    done();
                    });
            });
        });
    });

    // Test the /GET/:status route
    describe('/GET/:status order', () => {
        it('it should GET orders by the status', (done) => {
            let order = new Order({ 
                createdBy: user1._id,
                status: "open",
                items: [{
                        id: item1._id,
                        quantity: 4
                    },
                    {
                        id: item2._id,
                        quantity: 2
                    }]
            });
            order.save((err, order) => {
                chai.request(app)
            .get('/ordersByStatus/' + order.status)
            .send(order)
            .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    expect(res.body).that.contains.something.like({status: order.status});
                done();
            });
            });
        });
    });


    // Test the /GET/:orderId route
    describe('/GET/:orderId order', () => {
        it('it should GET order items by the order id', (done) => {
            let order = new Order({ 
                createdBy: user1._id,
                status: "open",
                items: [{
                        id: item1._id,
                        quantity: 4
                    },
                    {
                        id: item2._id,
                        quantity: 2
                    }]
            });
            order.save((err, order) => {
                chai.request(app)
            .get('/itemsByOrderId/' + order.id)
            .send(order)
            .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('items');
                    res.body.items.should.be.a('array');
                done();
            });
            });
        });
    });


    // Test the /PUT/:orderId route
    describe('/PUT/:orderId add new item', () => {
        it('it should ADD an item to a given order', (done) => {
            let order = new Order({ 
                createdBy: user1._id,
                status: "open",
                items: [{
                        id: item1._id,
                        quantity: 4
                    }]
            });

            order.save((err, order) => {
                new Promise((resolve) => {
                    resolve(
                        chai.request(app)
                        .put('/addNewItem/' + order.id)
                        .send({
                            id: item2._id,
                            quantity: 1
                        })
                    )
                })
                .then((res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(2);

                    let updatedOrder = res.body[0]
                    let updatedItem = res.body[1]

                    updatedOrder.should.be.a('object')
                    updatedOrder.should.have.property('createdBy');
                    updatedOrder.should.have.property('status');
                    updatedOrder.should.have.property('items');
                    updatedOrder.items.should.be.a('array');
                    updatedOrder.items.length.should.be.eql(order.items.length + 1);
                    updatedOrder.items[updatedOrder.items.length-1].quantity.should.be.eql(1);

                    updatedItem.should.be.a('object')
                    updatedItem.should.have.property('_id');
                    updatedItem.should.have.property('name');
                    updatedItem.should.have.property('unitPrice');
                    updatedItem.should.have.property('quantity');
                }).finally(done);
            });
        });
    });

    // Test the /PUT/:orderId/:itemId route
    describe('/PUT/:orderId/:itemId remove item', () => {
        it('it should REMOVE an item from a given order', (done) => {
            let order = new Order({ 
                createdBy: user1._id,
                status: "open",
                items: [{
                        id: item1._id,
                        quantity: 4
                    },
                    {
                        id: item2._id,
                        quantity: 2
                    }]
            });

            order.save((err, order) => {
                new Promise((resolve) => {
                    resolve(
                        chai.request(app)
                        .put('/removeItem/' + order.id + '/' + order.items[1]._id)
                        .send({
                            refId: order.items[1].id,
                            quantity: order.items[1].quantity
                        })
                    )
                })
                .then((res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(2);

                    let updatedOrder = res.body[0]
                    let updatedItem = res.body[1]

                    updatedOrder.should.be.a('object')
                    updatedOrder.should.have.property('createdBy');
                    updatedOrder.should.have.property('status');
                    updatedOrder.should.have.property('items');
                    updatedOrder.items.should.be.a('array');
                    updatedOrder.items.length.should.be.eql(order.items.length - 1);

                    updatedItem.should.be.a('object')
                    updatedItem.should.have.property('_id');
                    updatedItem.should.have.property('name');
                    updatedItem.should.have.property('unitPrice');
                    updatedItem.should.have.property('quantity');
                }).finally(done);
            });
        });
    });


    // Test the /PUT/:orderId/:itemId route
    describe('/PUT/:orderId/:itemId  increase item quantity', () => {
        it('it should INCREASE an item quantity from a given item of a given order', (done) => {
            let order = new Order({ 
                createdBy: user1._id,
                status: "open",
                items: [{
                        id: item1._id,
                        quantity: 4
                    }]
            });

            order.save((err, order) => {
                new Promise((resolve) => {
                    resolve(
                        chai.request(app)
                        .put('/increaseItemQuantity/' + order.id + '/' + order.items[0]._id)
                        .send({
                            refId: order.items[0].id,
                            quantity: order.items[0].quantity + 1
                        })
                    )
                })
                .then((res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(2);

                    let updatedOrder = res.body[0]
                    let updatedItem = res.body[1]

                    updatedOrder.should.be.a('object')
                    updatedOrder.should.have.property('createdBy');
                    updatedOrder.should.have.property('status');
                    updatedOrder.should.have.property('items');
                    updatedOrder.items.should.be.a('array');
                    updatedOrder.items[0].quantity.should.be.eql(order.items[0].quantity + 1);

                    updatedItem.should.be.a('object')
                    updatedItem.should.have.property('_id');
                    updatedItem.should.have.property('name');
                    updatedItem.should.have.property('unitPrice');
                    updatedItem.should.have.property('quantity');
                }).finally(done);
            });
        });
    });

    // Test the /PUT/:orderId/:itemId route
    describe('/PUT/:orderId/:itemId decrease item quantity', () => {
        it('it should DECREASE an item quantity from a given item of a given order', (done) => {
            let order = new Order({ 
                createdBy: user1._id,
                status: "open",
                items: [{
                        id: item2._id,
                        quantity: 6
                    }]
            });

            order.save((err, order) => {
                new Promise((resolve) => {
                    resolve(
                        chai.request(app)
                        .put('/decreaseItemQuantity/' + order.id + '/' + order.items[0]._id)
                        .send({
                            refId: order.items[0].id,
                            quantity: order.items[0].quantity - 1
                        })
                    )
                })
                .then((res) => {  
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(2);

                    let updatedOrder = res.body[0]
                    let updatedItem = res.body[1]

                    updatedOrder.should.be.a('object')
                    updatedOrder.should.have.property('createdBy');
                    updatedOrder.should.have.property('status');
                    updatedOrder.should.have.property('items');
                    updatedOrder.items.should.be.a('array');
                    updatedOrder.items[0].quantity.should.be.eql(order.items[0].quantity - 1);

                    updatedItem.should.be.a('object')
                    updatedItem.should.have.property('_id');
                    updatedItem.should.have.property('name');
                    updatedItem.should.have.property('unitPrice');
                    updatedItem.should.have.property('quantity');
                }).finally(done);
            });
        });
    });



});
