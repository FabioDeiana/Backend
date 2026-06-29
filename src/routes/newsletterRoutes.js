const express = require("express");
const router = express.Router();
const { subscribe, unsubscribe, updateNewsletterPreference, getSubscribers } = require("../controllers/newsletterController");
const { protect, authorize } = require("../middleware/auth");

router.post("/subscribe", subscribe);
router.post("/unsubscribe", unsubscribe);
router.put("/preference", protect, updateNewsletterPreference);
router.get("/subscribers", protect, authorize("admin"), getSubscribers);

module.exports = router;