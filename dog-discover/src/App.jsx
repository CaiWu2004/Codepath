import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import DogDisplay from "../components/DogDisplay";
import BanList from "../components/BanList";
import "./App.css";

function App() {
  const [dogData, setDogData] = useState(null);
  const [banList, setBanList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // API Key for API-Ninjas (sign up at https://api-ninjas.com/api/dogs)
  const API_KEY =
    "live_FPm3WbcFFp5lewMdnAJUWsTdjDXVLoZpRyQu8d8c0lslLGUqhm21DzZ7SRSupcdE";

  // Fetch dog data function
  const fetchDog = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let validDog = false;
      let attempts = 0;
      const maxAttempts = 10;

      while (!validDog && attempts < maxAttempts) {
        attempts++;

        // STEP 1: Fetch random dog image
        const imageResponse = await axios.get(
          "https://dog.ceo/api/breeds/image/random"
        );
        const imageUrl = imageResponse.data.message;

        // Extract breed from URL (e.g. "breeds/labrador/n02104365_1234.jpg")
        const breed = imageUrl.split("/")[4];

        // Skip if breed is banned
        if (
          banList.some(
            (item) => item.value.toLowerCase() === breed.toLowerCase()
          )
        )
          continue;

        // STEP 2: Fetch breed info from API-Ninjas
        try {
          const infoResponse = await axios.get(
            `https://api.api-ninjas.com/v1/dogs?name=${breed}`,
            { headers: { "X-Api-Key": API_KEY } }
          );

          // If breed info exists, use it
          if (infoResponse.data && infoResponse.data.length > 0) {
            const breedInfo = infoResponse.data[0];
            setDogData({
              image: imageUrl,
              breed: breed,
              name: breedInfo.name,
              temperament: breedInfo.temperament,
              group: breedInfo.group,
            });
          } else {
            // Fallback if no breed info
            setDogData({
              image: imageUrl,
              breed: breed,
              name: breed
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (str) => str.toUpperCase())
                .trim(),
              temperament: "Friendly, Playful",
              group: "Mixed",
            });
          }

          validDog = true;
        } catch (infoError) {
          console.error("Error fetching breed info:", infoError);
          // Fallback if API fails
          setDogData({
            image: imageUrl,
            breed: breed,
            name: breed
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, (str) => str.toUpperCase())
              .trim(),
            temperament: "Friendly, Playful",
            group: "Mixed",
          });
          validDog = true;
        }
      }

      if (!validDog) {
        setError(
          "No matching dogs found. Try removing items from your ban list."
        );
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [banList, API_KEY]);

  // Initialize first load
  useEffect(() => {
    fetchDog();
  }, [fetchDog]);

  // Ban list toggle
  const handleBanToggle = (attribute, value) => {
    setBanList((prev) => {
      const exists = prev.some((item) => item.value === value);
      return exists
        ? prev.filter((item) => item.value !== value)
        : [...prev, { attribute, value }];
    });
  };

  return (
    <div className="app">
      <header>
        <h1>Dog Discovery</h1>
        <p>Discover random dogs and create your ban list</p>
      </header>

      <main>
        <div className="content-container">
          <div className="cards-container">
            {dogData && (
              <DogDisplay
                dog={dogData}
                onAttributeClick={handleBanToggle}
                bannedValues={banList.map((item) => item.value)}
              />
            )}
            <BanList items={banList} onItemClick={handleBanToggle} />
          </div>

          <div className="discover-button">
            <button onClick={fetchDog} disabled={loading}>
              {loading ? "Fetching..." : "Discover New Dog"}
            </button>
            {error && <div className="error">{error}</div>}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
