const express = require("express");
const router = express.Router({ mergeParams: true });
const { getReviews, createReview, updateReview, deleteReview } = require("../controllers/reviewController");
const { protect, authorize } = require("../middleware/auth");

router.get("/", getReviews);
router.post("/", protect, createReview);
router.put("/:id", protect, updateReview);
router.delete("/:id", protect, deleteReview);

module.exports = router;