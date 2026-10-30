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

router.post("/transcribe", async (req, res) => {
  const { userId, audioData, mimeType = "audio/mp3" } = req.body;
  try {
    // Server-side credit check and deduction
    await deductCredits(userId, 20, `Audio Transcription`);

    const audioPart = {
      inlineData: {
        mimeType: mimeType,
        data: audioData,
      },
    };

    const response = await ai.models.generateContent({
      model: "gemini-3.5-transcribe",
      contents: { parts: [audioPart, { text: "Transcribe this audio into Hindi with timestamps in [MM:SS] format." }] },
    });

    res.json({ transcription: response.text });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
