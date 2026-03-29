export default async function handler(req, res) {
  const { food, premium } = req.body;

  try {
    const aiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a sommelier. Recommend wine pairings.",
          },
          {
            role: "user",
            content: premium
              ? `Give 3 premium wine pairings with explanations for: ${food}`
              : `Give 2 simple wine pairings for: ${food}`,
          },
        ],
      }),
    });

    const data = await aiResponse.json();
    const pairing = data.choices[0].message.content;

    res.status(200).json({ pairing });
  } catch (error) {
    res.status(500).json({ pairing: "Error generating pairing" });
  }
}
