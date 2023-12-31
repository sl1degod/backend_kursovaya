const Router = require('express')
const violationsController = require('../controller/ViolationsController')
const router = new Router();

router.get('/violations', violationsController.getAllViolations);
router.get('/violationsChar', violationsController.getCharViolations);
router.get('/violations/:id', violationsController.getViolations);

module.exports = router

