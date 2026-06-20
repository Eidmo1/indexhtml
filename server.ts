import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { initTelegramBot } from "./server/bot";

dotenv.config({ override: true });

async function startServer() {
  // Start the Telegram Bot polling if the token is supplied
  initTelegramBot();

  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for Gemini AI Chat with Google Search Grounding
  app.post("/api/chat", async (req, res) => {
    try {
      const { prompt, history } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ 
          error: "GEMINI_API_KEY is not configured on the server. Please check your secrets configuration in the settings tab."
        });
      }

      const ai = new GoogleGenAI({ apiKey });

      // Construct system instruction advising the AI to find direct download links, articles, movies or software using Google search and format download links elegantly in Markdown.
      const systemInstruction = `You are 1gram AI, an advanced AI search and retrieval professional assistant integrated into the 1gram Telegram mini app.
The user is asking you to search the web for files, programs, apps, movies, books, games, articles, or other downloadable assets.
You MUST utilize your Google Search Grounding tool to locate actual, existing sources, download links, official landing pages, streaming websites, or public repository links.
Do NOT guess or fabricate links under any circumstances.
Provide detailed helpful instructions on how to install or download the software, movie, or article.
Always present actual, grounded URLs found in search result citations, and format the link in clean Markdown with illustrative/clear title, like: [Click here to download/view](URL) or [تحميل البرنامج من الموقع الرسمي](URL).
Respond in Arabic by default unless the user communicates in English. Provide clear, highly readable answers with clean visual typography headers and lists.`;

      const formattedContents: any[] = [];
      if (history && Array.isArray(history)) {
        history.forEach((msg: any) => {
          formattedContents.push({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }]
          });
        });
      }

      // Ensure that the very first message is ALWAYS a 'user' turn for standard Gemini requests
      while (formattedContents.length > 0 && formattedContents[0].role === 'model') {
        formattedContents.shift();
      }

      // Ensure strict alternation of roles (user, model, user, model)
      const cleanContents: any[] = [];
      formattedContents.forEach((item) => {
        if (cleanContents.length === 0) {
          if (item.role === 'user') {
            cleanContents.push(item);
          }
        } else {
          const lastItem = cleanContents[cleanContents.length - 1];
          if (lastItem.role !== item.role) {
            cleanContents.push(item);
          } else {
            // Append the text if consecutive of same role to avoid losing context
            lastItem.parts[0].text += "\n" + item.parts[0].text;
          }
        }
      });

      // Add the final user prompt
      if (cleanContents.length > 0 && cleanContents[cleanContents.length - 1].role === 'user') {
        // If the last turn was already a user turn, merge current prompt into it to avoid validation issues
        cleanContents[cleanContents.length - 1].parts[0].text += "\n" + prompt;
      } else {
        cleanContents.push({
          role: "user",
          parts: [{ text: prompt }]
        });
      }

      let contentInput: any = cleanContents;
      if (cleanContents.length === 1 && cleanContents[0].role === 'user') {
        contentInput = cleanContents[0].parts[0].text;
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: contentInput,
        config: {
          systemInstruction: systemInstruction,
          tools: [{ googleSearch: {} }]
        }
      });

      const replyText = response.text || "عذراً، لم أتمكن من الحصول على نتائج دقيقة من محرك بحث جوجل في الوقت الحالي. يرجى إعادة كتابة السؤال بشكل أوضح.";
      res.json({ reply: replyText });
    } catch (error: any) {
      console.error("Gemini search integration error:", error);
      res.status(500).json({ 
        error: error.message || "عذراً، حدث خطأ داخلي أثناء استجواب منصة الذكاء الاصطناعي."
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[1gram Server] running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
