require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;
const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.API);
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp",
});

const generationConfig = {
  temperature: 0.85,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

console.log([process.env.API, process.env.PORT]);

app.use(express.static(path.join(__dirname, "public")));
app.get("/api/messages/:message", async (request, response) => {
  try {
    const message = request.params.message.split("&").join(" ");
    const chatSession = model.startChat({
      generationConfig,
      systemInstruction:
        "Your job is to ONLY convert texts into jejemon, make it OA and add jejemon emojis if possible.\n",
    });

    const result = await chatSession.sendMessage(message);
    response
      .status(200)
      .send({ success: true, message: result.response.text() });
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
