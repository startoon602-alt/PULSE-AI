export interface Feature {
  id: string;
  name: string;
  category: string;
  minPlan: 'free' | 'starter' | 'creator' | 'pro';
  description: string;
  computeHeavy: boolean;
}

export const FEATURE_REGISTRY: Feature[] = [
  // Story Studio
  { id: 'story_basic', name: 'Basic Story Generation', category: 'story', minPlan: 'free', description: 'Generate short Hindi scripts.', computeHeavy: true },
  { id: 'story_advanced', name: 'Advanced Narrative Engine', category: 'story', minPlan: 'creator', description: 'Scene-by-scene script logic.', computeHeavy: true },
  { id: 'story_edit', name: 'Manual Script Editor', category: 'story', minPlan: 'free', description: 'Edit generated text.', computeHeavy: false },
  
  // Voice Studio
  { id: 'voice_basic', name: 'Standard Hindi Voices', category: 'voice', minPlan: 'free', description: 'Access to 5 base voices.', computeHeavy: true },
  { id: 'voice_lock', name: 'Character Voice Lock', category: 'voice', minPlan: 'creator', description: 'Maintain voice consistency.', computeHeavy: false },
  { id: 'voice_advanced', name: 'Emotional Controls', category: 'voice', minPlan: 'starter', description: 'Fine-tune pitch and speed.', computeHeavy: true },

  // Video Studio
  { id: 'video_basic', name: 'Text-to-Video', category: 'video', minPlan: 'creator', description: 'Basic animation from text.', computeHeavy: true },
  { id: 'video_pro', name: 'Full Video Studio', category: 'video', minPlan: 'pro', description: 'High-res animation suite.', computeHeavy: true },

  // Timeline
  { id: 'timeline_basic', name: 'Standard Timeline', category: 'timeline', minPlan: 'creator', description: 'Multi-track editing.', computeHeavy: false },
  { id: 'timeline_pro', name: 'Advanced Audio Mixing', category: 'timeline', minPlan: 'pro', description: 'Layered sound engineering.', computeHeavy: false },
];

export function canAccess(userPlan: string, featureId: string): boolean {
  const planOrder = ['free', 'starter', 'creator', 'pro'];
  const feature = FEATURE_REGISTRY.find(f => f.id === featureId);
  if (!feature) return true; // Default to allow if not registered
  
  const userRank = planOrder.indexOf(userPlan);
  const minRank = planOrder.indexOf(feature.minPlan);
  
  return userRank >= minRank;
}
