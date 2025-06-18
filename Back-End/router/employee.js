const express = require('express');
const router = express.Router();
const employeeController = require('../controller/employee'); // Update path if needed

// Auth Routes
router.post('/signup', employeeController.signup);
router.post('/login', employeeController.login);
router.post('/logout', employeeController.logout);

// Employee Routes
router.get('/getAll', employeeController.getAllEmployees);
router.patch('/verify/:id', employeeController.verifyEmployee); // 👈 New route to verify employee
router.post('/addVisaId/:id/add-visa', employeeController.addVisaId);
router.get('/getByUserId/:userId/visas', employeeController.getUserVisaDetails);
module.exports = router;
