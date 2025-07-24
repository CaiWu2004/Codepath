import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function CreateCrewmate() {
  const [crewmate, setCrewmate] = useState({
    name: "",
    color: "Red",
    hat: "None",
    pet: "None",
    is_impostor: false, // Ensure this matches your Supabase column
    role: "Crewmate",
    bio: "",
    image_url: "",
  });

  // ... rest of your component

  const createCrewmate = async (e) => {
    e.preventDefault();

    try {
      const { data, error } = await supabase
        .from("crewmates")
        .insert({
          name: crewmate.name,
          color: crewmate.color,
          hat: crewmate.hat,
          pet: crewmate.pet,
          is_impostor: crewmate.is_impostor, // This must match your table column
          role: crewmate.role,
          bio: crewmate.bio,
          image_url:
            crewmate.image_url ||
            `https://www.innersloth.com/wp-content/uploads/2021/06/amongus-${crewmate.color.toLowerCase()}.png`,
        })
        .select();

      if (error) throw error;

      navigate("/");
    } catch (err) {
      console.error("Error creating crewmate:", err);
      alert(`Error: ${err.message}`);
    }
  };

  // ... rest of your component
}
