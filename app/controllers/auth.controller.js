const express = require('express');
const router = express.Router();
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');

const config = require('../config/auth.config');

/*
 ** Service Functions
 */
const { findUser, saveUser } = require('../services/user.service');

/*
 **
 ** Middleware
 ** @param {req, res, next}
 ** @return {next}
 */
const { verifyToken } = require('../middleware/authJwt');
const { isEmailFormatCorrect } = require('../helpers/appHelper');
const { savePatient } = require('../services/patient.service');

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

/*
 **
 ** BAYERS REGISTER
 ** @param {req, res}
 ** @return Access Token and User Details
 **
 */

router.post('/signup', async (req, res) => {
	try {
		const { name, email, password, dateOfBirth } = req.body;

		/*
		 * VALIDATIONS
		 * 1. Email is required.
		 * 2. Password must be at least 8 characters.
		 * 3. Name is required.
		 */

		if (!isEmailFormatCorrect(email)) return res.status(400).send({ message: 'Email is not valid!' });
		if (password.length < 8) return res.status(400).send({ message: 'Password must be at least 8 characters!' });
		if (!name) return res.status(400).send({ message: 'Name is required!' });

		let isUserExists = await findUser(email);
		if (isUserExists) return res.status(400).send({ message: 'User already exists!' });

		const userData = {
			email: email,
			password: bcrypt.hashSync(password, 8),
			role: 'PATIENT',
			name: name
		};

		await saveUser(userData)
			.then(user => {
				if (userData.role == 'PATIENT' && user._id) {
					// Save Patient
					savePatient({
						DOB: dateOfBirth,
						userId: user._id,
						bloodType: ''
					});
				}

				res.send({ message: 'User was registered successfully!' });
			})
			.catch(err => {
				res.status(400).send({ message: err?.message });
			});
	} catch (err) {
		return res.status(400).send({ message: 'Failed to Save User details!' });
	}
});

module.exports = router;
