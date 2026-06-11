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
    <div className="w-full space-y-4">
      <form onSubmit={handleSubmit} className="space-y-3">
        <label htmlFor="activity-search" className="text-sm font-semibold">
          Describe an activity
        </label>
        <div className="flex items-center gap-2 rounded-2xl border border-border bg-background px-4 py-3 transition focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/20">
          <Search className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
          <input
            id="activity-search"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. giving a speech"
            className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
            aria-label="Describe an activity"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-40"
            disabled={isLoading || !query.trim()}
          >
            Analyze
          </button>
        </div>
      </form>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Examples</p>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => handleSuggestionClick(suggestion)}
              className="rounded-full border border-border bg-background px-3 py-1.5 text-sm text-muted-foreground transition hover:border-primary hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
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
