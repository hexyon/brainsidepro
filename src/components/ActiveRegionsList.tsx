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
    <div className="border-2 border-border bg-background p-5">
      <div className="mb-4 flex items-center justify-between border-b-2 border-border pb-3">
        <h3 className="text-2xl font-bold tracking-[-0.03em]">Active regions</h3>
        <p className="text-lg font-bold text-muted-foreground">{activeRegions.length}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {activeRegions.map((region) => {
          const isSelected = selectedRegionId === region.id;

          return (
            <button
              key={region.id}
              onClick={() => onSelectRegion(region.id)}
              className={`border-2 px-3 py-2 text-left text-base font-bold transition ${
                isSelected
                  ? "border-foreground bg-primary text-primary-foreground"
                  : "border-border bg-secondary text-foreground hover:border-foreground"
              }`}
            >
              <span>{region.name}</span>
              <span className="ml-2 text-sm font-semibold opacity-70">{roleByRegionId[region.id] ?? region.category}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ActiveRegionsList;
