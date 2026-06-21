export interface PartnerBanner {
  id: string
  advertiserName: string
  title: string
  description: string
  category: string
  imageSrc: string
  imageAlt: string
  href: string
  ctaLabel: string
  /** "home" banners also appear on the homepage; all banners appear on /stores. */
  placement: "home" | "stores"
  status: "active" | "pending"
}

// External advertiser/affiliate banners. These are sponsored partner links — they
// do NOT mean the advertiser's catalog is imported into SulitScan deals.
export const partnerBanners: PartnerBanner[] = [
  {
    id: "partner-shopee",
    advertiserName: "Shopee",
    title: "Marketplace finds for everyday shopping",
    description: "Explore Shopee finds across tech, home, beauty, fashion, and daily essentials.",
    category: "Marketplace",
    imageSrc: "/banners/partners/shopee.jpg",
    imageAlt: "Shopee banner showing shopping bags, packages, and everyday marketplace products",
    href: "https://invl.me/clnkccq",
    ctaLabel: "View Shopee Offers",
    placement: "home",
    status: "active",
  },
  {
    id: "partner-asus",
    advertiserName: "ASUS",
    title: "Laptops, gaming, and tech gear",
    description: "Check tech gear, laptops, monitors, and gaming accessories from ASUS.",
    category: "Tech Gadgets",
    imageSrc: "/banners/partners/asus.jpg",
    imageAlt: "ASUS banner showing laptop, monitor, keyboard, and gaming tech gear",
    href: "https://invl.app/clnkcch",
    ctaLabel: "View ASUS Offers",
    placement: "home",
    status: "active",
  },
  {
    id: "partner-shein",
    advertiserName: "Shein",
    title: "Trendy fashion and everyday style",
    description: "Browse fashion, accessories, and style finds from Shein.",
    category: "Fashion",
    imageSrc: "/banners/partners/shein.jpg",
    imageAlt: "Shein banner showing trendy clothing, bags, shoes, and everyday fashion items",
    href: "https://miniurl.app/clnkcce",
    ctaLabel: "View Shein Offers",
    placement: "home",
    status: "active",
  },
  {
    id: "partner-photobooks",
    advertiserName: "Photobooks",
    title: "Personalized photo gifts and printed memories",
    description: "Create photo books, calendars, mugs, and keepsakes for meaningful gifts.",
    category: "Gift Ideas",
    imageSrc: "/banners/partners/photobooks.jpg",
    imageAlt: "Photobooks banner showing personalized photo books and printed gift items",
    href: "https://invl.me/clnkcbz",
    ctaLabel: "View Photobook Offers",
    placement: "home",
    status: "active",
  },
  {
    id: "partner-sephora",
    advertiserName: "Sephora",
    title: "Beauty, skincare, and makeup picks",
    description: "Browse beauty, skincare, makeup, and fragrance picks from Sephora.",
    category: "Beauty",
    imageSrc: "/banners/partners/sephora.jpg",
    imageAlt: "Sephora banner showing skincare, makeup, and beauty products",
    href: "https://invl.me/clnkccv",
    ctaLabel: "View Sephora Offers",
    placement: "stores",
    status: "active",
  },
  {
    id: "partner-ugreen",
    advertiserName: "UGREEN",
    title: "Chargers, cables, and smart accessories",
    description: "Browse chargers, hubs, cables, and everyday tech accessories from UGREEN.",
    category: "Tech Gadgets",
    imageSrc: "/banners/partners/ugreen.jpg",
    imageAlt: "UGREEN banner showing chargers, cables, USB hubs, and power accessories",
    href: "https://invl.app/clnkccl",
    ctaLabel: "View UGREEN Offers",
    placement: "stores",
    status: "active",
  },
  {
    id: "partner-focus-point",
    advertiserName: "Focus Point",
    title: "Eyewear, frames, and vision essentials",
    description: "Browse eyewear and optical picks for everyday style and comfort.",
    category: "Fashion",
    imageSrc: "/banners/partners/focus-point.jpg",
    imageAlt: "Focus Point banner showing eyewear, frames, and optical store display",
    href: "https://invl.me/clnkccc",
    ctaLabel: "View Focus Point Offers",
    placement: "stores",
    status: "active",
  },
  {
    id: "partner-alibaba",
    advertiserName: "Alibaba",
    title: "Global marketplace and wholesale finds",
    description: "Explore marketplace and sourcing pages for bulk or business-focused product research.",
    category: "Marketplace",
    imageSrc: "/banners/partners/alibaba.jpg",
    imageAlt: "Alibaba banner showing global marketplace, shipping boxes, and international sourcing concept",
    href: "https://invl.me/clnkcca",
    ctaLabel: "View Alibaba Offers",
    placement: "stores",
    status: "active",
  },
]

export const homePartnerBanners = partnerBanners.filter((b) => b.placement === "home")
