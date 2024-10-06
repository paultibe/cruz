import express from "express";

const router = express.Router();

router.use(express.json());

router.get("/", (req, res) => {
  console.log("Alan");
  res.send("Hello from Google Places endpoint");
});

export default router;
