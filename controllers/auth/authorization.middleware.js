'use strict';

const jwt = require('jsonwebtoken');

exports.validateToken =async(req, res, next) => {
	var token =  req.body.token || req.query.token || req.headers['x-access-token'];

 	if (token) {
		jwt.verify(token, require('../../secret'), (err, decoded) => {
			if (err || !decoded) {
				console.log("INFO PARAM OUT: validateToken : Try again the access, not valid or incorrect Token"+token );
				res.send({
					success: false,
					status: 401,
					tokenExpired: true,
					message: "Try again the access"
				});
			} else {
				console.log('INFO PARAM OUT: validateToken : Validated '+decoded._id  );
				req.decoded = decoded;
				next();
			}
		});
	} else {
		console.log('INFO PARAM OUT: validateToken : User not Authenticated, missing token');

		res.send({
			success: false,
			status: 406, 
			message: 'User not Authenticated'
		});
	}
};

