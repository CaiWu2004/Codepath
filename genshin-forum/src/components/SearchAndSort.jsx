import { useContext } from "react";
import { PostContext } from "../context/PostContext";

export default function SearchAndSort() {
  const { searchTerm, setSearchTerm, sortBy, setSortBy } =
    useContext(PostContext);

  return (
    <div className="search-sort-container">
      <div className="search-box">
        <input
          type="text"
          placeholder="Search posts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="sort-options">
        <label>Sort by:</label>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="createdAt">Newest First</option>
          <option value="upvotes">Most Upvoted</option>
        </select>
      </div>
    </div>
  );
}
