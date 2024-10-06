import express from "express";

const router = express.Router();

router.use(express.json());

// Mock data
const userData = {
  dreamVacation: "bali, indonesia",
  id: 1,
  location: [49.2799, 122.9199],
  major: "psychology",
  name: "Alan",
  year: 3
};

router.get("/", (req, res) => {
  res.json(userData);
});

export default router;
