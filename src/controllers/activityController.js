const Activity = require("../models/Activity");

// GET tutte le attività (con filtri)
const getActivities = async (req, res) => {
  try {
    const { category, city, diet, accessibility, other, search } = req.query;
    let filter = { status: "approved" };

    if (category) filter.category = category;
    if (city) filter.city = new RegExp(city, "i");
    if (search) filter.name = new RegExp(search, "i");
    if (diet) filter["tags.diet"] = { $in: diet.split(",") };
    if (accessibility)
      filter["tags.accessibility"] = { $in: accessibility.split(",") };
    if (other) filter["tags.other"] = { $in: other.split(",") };

    const activities = await Activity.find(filter).populate(
      "owner",
      "name email",
    );

    res.json(activities);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Errore del server", error: error.message });
  }
};

// GET singola attività
const getActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id).populate(
      "owner",
      "name email",
    );

    if (!activity) {
      return res.status(404).json({ message: "Attività non trovata" });
    }

    res.json(activity);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Errore del server", error: error.message });
  }
};


// POST crea attività (qualsiasi utente loggato; admin = approvata subito)
const createActivity = async (req, res) => {
  try {
    const activity = await Activity.create({
      ...req.body,
      status: req.user.role === "admin" ? "approved" : "pending",
      createdBy: req.user._id
    });
    const message =
      req.user.role === "admin"
        ? "Attività creata con successo"
        : "Attività proposta con successo! Sarà visibile dopo l'approvazione.";
    res.status(201).json({ message, activity });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Errore del server", error: error.message });
  }
};

// PUT aggiorna attività (admin o owner)
const updateActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({ message: "Attività non trovata" });
    }

    // Owner può modificare solo la propria attività
    if (
      req.user.role === "owner" &&
      activity.owner?.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "Non hai i permessi per modificare questa attività" });
    }

    const updated = await Activity.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json({
      message: "Attività aggiornata con successo",
      activity: updated,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Errore del server", error: error.message });
  }
};

// DELETE elimina attività (solo admin)
const deleteActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({ message: "Attività non trovata" });
    }

    await activity.deleteOne();
    res.json({ message: "Attività eliminata con successo" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Errore del server", error: error.message });
  }
};

// PUT assegna owner (solo admin)
const assignOwner = async (req, res) => {
  try {
    const { ownerId } = req.body;

    const activity = await Activity.findByIdAndUpdate(
      req.params.id,
      { owner: ownerId },
      { new: true },
    );

    if (!activity) {
      return res.status(404).json({ message: "Attività non trovata" });
    }

    res.json({ message: "Owner assegnato con successo", activity });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Errore del server", error: error.message });
  }
};

module.exports = {
  getActivities,
  getActivity,
  createActivity,
  updateActivity,
  deleteActivity,
  assignOwner,
};
