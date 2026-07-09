const express = require("express");
const router = express.Router();
const {
  getActivities,
  getActivity,
  createActivity,
  updateActivity,
  deleteActivity,
  assignOwner,
  getPendingActivities,
  moderateActivity
} = require("../controllers/activityController");
const { protect, authorize } = require("../middleware/auth");

router.get("/", getActivities);
router.get("/pending", protect, authorize("admin"), getPendingActivities);
router.get("/:id", getActivity);
router.post("/", protect, createActivity);
router.put("/:id/moderate", protect, authorize("admin"), moderateActivity);
router.put("/:id", protect, authorize("admin", "owner"), updateActivity);
router.delete("/:id", protect, authorize("admin"), deleteActivity);
router.put("/:id/assign-owner", protect, authorize("admin"), assignOwner);

module.exports = router;