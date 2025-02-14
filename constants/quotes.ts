export const LOADING_QUOTES = [
  "Transforming your love into art... 💕",
  "Creating magic with your memories... ✨",
  "Sprinkling some digital love dust... 💫",
  "Painting your story with AI... 🎨",
  "Making your love story anime-zing... 🌟",
  "Crafting your perfect avatar with care... 💝",
  "Adding a touch of romance... 💖",
  "Blending reality with magical moments... ✨",
  "Creating something special just for you... 💫",
  "Making your love story immortal... 💕",
];

export function getRandomQuote(): string {
  return LOADING_QUOTES[Math.floor(Math.random() * LOADING_QUOTES.length)];
} 