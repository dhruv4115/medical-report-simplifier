const express = require('express');
const multer = require('multer');
const reportController = require('../controllers/report.controller');

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });
router.post('/process-report', upload.single('image'), reportController.processReport);

module.exports = router;