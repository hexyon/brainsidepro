import { getRegionById } from "@/data/brainRegions";

interface RegionInfoProps {
  regionId: string | null;
  activityContext?: string;
}

const RegionInfo = ({ regionId, activityContext }: RegionInfoProps) => {
  const region = regionId ? getRegionById(regionId) : null;

  if (!region) return null;

  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <div className="flex items-start gap-4">
        <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-secondary p-2">
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
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Selected region</p>
          <h3 className="mt-1 text-xl font-semibold tracking-[-0.04em]">{region.name}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{region.category}</p>
        </div>
      </div>

      <div className="mt-5 space-y-5">
        <section>
          <h4 className="text-sm font-semibold">What it does</h4>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{region.description}</p>
        </section>

        <section>
          <h4 className="text-sm font-semibold">Key functions</h4>
          <div className="mt-2 flex flex-wrap gap-2">
            {region.functions.slice(0, 8).map((func) => (
              <span
                key={func}
                className="rounded-full border border-border bg-secondary/60 px-3 py-1 text-xs font-medium text-muted-foreground"
              >
                {func}
              </span>
            ))}
          </div>
        </section>

        <section>
          <h4 className="text-sm font-semibold">Why it matters here</h4>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {activityContext || `Search for an activity to see how ${region.name} contributes to it.`}
          </p>
        </section>
      </div>
    </div>
  );
};

export default RegionInfo;
