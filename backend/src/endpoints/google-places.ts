import express from 'express';

const router = express.Router();

router.use(express.json());

// Add your route handlers here
// For example:
// router.get('/some-endpoint', (req, res) => { ... });

router.post('/assign-driver', (req, res) => {
  // For now, we're hardcoding the driver
  const driver = {
    name: "Kashish Garg",
    // You can add more driver details here if needed
  };

  res.json(driver);
});

export default router;
