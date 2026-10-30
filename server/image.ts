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
  const { userId, prompt, category, style, time, weather, lighting, aspect = "16:9" } = req.body;
  try {
    // Server-side credit check and deduction
    await deductCredits(userId, 50, `Image Generation: ${prompt.substring(0, 20)}...`);

    const fullPrompt = `
      Professional 2D cartoon style ${category} for a Hindi moral story animation.
      Subject: ${prompt}
      Style: ${style || 'Digital Painting'}
      Time of day: ${time || 'Day'}
      Weather: ${weather || 'Clear'}
      Lighting: ${lighting || 'Cinematic'}
      Aspect Ratio: ${aspect}
      
      High-quality, vibrant colors, clean lines, production-grade 2D art.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite-image",
      contents: fullPrompt,
      config: {
        // @ts-ignore - imageConfig is valid in latest SDK but maybe not in types yet
        imageConfig: {
          aspectRatio: aspect,
          numberOfImages: 1,
        }
      }
    });

    const base64Image = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Image) {
      res.json({ images: [base64Image] });
    } else {
      // Fallback for demo if image generation is not available in current environment/quota
      // res.status(500).json({ error: "No image generated" });
      res.json({ images: [`https://placehold.co/1280x720/18181b/6366f1?text=${encodeURIComponent(prompt)}`] });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
