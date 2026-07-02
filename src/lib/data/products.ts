export type ProductCategory = 'kurta' | 'lawn-suit' | 'saree' | 'dress' | 'pant' | 'accessory'
export type ClothingSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL'
export type Brand = 'Aarong' | 'Yellow' | 'Khas' | 'Sapphire' | 'Sana Safinaz' | 'Johra' | 'Gul Ahmed' | 'Libas'
export type Fabric = 'Cotton' | 'Lawn' | 'Chiffon' | 'Georgette' | 'Silk' | 'Linen' | 'Muslin'
export type ProductBadge = 'new' | 'sale' | 'featured' | null

export interface ProductColor {
  name: string
  hex: string
}

export interface Product {
  /** Real MongoDB _id — present for backend-sourced products, absent for local mock data. */
  _id?: string
  id: number
  name: string
  // Widened from the `Brand` union to `string` so real backend brand values
  // (which aren't limited to the 8 curated demo brands) are type-safe.
  brand: Brand | string
  category: ProductCategory
  fabric: Fabric
  sizes: ClothingSize[]
  colors: ProductColor[]
  price: number
  originalPrice?: number
  images: string[]
  badge: ProductBadge
  rating: number
  reviewCount: number
  inStock: boolean
  description: string
  sku: string
}

export const PRODUCTS: Product[] = [
  // ── Kurtas (6) ──
  {
    id: 1,
    name: "Aarong Cotton Block Print Kurta",
    brand: "Aarong",
    category: "kurta",
    fabric: "Cotton",
    sizes: ["S", "M", "L", "XL"],
    colors: [{ name: "Indigo Blue", hex: "#2D4263" }, { name: "Rust Orange", hex: "#C1502E" }],
    price: 1850,
    images: ["/images/products/p01-1.jpg", "/images/products/p01-2.jpg"],
    badge: "featured",
    rating: 4.6,
    reviewCount: 312,
    inStock: true,
    description: "Hand block-printed cotton kurta with traditional motifs, finished with a relaxed straight-cut silhouette perfect for everyday wear.",
    sku: "FH-KUR-AAR-001",
  },
  {
    id: 2,
    name: "Aarong Hand-Embroidered Nakshi Kurta",
    brand: "Aarong",
    category: "kurta",
    fabric: "Cotton",
    sizes: ["M", "L", "XL", "XXL"],
    colors: [{ name: "Off White", hex: "#F0EAD6" }, { name: "Maroon", hex: "#6E1423" }],
    price: 2950,
    originalPrice: 3500,
    images: ["/images/products/p02-1.jpg", "/images/products/p02-2.jpg"],
    badge: "sale",
    rating: 4.7,
    reviewCount: 198,
    inStock: true,
    description: "Nakshi-embroidered cotton kurta featuring intricate hand-stitched panels along the yoke and hemline.",
    sku: "FH-KUR-AAR-002",
  },
  {
    id: 3,
    name: "Yellow Printed A-Line Kurta",
    brand: "Yellow",
    category: "kurta",
    fabric: "Cotton",
    sizes: ["XS", "S", "M", "L"],
    colors: [{ name: "Mustard", hex: "#D9A02C" }, { name: "Teal", hex: "#1F6F6F" }],
    price: 1450,
    images: ["/images/products/p03-1.jpg", "/images/products/p03-2.jpg"],
    badge: null,
    rating: 4.3,
    reviewCount: 145,
    inStock: true,
    description: "Lightweight A-line kurta in an all-over geometric print, designed for breathable all-day comfort.",
    sku: "FH-KUR-YEL-001",
  },
  {
    id: 4,
    name: "Yellow Embellished Festive Kurta",
    brand: "Yellow",
    category: "kurta",
    fabric: "Georgette",
    sizes: ["S", "M", "L", "XL"],
    colors: [{ name: "Wine", hex: "#5C0925" }, { name: "Emerald", hex: "#0B6E4F" }],
    price: 3200,
    images: ["/images/products/p04-1.jpg", "/images/products/p04-2.jpg"],
    badge: "new",
    rating: 4.5,
    reviewCount: 76,
    inStock: true,
    description: "Georgette kurta with sequin and zari embellishment along the neckline, made for festive occasions.",
    sku: "FH-KUR-YEL-002",
  },
  {
    id: 5,
    name: "Khas Handloom Cotton Kurta",
    brand: "Khas",
    category: "kurta",
    fabric: "Cotton",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [{ name: "Natural Beige", hex: "#E8DCC8" }, { name: "Charcoal Grey", hex: "#3A3A3A" }],
    price: 1690,
    images: ["/images/products/p05-1.jpg", "/images/products/p05-2.jpg"],
    badge: null,
    rating: 4.4,
    reviewCount: 210,
    inStock: true,
    description: "Handloom cotton kurta woven by local artisans, prized for its soft texture and natural dye tones.",
    sku: "FH-KUR-KHA-001",
  },
  {
    id: 6,
    name: "Khas Tie-Dye Summer Kurta",
    brand: "Khas",
    category: "kurta",
    fabric: "Linen",
    sizes: ["XS", "S", "M", "L"],
    colors: [{ name: "Sky Blue", hex: "#A9CCE3" }, { name: "Coral", hex: "#E07A5F" }],
    price: 1990,
    images: ["/images/products/p06-1.jpg", "/images/products/p06-2.jpg"],
    badge: "new",
    rating: 4.2,
    reviewCount: 64,
    inStock: true,
    description: "Breathable linen kurta with a hand tie-dye finish, ideal for hot-weather styling.",
    sku: "FH-KUR-KHA-002",
  },
  // ── Lawn Suits (5) ──
  {
    id: 7,
    name: "Sapphire Summer Lawn 3-Piece",
    brand: "Sapphire",
    category: "lawn-suit",
    fabric: "Lawn",
    sizes: ["S", "M", "L", "XL"],
    colors: [{ name: "Powder Pink", hex: "#F2C9CD" }, { name: "Sea Green", hex: "#6FA287" }],
    price: 4500,
    originalPrice: 5200,
    images: ["/images/products/p07-1.jpg", "/images/products/p07-2.jpg"],
    badge: "sale",
    rating: 4.6,
    reviewCount: 88,
    inStock: true,
    description: "Three-piece lawn suit with printed shirt, dupatta, and trouser — Sapphire's signature summer edit.",
    sku: "FH-LWN-SAP-001",
  },
  {
    id: 8,
    name: "Sapphire Embroidered Lawn Unstitched",
    brand: "Sapphire",
    category: "lawn-suit",
    fabric: "Lawn",
    sizes: ["S", "M", "L"],
    colors: [{ name: "Ivory", hex: "#F4ECD8" }, { name: "Plum", hex: "#5B2A5E" }],
    price: 3800,
    images: ["/images/products/p08-1.jpg", "/images/products/p08-2.jpg"],
    badge: null,
    rating: 4.3,
    reviewCount: 52,
    inStock: true,
    description: "Unstitched embroidered lawn fabric set, ready to tailor to your preferred fit.",
    sku: "FH-LWN-SAP-002",
  },
  {
    id: 9,
    name: "Sana Safinaz Embroidered Chiffon Suit",
    brand: "Sana Safinaz",
    category: "lawn-suit",
    fabric: "Chiffon",
    sizes: ["S", "M", "L", "XL"],
    colors: [{ name: "Black", hex: "#1B1B1B" }, { name: "Gold Beige", hex: "#C9A668" }],
    price: 7200,
    images: ["/images/products/p09-1.jpg", "/images/products/p09-2.jpg"],
    badge: "featured",
    rating: 4.8,
    reviewCount: 134,
    inStock: true,
    description: "Heavily embroidered chiffon suit from Sana Safinaz's luxury formals line, fully stitched.",
    sku: "FH-LWN-SS-001",
  },
  {
    id: 10,
    name: "Sana Safinaz Luxury Lawn Festive Edit",
    brand: "Sana Safinaz",
    category: "lawn-suit",
    fabric: "Lawn",
    sizes: ["M", "L", "XL", "XXL"],
    colors: [{ name: "Rani Pink", hex: "#C2185B" }, { name: "Turquoise", hex: "#1AA7A1" }],
    price: 8500,
    originalPrice: 9500,
    images: ["/images/products/p10-1.jpg", "/images/products/p10-2.jpg"],
    badge: "sale",
    rating: 4.9,
    reviewCount: 61,
    inStock: true,
    description: "Premium festive lawn from Sana Safinaz's limited edit, with hand-finished embellished borders.",
    sku: "FH-LWN-SS-002",
  },
  {
    id: 11,
    name: "Gul Ahmed Printed Lawn 2-Piece",
    brand: "Gul Ahmed",
    category: "lawn-suit",
    fabric: "Lawn",
    sizes: ["S", "M", "L", "XL"],
    colors: [{ name: "Lavender", hex: "#C9B6E4" }, { name: "Olive", hex: "#6B8E4E" }],
    price: 3100,
    images: ["/images/products/p11-1.jpg", "/images/products/p11-2.jpg"],
    badge: null,
    rating: 4.1,
    reviewCount: 97,
    inStock: true,
    description: "Two-piece printed lawn suit with matching dupatta, designed for everyday elegance.",
    sku: "FH-LWN-GA-001",
  },
  // ── Sarees (4) ──
  {
    id: 12,
    name: "Aarong Handwoven Jamdani Saree",
    brand: "Aarong",
    category: "saree",
    fabric: "Muslin",
    sizes: ["M", "L"],
    colors: [{ name: "Red", hex: "#B3122E" }, { name: "Gold", hex: "#B8860B" }],
    price: 6800,
    images: ["/images/products/p12-1.jpg", "/images/products/p12-2.jpg"],
    badge: "featured",
    rating: 4.9,
    reviewCount: 220,
    inStock: true,
    description: "Authentic handwoven Jamdani saree in fine muslin, featuring traditional motifs woven directly into the fabric.",
    sku: "FH-SAR-AAR-001",
  },
  {
    id: 13,
    name: "Aarong Tangail Cotton Saree",
    brand: "Aarong",
    category: "saree",
    fabric: "Cotton",
    sizes: ["M", "L"],
    colors: [{ name: "Green", hex: "#3C6E47" }, { name: "White", hex: "#F7F4ED" }],
    price: 2450,
    images: ["/images/products/p13-1.jpg", "/images/products/p13-2.jpg"],
    badge: null,
    rating: 4.5,
    reviewCount: 165,
    inStock: true,
    description: "Classic Tangail handloom cotton saree with a contrast woven border, soft against the skin.",
    sku: "FH-SAR-AAR-002",
  },
  {
    id: 14,
    name: "Yellow Designer Georgette Saree",
    brand: "Yellow",
    category: "saree",
    fabric: "Georgette",
    sizes: ["M", "L"],
    colors: [{ name: "Navy Blue", hex: "#1F2A44" }, { name: "Blush Pink", hex: "#E8B4BC" }],
    price: 3650,
    images: ["/images/products/p14-1.jpg", "/images/products/p14-2.jpg"],
    badge: "new",
    rating: 4.4,
    reviewCount: 58,
    inStock: true,
    description: "Flowing georgette saree with a designer pleated pallu and lightly embellished border.",
    sku: "FH-SAR-YEL-001",
  },
  {
    id: 15,
    name: "Yellow Silk Blend Party Saree",
    brand: "Yellow",
    category: "saree",
    fabric: "Silk",
    sizes: ["M", "L"],
    colors: [{ name: "Maroon", hex: "#6E1423" }, { name: "Champagne", hex: "#D9C9A3" }],
    price: 5200,
    originalPrice: 6000,
    images: ["/images/products/p15-1.jpg", "/images/products/p15-2.jpg"],
    badge: "sale",
    rating: 4.6,
    reviewCount: 73,
    inStock: true,
    description: "Silk blend party saree with a lustrous finish and woven zari border, made for evening occasions.",
    sku: "FH-SAR-YEL-002",
  },
  // ── Dresses (4) ──
  {
    id: 16,
    name: "Yellow Floral Wrap Midi Dress",
    brand: "Yellow",
    category: "dress",
    fabric: "Cotton",
    sizes: ["XS", "S", "M", "L"],
    colors: [{ name: "Floral Print", hex: "#E6C2C2" }, { name: "Sage Green", hex: "#9CAF88" }],
    price: 2150,
    images: ["/images/products/p16-1.jpg", "/images/products/p16-2.jpg"],
    badge: null,
    rating: 4.3,
    reviewCount: 112,
    inStock: true,
    description: "Wrap-style midi dress in soft cotton with a floral print, cinched at the waist for a flattering fit.",
    sku: "FH-DRS-YEL-001",
  },
  {
    id: 17,
    name: "Yellow Satin Slip Dress",
    brand: "Yellow",
    category: "dress",
    fabric: "Silk",
    sizes: ["S", "M", "L", "XL"],
    colors: [{ name: "Champagne", hex: "#D9C9A3" }, { name: "Black", hex: "#1B1B1B" }],
    price: 2890,
    images: ["/images/products/p17-1.jpg", "/images/products/p17-2.jpg"],
    badge: "new",
    rating: 4.5,
    reviewCount: 49,
    inStock: true,
    description: "Bias-cut satin slip dress with a minimal silhouette, suitable for layering or wearing solo.",
    sku: "FH-DRS-YEL-002",
  },
  {
    id: 18,
    name: "Libas Embroidered Maxi Dress",
    brand: "Libas",
    category: "dress",
    fabric: "Georgette",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [{ name: "Mustard", hex: "#D9A02C" }, { name: "Wine", hex: "#5C0925" }],
    price: 3450,
    images: ["/images/products/p18-1.jpg", "/images/products/p18-2.jpg"],
    badge: "featured",
    rating: 4.6,
    reviewCount: 84,
    inStock: true,
    description: "Floor-length embroidered maxi dress with flared sleeves and a fitted bodice.",
    sku: "FH-DRS-LIB-001",
  },
  {
    id: 19,
    name: "Libas Chiffon Layered Dress",
    brand: "Libas",
    category: "dress",
    fabric: "Chiffon",
    sizes: ["XS", "S", "M", "L"],
    colors: [{ name: "Blush Pink", hex: "#E8B4BC" }, { name: "Sky Blue", hex: "#A9CCE3" }],
    price: 2750,
    originalPrice: 3300,
    images: ["/images/products/p19-1.jpg", "/images/products/p19-2.jpg"],
    badge: "sale",
    rating: 4.2,
    reviewCount: 67,
    inStock: true,
    description: "Layered chiffon dress with a flowing tiered skirt, lined for comfortable everyday wear.",
    sku: "FH-DRS-LIB-002",
  },
  // ── Pants (3) ──
  {
    id: 20,
    name: "Khas Wide-Leg Palazzo Pant",
    brand: "Khas",
    category: "pant",
    fabric: "Cotton",
    sizes: ["S", "M", "L", "XL"],
    colors: [{ name: "Black", hex: "#1B1B1B" }, { name: "Stone Beige", hex: "#C9BBA8" }],
    price: 1190,
    images: ["/images/products/p20-1.jpg", "/images/products/p20-2.jpg"],
    badge: null,
    rating: 4.3,
    reviewCount: 95,
    inStock: true,
    description: "Relaxed wide-leg palazzo pant in breathable cotton, with an elasticated waistband.",
    sku: "FH-PNT-KHA-001",
  },
  {
    id: 21,
    name: "Khas Linen Straight Pant",
    brand: "Khas",
    category: "pant",
    fabric: "Linen",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [{ name: "Olive", hex: "#6B8E4E" }, { name: "Ivory", hex: "#F4ECD8" }],
    price: 1390,
    images: ["/images/products/p21-1.jpg", "/images/products/p21-2.jpg"],
    badge: "new",
    rating: 4.1,
    reviewCount: 41,
    inStock: true,
    description: "Tailored straight-leg pant in pure linen, finished with side pockets and a slim waistband.",
    sku: "FH-PNT-KHA-002",
  },
  {
    id: 22,
    name: "Yellow Linen Wide-Leg Pant",
    brand: "Yellow",
    category: "pant",
    fabric: "Linen",
    sizes: ["XS", "S", "M", "L"],
    colors: [{ name: "Rust Orange", hex: "#C1502E" }, { name: "Charcoal Grey", hex: "#3A3A3A" }],
    price: 1550,
    images: ["/images/products/p22-1.jpg", "/images/products/p22-2.jpg"],
    badge: null,
    rating: 4.4,
    reviewCount: 58,
    inStock: true,
    description: "High-waisted wide-leg linen pant designed to pair with kurtas or fitted tops alike.",
    sku: "FH-PNT-YEL-001",
  },
  // ── Accessories (3) ──
  {
    id: 23,
    name: "Aarong Hand-Embroidered Silk Dupatta",
    brand: "Aarong",
    category: "accessory",
    fabric: "Silk",
    sizes: ["M"],
    colors: [{ name: "Maroon", hex: "#6E1423" }, { name: "Gold", hex: "#B8860B" }],
    price: 1450,
    images: ["/images/products/p23-1.jpg", "/images/products/p23-2.jpg"],
    badge: null,
    rating: 4.5,
    reviewCount: 38,
    inStock: true,
    description: "Hand-embroidered silk dupatta with a delicate scalloped edge, finished to pair with festive kurtas.",
    sku: "FH-ACC-AAR-001",
  },
  {
    id: 24,
    name: "Johra Chikankari Cotton Dupatta",
    brand: "Johra",
    category: "accessory",
    fabric: "Cotton",
    sizes: ["M"],
    colors: [{ name: "White", hex: "#F7F4ED" }, { name: "Powder Pink", hex: "#F2C9CD" }],
    price: 890,
    images: ["/images/products/p24-1.jpg", "/images/products/p24-2.jpg"],
    badge: null,
    rating: 4.2,
    reviewCount: 29,
    inStock: true,
    description: "Lightweight cotton dupatta with traditional chikankari hand embroidery throughout.",
    sku: "FH-ACC-JOH-001",
  },
  {
    id: 25,
    name: "Johra Embellished Stretch Belt",
    brand: "Johra",
    category: "accessory",
    fabric: "Cotton",
    sizes: ["S", "M", "L"],
    colors: [{ name: "Black", hex: "#1B1B1B" }, { name: "Tan", hex: "#C9A668" }],
    price: 990,
    images: ["/images/products/p25-1.jpg", "/images/products/p25-2.jpg"],
    badge: "new",
    rating: 4.0,
    reviewCount: 22,
    inStock: true,
    description: "Embellished stretch waist belt designed to cinch kurtas and dresses for a defined silhouette.",
    sku: "FH-ACC-JOH-002",
  },
]

export interface BrandInfo {
  id: string
  name: Brand
  logo: string
  productCount: number
  origin: 'BD' | 'PK'
}

const BRAND_ORIGINS: Record<Brand, 'BD' | 'PK'> = {
  Aarong: 'BD',
  Yellow: 'BD',
  Khas: 'BD',
  Sapphire: 'PK',
  'Sana Safinaz': 'PK',
  Johra: 'BD',
  'Gul Ahmed': 'PK',
  Libas: 'PK',
}

export const BRANDS: BrandInfo[] = (Object.keys(BRAND_ORIGINS) as Brand[]).map((name) => ({
  id: name.toLowerCase().replace(/\s+/g, '-'),
  name,
  logo: `/images/brands/${name.toLowerCase().replace(/\s+/g, '-')}.png`,
  productCount: PRODUCTS.filter((p) => p.brand === name).length,
  origin: BRAND_ORIGINS[name],
}))

export interface CategoryInfo {
  id: ProductCategory
  label: string
  slug: string
  image: string
  productCount: number
}

const CATEGORY_LABELS: Record<ProductCategory, string> = {
  kurta: 'Kurtas',
  'lawn-suit': 'Lawn Suits',
  saree: 'Sarees',
  dress: 'Dresses',
  pant: 'Pants',
  accessory: 'Accessories',
}

export const CATEGORIES: CategoryInfo[] = (Object.keys(CATEGORY_LABELS) as ProductCategory[]).map((id) => ({
  id,
  label: CATEGORY_LABELS[id],
  slug: id,
  image: `/images/categories/${id}.jpg`,
  productCount: PRODUCTS.filter((p) => p.category === id).length,
}))

export function getFeatured(): Product[] {
  return PRODUCTS.filter((p) => p.badge === 'featured')
}

export function getNewArrivals(): Product[] {
  return PRODUCTS.filter((p) => p.badge === 'new')
}

export function getOnSale(): Product[] {
  return PRODUCTS.filter((p) => p.badge === 'sale')
}

export function getByCategory(category: ProductCategory): Product[] {
  return PRODUCTS.filter((p) => p.category === category)
}

export function getById(id: number): Product | undefined {
  return PRODUCTS.find((p) => p.id === id)
}

export function getBestSellers(): Product[] {
  return [...PRODUCTS].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 8)
}
