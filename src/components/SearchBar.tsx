import { useState } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

const suggestions = [
  "Running a marathon",
  "Solving a math problem",
  "Playing the piano",
  "Reading a book",
  "Coding a website",
  "Dancing salsa",
  "Feeling anxious",
  "Riding a bicycle",
];

const SearchBar = ({ onSearch, isLoading }: SearchBarProps) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSearch(query.trim());
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    onSearch(suggestion);
  };

  return (
    <div className="w-full space-y-4">
      <form onSubmit={handleSubmit} className="relative">
        <div className="editorial-search-container">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Describe an activity..."
            className="editorial-search-input"
            aria-label="Search"
            disabled={isLoading}
          />
          {query && (
            <button
              type="submit"
              className="flex-shrink-0 p-2 rounded-lg transition-transform active:scale-95"
              disabled={isLoading}
            >
              <img
                src="/search.png"
                alt="Search"
                className="w-5 h-5 object-contain dark:invert"
              />
            </button>
          )}
        </div>
      </form>

      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => handleSuggestionClick(suggestion)}
            className="apple-badge hover:bg-primary/10 hover:text-primary transition-all duration-200"
            disabled={isLoading}
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchBar;
