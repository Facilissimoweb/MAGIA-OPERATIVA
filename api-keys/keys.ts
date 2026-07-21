import dotenv from "dotenv";

// Load local environment variables if available
dotenv.config();

export const KEYS = {
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || "",
  GROQ_API_KEY: process.env.GROQ_API_KEY || "",
  APP_URL: process.env.APP_URL || "",
};

export function validateKeys() {
  const missing: string[] = [];
  if (!KEYS.GROQ_API_KEY) {
    missing.push("GROQ_API_KEY");
  }
  if (!KEYS.GEMINI_API_KEY) {
    missing.push("GEMINI_API_KEY");
  }
  return {
    isValid: missing.length === 0,
    missing,
  };
}
