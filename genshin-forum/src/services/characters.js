import axios from "axios";

const API_BASE = "https://genshin.dev/api";

export const getAllCharacters = async () => {
  try {
    const response = await axios.get(`${API_BASE}/characters`);
    return response.data;
  } catch (error) {
    console.error("Error fetching characters:", error);
    return [];
  }
};

export const getCharacterInfo = async (characterName) => {
  try {
    const response = await axios.get(`${API_BASE}/characters/${characterName}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching info for ${characterName}:`, error);
    return null;
  }
};

export const getCharacterTalents = async (characterName) => {
  try {
    const response = await axios.get(
      `${API_BASE}/characters/${characterName}/talents`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching talents for ${characterName}:`, error);
    return null;
  }
};

export const getCharacterConstellations = async (characterName) => {
  try {
    const response = await axios.get(
      `${API_BASE}/characters/${characterName}/constellations`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching constellations for ${characterName}:`, error);
    return null;
  }
};
