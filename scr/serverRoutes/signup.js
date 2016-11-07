"use strict"

var stringify = require('json-stringify');
var express = require('express');
var router = express.Router();
var response = require('../views/responseJson');
var hateoas = require('../../service/hateoas');
var util = require('../../service/util');
var User = require('../model/user');
var userDaoImpl = require('../model/userDaoImpl');


router.post('/signup', beforeSignup, saveUser, function (req, res, next) {
    res.status(201)
        .send(response.responseJson(true, req.body, req.body.token, hateoas.link("signup", {})));
});

function beforeSignup(req, res, next) {
    if ((stringify(req.body)) != "{}") {
        req.body = new User(req.body);
        req.body.validate(function (error) {
            if (error) {
                next(error);
            } else {
                util.generateToken(req.body.email, function (error, tokens) {
                    if (tokens) {
                        var token = { id: req.body._id, token: tokens };
                        req.body.token = token;
                        next();
                    } else next(new Error('Can not generate the tokens'));
                });
            }
        });
    } else next(new Error("The body is empty. Enter informations to signup."));
}

function saveUser(req, res, next) {
    util.generateSaltHash(req.body.password, function (error, hash) {
        if (hash) {
            req.body.password = hash;
            userDaoImpl.saveInDataBase(req, res, next);
        } else next(new Error('we could not hash the password.'));
    });

}

module.exports = router;