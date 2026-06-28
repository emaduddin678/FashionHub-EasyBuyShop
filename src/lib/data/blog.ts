export type BlogCategory = "Style Tips" | "Seasonal Edits" | "Brand Stories" | "Care Guides"

export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  category: BlogCategory
  author: string
  date: string
  coverBg: string
  coverFg: string
  body: string[]
  relatedProductIds: number[]
  relatedSlugs: string[]
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "how-to-style-a-lawn-suit-for-eid",
    title: "How to Style a Lawn Suit for Eid",
    excerpt:
      "From colour pairings to dupatta draping — everything you need to look your best in a lawn suit this Eid.",
    category: "Seasonal Edits",
    author: "Nusrat Jahan",
    date: "15 June 2026",
    coverBg: "F5EFE6",
    coverFg: "2D2D2D",
    body: [
      "Eid is the season when every woman wants her outfit to do the talking, and a well-styled lawn suit does exactly that. The key is in the details — the right dupatta drape, a complementary shoe, and accessories that add without overwhelming.",
      "Start with your base: an unstitched or ready-to-wear lawn suit in a mid-range print. Florals and geometric motifs are both on-trend this season. If your shirt is busy, opt for a plain trouser in a tonal colour pulled from the print itself. Sapphire and Sana Safinaz both do this beautifully in their summer collections.",
      "Dupatta placement is the single biggest style upgrade you can make. For Eid, we recommend the 'one-shoulder drape' — fold the dupatta lengthwise into a narrow strip, toss it over your left shoulder, and let it cascade down the back. Pin lightly at the shoulder with a brooch if needed.",
      "Footwear: block-heeled khussa or embellished sandals in gold or silver work best. Avoid very high stilettos — you'll be standing and greeting guests for hours.",
      "Finally, keep jewellery restrained. If your suit is embellished, let it breathe. One statement earring, a thin bangles set, and a subtle clutch is all you need. The outfit should be the centrepiece, not compete with it.",
      "FashionHub tip: order 2–3 sizes before Eid arrives — our Pakistani lawn stocks sell out fast. Check our /size-guide to confirm your measurements before ordering.",
    ],
    relatedProductIds: [7, 9, 10],
    relatedSlugs: [
      "xs-to-xxl-finding-your-perfect-fit",
      "the-pakistani-lawn-guide",
    ],
  },
  {
    slug: "aarong-vs-yellow-which-brand-suits-you",
    title: "Aarong vs Yellow: Which Brand Suits You?",
    excerpt:
      "Two of Bangladesh's most-loved fashion labels, side by side. Here's how to decide which fits your wardrobe — and your lifestyle.",
    category: "Brand Stories",
    author: "Tahmina Begum",
    date: "8 June 2026",
    coverBg: "E8DDD5",
    coverFg: "2D2D2D",
    body: [
      "Aarong and Yellow are the two labels every Bangladeshi woman knows by name. Both are institution-level brands with decades of heritage behind them — but they serve distinctly different aesthetics, price points, and occasions. Understanding the difference can save you time (and money) when shopping.",
      "Aarong is rooted in craft. Founded by BRAC as a fair-trade initiative, Aarong champions handloom weaving, block printing, and embroidery by artisans across Bangladesh. If you want something with genuine cultural weight — a Jamdani saree, a nakshi-embroidered kurta, a hand-block cotton piece — Aarong is unmatched. Expect to pay ৳1,800–৳7,000 for most pieces.",
      "Yellow is younger, more commercial, and proudly trend-conscious. It leans into international silhouettes adapted for Bangladeshi tastes — think A-line midi dresses, georgette festive kurtas, and satin slip dresses. If you want contemporary styling at accessible prices (৳1,200–৳3,500 for most lines), Yellow delivers consistently.",
      "For everyday office or casual wear: Yellow wins. The fabrics are easy to care for and the silhouettes work well for modern urban life. For gifting or occasions that call for something meaningful — a Eid celebration, a wedding, a traditional gathering — Aarong's artisan pieces carry a story that Yellow can't replicate.",
      "The verdict? Own both. A few core Aarong pieces (one good saree, one embroidered kurta) anchor your wardrobe with permanence. Fill the gaps with Yellow's seasonal lines to stay current without spending a fortune.",
    ],
    relatedProductIds: [1, 3, 12],
    relatedSlugs: [
      "how-to-style-a-lawn-suit-for-eid",
      "5-kurta-outfits-for-office-wear",
    ],
  },
  {
    slug: "xs-to-xxl-finding-your-perfect-fit",
    title: "XS to XXL: Finding Your Perfect Fit at FashionHub",
    excerpt:
      "Sizing confusion is the number-one reason for returns. Here's how to measure right — and choose confidently every time.",
    category: "Style Tips",
    author: "FashionHub Team",
    date: "1 June 2026",
    coverBg: "EAD9CE",
    coverFg: "2D2D2D",
    body: [
      "Nothing is more frustrating than a kurta that's too tight across the shoulders or a lawn suit trouser that doesn't sit right at the waist. The good news: almost all sizing problems are solvable with one step — taking accurate measurements before you order.",
      "You need three numbers: your bust (measured around the fullest part of your chest), your waist (around the narrowest point of your torso, not your hip), and your hip (around the fullest point of your seat, typically 18–20 cm below your waist). Use a soft tape measure, stand straight, and don't hold your breath.",
      "For kurtas and tops, your bust measurement is the key number. If you're between sizes, go up — you can always belt a slightly larger kurta, but you can't un-tighten a too-small one. Our size chart for tops runs from Bust 76–80 cm (XS/UK6) up to Bust 103–110 cm (XXL/UK16).",
      "Pakistani brands deserve special attention. Sapphire and Sana Safinaz follow Pakistani size conventions, which typically run about one to two centimetres larger in the bust than our Bangladeshi standard. If our size guide says M (86–90 cm bust), a Pakistani M might feel slightly roomier. When in doubt, check the specific product's measurements on the listing.",
      "If you're ordering unstitched fabric for tailoring, the fabric yardage is more important than the size label. Most Pakistani lawn 3-piece sets include enough fabric for up to XXL proportions — confirm with the yardage note on the listing.",
      "Visit our full /size-guide page for interactive tabs covering Tops, Bottoms, Dresses, and Sarees — with illustrated measurement diagrams for each.",
    ],
    relatedProductIds: [5, 7, 18],
    relatedSlugs: [
      "aarong-vs-yellow-which-brand-suits-you",
      "the-pakistani-lawn-guide",
    ],
  },
  {
    slug: "caring-for-chiffon-and-embroidered-pieces",
    title: "Caring for Chiffon & Embroidered Pieces",
    excerpt:
      "Delicate fabrics need gentle handling. These care tips will keep your investment pieces looking pristine for years.",
    category: "Care Guides",
    author: "Tahmina Begum",
    date: "22 May 2026",
    coverBg: "F0E6DC",
    coverFg: "2D2D2D",
    body: [
      "Chiffon and embroidered suits are among the most beautiful — and most fragile — garments in any wardrobe. A ৳7,000 Sana Safinaz chiffon suit deserves better than a machine spin cycle. Here's how to treat your finest pieces properly.",
      "Always dry-clean heavily embroidered pieces. Zari, sequin, and threadwork embellishments are attached to fabric with stitching that hot water and agitation will loosen over time. Dry-cleaning every 2–3 wears keeps both the fabric and the embellishment pristine.",
      "For plain chiffon (no heavy embellishment), gentle hand washing in cold water with a mild detergent is acceptable. Fill a basin, add a small amount of Persil liquid or any pH-neutral detergent, submerge the garment, and swish gently for 2–3 minutes. Never wring. Roll in a clean towel to absorb excess water, then hang to air-dry in the shade.",
      "Storage matters as much as washing. Fold chiffon pieces along the grain (not against it) in acid-free tissue paper, and store flat rather than hanging — chiffon stretches under its own weight when hung long-term. Embroidered pieces should be stored face-down so the embroidery doesn't catch on other garments.",
      "For stubborn odours without washing, hang the garment outdoors in the evening breeze for an hour. Fabric refresher sprays work well too — hold the can at arm's length and mist lightly from 30 cm away.",
      "Finally, treat any stain immediately. Blot (never rub) with a clean damp cloth. If it's oil-based, sprinkle a little talcum powder on the stain, leave for 30 minutes to absorb the oil, then brush gently before dry-cleaning.",
    ],
    relatedProductIds: [9, 10, 19],
    relatedSlugs: [
      "xs-to-xxl-finding-your-perfect-fit",
      "how-to-style-a-lawn-suit-for-eid",
    ],
  },
  {
    slug: "5-kurta-outfits-for-office-wear",
    title: "5 Kurta Outfits for Office Wear in Bangladesh",
    excerpt:
      "Looking professional without sacrificing cultural identity — five tried-and-tested kurta combinations for the modern Bangladeshi office.",
    category: "Style Tips",
    author: "Nusrat Jahan",
    date: "10 May 2026",
    coverBg: "DDD5CC",
    coverFg: "2D2D2D",
    body: [
      "The kurta is Bangladesh's most versatile garment — and yet office styling often goes wrong in the same predictable ways: too casual, too dressy, or simply ill-fitted. These five combinations are tested, repeatable, and genuinely professional.",
      "Look 1 — The Linen Classic: A plain linen kurta in charcoal, ivory, or stone beige, paired with tapered cigarette pants in the same tonal family. Keep it pressed. Add a leather tote and block-heeled sandals. Khas makes excellent linen kurtas in the ৳1,600–৳2,000 range.",
      "Look 2 — The Print Earner: A subtle block-print cotton kurta (not a loud floral — think small geometric or stripe) with straight white pants. Aarong's block-print line is reliable here. Balance the print with solid accessories.",
      "Look 3 — The Embellished Friday: For client meetings or important presentations, a lightly embroidered georgette kurta in jewel tones (deep wine, forest green, midnight navy) with palazzo pants. Yellow's festive line works beautifully here without being overly formal.",
      "Look 4 — The Monochrome Stack: Same-colour family from head to toe — a dusty rose kurta over dusty rose straight pants. Tonal dressing reads as deliberately styled and works especially well in formal office environments.",
      "Look 5 — The Layers Play: A long A-line kurta over fitted cigarette pants with a lightweight dupatta wrapped loosely as a scarf. This is particularly comfortable in air-conditioned offices where temperature swings require layers you can adjust through the day.",
      "Pro tip: invest in fit. A well-fitted mid-range kurta will always look more professional than an expensive one that doesn't sit right. Our /size-guide has detailed measurements to help you order correctly.",
    ],
    relatedProductIds: [1, 5, 20],
    relatedSlugs: [
      "aarong-vs-yellow-which-brand-suits-you",
      "xs-to-xxl-finding-your-perfect-fit",
    ],
  },
  {
    slug: "the-pakistani-lawn-guide",
    title: "The Pakistani Lawn Guide: Sapphire, Sana Safinaz & More",
    excerpt:
      "Pakistani lawn has captured Bangladeshi wardrobes for good reason. Here's everything you need to know before your first — or next — purchase.",
    category: "Brand Stories",
    author: "Tahmina Begum",
    date: "28 April 2026",
    coverBg: "E5D8CF",
    coverFg: "2D2D2D",
    body: [
      "Pakistani lawn is a category of its own. Ultra-fine, breathable, and usually printed in elaborate multi-colour designs, lawn fabric has become one of the most sought-after materials in Bangladesh — particularly in the months leading up to Eid. But navigating the brand landscape takes a little knowledge.",
      "Lawn is technically a type of fine cotton fabric, originally woven in Lahore in the early 20th century. The term now broadly refers to any fine summer fabric — cotton, blended cotton, or cotton-silk — typically sold as a 3-piece unstitched set (shirt, trouser, and dupatta) or as a 2-piece (shirt and dupatta). Most women have it stitched locally.",
      "Sapphire is the most accessible of the major Pakistani lawn houses for Bangladeshi buyers. Their prints are contemporary — large florals, digital prints, and geometric patterns — and their quality-to-price ratio is excellent. Expect to pay ৳3,800–৳5,500 for unstitched sets.",
      "Sana Safinaz is more premium and more formal. Their embroidered chiffon lines (not just lawn) are among the most coveted pieces each season. The embellishment work — zardozi, mirror work, thread embroidery — is sophisticated and holds up beautifully. Budget ৳6,500–৳9,000 for their better-known lines.",
      "Gul Ahmed is the heritage player — founded in 1953, they produce some of the most recognisable signature lawn prints each season. Their 2-piece 'Ideas' sub-brand is excellent value for everyday wear at ৳2,800–৳3,500. Their premium 'Original Residency Club' line is a collector's category.",
      "When buying unstitched lawn, always check the yardage. Most 3-piece sets include enough fabric for up to L or XL proportions. If you're ordering XXL or have a generous hip measurement, confirm the yardage before purchasing — or look specifically for 'plus yardage' variants.",
    ],
    relatedProductIds: [7, 8, 9],
    relatedSlugs: [
      "how-to-style-a-lawn-suit-for-eid",
      "aarong-vs-yellow-which-brand-suits-you",
    ],
  },
]

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug)
}

export function getRelatedPosts(slug: string): BlogPost[] {
  const post = getPostBySlug(slug)
  if (!post) return []
  return post.relatedSlugs
    .map((s) => getPostBySlug(s))
    .filter((p): p is BlogPost => p !== undefined)
}
