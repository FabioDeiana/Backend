const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Verifica token
const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token mancante" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Utente non trovato" });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: "Account disabilitato" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token non valido" });
  }
};

// Verifica ruolo
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Non hai i permessi per questa operazione" });
    }
    next();
  };
};

module.exports = { protect, authorize };