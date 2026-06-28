import Link from "next/link"
import { Heart } from "lucide-react"

export function EmptyWishlist() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <Heart size={80} className="text-gray-200" />
      <h2 className="font-bold text-2xl text-[#1A2B5E] mt-4">Your wishlist is empty</h2>
      <p className="text-gray-400 text-sm mt-2 max-w-md mx-auto leading-relaxed">
        Save items you love and come back to them anytime.
        Start exploring our collection!
      </p>
      <div className="mt-8 flex gap-4 justify-center flex-wrap">
        <Link
          href="/men"
          className="bg-[#1A2B5E] text-white px-7 py-3 rounded-xl font-bold text-sm hover:bg-[#D4A017] transition-colors"
        >
          Explore Men&apos;s
        </Link>
        <Link
          href="/women"
          className="border-2 border-[#1A2B5E] text-[#1A2B5E] px-7 py-3 rounded-xl font-bold text-sm hover:bg-[#1A2B5E] hover:text-white transition-colors"
        >
          Explore Women&apos;s
        </Link>
      </div>
      <p className="text-xs text-gray-400 mt-6">
        💡 Tip: Click the ♡ heart icon on any product to save it here
      </p>
    </div>
  )
}
