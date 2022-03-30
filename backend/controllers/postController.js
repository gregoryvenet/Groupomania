const router = require('express').Router()
const db = require('../config/dbConfig')
const postModel = require('../models/postModel')

module.exports.readPost = (req, res) => {
	postModel.find((err, docs)
		.then((results) => {
			res.status(200).send(results).sort({ createdAt: -1})
		})
		.catch((err) => {
			res.status(500).send("Erreur chargement des données: ", err)
		})
	)
};

module.exports.createPost = async (req, res) => {
	const { content, userId } = req.body;
	try {
		const user = await postModel.findOne({
			where: { id: userId },
		});
		const post = await Post.create({ content, userId: user.id });
		return res.json(post);
	} catch (err) {
		return res.status(500).json(err);
	}
};

module.exports.updatePost = (req, res) => {

};

module.exports.deletePost = (req, res) => {

};

module.exports.likePost = async (req, res) => {

};

module.exports.unlikePost = async (req, res) => {

};

module.exports.commentPost = (req, res) => {

};

module.exports.editCommentPost = (req, res) => {

};

module.exports.deleteCommentPost = (req, res) => {

};
