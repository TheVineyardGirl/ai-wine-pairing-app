import React, { useState } from "react";

export default function Home() {
  const [food, setFood] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [premium, setPremium] = useState(false);

  const getPairing = async () => {
    if (!food) return;
    setLoading(true);
    setResults([]);

    try {
      const response = await fetch("/api/pairing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ food, premium }),
      });

      const data = await response.json();
      const parsed = data.pairing.split("\n").filter(Boolean);
      setResults(parsed);
    } catch (error) {
      setResults(["Error getting recommendation."]);
    }

    setLoading(false);
  };

  const saveFavorite = (item) => {
    if (!favorites.includes(item)) {
      setFavorites([...favorites, item]);
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 500, margin: "auto", fontFamily: "Arial" }}>
      <h1>🍷 AI Wine Pairing</h1>

      <input
        type="text"
        placeholder="Enter a dish (e.g., steak, pasta, tacos)"
        value={food}
        onChange={(e) => setFood(e.target.value)}
        style={{ width: "100%", padding: 10, marginBottom: 10 }}
      />

      <button onClick={getPairing} style={{ width: "100%", padding: 10 }}>
        {loading ? "Finding pairing..." : "Find Pairings"}
      </button>

      <div style={{ marginTop: 10 }}>
        <label>Premium Mode </label>
        <button onClick={() => setPremium(!premium)}>
          {premium ? "ON" : "OFF"}
        </button>
      </div>

      {results.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <h3>Top Pairings:</h3>
          {results.map((r, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
              {r}
              <button onClick={() => saveFavorite(r)} style={{ marginLeft: 10 }}>
                Save
              </button>
            </div>
          ))}
        </div>
      )}

      {favorites.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <h3>⭐ Favorites</h3>
          {favorites.map((f, i) => (
            <div key={i}>{f}</div>
          ))}
        </div>
      )}
    </div>
  );
}
