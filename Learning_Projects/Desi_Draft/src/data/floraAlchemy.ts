import type { PortfolioProject } from './portfolio';

/**
 * Flora Alchemy — the real storefront at flora-alchemyy.vercel.app.
 *
 * Everything here is taken from the live site: the brand name, the tagline, the
 * product names and prices, the catalogue categories, and the screenshots in
 * `public/images/portfolio/flora-alchemy/`, which were captured from that
 * deployment by `audit/tools/flora.mjs`. The photographs are the brand's own
 * product and atelier photography, obtained from the same public site; credit
 * sits on every frame and in the facts list.
 *
 * No café, no interior, no concept render: this project is the digital
 * experience, so the frames are the shop, the products and the interface.
 */
export const floraAlchemy: PortfolioProject = {
  id: 'flora',
  slug: 'floral-alchemy',
  legacySlugs: ['floral-meets-graffiti'],
  title: 'flora alchemy',
  titleAside: 'sculpting a botanical digital experience',
  category: 'web',
  kind: 'feature',
  status: 'live',
  client: 'flora alchemy — botanical keepsakes',
  standfirst:
    'A handcrafted botanical keepsake brand, built into a working storefront: catalogue, product pages, a custom-gift studio and a gift finder.',
  intro:
    'Flora Alchemy sells sculpted chenille and velvet botanicals, deckled stationery and keepsake boxes made by independent makers in small batches. The site has to sell objects that are photographed by hand, in daylight, at arm’s length — so the storefront is built around the photograph, the craft note and one clear next step.',
  challenge:
    'A handcrafted catalogue does not survive a generic template. Every piece is one of a kind, each product page has to carry the craft story that justifies the price, and most of the traffic arrives on a 390px phone. The same shop still has to feel considered at 1440px, and the custom-gift flow has to feel like shopping rather than a form.',
  approach:
    'The catalogue came first: three pieces, one craft category, rupee pricing, and a product template that holds a two-image inspection view, a hand-written craft note, a delivery check, gift pairing and a “commission a custom version” route. The Custom Gift Studio and the Gift Finder reuse the same product components, so a commission and a ready-made piece belong to the same shop. Photography keeps its own aspect ratio — the 3:4 product portrait is never cropped into a banner.',
  role: ['Website design', 'Frontend development', 'Product presentation', 'Responsive experience', 'E-commerce interface'],
  services: ['Digital Experiences', 'Branding', 'Content Production'],
  deliverables: [
    'Storefront home with a live catalogue rail',
    'Product detail template: inspection gallery, craft note, delivery check, gifting',
    'Custom Gift Studio: occasion, base, blooms, palette, ribbon, seal, monogram',
    'Gift Finder by occasion and recipient',
    'Responsive layouts at 1440 × 900 and 390 × 844',
  ],
  phase: 'live — catalogue and custom studio shipping',
  coverFit: 'interface',
  cover: {
    src: '/images/portfolio/flora-alchemy/site-home-1440.webp',
    srcSet:
      '/images/portfolio/flora-alchemy/site-home-960.webp 960w, /images/portfolio/flora-alchemy/site-home-1440.webp 1440w',
    width: 1440,
    height: 900,
    ratio: '16 / 10',
    slot: 'live storefront — home, hero and catalogue rail',
    alt: 'The Flora Alchemy homepage at 1440px: the serif Flora Alchemy headline with the line “Sculpted Nature. Hand-Bound Memories.” beside a photograph of a sunflower bouquet',
    color: '#2E7D5B',
    caption: 'flora-alchemyy.vercel.app',
  },
  brand: {
    slot: {
      src: '/images/portfolio/flora-alchemy/brand-logo.webp',
      width: 1080,
      height: 1080,
      ratio: '1 / 1',
      slot: 'brand mark — pressed-botanical roundel',
      alt: 'The Flora Alchemy brand mark: a fine botanical roundel around the words Flora Alchemy',
      color: '#2E7D5B',
      caption: 'the mark, as it ships',
      credit: 'brand identity © Flora Alchemy',
    },
    tagline: 'Sculpted Nature. Hand-Bound Memories.',
    body: 'Handcrafted botanical keepsakes in small batches: one-of-a-kind floral art, deckled stationery and memory keepsakes, sculpted petal by petal and written to order in a botanical atelier. The visual language is pressed paper and dried colour — cream stock, muted sage, dusty rose and oiled brass — and the interface stays out of the way of the photograph.',
  },
  gallery: [
    {
      src: '/images/portfolio/flora-alchemy/atelier-table.webp',
      width: 512,
      height: 286,
      ratio: '16 / 9',
      slot: 'the atelier table — bouquets, wrapped gifts, ribbon, dried botanicals',
      alt: 'A wooden atelier table dressed with chenille bouquets, wrapped gifts, ribbon spools, stationery and dried botanicals beside a garden window',
      color: '#2E7D5B',
      caption: 'inside the atelier',
      credit: 'photography © Flora Alchemy',
    },
    {
      src: '/images/portfolio/flora-alchemy/product-blush-posy-960.webp',
      srcSet:
        '/images/portfolio/flora-alchemy/product-blush-posy-480.webp 480w, /images/portfolio/flora-alchemy/product-blush-posy-960.webp 960w',
      width: 1440,
      height: 1919,
      ratio: '3 / 4',
      slot: 'blush pink lily & rose bouquet — product portrait',
      alt: 'The Blush Pink Lily & Rose Bouquet: pink and white chenille blooms in layered blush wrapping, held against a window',
      color: '#E8B4F5',
      caption: 'blush pink lily & rose · ₹1,149',
      credit: 'product photography © Flora Alchemy',
    },
    {
      src: '/images/portfolio/flora-alchemy/product-sunshine-daisy-960.webp',
      srcSet:
        '/images/portfolio/flora-alchemy/product-sunshine-daisy-480.webp 480w, /images/portfolio/flora-alchemy/product-sunshine-daisy-960.webp 960w',
      width: 1440,
      height: 1920,
      ratio: '3 / 4',
      slot: 'sunshine daisy sunflower bouquet — product portrait',
      alt: 'The Sunshine Daisy Sunflower Bouquet: three large chenille sunflowers wrapped in printed paper, held up against the sky',
      color: '#E4FBA8',
      caption: 'sunshine daisy · ₹449',
      credit: 'product photography © Flora Alchemy',
    },
    {
      src: '/images/portfolio/flora-alchemy/product-lily-960.webp',
      srcSet:
        '/images/portfolio/flora-alchemy/product-lily-480.webp 480w, /images/portfolio/flora-alchemy/product-lily-960.webp 960w',
      width: 1440,
      height: 1920,
      ratio: '3 / 4',
      slot: 'blue & white lily bouquet — product portrait',
      alt: 'The Blue & White Lily Bouquet: cobalt and white chenille lilies in clear wrapping with a navy bow',
      color: '#8499F8',
      caption: 'blue & white lily · ₹329',
      credit: 'product photography © Flora Alchemy',
    },
    {
      src: '/images/portfolio/flora-alchemy/deckled-card-set.webp',
      width: 512,
      height: 279,
      ratio: '16 / 9',
      slot: 'deckled stationery — pressed botanicals, wax seals, handwritten card',
      alt: 'Deckled cotton-rag cards with pressed flowers and wax seals on a linen surface, beside a tablet showing a checkout',
      color: '#E8603C',
      caption: 'the paper · pressed the same morning',
      credit: 'photography © Flora Alchemy',
    },
    {
      src: '/images/portfolio/flora-alchemy/keepsake-box-open.webp',
      width: 512,
      height: 279,
      ratio: '16 / 9',
      slot: 'keepsake box, open — stationery and sculpted blooms',
      alt: 'An open kraft keepsake box with chenille blooms, a folded handwritten card and dried stems packed inside',
      color: '#E8B4F5',
      caption: 'the keepsake, packed',
      credit: 'photography © Flora Alchemy',
    },
    {
      src: '/images/portfolio/flora-alchemy/letter-and-wax-seal.webp',
      width: 512,
      height: 279,
      ratio: '16 / 9',
      slot: 'the note — lettered by hand, closed with a wax seal',
      alt: 'A handwritten letter on deckled paper, surrounded by pressed flowers and a green wax seal',
      color: '#2E7D5B',
      caption: 'written, then sealed',
      credit: 'photography © Flora Alchemy',
    },
  ],
  materials: [
    {
      src: '/images/portfolio/flora-alchemy/chenille-lavender.webp',
      width: 512,
      height: 279,
      ratio: '16 / 9',
      slot: 'chenille lavender on natural linen — macro',
      alt: 'A close view of a chenille lavender stem resting on natural linen',
      caption: 'the bloom — chenille, one petal at a time',
      credit: 'photography © Flora Alchemy',
    },
    {
      src: '/images/portfolio/flora-alchemy/dried-bundle.webp',
      width: 512,
      height: 279,
      ratio: '16 / 9',
      slot: 'dried botanicals tied with orange thread',
      alt: 'A bundle of dried botanicals tied with orange thread and tagged on a wooden board',
      caption: 'the wrap — dried botanicals, wax seal',
      credit: 'photography © Flora Alchemy',
    },
    {
      src: '/images/portfolio/flora-alchemy/single-stem-pot.webp',
      width: 512,
      height: 279,
      ratio: '16 / 9',
      slot: 'single sculpted stem in a terracotta pot',
      alt: 'A single chenille daisy in a small terracotta pot on a mossy surface',
      caption: 'the single stem',
      credit: 'photography © Flora Alchemy',
    },
    {
      src: '/images/portfolio/flora-alchemy/sunflower-charm.webp',
      width: 512,
      height: 279,
      ratio: '16 / 9',
      slot: 'sunflower charm and keepsake tag',
      alt: 'A small chenille sunflower in a terracotta pot hung from a brass clasp with a pressed Flora Alchemy tag',
      caption: 'the charm',
      credit: 'photography © Flora Alchemy',
    },
  ],
  packaging: [
    {
      src: '/images/portfolio/flora-alchemy/keepsake-box-ribbon.webp',
      width: 512,
      height: 279,
      ratio: '16 / 9',
      slot: 'keepsake box — velvet ribbon and wax seal',
      alt: 'A kraft keepsake box bound with dusty-rose velvet ribbon and closed with a wax seal on a linen table',
      caption: 'the box',
      credit: 'photography © Flora Alchemy',
    },
    {
      src: '/images/portfolio/flora-alchemy/pressed-botanical-card.webp',
      width: 512,
      height: 279,
      ratio: '16 / 9',
      slot: 'pressed botanical card — deckled edge, wax seal',
      alt: 'A deckled card with pressed flowers and a green wax seal beside dried stems',
      caption: 'the card',
      credit: 'photography © Flora Alchemy',
    },
    {
      src: '/images/portfolio/flora-alchemy/wrapped-posy-tag.webp',
      width: 512,
      height: 286,
      ratio: '16 / 9',
      slot: 'wrapped posy with a handwritten tag',
      alt: 'A wrapped posy tied with silk and finished with a handwritten paper tag',
      caption: 'the tag',
      credit: 'photography © Flora Alchemy',
    },
  ],
  interfaceShots: [
    {
      src: '/images/portfolio/flora-alchemy/site-shop-1440.webp',
      srcSet:
        '/images/portfolio/flora-alchemy/site-shop-960.webp 960w, /images/portfolio/flora-alchemy/site-shop-1440.webp 1440w',
      width: 1440,
      height: 900,
      ratio: '16 / 10',
      slot: 'shop — catalogue and filters',
      alt: 'The shop page at 1440px: the catalogue count, craft filters, sort control and three product cards',
      caption: 'shop — the whole catalogue on one screen',
      url: 'flora-alchemyy.vercel.app/shop',
    },
    {
      src: '/images/portfolio/flora-alchemy/site-product-1440.webp',
      srcSet:
        '/images/portfolio/flora-alchemy/site-product-960.webp 960w, /images/portfolio/flora-alchemy/site-product-1440.webp 1440w',
      width: 1440,
      height: 940,
      ratio: '16 / 10',
      slot: 'product detail — inspection gallery and buying panel',
      alt: 'A product page at 1440px: two-image inspection gallery beside the price, stock, gifting tags and delivery check',
      caption: 'product page — inspection, craft note, gifting',
      url: 'flora-alchemyy.vercel.app/product/…',
    },
    {
      src: '/images/portfolio/flora-alchemy/site-custom-gifts-1440.webp',
      srcSet:
        '/images/portfolio/flora-alchemy/site-custom-gifts-960.webp 960w, /images/portfolio/flora-alchemy/site-custom-gifts-1440.webp 1440w',
      width: 1440,
      height: 900,
      ratio: '16 / 10',
      slot: 'custom gift studio — occasion, base, blooms, palette, ribbon, seal',
      alt: 'The Custom Gift Studio at 1440px: a five-step composer on the left and a live gift preview with its price on the right',
      caption: 'custom gift studio — composed, priced live',
      url: 'flora-alchemyy.vercel.app/custom-gifts',
    },
    {
      src: '/images/portfolio/flora-alchemy/site-gift-finder-1440.webp',
      srcSet:
        '/images/portfolio/flora-alchemy/site-gift-finder-960.webp 960w, /images/portfolio/flora-alchemy/site-gift-finder-1440.webp 1440w',
      width: 1440,
      height: 900,
      ratio: '16 / 10',
      slot: 'gift finder — occasion and recipient',
      alt: 'The Gift Finder at 1440px: occasion and recipient choices above matching catalogue pieces',
      caption: 'gift finder — two questions, then pieces',
      url: 'flora-alchemyy.vercel.app/gift-finder',
    },
  ],
  phoneShot: {
    src: '/images/portfolio/flora-alchemy/site-home-mobile-390.webp',
    width: 390,
    height: 844,
    ratio: '390 / 844',
    slot: 'home at 390 × 844',
    alt: 'The Flora Alchemy homepage on a 390px phone: stacked headline, full-width product photograph and the shop buttons',
    caption: 'the same shop at 390px',
  },
  process: [
    {
      title: 'start from the photograph',
      body: 'The product portraits are 3:4, shot in daylight at home. The grid is built around that ratio, and the one wide atelier shot is the only full-bleed frame — nothing is cropped to fit a template.',
    },
    {
      title: 'one product template',
      body: 'Inspection gallery, craft and materials note, care, dimensions, packaging, delivery check, gift pairing and a custom-version request all live in the same page. A new piece is a data entry, not a new layout.',
    },
    {
      title: 'make commission feel like shopping',
      body: 'The Custom Gift Studio runs occasion → base → blooms → palette → ribbon → seal → monogram, with the price and the preview updating as you choose. It ends in the same bag as a ready-made piece.',
    },
    {
      title: 'keep the phone first',
      body: 'Most of this catalogue is browsed on a phone, so every screen is composed at 390px before it is checked at 1440: one column, thumb-sized controls and photographs that keep their ratio.',
    },
  ],
  facts: [
    { label: 'catalogue', value: '3 pieces · 1 craft category · INR pricing' },
    { label: 'screens', value: '1440 × 900 and 390 × 844, captured from the live site' },
    { label: 'build', value: 'storefront, product template, custom studio, gift finder' },
    { label: 'status', value: 'live at flora-alchemyy.vercel.app' },
    { label: 'imagery', value: 'product and atelier photography © Flora Alchemy' },
  ],
  live: { url: 'https://flora-alchemyy.vercel.app/', label: 'Visit Live Website' },
  seo: {
    title: 'Flora Alchemy — sculpting a botanical digital experience',
    description:
      'The Flora Alchemy storefront: a handcrafted botanical catalogue, product pages built around the photograph, a custom-gift studio and a gift finder. Live at flora-alchemyy.vercel.app.',
  },
  featured: true,
};
