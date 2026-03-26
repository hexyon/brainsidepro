import { brainRegions } from "@/data/brainRegions";

interface BrainSceneProps {
  activeRegionIds: string[];
  primaryRegionId: string | null;
  onSelectRegion: (id: string) => void;
}

const BrainScene = ({ activeRegionIds, primaryRegionId, onSelectRegion }: BrainSceneProps) => {
  const displayRegion = primaryRegionId
    ? brainRegions.find(r => r.id === primaryRegionId)
    : activeRegionIds.length > 0
    ? brainRegions.find(r => r.id === activeRegionIds[0])
    : null;

  return (
    <div className="w-full h-full flex items-center justify-center p-8 bg-gradient-to-br from-secondary/30 to-background">
      {displayRegion ? (
        <div className="relative w-full h-full flex items-center justify-center">
          <img
            src={displayRegion.imagePath}
            alt={displayRegion.name}
            className="max-w-full max-h-full object-contain"
          />
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
            <div className="apple-card px-6 py-3 glass-effect">
              <h3 className="text-foreground font-semibold text-[19px] text-center whitespace-nowrap">
                {displayRegion.name}
              </h3>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <div className="text-8xl mb-6">🧠</div>
          <p className="text-[19px] text-muted-foreground font-medium">
            Search for an activity to see brain regions
          </p>
        </div>
      )}
    </div>
  );
};

export default BrainScene;
