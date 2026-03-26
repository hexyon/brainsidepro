import { getRegionById } from "@/data/brainRegions";

interface RegionInfoProps {
  regionId: string | null;
  activityContext?: string;
  onClose: () => void;
}

const RegionInfo = ({ regionId, onClose }: RegionInfoProps) => {
  const region = regionId ? getRegionById(regionId) : null;

  if (!region) return null;

  return (
    <div className="apple-card animate-fade-in-up">
      <div className="max-w-6xl mx-auto space-y-6 p-4">

        {/* Header */}
        <div>
          <div className="bg-white dark:bg-black border-2 border-border rounded-2xl p-6 flex items-center justify-between">
            <h2 className="text-[32px] font-bold text-black dark:text-white leading-tight" style={{ fontFamily: 'Times New Roman, Times, serif' }}>
              {region.name}
            </h2>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors text-2xl leading-none"
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Image Card */}
          <div className="relative">
            <div className="bg-gray-50 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-shadow aspect-square flex items-center justify-center">
              <div className="rounded-xl overflow-hidden bg-white/60 dark:bg-black/20 p-4 w-full h-full flex items-center justify-center">
                <img
                  src={region.imagePath}
                  alt={region.name}
                  className="w-full h-full object-contain"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              </div>
            </div>
          </div>

          {/* Definition Card */}
          <div className="relative">
            <div className="bg-gray-50 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-shadow aspect-square flex flex-col">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[26px] font-bold text-gray-800">Definition</span>
              </div>
              <div className="-mx-8 mb-6 border-b border-border dark:hidden" />
              <div className="-mx-8 mb-6 bg-red-500 py-1 hidden dark:block" />
              <p className="text-[23px] text-gray-800 leading-relaxed">
                {region.description}
              </p>
            </div>
          </div>

          {/* Key Functions Card */}
          <div className="relative">
            <div className="bg-gray-50 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-shadow aspect-square flex flex-col">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[26px] font-bold text-gray-800">Key Functions</span>
              </div>
              <div className="-mx-8 mb-6 border-b border-border dark:hidden" />
              <div className="-mx-8 mb-6 bg-red-500 py-1 hidden dark:block" />
              <div className="flex flex-wrap gap-3 flex-1 content-start">
                {region.functions.slice(0, 8).map((func) => (
                  <span
                    key={func}
                    className="inline-flex items-center px-4 py-2 rounded-xl bg-white/60 dark:bg-black/30 border border-gray-300 dark:border-gray-600 text-gray-800 font-medium text-[23px] shadow-sm"
                  >
                    {func}
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default RegionInfo;
