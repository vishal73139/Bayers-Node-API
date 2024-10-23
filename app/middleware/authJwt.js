const jwt = require('jsonwebtoken');
const config = require('../config/auth.config.js');

/*
 **
 ** Verify Token
 ** @param {req, res, next}
 ** @return {next}
 **
 */
verifyToken = (req, res, next) => {
	let token = req.headers['bayers-access-token'];

	if (!token) {
		return res.status(403).send({ message: 'No token provided!' });
	}

	jwt.verify(token, config.secret, (err, decoded) => {
		if (err) {
			return res.status(401).send({
				message: 'Unauthorized!'
			});
		}
		req.userEmail = decoded.email;
		req.role = decoded.role;
		req.name = decoded.name;
		req.dbId = decoded.dbId;
		next();
	});
};

const authJwt = {
	verifyToken
};
module.exports = authJwt;
