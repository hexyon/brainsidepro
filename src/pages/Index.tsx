import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import SearchBar from "@/components/SearchBar";
import BrainScene from "@/components/BrainScene";
import ActiveRegionsList from "@/components/ActiveRegionsList";
import RegionInfo from "@/components/RegionInfo";
import { useAIBrainAnalysis } from "@/hooks/useAIBrainAnalysis";

const Index = () => {
  const [isDark, setIsDark] = useState(false);
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null);
  const { analyze, isAnalyzing, result, reset } = useAIBrainAnalysis();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  const handleSearch = async (query: string) => {
    setSelectedRegionId(null);
    await analyze(query);
  };

  const activeRegionIds = result?.regions ?? [];
  const primaryRegionId = activeRegionIds.length > 0 ? activeRegionIds[0] : null;

  useEffect(() => {
    if (primaryRegionId) {
      setSelectedRegionId(primaryRegionId);
    }
  }, [primaryRegionId]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="pt-12 pb-6 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <img src="/favicon.ico" alt="Brain Logo" className="w-32 h-32" />
            <button
              onClick={() => setIsDark(!isDark)}
              className="w-12 h-12 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200 active:scale-95 shadow-md hover:shadow-lg flex items-center justify-center"
              aria-label="Toggle dark mode"
            >
              <span className="text-2xl">
                <span className="dark:hidden">🌙</span>
                <span className="hidden dark:inline">☀️</span>
              </span>
            </button>
          </div>
          <p className="text-foreground/70 text-[20px] max-w-2xl mx-auto leading-relaxed">
            Discover which brain regions activate during different activities
          </p>
        </div>
      </header>

      {/* Search Section */}
      <section className="px-6 pb-8">
        <div className="max-w-3xl mx-auto">
          <SearchBar onSearch={handleSearch} isLoading={isAnalyzing} />
        </div>
      </section>

      {/* Brain Visualization */}
      <section className="px-6">
        <div className="max-w-7xl mx-auto">
          <div className="apple-card overflow-hidden" style={{ height: '450px' }}>
            <BrainScene
              activeRegionIds={activeRegionIds}
              primaryRegionId={primaryRegionId}
              onSelectRegion={setSelectedRegionId}
            />
          </div>
        </div>
      </section>

      {/* Info Panels */}
      <section className="px-6 py-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {activeRegionIds.length > 0 && (
            <ActiveRegionsList
              activeRegionIds={activeRegionIds}
              selectedRegionId={selectedRegionId}
              onSelectRegion={setSelectedRegionId}
            />
          )}

          {selectedRegionId && (
            <RegionInfo
              regionId={selectedRegionId}
              activityContext={result?.description}
            />
          )}

          {isAnalyzing && (
            <div className="text-center py-12 animate-fade-in-up">
              <div className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-secondary">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
                <span className="text-[17px] font-medium">
                  Analyzing brain activity with AI...
                </span>
              </div>
            </div>
          )}

          {activeRegionIds.length === 0 && !selectedRegionId && !isAnalyzing && (
            <div className="text-center py-12 animate-fade-in-up">
              <div className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-secondary/50">
                <img src="/search.png" alt="Search" className="w-5 h-5 object-contain" />
                <span className="text-[17px] text-muted-foreground">
                  Search for any activity to see brain regions light up
                </span>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Index;
