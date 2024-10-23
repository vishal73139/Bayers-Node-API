const express = require('express');
const router = express.Router();
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');

const config = require('../config/auth.config');

/*
 ** Service Functions
 */
const { findUser } = require('../services/user.service');

/*
 **
 ** Middleware
 ** @param {req, res, next}
 ** @return {next}
 */
const { verifyToken } = require('../middleware/authJwt');

/*
 **
 ** BAYERS SIGNIN
 ** @param {req, res}
 ** @return Access Token and User Details
 **
 */

router.post('/signin', async (req, res) => {
	try {
		const { email, password } = req.body;

		let errorMessage = 'Error : The password is invalid or the user does not have a password.';
		let userNotVaildError =
			'Error : There is no user record corresponding to this identifier. The user may have been deleted.';

		if (!email || !password) {
			return res.status(400).send({ message: errorMessage });
		}

		const user = await findUser(email);
		if (!user) {
			return res.status(400).send({ message: userNotVaildError });
		}

		var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

		if (!passwordIsValid) {
			return res.status(400).send({ message: errorMessage });
		}

		const token = jwt.sign(
			{
				email: user.email,
				dbId: user._id,
				role: user.role,
				name: user.name
			},
			config.secret,
			{
				algorithm: 'HS256',
				allowInsecureKeySizes: true,
				expiresIn: 86400 // 24 hours
			}
		);
		res.status(200).send({
			id: user._id,
			email: user.email,
			name: user.name,
			role: user.role,
			lastLogin: user.lastLogin,
			accessToken: token
		});
	} catch (err) {
		res.status(400).send({ message: err?.message });
	}
});

module.exports = router;
