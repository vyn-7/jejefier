const express = require("express");
const path = require("path");
const OpenAI = require("openai");

const app = express();
const openai = new OpenAI({ apiKey: process.env.API_KEY });
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));
app.get("/api/messages/:message", async (request, response) => {
  try {
    const message = request.params.message.split("&").join(" ");
    const completion = await openai.chat.completions.create({
      temperature: 0.7,
      top_p: 0.8,
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Your job is to convert the user's message into slightly jejemon, then add emojis.",
        },
        { role: "user", content: message },
      ],
    });

    response
      .status(200)
      .send({ success: true, message: completion.choices[0].message.content });
  } catch (error) {
    response.status(500).send({ success: false, message: error });
  }
});

app.get("/", (request, response) => {
  response.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("*", (request, response) => {
  response.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT);
