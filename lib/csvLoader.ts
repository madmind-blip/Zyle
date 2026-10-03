import Papa from 'papaparse';
import { Product } from './types';

// Curated 60-item dataset reflecting authentic lifestyle essentials, watches, kurta sets, smart audio, outerwear, combos & women's fashion
export const FALLBACK_CSV_RAW = `ID,NAME ,CATEGORY ,PRICE,ORIGINAL PRICE ,SIZES ,STOCK ,IMAGE,DESCRIPTION ,TAGS
ZY-001,Men's Chronograph Dial Steel Strap Watch,Watches ,1210,1950,Free size,24,https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80,Meticulously crafted chronograph featuring a brushed surgical-grade stainless steel case, multi-function subdials with 1/10th second precision, scratch-resistant sapphire crystal coating, and butterfly deployment clasp.,Best seller under 1500, Atelier Selection, Limited Run
ZY-002,Minimalist Bauhaus Automatic Timepiece,Watches,1499,2400,Free size,18,https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80,Understated German-inspired architectural dial with ultra-thin indices, genuine Italian calfskin leather strap, and Japanese Miyota automatic movement visible through an exhibition caseback.,Atelier Selection, Trending
ZY-003,Obsidian Stealth Tactical Chronometer,Watches ,1350,2100,Free size,12,https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80,Monochrome DLC diamond-like carbon coated stainless steel, luminescent high-contrast hands, 50m water resistance, and textured fluororubber strap engineered for all-weather performance.,Staff Pick, Water Resistant
ZY-004,Heritage Silver Mesh Minimalist Watch,Watches,1190,1850,Free size,20,https://images.unsplash.com/photo-1533139502658-0198f920d8e8?auto=format&fit=crop&w=800&q=80,Ultra-slim 7mm profile watch featuring a polished silver dial with rose gold accents and an interchangeable Milanese mesh magnetic strap.,Daily Essential, Minimalist
ZY-005,Ceramic Eclipse Midnight Dial Watch,Watches,1690,2700,Free size,15,https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80,High-tech scratch-proof zirconium ceramic bezel with a deep midnight sunburst dial and anti-reflective coated domed mineral crystal.,Collector Edit, Premium Watch
ZY-006,Royal Embroidered Silk Blend Kurta Set,Ethnic & Kurtas ,1890,2990,M, L, XL, XXL,25,https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80,Handcrafted art-silk kurta paired with tapered ivory churidar pants. Features fine tonal threadwork embroidery along the mandarin collar and concealed placket.,Festive Core, Top Seller
ZY-007,Pure Linen Mandarin Collar Kurta & Pajama,Ethnic & Kurtas,1690,2600,S, M, L, XL, XXL,30,https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80,Breathable 100% pre-shrunk French flax linen straight-cut kurta with functional side seam pockets and matching relaxed drawstring bottoms.,Summer Classic, Breathable Linen
ZY-008,Jacquard Self-Design Festive Kurta Pajama,Ethnic & Kurtas ,1990,3200,M, L, XL, XXL,18,https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80,Intricate self-weave banarasi jacquard pattern in regal jewel tones. Tailored with a structured chest profile and comfortable breathable cotton lining.,Occasion Wear, Festive Edit
ZY-009,Chikankari Hand-Embroidered Cotton Kurta,Ethnic & Kurtas,1490,2300,S, M, L, XL, XXL,22,https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80,Traditional shadow-work chikankari craftsmanship on fine mulmul cotton. Soft, lightweight drape engineered for comfortable celebration evenings.,Artisan Direct, Handcrafted
ZY-010,Nehru Jacket & Tonal Kurta Trio Set,Ethnic & Kurtas ,2490,3990,M, L, XL, XXL,14,https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80,A complete 3-piece ceremonial ensemble featuring a structured textured bundi vest, matching solid kurta, and tailored tapered trousers.,Wedding Guest, Complete Ensemble
ZY-011,Acoustic Master ANC Wireless Over-Ear Headphones,Audio & Electronics ,2899,4999,Free size,15,https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80,Hybrid active noise cancellation with 40mm custom beryllium drivers, spatial audio tuning, 45-hour continuous battery life, and ultra-plush lambskin memory foam earcups.,Premium Audio, High Fidelity
ZY-012,Atelier Acoustic True Wireless Earbuds,Audio & Electronics,1690,2990,Free size,30,https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80,Featherweight ergonomic in-ear monitors with transparency pass-through mode, ENC quad-microphones for crystal-clear calls, and IPX5 water resistance.,Under 2000, Best Audio
ZY-013,Solid Aluminum Desktop Hi-Fi Bluetooth Speaker,Audio & Electronics ,2190,3490,Free size,8,https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80,CNC-milled unibody aluminum acoustic enclosure delivering dual-passive radiators, 360-degree room-filling soundstage, and 18-hour playback.,Audiophile, Desk Setup
ZY-014,Aero Acoustic Titanium Bone Conduction Headset,Audio & Electronics,1990,3190,Free size,16,https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?auto=format&fit=crop&w=800&q=80,Open-ear bone conduction transducers on an aerospace titanium neckband. Ideal for runners and cyclists requiring environmental awareness.,Sport Audio, Open Ear
ZY-015,Executive Horology & Full-Grain Leather Goods Box,Combos ,2250,3800,Free size,10,https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80,A curated gift curation uniting our signature stainless steel dress watch with a hand-stitched Italian full-grain bifold wallet and brass pen in an embossed keepsake box.,Best Gift Combo, Great Value
ZY-016,Minimalist Linen Overshirt & Tailored Chino Set,Combos,2499,3999,S, M, L, XL, XXL,14,https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80,Pre-washed French flax linen relaxed overshirt paired with stretch cotton twill tailored trousers. Breathable, effortless drape designed for tropical climates.,Wardrobe Staple, Complete Look
ZY-017,Kurta & Silk Blend Stole Festive Combo,Combos ,2190,3490,M, L, XL, XXL,12,https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80,Signature straight-cut textured festive kurta accompanied by an authentic banarasi zari-bordered pure silk stole.,Festive Gift, Complete Set
ZY-018,Chronograph Watch & Polarized Sunglasses Curation,Combos,2290,3690,Free size,15,https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80,Our top-rated steel chronograph wrist watch paired with titanium aviator polarized sunglasses in a double leather travel case.,Duo Box, Travel Essential
ZY-019,Structured Charcoal Wool Field Jacket,Jackets ,2690,4200,S, M, L, XL, XXL,9,https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80,Heavyweight recycled Melton wool blend tailored with storm flap, concealed YKK matte black zipper, dual chest cargo pockets, and quilted thermal satin lining.,Winter Essential, Outerwear Edit
ZY-020,Matte Obsidian Technical Windbreaker Atelier Edition,Jackets,1890,2990,S, M, L, XL, XXL,22,https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=800&q=80,Ultra-lightweight ripstop nylon with DWR fluorocarbon-free hydrophobic finish. Features taped weatherproof seams, adjustable scuba hood, and packable interior pouch.,Water Repellent, All-Weather
ZY-021,Italian Suede Minimalist Trucker Jacket,Jackets ,3250,5400,S, M, L, XL,11,https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80,Supple brushed faux-suede construction with antique nickel button closures, double welt side pockets, and point collar.,Luxury Suede, Collector Item
ZY-022,Bomber Jacket in Technical Weatherproof Twill,Jackets,2190,3400,S, M, L, XL, XXL,19,https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80,Modernized MA-1 silhouette featuring ribbed storm cuffs, utility sleeve zip pocket, and water-resistant micro-twill outer shell.,Streetwear Core, Minimalist
ZY-023,Sculpted Cashmere Blend Ribbed Knit Dress,Women ,1990,3200,S, M, L, XL,16,https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80,Silky-soft cashmere and modal blend with figure-skimming vertical ribbing, mock neckline, and subtle side slit.,Women's Edit, Elegant
ZY-024,Structured Minimalist Crossbody Box Bag,Women,1490,2400,Free size,20,https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80,Architectural structured silhouette crafted from scratch-resistant vegan saffiano leather, featuring magnetic snap closure and brushed hardware.,Everyday Carry, Women
ZY-025,Pure Mulberry Silk Atelier Wrap Blouse,Women ,2150,3500,S, M, L, XL,14,https://images.unsplash.com/photo-1534126511673-b6899657816a?auto=format&fit=crop&w=800&q=80,Fluid drape tailoring in 19-momme sandwashed mulberry silk with a French cuff finish and interior stay button.,Silk Atelier, Luxury
ZY-026,Japanese Poplin Relaxed Fit Oxford Shirt,Shirts ,1290,1990,S, M, L, XL, XXL,28,https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80,Woven from 100% long-staple combed cotton poplin. Features Mother-of-Pearl finished buttons, soft button-down collar, and pre-shrunk wash.,Daily Classic, 100% Cotton
ZY-027,Heavyweight 280GSM French Terry Oversized Tee,Shirts,890,1490,S, M, L, XL, XXL,35,https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80,Drop-shoulder silhouette knit from dense 280 GSM combed ringspun cotton. Tight ribbed neckband that retains shape wash after wash.,Streetwear Core, Heavyweight
ZY-028,Camp Collar Resort Linen Short Sleeve Shirt,Shirts ,1390,2100,S, M, L, XL, XXL,24,https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80,Relaxed vacation collar shirt cut from washed Belgian linen with side hem vents and natural horn buttons.,Resort Wear, Breathable
ZY-029,Handcrafted Matte Titanium Aviator Sunglasses,Eyewear ,1390,2290,Free size,19,https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80,Ultra-lightweight Japanese aerospace titanium frames fitted with polarized UV400 anti-reflective lenses and hypoallergenic silicone pads.,Eyewear, Polarized UV400
ZY-030,Architectural Acetate Square Sunglasses,Eyewear,1290,2090,Free size,21,https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80,Milled Italian Mazzucchelli cellulose acetate with five-barrel German engineered hinges and scratch-resistant green gradient lenses.,Modern Classic, Acetate
ZY-031,Nautical Diver Automatic 200M Watch,Watches ,1850,2990,Free size,11,https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80,Unidirectional 120-click rotating ceramic diver bezel, SuperLumiNova BGW9 indices, screw-down crown, and solid oyster-style steel bracelet.,Diver Watch, Automatic
ZY-032,Vintage Tan Leather Chronograph Watch,Watches,1390,2190,Free size,17,https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80,Cream panda subdial arrangement housed in a 40mm polished steel case with hand-aged vegetable tanned Tuscan leather strap.,Vintage Style, Leather Strap
ZY-033,Raw Silk Embroidered Bandhgala Kurta Set,Ethnic & Kurtas ,2390,3800,M, L, XL, XXL,15,https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80,Premium textured matka raw silk kurta featuring handcrafted metallic thread embroidery on the collar, accompanied by fitted churidar trousers.,Wedding Classic, Silk Kurta
ZY-034,Pathani Cotton Comfort Kurta Pajama,Ethnic & Kurtas,1450,2290,M, L, XL, XXL,26,https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80,Classic broad-shoulder pathani silhouette with flap chest pockets, roll-up sleeve tabs, and comfortable loose-fit salwar bottoms.,Pathani Suit, Everyday Traditional
ZY-035,Studio Wireless Monitor Headphones,Audio & Electronics ,2490,3990,Free size,13,https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80,Flat-response frequency tuning for producers and music enthusiasts. High-resolution LDAC codec support with dual device pairing.,Studio Grade, Lossless
ZY-036,Retro Wooden Acoustic Home Speaker,Audio & Electronics,2390,3790,Free size,9,https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80,Handcrafted walnut wood acoustic chamber housing dual 2.5-inch full range drivers and a rear-ported passive radiator for deep natural bass.,Home Audio, Acoustic Wood
ZY-037,Festive Silk Kurta & Embroidered Nehru Jacket,Combos ,2890,4600,M, L, XL, XXL,10,https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80,Our most distinguished festive combination: a raw silk textured jacket over an ivory cotton-silk kurta and churidar.,Festive Best, Complete Look
ZY-038,Smart Casual Blazer & Supima Tee Ensemble,Combos,2690,4200,S, M, L, XL, XXL,12,https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80,Unstructured lightweight tropical wool-blend blazer paired with a heavy 220 GSM Supima crewneck tee in crisp monochrome tone.,Smart Casual, Duo
ZY-039,Atelier Waxed Canvas Utility Overshirt,Jackets ,2450,3850,S, M, L, XL, XXL,16,https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80,Weather-resistant 10oz paraffin waxed cotton canvas that patinas beautifully with age. Heavy brass snap fasteners and reinforced elbow patches.,Heritage Workwear, Durable
ZY-040,Minimalist Trench Coat with Detachable Belt,Jackets,3490,5600,S, M, L, XL,8,https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80,Double-breasted timeless silhouette in water-repellent gabardine cotton with horn buttons and storm shield back flap.,Timeless Trench, Outerwear
ZY-041,Tailored Wide Leg Wool-Blend Trousers,Women ,1690,2650,S, M, L, XL,18,https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80,High-waisted silhouette with deep front pleats, hidden slide clasp, and flowing fluid drape in lightweight stretch wool.,Women's Atelier, Tailored
ZY-042,Soft Leather Slouch Hobo Shoulder Bag,Women,1790,2890,Free size,14,https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80,Buttery smooth nappa faux-leather with generous main compartment, interior zip pocket, and magnetic closure for casual luxury carry.,Everyday Handbag, Women
ZY-043,Slub Linen Relaxed Band Collar Shirt,Shirts ,1350,2190,S, M, L, XL, XXL,25,https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80,Artisan washed slub linen offering authentic textural character. Features a soft stand collar and tailored barrel cuffs.,Linen Shirt, Breathable
ZY-044,Heavy Indigo Denim Overshirt,Shirts,1590,2490,S, M, L, XL, XXL,20,https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80,Rope-dyed 11oz ring-spun cotton denim washed for softness without losing deep indigo undertones. Copper rivets and twin flap pockets.,Raw Denim, Core
ZY-045,Round Wireframe Polarized Sunglasses,Eyewear ,1190,1950,Free size,22,https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80,Minimalist circular titanium frames with tortoise temple tips and glare-blocking polarized lenses.,Vintage Minimalist, Eyewear
ZY-046,Hexagonal Geometric Metal Sunglasses,Eyewear,1350,2150,Free size,17,https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80,Contemporary hexagonal geometric rim design with laser-etched bridge detailing and high-clarity CR-39 UV400 lenses.,Modern Geometric, Sunglasses
ZY-047,Chronograph Steel Watch & Leather Belt Gift Box,Combos ,2190,3490,Free size,11,https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80,Precision dial wrist watch accompanied by a reversible full-grain leather belt and solid brass buckle in an embossed presentation box.,Gifting Core, Executive
ZY-048,Dual Dial Chronometer Skeleton Automatic,Watches ,1990,3290,Free size,10,https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80,Skeletonized mechanical dial displaying intricate escapement gears, 21-jewel automatic movement, and scratch-resistant sapphire crystal.,Skeleton Watch, Automatic
ZY-049,Asymmetrical Hem Cotton Kurta with Dhoti,Ethnic & Kurtas ,1790,2890,M, L, XL, XXL,18,https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80,Modern angular draped hemline kurta paired with ready-to-wear pleated cotton dhoti trousers for effortless festive styling.,Indo-Western, Draped
ZY-050,Loom-Woven Tussar Silk Kurta Pajama,Ethnic & Kurtas,2190,3490,M, L, XL, XXL,14,https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80,Natural textured tussar silk kurta in earthy tones with subtle contrast thread embroidery along the neckline and cuffs.,Handloom Silk, Traditional
ZY-051,Waterproof Sport Smart Audio Earbuds,Audio & Electronics ,1490,2490,Free size,27,https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80,IPX7 fully submersible waterproof sport earbuds with secure ear-hook wings, punchy low-end bass tuning, and 32-hour playback.,Sport Earbuds, Sweatproof
ZY-052,Pocket Aluminum Bluetooth Hi-Fi Transducer,Audio & Electronics,1390,2190,Free size,16,https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80,Credit-card sized anodized aluminum pocket speaker delivering surprising 5W punchy audio and built-in conference microphone.,Travel Tech, Minimalist
ZY-053,Tailored Wool-Blend Overcoat with Lapel,Jackets ,3690,5990,S, M, L, XL, XXL,7,https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80,Single-breasted knee-length overcoat cut from dense Italian virgin wool blend with structured shoulder pads and inner pocketing.,Executive Coat, Luxury Winter
ZY-054,Reversible Quilted Atelier Vest,Jackets,1790,2790,S, M, L, XL, XXL,21,https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=800&q=80,Two-in-one reversible vest with diamond quilted micro-fleece on one side and weather-repellent nylon on the reverse.,Layering Piece, Core
ZY-055,Ribbed Knit Cashmere Blend Cardigan,Women ,1890,2990,S, M, L, XL,19,https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80,Chunky ribbed texture knit with genuine horn buttons, deep V-neckline, and relaxed drop-shoulder silhouette.,Women's Knitwear, Cozy
ZY-056,Tailored Pleated Midi Skirt in Sand,Women,1590,2450,S, M, L, XL,15,https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80,Crisp knife pleats engineered to retain sharp structure through daily wear, featuring an elasticized rear waistband for all-day ease.,Pleated Skirt, Atelier
ZY-057,Super 120s Combed Cotton Dress Shirt,Shirts ,1490,2350,S, M, L, XL, XXL,23,https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80,Woven from high-thread-count Super 120s yarn with non-iron treated finish and crisp spread collar for sharp formal presence.,Formal Shirt, Premium Cotton
ZY-058,Knit Cotton Textured Polo Shirt,Shirts,1190,1850,S, M, L, XL, XXL,29,https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80,Fine gauge breathable knit polo featuring ribbed open collar without buttons for a relaxed contemporary retro silhouette.,Knit Polo, Smart Casual
ZY-059,Navigator Flat-Top Sunglasses,Eyewear ,1250,1990,Free size,18,https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80,Bold architectural flat brow-line in matte graphite finish with polarized anti-glare lenses.,Bold Style, Eyewear
ZY-060,Retro Round Keyhole Bridge Acetate Sunglasses,Eyewear,1390,2250,Free size,20,https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80,Vintage-inspired keyhole bridge crafted from hand-polished honey tortoise acetate with green tinted polarized lenses.,Heritage Eyewear, Polarized`;

/**
 * Normalizes raw category string to standard Title Case taxonomy
 */
export function normalizeCategory(rawCat: string): string {
  if (!rawCat) return 'General';
  const clean = rawCat.trim().toLowerCase();

  if (clean.includes('kurta') || clean.includes('ethnic') || clean.includes('pajama') || clean.includes('dhoti')) return 'Ethnic & Kurtas';
  if (clean.includes('watch') || clean.includes('horology') || clean.includes('timepiece')) return 'Watches';
  if (clean.includes('audio') || clean.includes('elect') || clean.includes('headphone') || clean.includes('speaker') || clean.includes('earbud')) return 'Audio & Electronics';
  if (clean.includes('combo') || clean.includes('set') || clean.includes('box') || clean.includes('curation')) return 'Combos';
  if (clean.includes('jacket') || clean.includes('coat') || clean.includes('outerwear') || clean.includes('windbreaker') || clean.includes('vest')) return 'Jackets';
  if (clean.includes('women') || clean.includes('dress') || clean.includes('skirt') || clean.includes('blouse') || clean.includes('lady')) return 'Women';
  if (clean.includes('shirt') || clean.includes('tee') || clean.includes('t-shirt') || clean.includes('polo') || clean.includes('top')) return 'Shirts';
  if (clean.includes('eye') || clean.includes('glass') || clean.includes('shade') || clean.includes('sunglass')) return 'Eyewear';

  return clean
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Parses size strings: "M-L-XL" -> ["M", "L", "XL"]
 * "38-40-42-44" -> ["38", "40", "42", "44"]
 * "S, M, L, XL, XXL" -> ["S", "M", "L", "XL", "XXL"]
 * "Free size" / "Free Size" -> ["Free Size"]
 */
export function parseSizes(sizeStr: string | undefined): string[] {
  if (!sizeStr) return ['Free Size'];
  const trimmed = sizeStr.trim();
  if (trimmed.toLowerCase().includes('free size') || trimmed.toLowerCase() === 'free') {
    return ['Free Size'];
  }
  // Split by comma, hyphen, slash, or pipe
  const tokens = trimmed
    .split(/[,/|\-]+/)
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.toLowerCase().includes('size') && !s.toLowerCase().includes('available'));

  return tokens.length > 0 ? tokens : [trimmed];
}

/**
 * Sanitizes and parses a CSV string into a validated array of Product objects.
 */
export function parseProductsCSV(csvText: string): Product[] {
  try {
    const parsed = Papa.parse<Record<string, string>>(csvText.trim(), {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h) => h.trim().toUpperCase(),
    });

    if (!parsed.data || parsed.data.length === 0) {
      console.warn('Empty parsed CSV, using fallback dataset');
      return parseProductsCSV(FALLBACK_CSV_RAW);
    }

    const products: Product[] = [];

    parsed.data.forEach((row, index) => {
      const getVal = (prefix: string) => {
        const foundKey = Object.keys(row).find(k => k.trim().toUpperCase().includes(prefix.toUpperCase()));
        return foundKey ? (row[foundKey] || '').trim() : '';
      };

      const rawId = getVal('ID') || `ZY-${String(index + 1).padStart(3, '0')}`;
      const rawName = getVal('NAME') || `Curated Artifact ${index + 1}`;
      const rawCategory = getVal('CATEGORY') || 'Lifestyle';
      const rawPrice1 = parseFloat(getVal('ORIGINAL PRICE') || getVal('PRICE') || '0') || 0;
      const rawPrice2 = parseFloat(getVal('PRICE') || getVal('ORIGINAL PRICE') || '0') || 0;
      const rawSizes = getVal('SIZES') || getVal('SIZE');
      const rawStock = parseInt(getVal('STOCK') || '10', 10);
      const rawImage = getVal('IMAGE');
      const rawDesc = getVal('DESCRIPTION') || getVal('DESC') || 'Exclusively curated artisan piece with verified atelier fulfillment.';
      const rawTags = getVal('TAGS') || getVal('TAG') || '';

      if (!rawName || rawName === 'undefined') return;

      const p1 = Math.abs(rawPrice1);
      const p2 = Math.abs(rawPrice2);
      let mrp = Math.max(p1, p2);
      let selling = Math.min(p1, p2);

      if (selling === 0 && mrp > 0) {
        selling = mrp;
        mrp = Math.round(mrp * 1.35);
      } else if (mrp === 0 && selling === 0) {
        selling = 1290;
        mrp = 1990;
      }

      const discountPercent = mrp > selling ? Math.round(((mrp - selling) / mrp) * 100) : 0;
      const category = normalizeCategory(rawCategory);
      const sizes = parseSizes(rawSizes);
      const stock = isNaN(rawStock) ? 15 : rawStock;
      const tags = rawTags
        ? rawTags.split(/[,/|]+/).map(t => t.trim()).filter(Boolean)
        : [category];

      const specs = generateSpecsForCategory(category);

      products.push({
        id: rawId,
        name: rawName,
        category,
        sellingPrice: selling,
        originalPrice: mrp,
        discountPercent,
        sizes,
        stock,
        inStock: stock > 0,
        image: sanitizeImageUrl(rawImage, category, index),
        description: rawDesc,
        tags,
        specs,
      });
    });

    return products.length > 0 ? products : parseProductsCSV(FALLBACK_CSV_RAW);
  } catch (err) {
    console.error('Error parsing CSV, using fallback:', err);
    return parseProductsCSV(FALLBACK_CSV_RAW);
  }
}

/**
 * Returns a guaranteed valid image URL with category-themed high-res fallbacks.
 * Intercepts unresolvable placeholder URLs (e.g. dummy ImgBB paths) and replaces with verified photography.
 */
function sanitizeImageUrl(rawUrl: string | undefined, category: string, index: number): string {
  if (rawUrl && rawUrl.startsWith('http')) {
    // Intercept known dummy/mock paths that return 404 upstream
    const isMockPlaceholder =
      rawUrl.includes('i.ibb.co/6y4t6r2') ||
      rawUrl.includes('i.ibb.co/XWw55h1') ||
      rawUrl.includes('i.ibb.co/924BHzT') ||
      rawUrl.includes('i.ibb.co/2gL8dGZ') ||
      rawUrl.includes('i.ibb.co/6P0P6v7') ||
      rawUrl.includes('i.ibb.co/VMyh46z') ||
      rawUrl.includes('i.ibb.co/q1z6B6p') ||
      rawUrl.includes('i.ibb.co/6n9f8jQ') ||
      rawUrl.includes('i.ibb.co/8Y53v1M') ||
      rawUrl.includes('i.ibb.co/nCdf6b3') ||
      rawUrl.includes('i.ibb.co/k07pY1h') ||
      rawUrl.includes('i.ibb.co/82yGZtB') ||
      rawUrl.includes('i.ibb.co/Wc6K87q') ||
      rawUrl.includes('i.ibb.co/2v76W1M') ||
      rawUrl.includes('i.ibb.co/mHkm2Q9') ||
      rawUrl.includes('i.ibb.co/Jqf9mF5');

    if (!isMockPlaceholder) {
      return rawUrl;
    }
  }

  // Category fallback pool with complete, un-cropped product photography
  const fallbackMap: Record<string, string[]> = {
    'Watches': [
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1533139502658-0198f920d8e8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80',
    ],
    'Ethnic & Kurtas': [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80',
    ],
    'Audio & Electronics': [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?auto=format&fit=crop&w=800&q=80',
    ],
    'Combos': [
      'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80',
    ],
    'Jackets': [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80',
    ],
    'Women': [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1534126511673-b6899657816a?auto=format&fit=crop&w=800&q=80',
    ],
    'Shirts': [
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80',
    ],
    'Eyewear': [
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80',
    ],
  };

  const pool = fallbackMap[category] || fallbackMap['Watches'];
  return pool[index % pool.length];
}

function generateSpecsForCategory(category: string) {
  if (category === 'Watches') {
    return [
      { label: 'Movement', value: 'High-Accuracy Quartz Analog' },
      { label: 'Dial & Case', value: 'Alloy Case with Stainless Steel Back' },
      { label: 'Glass', value: 'Hardened Scratch-Resistant Mineral Glass' },
      { label: 'Strap', value: 'Adjustable Stainless Steel / Textured Strap' },
      { label: 'Verification', value: 'Calibrated & Battery-Tested Prior to Dispatch' },
    ];
  }
  if (category === 'Ethnic & Kurtas' || category === 'Women') {
    return [
      { label: 'Fabric', value: 'Breathable Cotton & Rayon Blend' },
      { label: 'Fit & Cut', value: 'Relaxed Tailored Drape (All-Day Comfort)' },
      { label: 'Workmanship', value: 'Reinforced Interlock Stitching & Clean Hems' },
      { label: 'Care Advice', value: 'Machine Wash Gentle / Cold Hand Wash' },
      { label: 'Verification', value: 'Pre-inspected for Fabric Feel & Color Fastness' },
    ];
  }
  if (category === 'Audio & Electronics') {
    return [
      { label: 'Driver Units', value: 'Dynamic Stereo Drivers (Balanced Acoustic Curve)' },
      { label: 'Connectivity', value: 'Bluetooth 5.0+ Wireless / Fast Auto-Pairing' },
      { label: 'Casing', value: 'Lightweight Impact-Resistant Matte Polycarbonate' },
      { label: 'Included', value: 'Charging Cable & Quick Setup Guide' },
      { label: 'Verification', value: 'Sound Balance & Battery Retention Tested' },
    ];
  }
  if (category === 'Jackets') {
    return [
      { label: 'Outer Shell', value: 'Durable Wind-Resistant Poly-Cotton Blend' },
      { label: 'Inner Lining', value: 'Soft Thermal Insulation / Micro-Fleece' },
      { label: 'Hardware', value: 'Smooth Heavy-Duty Zipper & Elasticated Rib Cuffs' },
      { label: 'Season', value: 'Ideal for Autumn / Winter Daily Commutes' },
      { label: 'Verification', value: 'Zip-Tested & Seam-Checked Before Dispatch' },
    ];
  }
  if (category === 'Combos' || category === 'Shirts') {
    return [
      { label: 'Material', value: '100% Combed Breathable Daily Cotton' },
      { label: 'Set Details', value: 'Color-Matched Value Bundle' },
      { label: 'Durability', value: 'Fade-Resistant Pigment Dyeing' },
      { label: 'Care Advice', value: 'Normal Machine Wash with Like Colors' },
      { label: 'Verification', value: 'Size-Checked & Neatly Folded' },
    ];
  }
  return [
    { label: 'Composition', value: 'Curated Everyday-Grade Material' },
    { label: 'Fit Type', value: 'Standard Regular Fit (Matches Stated Sizes)' },
    { label: 'Craft Standard', value: 'Clean Seams with Thorough Finishing' },
    { label: 'Assurance', value: '7-Day Sizing Exchange & Flat ₹149 COD' },
    { label: 'Verification', value: 'Individually Inspected by Concierge Desk' },
  ];
}

/**
 * Fetches products from Google Sheet CSV or uses fallback with automatic timestamp cache-busting.
 */
export async function fetchLiveProducts(customUrl?: string): Promise<{ products: Product[]; source: 'live' | 'fallback'; timestamp: number }> {
  const targetUrl = customUrl || process.env.NEXT_PUBLIC_PRODUCTS_CSV_URL;

  if (!targetUrl || !targetUrl.trim()) {
    return {
      products: parseProductsCSV(FALLBACK_CSV_RAW),
      source: 'fallback',
      timestamp: Date.now(),
    };
  }

  try {
    const urlObj = new URL(targetUrl);
    urlObj.searchParams.set('t', Date.now().toString());

    const response = await fetch(urlObj.toString(), {
      next: { revalidate: 60 },
      headers: {
        'Accept': 'text/csv, text/plain, */*',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch CSV: ${response.status} ${response.statusText}`);
    }

    const csvText = await response.text();
    const products = parseProductsCSV(csvText);

    return {
      products,
      source: 'live',
      timestamp: Date.now(),
    };
  } catch (error) {
    console.warn('Failed to fetch remote CSV, falling back to local dataset:', error);
    return {
      products: parseProductsCSV(FALLBACK_CSV_RAW),
      source: 'fallback',
      timestamp: Date.now(),
    };
  }
}
