// src/App.js
import React, { useState } from "react";
import "./App.css";

function App() {
  const [consumption, setConsumption] = useState("");
  const [tariffs, setTariffs] = useState([]);

  const handleInputChange = (e) => {
    setConsumption(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/calculate-tariffs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ consumption: parseFloat(consumption) }),
      });
      const data = await response.json();
      setTariffs(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="App">
      <h1>Electricity Tariff Comparison</h1>
      <form onSubmit={handleSubmit} className="tariff-form">
        <label>
          Enter your consumption (kWh/year):
          <input
            type="number"
            value={consumption}
            onChange={handleInputChange}
            required
          />
        </label>
        <button type="submit">Calculate</button>
      </form>
      <div className="tariffs">
        {tariffs.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>Tariff Name</th>
                <th>Annual Cost (€)</th>
              </tr>
            </thead>
            <tbody>
              {tariffs.map((tariff, index) => (
                <tr key={index}>
                  <td>{tariff.name}</td>
                  <td>{tariff.annualCost.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default App;
