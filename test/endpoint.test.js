const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../index');

const expect = chai.expect;

chai.use(chaiHttp);

describe('User endpoint tests', function() {

    before(function() {
        return runServer();
      });

    after(function() {
        return closeServer();
      });

    it('should list a user', function() {
        return chai.request(app)
            .get('/api/users')
            .then(function(res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            expect(res.body).to.be.a('array');
            expect(res.body.length).to.be.above(0);
            const expectedKeys = ['id', 'firstName', 'lastName', 'className'];
            res.body.forEach(function(item) {
                expect(item).to.be.a('object');
                expect(item).to.include.keys(expectedKeys);
            });
            });
    });

    it('should add an user on POST', function() {
        const newUser = {firstName: 'John', lastName: 'Doe', className: 'BIO103'};
        return chai.request(app)
          .post('/api/newUser')
          .send(newUser)
          .then(function(res) {
            expect(res).to.have.status(201);
            expect(res).to.be.json;
            expect(res.body).to.be.a('object');
            expect(res.body).to.include.keys('id', 'firstName', 'lastName', 'className');
            expect(res.body.id).to.not.equal(null);
            expect(res.body).to.deep.equal(Object.assign(newUser, {id: res.body.id}));
          });
      });

    it('should update user', function() {
        const updateUser = {
            firstName: 'John',
            lastName: 'Doe',
            className: 'BIO103'
        };
        return chai.request(app)
            .get('/api/users')
            .then(function(res) {
            updateUser.id = res.body[0].id;
            return chai.request(app)
                .put(`/api/newUser/${updateUser.id}`)
                .send(updateUser)
            })
            .then(function(res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            expect(res.body).to.be.a('object');
            expect(res.body).to.deep.equal(updateUser);
            });
        });

    it('should delete items on DELETE', function() {
        return chai.request(app)
            .get('/api/users')
            .then(function(res) {
            return chai.request(app)
                .delete(`'/api/users'/${res.body[0].id}`);
            })
            .then(function(res) {
            expect(res).to.have.status(204);
            });
        });
})