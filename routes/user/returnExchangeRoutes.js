const express = require('express');
const authenticate = require('../../middlewares/authMiddleware');
const {
  requestReturnExchange,
  getUserRequests,
  cancelRequest,
} = require('../../controllers/user/returnExchangeController');

const router = express.Router();

router.post('/return-exchange', authenticate, requestReturnExchange);
router.get('/return-exchange', authenticate, getUserRequests);
router.delete('/return-exchange/:requestId', authenticate, cancelRequest);

module.exports = router;
