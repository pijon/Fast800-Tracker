export const APP_NAME = "Vesta";
export const DAILY_CALORIE_LIMIT = 800;
export const MAX_FAMILY_GROUP_SIZE = 10;

// Using the recommended models from the coding guidelines
// Using the recommended models from the coding guidelines
export const GEMINI_MODEL_V3_PREVIEW = 'gemini-3-flash-preview';
export const GEMINI_MODEL_STABLE = 'gemini-2.5-flash';

// Default to V3 Preview (Experimental) as requested
export const GEMINI_TEXT_MODEL = GEMINI_MODEL_V3_PREVIEW;
export const GEMINI_THINKING_MODEL = 'gemini-2.0-flash-thinking-exp-1219'; // Keep this explicit for now
// Fast model for simple, latency-sensitive operations (food logging, quick analysis)
export const GEMINI_FAST_MODEL = GEMINI_MODEL_V3_PREVIEW;

export const PLACEHOLDER_IMAGE = "https://picsum.photos/400/300";

export const DEFAULT_USER_STATS = {
  startWeight: 0, // Deprecated, will be set by onboarding
  currentWeight: 0,
  goalWeight: 0,
  name: '',
  dailyCalorieGoal: 800,
  dailyWorkoutCalorieGoal: 400, // Default burn target
  dailyWaterGoal: 2000,
  weightHistory: [], // Empty history triggers onboarding
  dietMode: 'daily' as const,
  nonFastDayCalories: 2000,
  dailyWorkoutCountGoal: 1
};

export const DEFAULT_FEATURE_FLAGS: import('./types').FeatureFlags = {
  forceSundayReset: false,
  useGeminiExperimental: true // Default to Gemini 3.0 (Experimental)
};

export const DEFAULT_DEV_SETTINGS: import('./types').DevSettings = {
  featureFlags: DEFAULT_FEATURE_FLAGS,
};