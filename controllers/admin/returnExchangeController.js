const ReturnExchange = require('../../models/returnExchangeModel');

// Admin Approves or Rejects Return/Exchange Request
exports.processRequest = async (req, res) => {
    const { requestId } = req.params;
    const { status } = req.body;
  
    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status update' });
    }
  
    try {
      const request = await ReturnExchange.findById(requestId).populate('orderId productId');
  
      if (!request) {
        return res.status(404).json({ message: 'Request not found' });
      }
  
      request.status = status;
      request.resolvedDate = new Date();
  
      if (status === 'Approved') {
        if (request.type === 'Return') {
          // Refund process
          if (request.refundMethod === 'Original Payment Method') {
            console.log('Refund issued to original payment method');
          } else {
            console.log('Refund issued to saved bank account');
          }
        } else {
          // Exchange process
          console.log(`Product exchanged with product ID: ${request.exchangeProductId}`);
        }
      }
  
      await request.save();
      res.status(200).json({ message: 'Request processed successfully', request });
    } catch (error) {
      res.status(500).json({ message: 'Error processing request', error: error.message });
    }
};

// Admin View History of Processed Refunds and Exchanges
exports.getProcessedRequests = async (req, res) => {
    try {
        const processedRequests = await ReturnExchange.find({
            status: { $in: ['Approved', 'Rejected', 'Completed'] },
        })
        .populate('userId orderId productId exchangeProductId')
        .sort({ resolvedDate: -1 });

        res.status(200).json({
            message: 'Processed requests retrieved successfully',
            processedRequests,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching processed requests',
            error: error.message,
        });
    }
};
