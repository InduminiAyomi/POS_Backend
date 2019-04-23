process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let UserModel = require('../app/models/user.model');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../app');
let should = chai.should();

chai.use(chaiHttp);

describe('Users', () => {

    beforeEach((done) => { //Before each test we empty the database
        UserModel.remove({}, (err) => { 
            done();           
        });        
    });

    // Test the /POST route
    describe('/POST user', () => {
        it('it should POST a user', (done) => {
            let user = {
                username: "admin",
                password: "admin"
              }
            chai.request(app)
                .post('/addUser')
                .send(user)
                .end((err, res) => {
                      res.should.have.status(200);
                      res.body.should.be.a('object');
                      res.body.should.have.property('username');
                      res.body.should.have.property('password');
                  done();
                });
        });
    });

    // Test the /GET route
    describe('/GET users', () => {
        it('it should GET all the users', (done) => {
        chai.request(app)
            .get('/allUsers')
            .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(0);
                done();
            });
        });
    });

    // Test the /DELETE/:userId route
    describe('/DELETE/:userId user', () => {
        it('it should DELETE a user given the id', (done) => {
            let user = new UserModel({username: "test user", password: "no password" })
            user.save((err, user) => {
                  chai.request(app)
                  .delete('/deleteUser/' + user._id)
                  .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('message').eql('User deleted successfully!');
                    done();
                  });
            });
        });
    });

    afterEach((done) => { 
        UserModel.remove({}, (err) => { 
            done();           
        });        
    });


});
