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
  const { userId, text, voiceName, style, speed, pitch, emotion, pause } = req.body;
  try {
    // Server-side credit check and deduction
    await deductCredits(userId, 10, `Voice Generation: ${text.substring(0, 20)}...`);

    const stylePrompt = style ? `Character Style: ${style}. ` : "";
    const emotionPrompt = emotion ? `Emotion: ${emotion}. ` : "";
    const speedPrompt = speed ? `Speed: ${speed}x. ` : "";
    const pitchPrompt = pitch ? `Pitch: ${pitch}. ` : "";
    const pausePrompt = pause ? `Add ${pause}ms pauses between sentences. ` : "";

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash-lite-tts",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: text,
              speechMetadata: {
                style: `${stylePrompt}${emotionPrompt}${speedPrompt}${pitchPrompt}${pausePrompt}Ensure natural Hindi/English pronunciation.`,
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voiceName || "Kore" },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      res.json({ audio: base64Audio, format: 'wav' });
    } else {
      res.status(500).json({ error: "No audio generated" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/preview", async (req, res) => {
  const { userId, text, voiceName, style, speed, pitch } = req.body;
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash-lite-tts",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: text,
              speechMetadata: {
                style: `Style: ${style}. Speed: ${speed}x. Pitch: ${pitch}. Quick preview.`,
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voiceName || "Kore" },
          },
        },
      },
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


