import { brainRegions, type BrainRegion } from "@/data/brainRegions";

interface ActiveRegionsListProps {
  activeRegionIds: string[];
  selectedRegionId: string | null;
  onSelectRegion: (id: string) => void;
}

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

const ActiveRegionsList = ({ activeRegionIds, selectedRegionId, onSelectRegion }: ActiveRegionsListProps) => {
  const activeRegions = activeRegionIds
    .map((id) => brainRegions.find((region) => region.id === id))
    .filter(Boolean) as BrainRegion[];

  if (activeRegions.length === 0) return null;

  return (
    <div className="rounded-2xl border border-border bg-background p-3">
      <div className="mb-2 flex items-center justify-between px-1">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Active regions</p>
        <p className="text-xs font-medium text-muted-foreground">{activeRegions.length}</p>
      </div>

      <div className="space-y-2">
        {activeRegions.map((region) => {
          const isSelected = selectedRegionId === region.id;

          return (
            <button
              key={region.id}
              onClick={() => onSelectRegion(region.id)}
              className={`w-full rounded-xl border p-3 text-left transition ${
                isSelected
                  ? "border-primary bg-primary/20 text-foreground"
                  : "border-transparent bg-secondary/60 text-muted-foreground hover:border-border hover:bg-secondary hover:text-foreground"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-semibold tracking-[-0.02em]">{region.name}</span>
                <span className="h-2.5 w-2.5 flex-shrink-0 rounded-full" style={{ backgroundColor: region.color }} />
              </div>
              <p className="mt-1 text-xs">{roleByRegionId[region.id] ?? region.category}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ActiveRegionsList;
