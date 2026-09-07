const express = require('express')

const blogController = require('../controllers/blog')

const router = express.Router()

router.get('/tours', blogController.getPosts)
router.get('/tours/countries/:continent', blogController.getCountriesByContinent)
router.get('/tours/:continent', blogController.getPostsByContinent)
router.get('/tours/details/:country', blogController.getPost)
router.post('/new-post', blogController.createPost)

module.exports = router