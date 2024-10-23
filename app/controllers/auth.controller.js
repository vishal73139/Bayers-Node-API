const express = require('express');
const router = express.Router();
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
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
const { isEmailFormatCorrect } = require('../helpers/appHelper');
const { savePatient } = require('../services/patient.service');
const {
	INVALID_PASSWORD,
	INVALID_EMAIL,
	PASSWORD_ERROR,
	USER_ALERADY_ERROR,
	USER_REGISTER_SUCCESS,
	INVALID_NAME_ERROR
} = require('../constants/constants');

/*
 **
 ** BAYERS SIGNIN
 ** @param {req, res}
 ** @return Access Token and User Details
 **
 */

router.post(
	'/signin',
	[body('email', INVALID_EMAIL).isEmail(), body('password', PASSWORD_ERROR).isLength({ min: 8 })],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		try {
			const { email, password } = req.body;

			const user = await findUser(email);
			if (!user) {
				return res.status(400).send({ message: INVALID_PASSWORD });
			}

			var passwordIsValid = bcrypt.compareSync(password, user.password);

			if (!passwordIsValid) {
				return res.status(400).send({ message: INVALID_PASSWORD });
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
	}
);

/*
 **
 ** BAYERS REGISTER
 ** @param {req, res}
 ** @return Sucess Message
 **
 */

router.post(
	'/signup',
	[
		body('name', INVALID_NAME_ERROR).notEmpty(),
		body('email', INVALID_EMAIL).isEmail(),
		body('password', PASSWORD_ERROR).isLength({ min: 8 })
	],
	async (req, res) => {
		try {
			const { name, email, password, dateOfBirth } = req.body;

			let isUserExists = await findUser(email);
			if (isUserExists) return res.status(400).send({ message: USER_ALERADY_ERROR });

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

					res.send({ message: USER_REGISTER_SUCCESS });
				})
				.catch(err => {
					res.status(400).send({ message: err?.message });
				});
		} catch (err) {
			return res.status(400).send({ message: 'Failed to Save User details!' });
		}
	}
);

module.exports = router;
