const express = require('express')

const router = express.Router()

const controllers = require('../controllers/consumer')

router.post('/short', controllers.short)

router.get('/getShorts', controllers.getShorts)

router.get('/:id/:preferedText', controllers.redirectToURL)

router.post('/deleteShort', controllers.deleteShort)

module.exports=router;