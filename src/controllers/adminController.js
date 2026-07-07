const User = require("../models/User");

// GET tutti gli utenti
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Errore del server", error: error.message });
  }
};

// PUT aggiorna ruolo o stato utente
const updateUser = async (req, res) => {
  try {
    const { role, isActive } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role, isActive },
      { new: true }
    ).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Utente non trovato" });
    }
    res.json({ message: "Utente aggiornato con successo", user });
  } catch (error) {
    res.status(500).json({ message: "Errore del server", error: error.message });
  }
};

// DELETE elimina utente
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Utente non trovato" });
    }
    if (user.role === "admin") {
      return res.status(403).json({ message: "Non puoi eliminare un admin" });
    }
    await user.deleteOne();
    res.json({ message: "Utente eliminato con successo" });
  } catch (error) {
    res.status(500).json({ message: "Errore del server", error: error.message });
  }
};

module.exports = { getUsers, updateUser, deleteUser };