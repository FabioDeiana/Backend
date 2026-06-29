const Review = require("../models/Review");
const Activity = require("../models/Activity");

// GET recensioni di una attività
const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      activity: req.params.activityId,
    }).populate("user", "name avatar");
    res.json(reviews);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Errore del server", error: error.message });
  }
};

// POST crea recensione
const createReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const activityId = req.params.activityId;

    const activity = await Activity.findById(activityId);
    if (!activity) {
      return res.status(404).json({ message: "Attività non trovata" });
    }

    // Controlla se l'utente ha già recensito
    const existing = await Review.findOne({
      activity: activityId,
      user: req.user._id,
    });
    if (existing) {
      return res
        .status(400)
        .json({ message: "Hai già recensito questa attività" });
    }

    const review = await Review.create({
      activity: activityId,
      user: req.user._id,
      rating,
      comment,
    });

    await review.populate("user", "name avatar");

    res
      .status(201)
      .json({ message: "Recensione aggiunta con successo", review });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Errore del server", error: error.message });
  }
};

// PUT aggiorna recensione
const updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Recensione non trovata" });
    }

    // Solo l'autore può modificarla
    if (review.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({
          message: "Non hai i permessi per modificare questa recensione",
        });
    }

    const updated = await Review.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json({
      message: "Recensione aggiornata con successo",
      review: updated,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Errore del server", error: error.message });
  }
};

// DELETE elimina recensione
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Recensione non trovata" });
    }

    // Solo autore o admin possono eliminare
    if (
      review.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({
          message: "Non hai i permessi per eliminare questa recensione",
        });
    }

    await review.deleteOne();
    res.json({ message: "Recensione eliminata con successo" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Errore del server", error: error.message });
  }
};

module.exports = { getReviews, createReview, updateReview, deleteReview };
