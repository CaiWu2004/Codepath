const API_BASE = "https://api.genshin.dev";

export async function getCharacters() {
  try {
    // Use a CORS proxy or your backend
    const response = await fetch(
      `https://cors-anywhere.herokuapp.com/${API_BASE}/characters`,
      {
        headers: {
          "X-Requested-With": "XMLHttpRequest",
        },
      }
    );
    if (!response.ok) throw new Error("Failed to fetch characters");
    return await response.json();
  } catch (error) {
    console.error("Error fetching characters:", error);
    return [];
  }
}
