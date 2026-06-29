const MenuItem = require("../models/MenuItem");
const Activity = require("../models/Activity");

// GET menu di una attività (con filtri)
const getMenuItems = async (req, res) => {
  try {
    const { category, allergens, dietTags } = req.query;

    let filter = { activity: req.params.activityId };

    if (category) filter.category = category;
    if (allergens) filter.allergens = { $nin: allergens.split(",") };
    if (dietTags) filter.dietTags = { $in: dietTags.split(",") };

    const items = await MenuItem.find(filter);
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Errore del server", error: error.message });
  }
};

// POST crea voce menu (admin o owner)
const createMenuItem = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.activityId);
    if (!activity) {
      return res.status(404).json({ message: "Attività non trovata" });
    }

    // Owner può aggiungere solo alla propria attività
    if (req.user.role === "owner" && activity.owner?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Non hai i permessi per modificare questa attività" });
    }

    const item = await MenuItem.create({
      ...req.body,
      activity: req.params.activityId
    });

    res.status(201).json({ message: "Voce menu aggiunta con successo", item });
  } catch (error) {
    res.status(500).json({ message: "Errore del server", error: error.message });
  }
};

// PUT aggiorna voce menu (admin o owner)
const updateMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id).populate("activity");
    if (!item) {
      return res.status(404).json({ message: "Voce menu non trovata" });
    }

    if (req.user.role === "owner" && item.activity.owner?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Non hai i permessi per modificare questa voce" });
    }

    const updated = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: "Voce menu aggiornata con successo", item: updated });
  } catch (error) {
    res.status(500).json({ message: "Errore del server", error: error.message });
  }
};

// DELETE elimina voce menu (admin o owner)
const deleteMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id).populate("activity");
    if (!item) {
      return res.status(404).json({ message: "Voce menu non trovata" });
    }

    if (req.user.role === "owner" && item.activity.owner?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Non hai i permessi per eliminare questa voce" });
    }

    await item.deleteOne();
    res.json({ message: "Voce menu eliminata con successo" });
  } catch (error) {
    res.status(500).json({ message: "Errore del server", error: error.message });
  }
};

module.exports = { getMenuItems, createMenuItem, updateMenuItem, deleteMenuItem };