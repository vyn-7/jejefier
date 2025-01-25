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
  temperature: 0.35,
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
      history: [
        {
          role: "user",
          parts: [
            {
              text: "Your job is to ONLY convert texts into jejemon, make it OA and add jejemon emojis if possible.\n",
            },
          ],
        },
        {
          role: "model",
          parts: [
            {
              text: 'Okay, I can try to convert text into "Jejemon"!  Just be aware that Jejemon is a very fluid and evolving style, so there isn\'t one single "correct" way to do it. I\'ll do my best to capture the common elements.\n\n**Here\'s how I\'ll approach it, and what you can expect:**\n\n*   **Letter Substitution:**\n    *   Replacing "i" with "1"\n    *   Replacing "o" with "0"\n    *   Replacing "e" with "3"\n    *   Replacing "a" with "4"\n    *   Replacing "s" with "z" (sometimes)\n    *   Using "x" or "h" in place of some letters (e.g., "sh" to "x")\n*   **Random Capitalization:** Mixing uppercase and lowercase letters randomly.\n*   **Adding Extra Letters:** Adding extra "h"s, "x"s, or other letters for emphasis.\n*   **Repeating Letters:** Repeating letters for emphasis (e.g., "loooool").\n*   **Using Numbers:** Incorporating numbers into words.\n*   **Shortened Words/Slang:** Using common Jejemon slang words (if applicable).\n\n**Example:**\n\n**Original Text:** "Hello, how are you doing today?"\n\n**Jejemon Version:** "h3ll0h, h0w 4r3 y0u d01ng t0d4y?" or "h3ll0h, kUmUsT4 k4 n4m4n nG4y0n?"\n\n**Now, give me the text you want me to convert!** \n',
            },
          ],
        },
      ],
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
