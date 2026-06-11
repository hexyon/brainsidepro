import { useState } from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

const suggestions = [
  "Playing the piano",
  "Solving a math problem",
  "Feeling anxious before a test",
  "Dancing salsa",
  "Reading a book",
  "Riding a bicycle",
];

const SearchBar = ({ onSearch, isLoading }: SearchBarProps) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) onSearch(query.trim());
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    onSearch(suggestion);
  };

  return (
    <div className="w-full space-y-5">
      <form onSubmit={handleSubmit} className="space-y-3">
        <label htmlFor="activity-search" className="text-xl font-bold">
          Describe an activity
        </label>
        <div className="flex items-center gap-3 border-2 border-border bg-background px-4 py-4 transition focus-within:border-foreground focus-within:ring-4 focus-within:ring-primary/25">
          <Search className="h-6 w-6 flex-shrink-0 text-muted-foreground" />
          <input
            id="activity-search"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. giving a speech"
            className="min-w-0 flex-1 bg-transparent text-xl outline-none placeholder:text-muted-foreground"
            aria-label="Describe an activity"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="border-2 border-foreground bg-foreground px-5 py-3 text-base font-bold text-background transition hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-40"
            disabled={isLoading || !query.trim()}
          >
            Analyze
          </button>
        </div>
      </form>

      <div>
        <p className="mb-3 text-base font-bold uppercase tracking-[0.16em] text-muted-foreground">Examples</p>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => handleSuggestionClick(suggestion)}
              className="border-2 border-border bg-secondary px-3 py-2 text-base font-semibold text-foreground transition hover:border-foreground disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isLoading}
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
