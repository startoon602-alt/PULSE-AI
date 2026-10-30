export interface VoiceCharacter {
  id: string;
  displayName: string;
  category: string;
  description: string;
  providerVoice: 'Kore' | 'Puck' | 'Charon' | 'Fenrir' | 'Zephyr';
  settings: {
    pitch: number;
    speed: number;
    style: string;
  };
  previewText: string;
  gender: 'Male' | 'Female' | 'Neutral';
  age: 'Child' | 'Young' | 'Adult' | 'Elderly';
  personality: string;
  emotions: string[];
}

export const voiceCategories = [
  "Male Narrators", "Female Narrators", "Young Male Characters", "Young Female Characters",
  "Child-style Characters", "Elderly Male Characters", "Elderly Female Characters",
  "Villain Characters", "King and Queen Characters", "Farmer Characters",
  "Merchant Characters", "Mother Characters", "Father Characters",
  "Grandmother Characters", "Grandfather Characters", "Funny Cartoon Characters",
  "Emotional Characters", "Deep Voice Characters", "Soft Voice Characters",
  "Dramatic Storytelling Characters"
];

const categoryToGenderAge: Record<string, { gender: 'Male' | 'Female' | 'Neutral', age: 'Child' | 'Young' | 'Adult' | 'Elderly' }> = {
  "Male Narrators": { gender: 'Male', age: 'Adult' },
  "Female Narrators": { gender: 'Female', age: 'Adult' },
  "Young Male Characters": { gender: 'Male', age: 'Young' },
  "Young Female Characters": { gender: 'Female', age: 'Young' },
  "Child-style Characters": { gender: 'Neutral', age: 'Child' },
  "Elderly Male Characters": { gender: 'Male', age: 'Elderly' },
  "Elderly Female Characters": { gender: 'Female', age: 'Elderly' },
  "Villain Characters": { gender: 'Male', age: 'Adult' },
  "King and Queen Characters": { gender: 'Neutral', age: 'Adult' },
  "Farmer Characters": { gender: 'Male', age: 'Adult' },
  "Merchant Characters": { gender: 'Male', age: 'Adult' },
  "Mother Characters": { gender: 'Female', age: 'Adult' },
  "Father Characters": { gender: 'Male', age: 'Adult' },
  "Grandmother Characters": { gender: 'Female', age: 'Elderly' },
  "Grandfather Characters": { gender: 'Male', age: 'Elderly' },
  "Funny Cartoon Characters": { gender: 'Neutral', age: 'Young' },
  "Emotional Characters": { gender: 'Neutral', age: 'Adult' },
  "Deep Voice Characters": { gender: 'Male', age: 'Adult' },
  "Soft Voice Characters": { gender: 'Female', age: 'Adult' },
  "Dramatic Storytelling Characters": { gender: 'Neutral', age: 'Adult' }
};

const baseVoices = {
  Male: ['Puck', 'Charon', 'Fenrir'],
  Female: ['Kore', 'Zephyr'],
  Neutral: ['Kore', 'Puck', 'Charon', 'Fenrir', 'Zephyr']
};

const emotions = [
  "Normal", "Happy", "Sad", "Crying", "Angry", "Shouting", "Whispering",
  "Scared", "Surprised", "Excited", "Mysterious", "Emotional", "Loving",
  "Threatening", "Funny", "Dramatic", "Calm", "Serious", "Inspirational"
];

const generateVoices = (): VoiceCharacter[] => {
  const characters: VoiceCharacter[] = [];
  
  voiceCategories.forEach((cat) => {
    const { gender, age } = categoryToGenderAge[cat];
    
    for (let i = 1; i <= 5; i++) {
      const id = `${cat.replace(/\s+/g, '')}_${i}`;
      let providerVoice: any = baseVoices[gender][i % baseVoices[gender].length];
      if (gender === 'Neutral') {
        providerVoice = baseVoices.Neutral[i % baseVoices.Neutral.length];
      }

      // Specific overrides for elderly
      if (age === 'Elderly') {
        providerVoice = gender === 'Male' ? 'Charon' : 'Zephyr';
      }
      
      // Specific overrides for children
      if (age === 'Child') {
        providerVoice = 'Kore';
      }

      const pitch = age === 'Elderly' ? -4 : (age === 'Child' ? 6 : (i % 3 - 1) * 2);
      const speed = age === 'Elderly' ? 0.85 : (age === 'Child' ? 1.1 : 1.0);
      
      let displayName = `${cat.split(' ')[0]} ${i}`;
      let personality = "Friendly and helpful";
      let previewText = "एक समय की बात है, एक छोटे से गाँव में एक गरीब किसान रहता था।";

      // Apply some predefined names from the prompt
      if (cat === "Male Narrators" && i === 1) displayName = "Aarav — Warm Storyteller";
      if (cat === "Villain Characters" && i === 1) {
        displayName = "Bhairav — Villain Character";
        previewText = "तुमने मेरी बात मानने से इनकार कैसे कर दिया?";
      }
      if (cat === "Grandmother Characters" && i === 1) {
        displayName = "Daadi Maa — Loving Elderly Woman";
        previewText = "बेटा, जीवन में हमेशा सच्चाई का साथ देना चाहिए।";
      }

      characters.push({
        id,
        displayName,
        category: cat,
        description: `Professional ${cat.toLowerCase()} with a ${personality.toLowerCase()} tone.`,
        providerVoice,
        settings: {
          pitch,
          speed,
          style: `A ${personality.toLowerCase()} ${gender.toLowerCase()} ${age.toLowerCase()} voice character.`
        },
        previewText,
        gender,
        age,
        personality,
        emotions: emotions.slice(0, 8 + (i % 5))
      });
    }
  });

  return characters;
};

export const voiceLibrary = generateVoices();
