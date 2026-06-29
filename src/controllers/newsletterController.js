const Subscriber = require("../models/Subscriber");
const User = require("../models/User");

// POST iscrizione newsletter (utente anonimo)
const subscribe = async (req, res) => {
  try {
    const { email } = req.body;

    const existing = await Subscriber.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email già iscritta alla newsletter" });
    }

    await Subscriber.create({ email });
    res.status(201).json({ message: "Iscrizione alla newsletter avvenuta con successo" });
  } catch (error) {
    res.status(500).json({ message: "Errore del server", error: error.message });
  }
};

// POST disiscrizione newsletter (utente anonimo)
const unsubscribe = async (req, res) => {
  try {
    const { email } = req.body;

    const subscriber = await Subscriber.findOne({ email });
    if (!subscriber) {
      return res.status(404).json({ message: "Email non trovata" });
    }

    await subscriber.deleteOne();
    res.json({ message: "Disiscrizione avvenuta con successo" });
  } catch (error) {
    res.status(500).json({ message: "Errore del server", error: error.message });
  }
};

// PUT aggiorna preferenza newsletter (utente loggato)
const updateNewsletterPreference = async (req, res) => {
  try {
    const { subscribed } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        "newsletter.subscribed": subscribed,
        "newsletter.subscribedAt": subscribed ? new Date() : null
      },
      { new: true }
    ).select("-password");

    res.json({ message: "Preferenza newsletter aggiornata", user });
  } catch (error) {
    res.status(500).json({ message: "Errore del server", error: error.message });
  }
};

// GET tutti gli iscritti (solo admin)
const getSubscribers = async (req, res) => {
  try {
    const subscribers = await Subscriber.find({ isActive: true });
    res.json(subscribers);
  } catch (error) {
    res.status(500).json({ message: "Errore del server", error: error.message });
  }
};

module.exports = { subscribe, unsubscribe, updateNewsletterPreference, getSubscribers };