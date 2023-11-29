const supertest = require('supertest');
const request = supertest('https://gorest.co.in/public/v2/');
const { expect } = require('chai')
require('dotenv').config()
const token = 'adbf7b90c0a6c77b1099067013b6d1ec9602ca7330d515abf40b5c133e886b2c'
describe('user test', () => {
    //// to run only one test use "it.only(... )"
    //// to skip test use "xit" or xdescribe or "it.skip"
    let userid;
    describe('post', () => {
        //// tring post method
        it(' user', () => {
            const user = {
                email: `test-${Math.floor(Math.random() * 9999)}@mail.ca`,
                name: 'Test name',
                gender: 'male',
                status: 'inactive',
            };
            return request
                .post('users')
                .set('Authorization', `Bearer ${token}`)
                .send(user)
                .then(data => {
                    // Add a check for data.body existence
                    expect(data.body).to.be.an('object');

                    // Now check if data.body includes all user propertys
                    expect(data.body).to.deep.include(user);
                    userid = data.body.id;
                    console.log(userid)
                });
        });
    })
    ////////////////////////
    describe('get', () => {
        /////////// to check that if there is a data
        it('getint user', () => {
            return request.get(`users?access-token=${token}`)
                .then((res) => {
                    expect(res.body).to.not.be.empty;

                })
        })
        ////////// check one data
        it(`:id /${userid}`, () => {
            return request.get(`users/${userid}?access-token=${token}`)
                .then((res) => {
                    expect(res.body.id).to.be.eq(userid);
                    expect(res.body).to.not.be.deep.equal({})
                })
        })

        ////// to check every data
        it(' and check', () => {
            return request.get(`users?access-token=${token}`)
                .then((res) => {
                    res.body.forEach((user) => {
                        expect(user).to.have.property('name').and.to.have.length.above(0);
                        expect(user).to.have.property('email').and.to.match(/^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/); // Regex for email validation
                    });
                });
        });
    })
    //////////////////
    describe('put', () => {
        it(`PUT /users/:${userid}`, () => {
            const data = {
                status: 'active',
                name: `Luffy - ${Math.floor(Math.random() * 9999)}`,
            };

            return request
                .put(`users/${userid}`)
                .set('Authorization', `Bearer ${token}`)
                .send(data)
                .then((res) => {
                    expect(res.body).to.deep.include(data);
                });
        });
    })
    ///////////////
    describe('delete', () => {
        it(`DELETE /users/:${userid}`, () => {
            return request
                .delete(`users/${userid}`)
                .set('Authorization', `Bearer ${token}`)
                .then((res) => {
                    // Use logical OR outside the expect statements
                    expect(res.body).to.deep.equal({})
                    expect(res.body).to.deep.equal({ "message": "Resource not found" });
                });
        });
    })

})