const db = require("../models");
const userModel = db.userModel;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const passwordValidator = require("password-validator");
const fs = require("fs");

//Schema password
const schemaPassword = new passwordValidator();
schemaPassword
	.is()
	.min(8)
	.is()
	.max(100)
	.has()
	.uppercase()
	.has()
	.lowercase()
	.has()
	.not()
	.spaces()
	.has()
	.digits(2);

exports.signup = (req, res) => {
	if (schemaPassword.validate(req.body.password)) {
		bcrypt.hash(req.body.password, 10).then((hash) => {
			const user = {
				firstName: req.body.firstName,
				lastName: req.body.lastName,
				email: req.body.email,
				password: hash,
				avatar: `${req.protocol}://${req.get("host")}/images/avatar.webp`,
			};
			userModel
				.create(user)
				.then(() => res.status(201).json({ message: "Utilisateur créé !" }))
				.catch((err) => {
					res.status(500).json({
						message: err.message,
					});
				});
		});
	} else {
		res.status(401).json({
			message:
				"Le mot de passe doit contenir 8 caractères, 1 majuscule, 1 minuscule et 2 chiffres minimum!",
		});
	}
};
exports.login = async (req, res) => {
	await userModel
		.findOne({ where: { email: req.body.email } })
		.then((user) => {
			if (!user) {
				return res
					.status(401)
					.json({ error: "identifiant non valide ou inéxistant" });
			} else {
				bcrypt
					.compare(req.body.password, user.password)
					.then((valid) => {
						if (!valid) {
							return res.status(401).json({ error: "password non valide" });
						}
						res.status(200).json({
							id: user.id,
							username: user.username,
							token: jwt.sign({ userId: user.id }, process.env.TOKEN_KEY, {
								expiresIn: "24h",
							}),
							message: "Utilisateur connecté avec succès !",
						});
					})
					.catch((error) => res.status(500).json({ error }));
			}
		})
		.catch((error) => res.status(500).json({ error }));
};
exports.getAllUsers = async (req, res, next) => {
	await userModel
		.findAll({ attributes: ["id", "firstName", "lastName", "email", "avatar"] })
		.then((users) => res.status(200).json(users))
		.catch((error) => res.status(400).json(error));
};

exports.findOneUser = async (req, res) => {
	const id = req.params.id;
	await userModel
		.findByPk(id)
		.then((data) => {
			if (data) {
				res.send(data);
			} else {
				res.status(404).send({
					message: `Ne peut pas trouver l'utilisateur avec l'id= ` + id,
				});
			}
		})
		.catch((err) => {
			res.status(500).send({
				message:
					"erreur lors de la récupération de l'utilisateur avec l'id=" + id,
			});
		});
};

exports.updateUser = async (req, res) => {
	userModel.findOne({ where: { id: req.params.id } })
		.then((user) => {
			if (
				user.avatar !==
					`${req.protocol}://${req.get("host")}/images/${req.file.filename}` &&
				user.avatar !== "http://localhost:5000/images/avatar.webp"
			) {
				let img = user.avatar.split("/images/")[1];
				fs.unlink("images/" + img, () => {
					userModel.update(
						{
							avatar:
								req.protocol +
								"://" +
								req.get("host") +
								"/images/" +
								req.file.filename,
						},
						{ where: { id: req.params.id } },
					)
						.then(() => {
							res.status(201).json({
								avatar: `${req.protocol}://${req.get("host")}/images/${
									req.file.filename
								}`,
								message: "Votre photo de profil à bien été modifiée",
							});
						})
						.catch((error) => res.status(404).json({ error }));
				});
			} else {
				userModel.update(
					{
						avatar:
							req.protocol +
							"://" +
							req.get("host") +
							"/images/" +
							req.file.filename,
					},
					{ where: { id: req.params.id } },
				)
					.then(() => {
						res.status(201).json({
							avatar: `${req.protocol}://${req.get("host")}/images/${
								req.file.filename
							}`,
							message: "Votre photo de profil à bien été modifiée",
						});
					})
					.catch((error) => res.status(404).json({ error }));
			}
		})
		.catch((error) => res.status(500).json(error));
};
exports.deleteUser = async (req, res) => {
	await userModel
		.findOne({
			where: { id: req.params.id },
		})
		.then((user) => {
			if (user.avatar !== "http://localhost:5000/images/avatar.webp") {
				const filename = user.avatar.split("/images/")[1];
				fs.unlink(`images/${filename}`, () => {
					userModel.destroy({ where: { id: req.params.id } })
						.then(() => {
							res
								.status(200)
								.json({
									message: "Votre compte utilisateur à bien été supprimé.",
								});
						})
						.catch((error) => res.status(404).json({ error }));
				});
			} else {
				userModel.destroy({ where: { id: req.params.id } })
					.then(() =>
						res
							.status(200)
							.json({
								message: "Votre compte utilisateur à bien été supprimé.",
							}),
					)
					.catch((error) => res.status(404).json({ error }));
			}
		})
		.catch((error) => res.status(500).send({ error }));
};
