import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import CrewmateCard from "../components/CrewmateCard";

export default function Home() {
  const [crewmates, setCrewmates] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCrewmates = async () => {
    try {
      console.log("[DEBUG] Starting fetch...");
      setLoading(true);
      setError(null);

      let query = supabase.from("crewmates").select("*");

      if (filter === "impostors") {
        query = query.eq("is_impostor", true);
      } else if (filter === "crewmates") {
        query = query.eq("is_impostor", false);
      }

      const { data, error: fetchError } = await query.order("created_at", {
        ascending: false,
      });

      console.log("[DEBUG] API Response:", { data, error: fetchError });

      if (fetchError) {
        throw fetchError;
      }

      if (!data) {
        console.warn("[DEBUG] No data returned, setting empty array");
        setCrewmates([]);
      } else {
        console.log("[DEBUG] Setting crewmates:", data);
        setCrewmates(data);
      }
    } catch (err) {
      console.error("[DEBUG] Fetch error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCrewmates();

    const subscription = supabase
      .channel("crewmates_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "crewmates",
        },
        (payload) => {
          console.log("[DEBUG] Realtime change:", payload);
          fetchCrewmates();
        }
      )
      .subscribe();

    return () => {
      console.log("[DEBUG] Cleaning up subscription");
      supabase.removeChannel(subscription);
    };
  }, [filter]);

  console.log("[DEBUG] Current crewmates state:", crewmates);

  return (
    <div className="among-us-theme">
      <h1>Among Us Crewmate Hub</h1>

      <div className="filter-controls">
        <button onClick={() => setFilter("all")}>All</button>
        <button onClick={() => setFilter("crewmates")}>Crewmates</button>
        <button onClick={() => setFilter("impostors")}>Impostors</button>
      </div>

      {loading && <p>Loading crewmates...</p>}
      {error && (
        <div className="error">
          Error loading crewmates: {error}
          <button onClick={fetchCrewmates}>Retry</button>
        </div>
      )}

      <div className="crewmate-gallery">
        {!loading && crewmates.length === 0 ? (
          <div className="empty-state">
            <p>No crewmates yet! Create your first one.</p>
            <img src="/empty-crew.png" alt="Empty crew" />
          </div>
        ) : (
          crewmates.map((crewmate) => (
            <CrewmateCard key={crewmate.id} crewmate={crewmate} />
          ))
        )}
      </div>
    </div>
  );
}
