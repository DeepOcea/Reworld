var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('../config/config');
var ua = require('mobile-agent');

/* GET users listing. */
router.get('/', function(req, res, next) {
	var agent = ua(req.headers['user-agent']);
	var page = agent.Mobile ? 'missionMobile' : 'mission';
    
	res.render(page,{'path':'','title':'登录','user':req.session.user});
});
module.exports = router;