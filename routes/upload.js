const express = require('express')
const multer  = require('multer')
const router = express.Router({mergeParams: true})
const upload = multer({ dest: 'uploads/' })
const uploadController = require('../controllers/uploads')
const {isLoggedIn} = require('../middleware')

router.route('/')
    .get(uploadController.index)
    .post(isLoggedIn, upload.array('csvs'), uploadController.uploadFiles)

router.route('/seed')
    .post(isLoggedIn, uploadController.uploadSeeds)

module.exports = router