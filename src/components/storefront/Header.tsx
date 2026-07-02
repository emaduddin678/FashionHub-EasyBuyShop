"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Search, Heart, ShoppingBag, User, Menu, X, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import { logoutUser } from "@/lib/store/authSlice"

// ── Nav data ──────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: "New Arrivals", href: "/new-arrivals" },
  { label: "Kurtas",       href: "/category/kurta" },
  { label: "Lawn Suits",   href: "/category/lawn-suit" },
  { label: "Sarees",       href: "/category/saree" },
  { label: "Brands",       href: "/brands" },
  { label: "Sale",         href: "/sale", accent: true },
]

const DRESS_CATEGORIES = [
  { label: "Casual",  href: "/category/dress?type=casual" },
  { label: "Party",   href: "/category/dress?type=party" },
  { label: "Formal",  href: "/category/dress?type=formal" },
  { label: "Maxi",    href: "/category/dress?type=maxi" },
  { label: "Mini",    href: "/category/dress?type=mini" },
]

const DRESS_BRANDS = [
  { label: "Aarong",       href: "/brands/aarong" },
  { label: "Yellow",       href: "/brands/yellow" },
  { label: "Sapphire",     href: "/brands/sapphire" },
  { label: "Sana Safinaz", href: "/brands/sana-safinaz" },
  { label: "Khas",         href: "/brands/khas" },
]

// ── Badge ─────────────────────────────────────────────────────────────────────

function Badge({ count }: { count: number }) {
  if (count === 0) return null
  return (
    <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] rounded-full bg-brand-rose text-brand-ivory font-sans font-bold flex items-center justify-center px-1"
      style={{ fontSize: "9px" }}>
      {count > 99 ? "99+" : count}
    </span>
  )
}

// ── Search overlay ────────────────────────────────────────────────────────────

function SearchOverlay({ onClose }: { onClose: () => void }) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState("")

  useEffect(() => { inputRef.current?.focus() }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 z-[200] flex flex-col"
      style={{ background: "rgba(45,45,45,0.50)", backdropFilter: "blur(4px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="w-full py-6 px-4 sm:px-8"
        style={{ background: "var(--color-brand-ivory)", borderBottom: "1px solid var(--color-border)" }}
      >
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <form onSubmit={handleSubmit} className="flex-1 flex items-center gap-3 rounded-full px-5 py-3 border"
            style={{ borderColor: "var(--color-border)", background: "white" }}>
            <Search className="w-5 h-5 text-brand-charcoal/40 flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search kurtas, sarees, brands…"
              className="flex-1 font-sans text-brand-charcoal bg-transparent outline-none placeholder:text-brand-charcoal/30"
              style={{ fontSize: "16px" }}
            />
          </form>
          <button onClick={onClose} aria-label="Close search"
            className="w-10 h-10 flex items-center justify-center rounded-full text-brand-charcoal/50 hover:text-brand-charcoal hover:bg-brand-beige transition-colors flex-shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Mega menu — Dresses ───────────────────────────────────────────────────────

function DressesMegaMenu() {
  return (
    <div
      className="absolute top-full left-1/2 -translate-x-1/2 w-[640px] z-50 rounded-b-xl overflow-hidden shadow-[0_8px_32px_rgba(45,45,45,0.14)]"
      style={{ background: "var(--color-brand-ivory)", border: "1px solid var(--color-border)", borderTop: "none" }}
    >
      <div className="grid grid-cols-3 gap-0">
        {/* Col 1 — Categories */}
        <div className="px-6 py-5 border-r" style={{ borderColor: "var(--color-border-light)" }}>
          <p className="font-sans uppercase tracking-widest text-brand-charcoal/40 mb-3" style={{ fontSize: "10px" }}>
            Categories
          </p>
          <ul className="flex flex-col gap-2.5">
            {DRESS_CATEGORIES.map(({ label, href }) => (
              <li key={href}>
                <Link href={href}
                  className="font-sans text-brand-charcoal hover:text-brand-rose transition-colors"
                  style={{ fontSize: "14px" }}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 2 — Brands */}
        <div className="px-6 py-5 border-r" style={{ borderColor: "var(--color-border-light)" }}>
          <p className="font-sans uppercase tracking-widest text-brand-charcoal/40 mb-3" style={{ fontSize: "10px" }}>
            By Brand
          </p>
          <ul className="flex flex-col gap-2.5">
            {DRESS_BRANDS.map(({ label, href }) => (
              <li key={href}>
                <Link href={href}
                  className="font-sans text-brand-charcoal hover:text-brand-rose transition-colors"
                  style={{ fontSize: "14px" }}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3 — Promo */}
        <div className="relative overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/mega/dresses-promo.jpg"
            alt="Shop Dresses"
            className="w-full h-full object-cover"
            style={{ minHeight: "180px" }}
          />
          <div className="absolute inset-0 flex flex-col justify-end p-4"
            style={{ background: "linear-gradient(to top, rgba(45,45,45,0.7) 0%, transparent 60%)" }}>
            <Link href="/category/dress"
              className="self-start font-sans font-semibold text-brand-ivory px-4 py-2 rounded-full bg-brand-rose hover:bg-brand-mauve transition-colors"
              style={{ fontSize: "13px" }}>
              Shop Dresses
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Mobile drawer ─────────────────────────────────────────────────────────────

function MobileDrawer({ open, onClose, cartCount, wishlistCount }: {
  open: boolean
  onClose: () => void
  cartCount: number
  wishlistCount: number
}) {
  const pathname = usePathname()
  const [searchQ, setSearchQ] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQ.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQ.trim())}`)
      onClose()
    }
  }

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [open])

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn("fixed inset-0 z-[150] transition-opacity duration-300",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none")}
        style={{ background: "rgba(45,45,45,0.50)" }}
        onClick={onClose}
        aria-hidden
      />

      {/* Drawer */}
      <div
        className={cn("fixed inset-y-0 left-0 z-[160] w-[300px] flex flex-col transition-transform duration-300",
          open ? "translate-x-0" : "-translate-x-full")}
        style={{ background: "var(--color-brand-ivory)", borderRight: "1px solid var(--color-border)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "var(--color-border)" }}>
          <Link href="/" onClick={onClose}
            className="font-heading text-brand-charcoal"
            style={{ fontSize: "24px" }}>
            Fashion<span className="text-brand-rose">Hub</span>
          </Link>
          <button onClick={onClose} aria-label="Close menu"
            className="w-9 h-9 flex items-center justify-center rounded-lg text-brand-charcoal/50 hover:text-brand-charcoal hover:bg-brand-beige transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="px-5 py-4 border-b" style={{ borderColor: "var(--color-border)" }}>
          <form onSubmit={handleSearch} className="flex items-center gap-2 rounded-lg px-3 py-2.5 border"
            style={{ borderColor: "var(--color-border)", background: "white" }}>
            <Search className="w-4 h-4 text-brand-charcoal/40 flex-shrink-0" />
            <input
              type="text"
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
              placeholder="Search…"
              className="flex-1 font-sans text-brand-charcoal bg-transparent outline-none placeholder:text-brand-charcoal/30"
              style={{ fontSize: "14px" }}
            />
          </form>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto px-5 py-4">
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map(({ label, href, accent }) => (
              <li key={href}>
                <Link href={href} onClick={onClose}
                  className={cn(
                    "block font-sans font-medium px-3 py-3 rounded-lg transition-colors",
                    pathname === href
                      ? "text-brand-rose bg-brand-rose/8"
                      : accent
                      ? "text-brand-rose hover:bg-brand-rose/8"
                      : "text-brand-charcoal hover:bg-brand-beige",
                  )}
                  style={{ fontSize: "15px" }}>
                  {label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/category/dress" onClick={onClose}
                className={cn(
                  "block font-sans font-medium px-3 py-3 rounded-lg transition-colors",
                  pathname === "/category/dress"
                    ? "text-brand-rose bg-brand-rose/8"
                    : "text-brand-charcoal hover:bg-brand-beige"
                )}
                style={{ fontSize: "15px" }}>
                Dresses
              </Link>
            </li>
          </ul>
        </nav>

        {/* Bottom icon links */}
        <div className="border-t px-5 py-4 flex gap-4" style={{ borderColor: "var(--color-border)" }}>
          <Link href="/wishlist" onClick={onClose}
            className="flex items-center gap-2 font-sans font-medium text-brand-charcoal hover:text-brand-rose transition-colors"
            style={{ fontSize: "14px" }}>
            <div className="relative">
              <Heart className="w-5 h-5" />
              <Badge count={wishlistCount} />
            </div>
            Wishlist
          </Link>
          <Link href="/cart" onClick={onClose}
            className="flex items-center gap-2 font-sans font-medium text-brand-charcoal hover:text-brand-rose transition-colors"
            style={{ fontSize: "14px" }}>
            <div className="relative">
              <ShoppingBag className="w-5 h-5" />
              <Badge count={cartCount} />
            </div>
            Cart
          </Link>
        </div>
      </div>
    </>
  )
}

// ── Account menu (smart — shows user dropdown when logged in) ───────────────────

function AccountMenu() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const user = useAppSelector((s) => s.auth.user)
  const sessionChecked = useAppSelector((s) => s.auth.sessionChecked)
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = async () => {
    setOpen(false)
    await dispatch(logoutUser())
    router.push("/")
  }

  if (!sessionChecked) {
    return <div className="hidden md:flex w-9 h-9 items-center justify-center rounded-lg">
      <div className="w-6 h-6 rounded-full animate-pulse" style={{ background: "var(--color-brand-beige)" }} />
    </div>
  }

  if (!user) {
    return (
      <Link href="/account/login"
        className="hidden md:flex w-9 h-9 items-center justify-center rounded-lg text-brand-charcoal/70 hover:text-brand-rose hover:bg-brand-rose/8 transition-colors"
        aria-label="Sign in">
        <User className="w-5 h-5" />
      </Link>
    )
  }

  return (
    <div className="relative hidden md:block" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-9 h-9 flex items-center justify-center rounded-full font-sans font-bold transition-colors"
        style={{ background: "var(--color-brand-rose)", color: "var(--color-brand-ivory)", fontSize: "13px" }}
        aria-label="Account menu"
      >
        {user.firstName[0]?.toUpperCase()}
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-52 rounded-xl overflow-hidden z-50"
          style={{ background: "var(--color-brand-ivory)", border: "1px solid var(--color-border)", boxShadow: "0 8px 30px rgba(45,42,38,0.14)" }}
        >
          <div className="px-4 py-3" style={{ borderBottom: "1px solid var(--color-border-light)" }}>
            <p className="font-sans font-semibold" style={{ fontSize: "13px", color: "var(--color-brand-charcoal)" }}>
              {user.firstName} {user.lastName}
            </p>
            <p className="font-sans truncate" style={{ fontSize: "11px", color: "var(--color-brand-charcoal)", opacity: 0.5 }}>
              {user.email}
            </p>
          </div>
          <Link
            href="/account"
            onClick={() => setOpen(false)}
            className="block px-4 py-2.5 font-sans hover:bg-brand-beige transition-colors"
            style={{ fontSize: "13px", color: "var(--color-brand-charcoal)" }}
          >
            My Account
          </Link>
          <Link
            href="/wishlist"
            onClick={() => setOpen(false)}
            className="block px-4 py-2.5 font-sans hover:bg-brand-beige transition-colors"
            style={{ fontSize: "13px", color: "var(--color-brand-charcoal)" }}
          >
            My Wishlist
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full text-left px-4 py-2.5 font-sans transition-colors"
            style={{ fontSize: "13px", color: "var(--color-brand-rose)", borderTop: "1px solid var(--color-border-light)" }}
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  )
}

// ── Main Header ───────────────────────────────────────────────────────────────

export function Header() {
  const pathname = usePathname()
  const cartCount = useAppSelector((s) =>
    s.cart.items.reduce((sum, item) => sum + item.quantity, 0)
  )
  const wishlistCount = useAppSelector((s) => s.wishlist.items.length)

  const [searchOpen, setSearchOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [dressMenuOpen, setDressMenuOpen] = useState(false)
  const dressRef = useRef<HTMLDivElement>(null)
  const dressTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const openDressMenu = useCallback(() => {
    if (dressTimer.current) clearTimeout(dressTimer.current)
    setDressMenuOpen(true)
  }, [])

  const closeDressMenu = useCallback(() => {
    dressTimer.current = setTimeout(() => setDressMenuOpen(false), 120)
  }, [])

  // Close drawer on route change
  useEffect(() => { setDrawerOpen(false) }, [pathname])

  return (
    <>
      <header
        className="sticky top-0 z-50 w-full h-[72px] flex items-center"
        style={{
          background: "rgba(253,250,246,0.92)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center gap-6">

          {/* ── Hamburger (mobile only) ── */}
          <button
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg text-brand-charcoal hover:bg-brand-beige transition-colors flex-shrink-0"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* ── Logo ── */}
          <Link href="/" className="flex-shrink-0 flex items-center gap-1">
            <span className="font-heading text-brand-charcoal" style={{ fontSize: "28px", lineHeight: 1 }}>
              Fashion<span className="text-brand-rose">Hub</span>
            </span>
            {/* Rose dot brand signature */}
            <span className="w-1.5 h-1.5 rounded-full bg-brand-rose mb-3 flex-shrink-0" />
          </Link>

          {/* ── Nav links (desktop) ── */}
          <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
            {NAV_LINKS.map(({ label, href, accent }) => (
              <Link key={href} href={href}
                className={cn(
                  "font-sans font-medium px-3 py-2 rounded-lg transition-colors whitespace-nowrap",
                  pathname === href
                    ? "text-brand-rose"
                    : accent
                    ? "text-brand-rose hover:bg-brand-rose/8"
                    : "text-brand-charcoal hover:text-brand-rose",
                )}
                style={{ fontSize: "14px" }}>
                {label}
              </Link>
            ))}

            {/* Dresses with mega menu */}
            <div
              ref={dressRef}
              className="relative"
              onMouseEnter={openDressMenu}
              onMouseLeave={closeDressMenu}
            >
              <button
                className={cn(
                  "flex items-center gap-1 font-sans font-medium px-3 py-2 rounded-lg transition-colors whitespace-nowrap",
                  pathname.startsWith("/category/dress")
                    ? "text-brand-rose"
                    : "text-brand-charcoal hover:text-brand-rose"
                )}
                style={{ fontSize: "14px" }}
                aria-expanded={dressMenuOpen}
              >
                Dresses
                <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-200", dressMenuOpen && "rotate-180")} />
              </button>

              {dressMenuOpen && <DressesMegaMenu />}
            </div>
          </nav>

          {/* ── Icon row (desktop) ── */}
          <div className="flex items-center gap-2 flex-shrink-0 ml-auto md:ml-0">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Open search"
              className="hidden md:flex w-9 h-9 items-center justify-center rounded-lg text-brand-charcoal/70 hover:text-brand-rose hover:bg-brand-rose/8 transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist */}
            <Link href="/wishlist"
              className="hidden md:flex w-9 h-9 items-center justify-center rounded-lg text-brand-charcoal/70 hover:text-brand-rose hover:bg-brand-rose/8 transition-colors relative"
              aria-label={`Wishlist (${wishlistCount} items)`}>
              <Heart className="w-5 h-5" />
              <Badge count={wishlistCount} />
            </Link>

            {/* Cart */}
            <Link href="/cart"
              className="flex w-9 h-9 items-center justify-center rounded-lg text-brand-charcoal/70 hover:text-brand-rose hover:bg-brand-rose/8 transition-colors relative"
              aria-label={`Cart (${cartCount} items)`}>
              <ShoppingBag className="w-5 h-5" />
              <Badge count={cartCount} />
            </Link>

            {/* Account (smart — shows user menu when logged in) */}
            <AccountMenu />
          </div>

        </div>
      </header>

      {/* ── Search overlay ── */}
      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}

      {/* ── Mobile drawer ── */}
      <MobileDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
      />
    </>
  )
}
