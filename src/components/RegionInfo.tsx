import { getRegionById } from "@/data/brainRegions";

interface RegionInfoProps {
  regionId: string | null;
  activityContext?: string;
}

const RegionInfo = ({ regionId, activityContext }: RegionInfoProps) => {
  const region = regionId ? getRegionById(regionId) : null;

  if (!region) return null;

  return (
    <div className="space-y-5">
      <section className="border-2 border-border bg-background p-5">
        <div className="flex items-start gap-5">
          <div className="flex h-28 w-28 flex-shrink-0 items-center justify-center border-2 border-border bg-secondary p-2">
            <img
              src={region.imagePath}
              alt={region.name}
              className="h-full w-full object-contain"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
          <div className="min-w-0">
            <p className="text-base font-bold uppercase tracking-[0.16em] text-muted-foreground">Selected region</p>
            <h3 className="mt-2 text-3xl font-bold tracking-[-0.04em]">{region.name}</h3>
            <p className="mt-2 text-lg font-semibold text-muted-foreground">{region.category}</p>
          </div>
        </div>
      </section>

      <section className="border-2 border-border bg-background p-5">
        <h4 className="border-b-2 border-border pb-3 text-2xl font-bold tracking-[-0.03em]">What it does</h4>
        <p className="mt-4 text-lg leading-8 text-muted-foreground">{region.description}</p>
      </section>

      <section className="border-2 border-border bg-background p-5">
        <h4 className="border-b-2 border-border pb-3 text-2xl font-bold tracking-[-0.03em]">Key functions</h4>
        <div className="mt-4 flex flex-wrap gap-2">
          {region.functions.slice(0, 8).map((func) => (
            <span
              key={func}
              className="border-2 border-border bg-secondary px-3 py-2 text-base font-bold text-foreground"
            >
              {func}
            </span>
          ))}
        </div>
      </section>

      <section className="border-2 border-border bg-background p-5">
        <h4 className="border-b-2 border-border pb-3 text-2xl font-bold tracking-[-0.03em]">Why it matters here</h4>
        <p className="mt-4 text-lg leading-8 text-muted-foreground">
          {activityContext || `Search for an activity to see how ${region.name} contributes to it.`}
        </p>
      </section>
    </div>
  );
};

export default RegionInfo;
