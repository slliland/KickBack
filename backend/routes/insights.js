const express = require('express');
const router = express.Router();

router.get('/insights', (req, res) => {
  const insightsContent = {
    title: "Continental Coaching: Map Insights",
    sections: [
      {
        header: "The Trophy Cabinets",
        text: "Spain, France, and Germany display their dominance in darker hues, reflecting multiple EURO conquests."
      },
      {
        header: "Underdogs United",
        text: "Keep your eye on Denmark and Greece. Their lighter shades belie EURO victories, proving that in this tournament, every underdog has its day!"
      },
      {
        header: "Eastern Elevation",
        text: "While not as dark as their Western rivals, notice how Eastern European nations have been steadily climbing the ranks since joining the fray."
      },
      {
        header: "Tactical Insight",
        text: "This map isn't just a trophy case; it's a testament to football excellence spreading across Europe. Every nation, regardless of size, has the potential to etch its name in EURO history!"
      },
      {
        header: "Cross-Border Clashes: Neighborhood Rivalries",
        text: "Let's zoom in on some compelling nearby nemeses:\n\n• Iberian Faceoff: Spain vs Portugal – A peninsula divided by borders, united by football fervor\n• Benelux Showdown: Belgium, Netherlands, Luxembourg – Small in area, giants in talent\n• Balkan Battleground: The region has enough footballing drama to fill a Netflix series!"
      },
      {
        header: "Final Whistle",
        text: "I've only scratched the surface of our EURO data expedition. Stay tuned as I dive deeper into team tactics, legendary players, and the unforgettable moments that make EURO a premier football spectacle!"
      }
    ]
  };

  res.json(insightsContent);
});

module.exports = router;
