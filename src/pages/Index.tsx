import { useEffect, useMemo, useState } from "react";
import { Brain, Loader2, Moon, Sparkles, Sun } from "lucide-react";
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
      <div className="mx-auto flex min-h-screen w-full max-w-[1440px] flex-col gap-6 px-4 py-5 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 rounded-[28px] border border-border/70 bg-card/70 px-5 py-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
              <Brain className="h-7 w-7" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Brain Side Pro</p>
              <h1 className="mt-1 text-2xl font-semibold tracking-[-0.04em] sm:text-3xl">Understand what your brain is doing</h1>
            </div>
          </div>
          <button
            onClick={() => setIsDark(!isDark)}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border bg-background px-4 text-sm font-medium text-foreground transition hover:bg-secondary"
            aria-label="Toggle dark mode"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            {isDark ? "Light" : "Dark"}
          </button>
        </header>

        <section className="grid flex-1 gap-6 lg:grid-cols-[340px_minmax(0,1fr)_380px]">
          <aside className="space-y-4 rounded-[28px] border border-border/70 bg-card p-5 shadow-sm lg:sticky lg:top-5 lg:h-[calc(100vh-2.5rem)] lg:overflow-auto">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5" />
                Start here
              </div>
              <p className="text-[15px] leading-6 text-muted-foreground">
                Type an activity and the app maps likely brain systems into a simple, explorable view.
              </p>
            </div>
            <SearchBar onSearch={handleSearch} isLoading={isAnalyzing} />
            <div className="rounded-2xl border border-border bg-background/70 p-4">
              <p className="text-sm font-semibold">How it works</p>
              <ol className="mt-3 space-y-3 text-sm text-muted-foreground">
                <li className="flex gap-3"><span className="step-dot">1</span><span>Describe what someone is doing or feeling.</span></li>
                <li className="flex gap-3"><span className="step-dot">2</span><span>AI identifies likely brain regions involved.</span></li>
                <li className="flex gap-3"><span className="step-dot">3</span><span>Explore each region with plain-English context.</span></li>
              </ol>
            </div>
            <p className="rounded-2xl bg-secondary/70 p-4 text-xs leading-5 text-muted-foreground">
              Educational visualization only. It is not medical advice or a diagnosis.
            </p>
          </aside>

          <section className="flex min-h-[640px] flex-col gap-4 rounded-[32px] border border-border/70 bg-card p-4 shadow-sm sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Visualization</p>
                <h2 className="mt-1 text-3xl font-semibold tracking-[-0.05em]">{activeRegionIds.length ? `${activeRegionIds.length} active regions` : "Ready to analyze"}</h2>
              </div>
              <div className="rounded-2xl bg-secondary px-4 py-3 text-sm text-muted-foreground sm:max-w-[320px]">
                {activeRegionIds.length ? `Likely systems: ${systemSummary}.` : "Try an example like “playing piano” or “feeling anxious before a test.”"}
              </div>
            </div>

            <div className="min-h-[460px] flex-1 overflow-hidden rounded-[28px] border border-border bg-background">
              <BrainScene
                activeRegionIds={activeRegionIds}
                primaryRegionId={selectedRegionId ?? primaryRegionId}
                onSelectRegion={setSelectedRegionId}
              />
            </div>

            {isAnalyzing && (
              <div className="grid gap-3 rounded-[24px] border border-border bg-background p-4 text-sm text-muted-foreground sm:grid-cols-3">
                <div className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin text-primary" /> Reading activity</div>
                <div className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin text-primary" /> Mapping systems</div>
                <div className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin text-primary" /> Preparing explanation</div>
              </div>
            )}

            {!isAnalyzing && activeRegions.length > 0 && (
              <div className="grid gap-3 sm:grid-cols-3">
                {activeRegions.slice(0, 3).map((region) => region && (
                  <button
                    key={region.id}
                    onClick={() => setSelectedRegionId(region.id)}
                    className="rounded-2xl border border-border bg-background p-4 text-left transition hover:-translate-y-0.5 hover:shadow-sm"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{roleByRegionId[region.id] ?? region.category}</p>
                    <p className="mt-2 text-lg font-semibold tracking-[-0.03em]">{region.name}</p>
                  </button>
                ))}
              </div>
            )}
          </section>

          <aside className="space-y-4 rounded-[28px] border border-border/70 bg-card p-5 shadow-sm lg:sticky lg:top-5 lg:h-[calc(100vh-2.5rem)] lg:overflow-auto">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Analysis</p>
              <h2 className="mt-1 text-2xl font-semibold tracking-[-0.04em]">{activeRegionIds.length ? "What lit up" : "Your results will appear here"}</h2>
            </div>

            {activeRegionIds.length > 0 ? (
              <>
                <div className="rounded-2xl bg-secondary/70 p-4">
                  <p className="text-sm font-semibold">At a glance</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
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
              <div className="rounded-2xl border border-dashed border-border bg-background p-5 text-sm leading-6 text-muted-foreground">
                Search for an activity to see the AI summary, active region list, and a focused explanation for each region.
              </div>
            )}
          </aside>
        </section>
      </div>
    </main>
  );
};

export default Index;
