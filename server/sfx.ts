import { GoogleGenAI } from "@google/genai";
import express from "express";
import dotenv from "dotenv";
import { deductCredits } from './credits';

dotenv.config();

const router = express.Router();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

router.post("/generate", async (req, res) => {
  const { userId, prompt, category } = req.body;
  try {
    // Server-side credit check and deduction
    await deductCredits(userId, 5, `SFX/Music Generation: ${prompt.substring(0, 20)}...`);

    const fullPrompt = `
      Generate a short audio clip (SFX or Music).
      Description: ${prompt}
      Category: ${category}
      Mood: Atmospheric, cartoonish, professional.
    `;

    // Using Lyria Clip for short audio/SFX-like tasks
    const response = await ai.models.generateContent({
      model: "lyria-3-clip-preview",
      contents: fullPrompt,
      config: {
        responseModalities: ["AUDIO"]
      }
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      res.json({ audio: base64Audio });
    } else {
      res.status(500).json({ error: "No audio generated" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
