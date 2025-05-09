import trends from "google-trends-api";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const text = req.body.text || "";
  const phrases = extractPhrases(text);

  const checked = [];

  for (const phrase of phrases) {
    try {
      const results = await trends.interestOverTime({ keyword: phrase, geo: "DE" });
      const data = JSON.parse(results);
      const values = data.default.timelineData.map(d => d.value[0]);
      const hasTrend = values.some(v => v > 0);
      if (hasTrend) checked.push(phrase);
    } catch (e) {
      // Trends API schluckt manche Begriffe nicht, einfach ignorieren
    }
  }

  res.json(checked.slice(0, 15)); // nur Top 15 zurückgeben
}

function extractPhrases(text) {
  const words = text
    .replace(/\n/g, " ")
    .toLowerCase()
    .match(/\b[\wäöüß]{2,}\b/g) || [];

  const phrases = new Set();

  for (let i = 0; i < words.length - 1; i++) {
    const phrase = words[i] + " " + words[i + 1];
    if (phrase.length > 5) phrases.add(phrase);
  }

  return Array.from(phrases).slice(0, 50); // max 50 prüfen
}
