const express = require('express');
const authenticate = require('../../middlewares/authMiddleware');
const {
  processRequest,
  getProcessedRequests
} = require('../../controllers/admin/returnExchangeController');

const router = express.Router();


router.put('/admin/return-exchange/:requestId', authenticate, processRequest);
router.get('/admin/return-exchange/history', authenticate, getProcessedRequests);

module.exports = router;
