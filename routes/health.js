const express = require('express');
const HealthCheck = require('../models/HealthCheck');

const router = express.Router();

// Health check endpoint
router.get('/healthz', async (req, res) => {
  try {
    // Check if request has any payload/body OR query parameters
    const hasBody = req.body && Object.keys(req.body).length > 0;
    const hasQuery = Object.keys(req.query).length > 0;
    
    if (hasBody || hasQuery) {
      return res.status(400)
        .set({
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'X-Content-Type-Options': 'nosniff'
        })
        .end();
    }
    // Insert health check record
    await HealthCheck.create({
      check_datetime: new Date()
    });

    // Return success response
    res.status(200)
      .set({
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'X-Content-Type-Options': 'nosniff'
      })
      .end();

  } catch (error) {
    console.error('Health check failed:', error.message);
    
    // Return service unavailable on database error
    res.status(503)
      .set({
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'X-Content-Type-Options': 'nosniff'
      })
      .end();
  }
});

// Handle non-GET methods
router.all('/healthz', (req, res) => {
  res.status(405)
    .set({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'X-Content-Type-Options': 'nosniff'
    })
    .end();
});

module.exports = router;