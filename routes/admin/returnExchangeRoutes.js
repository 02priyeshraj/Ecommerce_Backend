const express = require('express');
const authenticate = require('../../middlewares/authMiddleware');
const {
  processRequest,
  getProcessedRequests
} = require('../../controllers/admin/returnExchangeController');

const router = express.Router();


router.put('/return-exchange/:requestId', authenticate, processRequest);
router.get('/return-exchange/history', authenticate, getProcessedRequests);

module.exports = router;
