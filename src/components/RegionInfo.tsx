import { getRegionById } from "@/data/brainRegions";

interface RegionInfoProps {
  regionId: string | null;
  activityContext?: string;
}

const RegionInfo = ({ regionId, activityContext }: RegionInfoProps) => {
  const region = regionId ? getRegionById(regionId) : null;
  const panelEdge =
    "border border-zinc-300 dark:border-zinc-700 ring-1 ring-zinc-950/5 dark:ring-white/10 shadow-sm";
  const textPanel =
    `bg-white dark:bg-zinc-950 p-8 ${panelEdge} aspect-square flex flex-col`;
  const divider = "-mx-8 mb-6 border-b border-zinc-200 dark:border-zinc-800";

  if (!region) return null;

  return (
    <div className="bg-card border border-border/50 animate-fade-in-up">
      <div className="max-w-6xl mx-auto space-y-6 p-4">
        {/* Header */}
        <div>
          <div className="bg-white dark:bg-black border-2 border-border p-6 flex items-center justify-center">
            <h2
              className="text-[32px] font-bold text-black dark:text-white leading-tight text-center"
              style={{ fontFamily: "Times New Roman, Times, serif" }}
            >
              {region.name}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Image Card */}
          <div className="relative">
            <div
              className={`bg-black ${panelEdge} aspect-square overflow-hidden flex items-center justify-center`}
            >
              <div className="w-full h-full flex items-center justify-center">
                <img
                  src={region.imagePath}
                  alt={region.name}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            </div>
          </div>

          {/* Definition Card */}
          <div className="relative">
            <div className={textPanel}>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[26px] font-bold text-zinc-900 dark:text-zinc-100">
                  Definition
                </span>
              </div>
              <div className={divider} />
              <p className="text-[23px] text-zinc-800 dark:text-zinc-200 leading-relaxed">
                {region.description}
              </p>
            </div>
          </div>

          {/* Key Functions Card */}
          <div className="relative">
            <div className={textPanel}>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[26px] font-bold text-zinc-900 dark:text-zinc-100">
                  Key Functions
                </span>
              </div>
              <div className={divider} />
              <div className="flex flex-wrap gap-3 flex-1 content-start">
                {region.functions.slice(0, 8).map((func) => (
                  <span
                    key={func}
                    className="inline-flex items-center px-4 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 font-medium text-[23px]"
                  >
                    {func}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Activity Context Card */}
          <div className="relative">
            <div className={textPanel}>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[26px] font-bold text-zinc-900 dark:text-zinc-100">
                  Activity Context
                </span>
              </div>
              <div className={divider} />
              <p className="text-[23px] text-zinc-800 dark:text-zinc-200 leading-relaxed">
                {activityContext ||
                  `Search for an activity to see how ${region.name} contributes to it.`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegionInfo;
