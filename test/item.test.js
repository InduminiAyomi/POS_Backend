process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let ItemModel = require('../app/models/item.model');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../app');
let should = chai.should();

chai.use(chaiHttp);

describe('Items', () => {

  beforeEach((done) => { //Before each test we empty the database
    ItemModel.remove({}, (err) => { 
        done();           
    });        
  });

  // Test the /GET route
  describe('/GET items', () => {
      it('it should GET all the items', (done) => {
        chai.request(app)
            .get('/allItems')
            .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('array');
                  res.body.length.should.be.eql(0);
              done();
            });
      });
  });

  // Test the /GET/:itemId route
  describe('/GET/:itemId item', () => {
    it('it should GET a item by the given id', (done) => {
        let item = new ItemModel({ name: "Latte", unitPrice: 2.99 , quantity: 20 });
        item.save((err, item) => {
            chai.request(app)
          .get('/item/' + item.id)
          .send(item)
          .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('name');
                res.body.should.have.property('unitPrice');
                res.body.should.have.property('quantity');
                res.body.should.have.property('_id').eql(item.id);
            done();
          });
        });
    });
  
    // Test the /POST route
    describe('/POST item', () => {
      it('it should POST a item', (done) => {
          let item = {
            name: "Iced Coffee",
            unitPrice: 3.99,
            quantity: 15
          }
        chai.request(app)
            .post('/addItem')
            .send(item)
            .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('object');
                  res.body.should.have.property('name');
                  res.body.should.have.property('unitPrice');
                  res.body.should.have.property('quantity');
              done();
            });
      });
    });
    
    // Test the /PUT/:itemId route
    describe('/PUT/:itemId item', () => {
      it('it should UPDATE a item given the id', (done) => {
          let item = new ItemModel({name: "Capuccino", unitPrice: 4.99, quantity: 12})
          item.save((err, item) => {
                chai.request(app)
                .put('/updateItem/' + item._id)
                .send({name: "Capuccino", unitPrice: 3.99, quantity: 12})
                .end((err, res) => {
                      res.should.have.status(200);
                      res.body.should.be.a('object');
                      res.body.should.have.property('unitPrice').eql(3.99);
                  done();
                });
          });
      });
    });

    // Test the /PUT/:itemId route
    describe('/PUT/:itemId item quantity', () => {
      it('it should UPDATE a item qunatity given the id', (done) => {
          let item = new ItemModel({name: "Capuccino", unitPrice: 4.99, quantity: 12})
          item.save((err, item) => {
                chai.request(app)
                .put('/changeItemQuantity/' + item._id)
                .send({quantity: 10})
                .end((err, res) => {
                      res.should.have.status(200);
                      res.body.should.be.a('object');
                      res.body.should.have.property('quantity').eql(10);
                  done();
                });
          });
      });
    });

    // Test the /DELETE/:itemId route
    describe('/DELETE/:itemId item', () => {
      it('it should DELETE a item given the id', (done) => {
          let item = new ItemModel({name: "Long Black", unitPrice: 2.99, quantity: 7})
          item.save((err, item) => {
                chai.request(app)
                .delete('/deleteItem/' + item._id)
                .end((err, res) => {
                      res.should.have.status(200);
                      res.body.should.be.a('object');
                      res.body.should.have.property('message').eql('Item deleted successfully!');
                  done();
                });
          });
        });
      });
    });

  afterEach((done) => { 
    ItemModel.remove({}, (err) => { 
      done();           
    });        
  });

});
