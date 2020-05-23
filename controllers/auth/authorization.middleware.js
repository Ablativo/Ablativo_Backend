'use strict';

const jwt = require('jsonwebtoken');

exports.validateToken =async(req, res, next) => {
	var token =  req.body.token || req.query.token || req.headers['x-access-token'];

 	if (token) {
		jwt.verify(token, require('../../secret'), (err, decoded) => {
			if (err || !decoded) {
				console.log("INFO PARAM OUT: validateToken : Effettua nuovamente l'accesso, Token non validato o incorretto "+token );
				res.send({
					success: false,
					status: 401,
					tokenExpired: true,
					message: "Effettua nuovamente l'accesso"
				});
			} else {
				console.log('INFO PARAM OUT: validateToken : Validato '+decoded._id +'   '+decoded.email );
				req.decoded = decoded;
				next();
			}
		});
	} else {
		console.log('INFO PARAM OUT: validateToken : User not Authenticated, manca il token');

		res.send({
			success: false,
			status: 406, 
			message: 'User not Authenticated'
		});
	}
};

