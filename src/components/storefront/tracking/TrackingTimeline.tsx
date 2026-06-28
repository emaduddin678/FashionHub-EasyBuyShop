"use client"

import { Check, Package, Truck, MapPin, Home, ShoppingBag } from "lucide-react"

interface TimelineStep {
  status: string
  label: string
  description: string
  timestamp: string | null
  expectedDate?: string
  completed: boolean
  active?: boolean
}

interface TrackingTimelineProps {
  timeline: TimelineStep[]
}

const STEP_ICONS: Record<string, React.ElementType> = {
  order_placed: ShoppingBag,
  payment_confirmed: Check,
  being_packed: Package,
  shipped: Truck,
  out_for_delivery: MapPin,
  delivered: Home,
}

function formatTimestamp(ts: string | null, expectedDate?: string): string {
  if (ts) {
    const d = new Date(ts)
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) +
      ", " +
      d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: true })
  }
  if (expectedDate) {
    const d = new Date(expectedDate)
    return "Expected: " + d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
  }
  return ""
}

export function TrackingTimeline({ timeline }: TrackingTimelineProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
      <h2 className="font-semibold text-[#1A2B5E] mb-6">Delivery Timeline</h2>

      <div className="relative">
        {timeline.map((step, i) => {
          const Icon = STEP_ICONS[step.status] ?? Package
          const isLast = i === timeline.length - 1
          const isCompleted = step.completed
          const isActive = step.active && !isCompleted

          return (
            <div key={step.status} className="relative flex gap-4">
              {/* Vertical line */}
              {!isLast && (
                <div
                  className={`absolute left-4 top-8 w-0.5 h-full ${
                    isCompleted
                      ? "bg-green-300"
                      : "border-l-2 border-dashed border-gray-200 bg-transparent"
                  }`}
                  style={isCompleted ? {} : { background: "none" }}
                />
              )}

              {/* Icon circle */}
              <div className="relative flex-shrink-0">
                {isActive && (
                  <span className="absolute inset-0 rounded-full bg-amber-400 opacity-30 animate-ping" />
                )}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center z-10 relative ${
                    isCompleted
                      ? "bg-green-500"
                      : isActive
                      ? "bg-amber-500"
                      : "bg-gray-100 border-2 border-gray-200"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 text-white" strokeWidth={3} />
                  ) : (
                    <Icon
                      className={`w-4 h-4 ${isActive ? "text-white" : "text-gray-400"}`}
                    />
                  )}
                </div>
              </div>

              {/* Content */}
              <div
                className={`flex-1 pb-6 ${
                  isActive ? "bg-amber-50 -mx-4 px-4 rounded-lg py-3 mb-3" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p
                      className={`font-medium text-sm ${
                        isCompleted
                          ? "text-[#1A2B5E]"
                          : isActive
                          ? "text-amber-700"
                          : "text-gray-400"
                      }`}
                    >
                      {step.label}
                      {isActive && (
                        <span className="ml-2 text-[10px] font-bold bg-amber-100 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full uppercase tracking-wide">
                          Current
                        </span>
                      )}
                    </p>
                    <p className={`text-xs mt-0.5 ${isCompleted || isActive ? "text-gray-500" : "text-gray-400"}`}>
                      {step.description}
                    </p>
                  </div>
                  <p className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0">
                    {formatTimestamp(step.timestamp, step.expectedDate)}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
