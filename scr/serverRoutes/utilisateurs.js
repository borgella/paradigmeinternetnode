"use strict"

var express = require('express');
var router = express.Router();
var response = require('../views/responseJson');
var hateoas = require('../../service/hateoas');
var util = require('../../service/util');


router.get('/fil',function(req,res,next){
    res.status(200)
    .send(response.responseJson(true,"Utilisateur requests",hateoas.link("home",{})));
});



module.exports = router;