import { useEffect, useState } from "react";

function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const search = async () => {
    if (!query) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:8000/search?q=${query}`);
      if (!response.ok) throw new Error("Something went wrong");
      const data = await response.json();
      setResults(data);

      const uniqueCategories = [...new Set(data.map((r) => r["Category"]).filter(Boolean))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Search failed", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredResults = selectedCategory
    ? results.filter((r) => r["Category"] === selectedCategory)
    : results;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6 font-sans text-gray-900 dark:text-gray-100">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-700 dark:text-blue-300">
             Cooks Illustrated Recipe Finder
          </h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="ml-4 px-3 py-1 border rounded text-sm bg-white text-gray-800 dark:bg-gray-800 dark:text-white dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <input
            type="text"
            value={query}
            placeholder="Search for a recipe..."
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded shadow-sm dark:bg-gray-800 dark:text-white"
          />
          <button
            onClick={search}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Search
          </button>
        </div>

        {categories.length > 0 && (
          <div className="mb-4">
            <label className="block mb-1 font-medium">Filter by Category:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-800 dark:text-white"
            >
              <option value="">All Categories</option>
              {categories.map((cat, idx) => (
                <option key={idx} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        )}

        {loading && <p className="text-gray-600 dark:text-gray-300">Loading...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}
        {!loading && !error && results.length === 0 && query && (
          <p className="text-gray-600 dark:text-gray-300">No results found.</p>
        )}

        <div className="space-y-4 mt-6">
          {filteredResults.map((recipe, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow border border-gray-200 dark:border-gray-700 hover:shadow-md transition"
            >
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                {recipe["Recipe"]}
              </h2>
              <p>
                <strong>Issue:</strong> {recipe["Date"]} ({recipe["Months"]},{" "}
                {recipe["Year"]})
              </p>
              <p>
                <strong>Category:</strong> {recipe["Category"]}
              </p>
              <p>
                <strong>Cover Color:</strong> {recipe["Cover Color (Border)"]}
              </p>
              <p>
                <strong>Notes:</strong>{" "}
                {recipe["Notes"] ? (
                  <a
                    href={recipe["Notes"]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 underline"
                  >
                    {recipe["Notes"]}
                  </a>
                ) : (
                  "None"
                )}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
