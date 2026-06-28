"use client"

interface TrackingMapProps {
  status: string
}

export function TrackingMap({ status }: TrackingMapProps) {
  const isActive = status === "shipped" || status === "out_for_delivery"

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
      <h2 className="font-semibold text-[#1A2B5E] mb-3">Package Location</h2>

      <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-xl h-40 flex flex-col items-center justify-center">
        {isActive ? (
          <>
            {/* Animated route when in transit */}
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-[#1A2B5E]" />
                <p className="text-xs font-semibold text-[#1A2B5E]">Warehouse</p>
                <p className="text-[10px] text-gray-500">Dhaka</p>
              </div>

              <div className="relative w-20 h-1 bg-gray-200 rounded-full mx-2">
                <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#D4A017] shadow-md animate-[slide_2s_ease-in-out_infinite]" />
                <style>{`
                  @keyframes slide {
                    0%, 100% { left: 0; }
                    50% { left: calc(100% - 12px); }
                  }
                `}</style>
              </div>

              <div className="flex flex-col items-center gap-1">
                <div className="text-xl">📍</div>
                <p className="text-xs font-semibold text-[#1A2B5E]">Your Location</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              {status === "out_for_delivery" ? "🚴 Delivery agent is near you!" : "Package is on the way"}
            </p>
          </>
        ) : (
          <>
            <span className="text-3xl">📍</span>
            <p className="text-sm text-gray-500 mt-2 text-center">Dhaka Warehouse → Your Location</p>
          </>
        )}
      </div>

      <p className="text-xs text-gray-400 text-center mt-2">
        🚚 Live GPS tracking coming soon
      </p>
    </div>
  )
}
