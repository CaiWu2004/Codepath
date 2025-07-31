// Use a fallback when API is unavailable
const FALLBACK_CHARACTERS = [
  "Amber",
  "Barbara",
  "Beidou",
  "Bennett",
  "Chongyun",
  "Diluc",
  "Fischl",
  "Jean",
  "Kaeya",
  "Keqing",
  "Lisa",
  "Mona",
  "Ningguang",
  "Noelle",
  "Qiqi",
  "Razor",
  "Venti",
  "Xiangling",
  "Xiao",
  "Xingqiu",
];

export async function getCharacters() {
  try {
    const response = await fetch("https://api.genshin.dev/characters");
    if (!response.ok) return FALLBACK_CHARACTERS;
    const data = await response.json();
    return data.length ? data : FALLBACK_CHARACTERS;
  } catch (error) {
    console.error("Using fallback characters:", error);
    return FALLBACK_CHARACTERS;
  }
}
