import { useEffect, useMemo, useState } from "react";
import { Loader2, Moon, Sun } from "lucide-react";
import SearchBar from "@/components/SearchBar";
import BrainScene from "@/components/BrainScene";
import ActiveRegionsList from "@/components/ActiveRegionsList";
import RegionInfo from "@/components/RegionInfo";
import { brainRegions } from "@/data/brainRegions";
import { useAIBrainAnalysis } from "@/hooks/useAIBrainAnalysis";

const roleByRegionId: Record<string, string> = {
  prefrontal: "Thinking",
  motor: "Movement",
  sensory: "Senses",
  visual: "Senses",
  auditory: "Senses",
  broca: "Language",
  wernicke: "Language",
  hippocampus: "Memory",
  amygdala: "Emotion",
  cerebellum: "Movement",
  thalamus: "Coordination",
  hypothalamus: "Body regulation",
  brainstem: "Body regulation",
  parietal: "Spatial awareness",
  temporal: "Memory",
};

const getSystemSummary = (regionIds: string[]) => {
  const roles = Array.from(new Set(regionIds.map((id) => roleByRegionId[id]).filter(Boolean)));
  if (roles.length === 0) return "Search an activity to map likely brain systems.";
  if (roles.length === 1) return roles[0];
  return `${roles.slice(0, -1).join(", ")} and ${roles[roles.length - 1]}`;
};

const Index = () => {
  const [isDark, setIsDark] = useState(false);
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null);
  const { analyze, isAnalyzing, result } = useAIBrainAnalysis();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  const handleSearch = async (query: string) => {
    setSelectedRegionId(null);
    await analyze(query);
  };

  const activeRegionIds = result?.regions ?? [];
  const primaryRegionId = activeRegionIds.length > 0 ? activeRegionIds[0] : null;
  const activeRegions = useMemo(
    () => activeRegionIds.map((id) => brainRegions.find((region) => region.id === id)).filter(Boolean),
    [activeRegionIds]
  );
  const systemSummary = getSystemSummary(activeRegionIds);

  useEffect(() => {
    if (primaryRegionId) setSelectedRegionId(primaryRegionId);
  }, [primaryRegionId]);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-[1500px] flex-col gap-6 px-4 py-5 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-5 border-2 border-border bg-card px-5 py-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <div className="flex items-center gap-5">
            <div className="flex h-20 w-20 items-center justify-center border-2 border-border bg-background p-2 shadow-sm">
              <img src="/favicon.ico" alt="Brain Side icon" className="h-full w-full object-contain" />
            </div>
            <div>
              <p className="text-base font-bold uppercase tracking-[0.16em] text-muted-foreground">Brain Side</p>
              <h1 className="mt-2 text-3xl font-bold tracking-[-0.04em] sm:text-4xl">Understand what your brain is doing</h1>
            </div>
          </div>
          <button
            onClick={() => setIsDark(!isDark)}
            className="inline-flex h-12 items-center justify-center gap-2 border-2 border-border bg-background px-5 text-base font-bold text-foreground transition hover:bg-secondary"
            aria-label="Toggle dark mode"
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            {isDark ? "Light" : "Dark"}
          </button>
        </header>

        <section className="grid flex-1 gap-6 lg:grid-cols-[380px_minmax(0,1fr)_420px]">
          <aside className="space-y-5 border-2 border-border bg-card p-5 shadow-sm lg:sticky lg:top-5 lg:h-[calc(100vh-2.5rem)] lg:overflow-auto">
            <div className="border-2 border-border bg-background p-5">
              <h2 className="text-2xl font-bold tracking-[-0.03em]">Search an activity</h2>
              <p className="mt-3 text-lg leading-7 text-muted-foreground">
                Type what someone is doing or feeling. The app will map the likely brain systems and explain them in plain English.
              </p>
            </div>

            <div className="border-2 border-border bg-background p-5">
              <SearchBar onSearch={handleSearch} isLoading={isAnalyzing} />
            </div>

            <div className="border-2 border-border bg-background p-5">
              <h2 className="text-2xl font-bold tracking-[-0.03em]">How it works</h2>
              <ol className="mt-4 space-y-4 text-lg leading-7 text-muted-foreground">
                <li className="flex gap-4"><span className="flex h-8 w-8 flex-shrink-0 items-center justify-center border-2 border-border bg-secondary text-base font-bold text-foreground">1</span><span>Describe an activity or feeling.</span></li>
                <li className="flex gap-4"><span className="flex h-8 w-8 flex-shrink-0 items-center justify-center border-2 border-border bg-secondary text-base font-bold text-foreground">2</span><span>AI identifies likely active brain regions.</span></li>
                <li className="flex gap-4"><span className="flex h-8 w-8 flex-shrink-0 items-center justify-center border-2 border-border bg-secondary text-base font-bold text-foreground">3</span><span>Select any region to understand its role.</span></li>
              </ol>
            </div>

            <p className="border-2 border-border bg-secondary p-5 text-base font-medium leading-7 text-muted-foreground">
              Educational visualization only. It is not medical advice or a diagnosis.
            </p>
          </aside>

          <section className="flex min-h-[680px] flex-col gap-5 border-2 border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="grid gap-4 border-2 border-border bg-background p-5 xl:grid-cols-[1fr_360px]">
              <div>
                <p className="text-base font-bold uppercase tracking-[0.16em] text-muted-foreground">Visualization</p>
                <h2 className="mt-2 text-4xl font-bold tracking-[-0.05em]">
                  {activeRegionIds.length ? `${activeRegionIds.length} active regions` : "Ready to analyze"}
                </h2>
              </div>
              <div className="border-2 border-border bg-secondary p-4 text-lg leading-7 text-muted-foreground">
                {activeRegionIds.length ? `Likely systems: ${systemSummary}.` : "Try an example like “playing piano” or “feeling anxious before a test.”"}
              </div>
            </div>

            <div className="min-h-[500px] flex-1 overflow-hidden border-2 border-border bg-background">
              <BrainScene
                activeRegionIds={activeRegionIds}
                primaryRegionId={selectedRegionId ?? primaryRegionId}
                onSelectRegion={setSelectedRegionId}
              />
            </div>

            {isAnalyzing && (
              <div className="grid gap-3 border-2 border-border bg-background p-5 text-lg text-muted-foreground sm:grid-cols-3">
                <div className="flex items-center gap-3"><Loader2 className="h-5 w-5 animate-spin text-primary" /> Reading activity</div>
                <div className="flex items-center gap-3"><Loader2 className="h-5 w-5 animate-spin text-primary" /> Mapping systems</div>
                <div className="flex items-center gap-3"><Loader2 className="h-5 w-5 animate-spin text-primary" /> Preparing explanation</div>
              </div>
            )}
          </section>

          <aside className="space-y-5 lg:sticky lg:top-5 lg:h-[calc(100vh-2.5rem)] lg:overflow-auto">
            <div className="border-2 border-border bg-card p-5 shadow-sm">
              <p className="text-base font-bold uppercase tracking-[0.16em] text-muted-foreground">Analysis</p>
              <h2 className="mt-2 text-3xl font-bold tracking-[-0.04em]">
                {activeRegionIds.length ? "What lit up" : "Results appear here"}
              </h2>
            </div>

            {activeRegionIds.length > 0 ? (
              <>
                <div className="border-2 border-border bg-card p-5 shadow-sm">
                  <h3 className="text-2xl font-bold tracking-[-0.03em]">At a glance</h3>
                  <p className="mt-3 text-lg leading-7 text-muted-foreground">
                    This activity likely involves {systemSummary.toLowerCase()} across {activeRegionIds.length} brain regions.
                  </p>
                </div>

                <ActiveRegionsList
                  activeRegionIds={activeRegionIds}
                  selectedRegionId={selectedRegionId}
                  onSelectRegion={setSelectedRegionId}
                />

                <RegionInfo
                  regionId={selectedRegionId}
                  activityContext={result?.description}
                />
              </>
            ) : (
              <div className="border-2 border-dashed border-border bg-card p-5 text-lg leading-7 text-muted-foreground shadow-sm">
                Search for an activity to see the AI summary, active region buttons, and a focused explanation for each selected region.
              </div>
            )}
          </aside>
        </section>
      </div>
    </main>
  );
};

export default Index;
