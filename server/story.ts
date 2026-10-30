import { GoogleGenAI, Type } from "@google/genai";
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

router.post("/generate-titles", async (req, res) => {
  const { topic, category, excludeTitles = [] } = req.body;
  try {
    const prompt = `
      Generate 10 unique, creative, and catchy Hindi cartoon story titles.
      Topic: ${topic}
      Category: ${category}
      ${excludeTitles.length > 0 ? `EXCLUDE these existing titles: ${excludeTitles.join(', ')}` : ''}
      Return ONLY a JSON array of strings.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });
    res.json({ titles: JSON.parse(response.text || "[]") });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

const pricing: Record<string, number> = {
  '5 Minutes': 25,
  '10 Minutes': 50,
  '20 Minutes': 100,
  '30 Minutes': 150,
  '40 Minutes': 200,
  '60 Minutes': 300
};

router.post("/generate-story", async (req, res) => {
  const { userId, title, category, duration, tone, customInstructions } = req.body;
  try {
    const cost = pricing[duration] || 25;
    
    // Server-side credit check and deduction
    await deductCredits(userId, cost, `Story Generation: ${title}`);

    const prompt = `
      Write a professional 2D cartoon story script in Hindi for a YouTube channel.
      Title: ${title}
      Category: ${category}
      Approximate Duration: ${duration}
      Tone: ${tone}
      Instructions: ${customInstructions}
      
      Structure the output as a JSON object with:
      1. fullStory: A long narrative version (at least 500 words for short, 2000 words for long).
      2. moral: The moral lesson of the story in Hindi.
      3. scenes: An array of objects, each with:
         - sceneNumber: integer
         - location: string (e.g., "Village Forest - Day")
         - characters: array of strings
         - narration: string (Hindi)
         - dialogue: array of objects { character: string, line: string, emotion: string }
         - visualDescription: string (Detailed prompt for AI image generation)
    `;

    const response = await ai.models.generateContent({
      model: "gemini-4-argon",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            fullStory: { type: Type.STRING },
            moral: { type: Type.STRING },
            scenes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  sceneNumber: { type: Type.INTEGER },
                  location: { type: Type.STRING },
                  characters: { type: Type.ARRAY, items: { type: Type.STRING } },
                  narration: { type: Type.STRING },
                  dialogue: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        character: { type: Type.STRING },
                        line: { type: Type.STRING },
                        emotion: { type: Type.STRING }
                      }
                    }
                  },
                  visualDescription: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });
    res.json(JSON.parse(response.text || "{}"));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

