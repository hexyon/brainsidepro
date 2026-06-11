import { brainRegions, type BrainRegion } from "@/data/brainRegions";

interface ActiveRegionsListProps {
  activeRegionIds: string[];
  selectedRegionId: string | null;
  onSelectRegion: (id: string) => void;
}

const ActiveRegionsList = ({ activeRegionIds, selectedRegionId, onSelectRegion }: ActiveRegionsListProps) => {
  const activeRegions = activeRegionIds
    .map(id => brainRegions.find(r => r.id === id))
    .filter(Boolean) as BrainRegion[];

  if (activeRegions.length === 0) return null;

  return (
    <div className="apple-card p-6 animate-fade-in-up">
      <div className="flex items-baseline justify-between mb-6 pb-4 border-b border-border">
        <p className="text-[13px] uppercase tracking-[0.12em] font-medium text-muted-foreground">
          Active Regions
        </p>
        <p className="text-[13px] uppercase tracking-[0.12em] font-medium text-muted-foreground">
          {activeRegions.length} found
        </p>
      </div>

      <div className="divide-y divide-border">
        {activeRegions.map((region) => (
          <button
            key={region.id}
            onClick={() => onSelectRegion(region.id)}
            className="w-full flex items-center py-5 group text-left transition-all duration-200 active:scale-[0.99] relative"
          >
            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-0 bg-primary rounded-full transition-all duration-200 group-hover:h-[60%]" />
            <span className="text-[22px] font-semibold tracking-tight flex-1 leading-none pl-4 group-hover:pl-5 transition-all duration-200">
              {region.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ActiveRegionsList;
