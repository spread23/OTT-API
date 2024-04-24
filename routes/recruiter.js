const express = require('express')

const RecruiterController = require('../controllers/recruiter')

const router = express.Router()

router.get('/test', RecruiterController.test)

module.exports = router