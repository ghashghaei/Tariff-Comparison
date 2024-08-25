// index.js
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Function to calculate costs
function calculateAnnualCost(consumption, tariff) {
  if (tariff.type === 1) {
    // Type 1 calculation
    const baseCost = 5 * 12; // €5/month
    const consumptionCost = consumption * 0.22; // 22 cents/kWh
    return baseCost + consumptionCost;
  } else if (tariff.type === 2) {
    // Type 2 calculation
    const baseCost = tariff.baseCost; // €800 for up to 4000 kWh
    const additionalCost =
      consumption > tariff.includedKwh
        ? (consumption - tariff.includedKwh) * 0.3
        : 0; // 30 cents/kWh above includedKwh
    return baseCost + additionalCost;
  }
  return 0;
}

// Define tariffs
const tariffs = [
  { name: "Product A", type: 1, baseCost: 5, additionalKwhCost: 22 },
  {
    name: "Product B",
    type: 2,
    includedKwh: 4000,
    baseCost: 800,
    additionalKwhCost: 30,
  },
];

// API endpoint to calculate tariffs
app.post("/calculate-tariffs", (req, res) => {
  const { consumption } = req.body;

  if (typeof consumption !== "number") {
    return res.status(400).json({ error: "Invalid consumption value" });
  }

  const results = tariffs.map((tariff) => {
    return {
      name: tariff.name,
      annualCost: calculateAnnualCost(consumption, tariff),
    };
  });

  res.json(results);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
