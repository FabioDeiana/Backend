const axios = require("axios");
const Activity = require("../models/Activity");

const chat = async (req, res) => {
  try {
    const { message, preferences, language } = req.body;

    // Recupera attività dal database
    const activities = await Activity.find({}).limit(50);

    const activitiesContext = activities.map(a => ({
      name: a.name,
      category: a.category,
      city: a.city,
      description: a.description,
      tags: a.tags,
      address: a.address
    }));

    const systemPrompt = `Sei un assistente di GreenMap, una piattaforma che aiuta le persone a trovare attività eco-friendly come ristoranti vegani, supermercati biologici e negozi sostenibili.
    
Il tuo compito è aiutare gli utenti a trovare attività in base alle loro esigenze, preferenze alimentari e necessità di accessibilità.

Ecco le attività disponibili nel database:
${JSON.stringify(activitiesContext, null, 2)}

${preferences ? `L'utente ha queste preferenze: ${JSON.stringify(preferences)}` : ""}

Rispondi sempre in ${language || "italiano"}, in modo amichevole e conciso. Se non trovi attività che corrispondono alla richiesta, dillo chiaramente e suggerisci di ampliare la ricerca.`;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-oss-120b:free", 
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ]
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const reply = response.data.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ message: "Errore del server", error: error.response?.data || error.message });
  }
};

module.exports = { chat };