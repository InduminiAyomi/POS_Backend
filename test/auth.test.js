process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let UserModel = require('../app/models/user.model');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../app');
let should = chai.should();

chai.use(chaiHttp);

describe('Authentication', () => {

    beforeEach((done) => { //Before each test we empty the database
        UserModel.remove({}, (err) => { 
            done();           
        });        
    });

    // Test the /POST route
    describe('/POST auth', () => {
        it('it should retrieve a single User with Username and Password ', (done) => {
            let user = new UserModel({ 
                username: "admin",
                password: "admin"
            });
            user.save((err, user) => {
                chai.request(app)
                .post('/auth')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('boolean');
                    done();
                });
            });
        });
    });

    afterEach((done) => { //Before each test we empty the database
        UserModel.remove({}, (err) => { 
            done();           
        });        
    });

});
