/**
 * Default Seed Data for Anfal Enterprises
 * Exactly 6 Brands as verified from the facility monument plaque,
 * plus Team and Core Pillars configuration.
 */

const DEFAULT_COMPANY_DATA = {
  name: "ANFAL ENTERPRISES",
  subtitle: "WHOLESALE FMCG DISTRIBUTOR",
  tagline: "TRUST. RANGE. RELIABILITY.",
  heroText: "Your trusted partner for FMCG wholesale distribution in Bhatkal and coastal Karnataka. Direct distributor of premier consumer brands with rapid fulfillment.",
  aboutStatement: "Reliable FMCG Distribution. Built on Trust.",
  aboutDescription: "ANFAL ENTERPRISES is an established FMCG wholesaler and distributor based in Bhatkal, Karnataka. With decades of regional distribution excellence and strategic warehouse facilities right on N.H. 66, we supply a comprehensive range of verified consumer goods, personal care essentials, packaged foods, and household products to supermarkets, grocery retailers, and commercial institutions.",
  address: "N.H. 66, Nawayath Colony, Bhatkal, Karnataka – 581320, India",
  locationShort: "Bhatkal, Karnataka",
  proprietor: "Mr. Imtiyaz Hussain",
  phone: "+91 98450 12345",
  whatsapp: "+91 98450 12345",
  email: "info@anfalenterprises.com",
  operatingHours: "Monday – Saturday: 9:00 AM – 8:00 PM (Sunday: Closed)",
  googleMapsUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3871.2568341932706!2d74.5403539!3d14.0027796!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bbc431ca824eaed%3A0x1cfc394b49cd1e5f!2sAnfal%20hyper%20market!5e0!3m2!1sen!2sin!4v1710000000000!5m2!1sen!2sin",
  directionsUrl: "https://maps.app.goo.gl/Vvbhyn822UTp8xpi7",
  heroImage: "assets/images/anfal-building.jpg",
  aboutImage: "assets/images/anfal-building.jpg"
};

const DEFAULT_PILLARS = [
  {
    id: "pillar-1",
    title: "WIDE RANGE",
    icon: "shopping-cart",
    description: "Extensive product assortment spanning food, beverages, personal hygiene, and daily household consumer goods from top-tier FMCG brands."
  },
  {
    id: "pillar-2",
    title: "COMPETITIVE PRICES",
    icon: "price-tag",
    description: "Transparent, volume-tiered wholesale pricing structured to maximize retail margins and sustainable business growth for store owners."
  },
  {
    id: "pillar-3",
    title: "TIMELY DELIVERY",
    icon: "truck",
    description: "Prompt, dependable logistics dispatch servicing Bhatkal and neighboring taluks with dedicated transport fleet readiness."
  },
  {
    id: "pillar-4",
    title: "CUSTOMER FOCUS",
    icon: "users",
    description: "Personalized partner support, seamless billing, and long-term relational commitment built on genuine trust and responsiveness."
  }
];

const DEFAULT_TEAM = [
  {
    id: "team-1",
    name: "Mr. Imtiyaz Hussain",
    role: "CEO & Founder",
    category: "Executive Leadership",
    bio: "Guiding the strategic vision, brand conglomerate partnerships, and foundational ethos of trust that defines Anfal Enterprises.",
    phone: "+91 98450 12345",
    email: "ceo@anfalenterprises.com",
    avatarIcon: "shield"
  },
  {
    id: "team-2",
    name: "Mohammed Tariq",
    role: "General Manager",
    category: "Operations & Logistics",
    bio: "Directing daily warehouse operations, inventory accuracy, high-capacity stock fulfillment, and regional dispatch schedules.",
    phone: "+91 98450 78611",
    email: "manager@anfalenterprises.com",
    avatarIcon: "settings"
  },
  {
    id: "team-3",
    name: "Syed Farhan",
    role: "Sales Manager",
    category: "B2B Sales & Distribution",
    bio: "Managing key supermarket partnerships, merchant onboarding, bulk contract pricing, and customer account fulfillment.",
    phone: "+91 98450 78622",
    email: "sales@anfalenterprises.com",
    avatarIcon: "trending-up"
  },
  {
    id: "team-4",
    name: "Ibrahim Khalil",
    role: "Sales & Marketing Lead",
    category: "Retail Growth & Promotions",
    bio: "Driving brand activations, new product launches, retail store promotions, and expanding distributor reach across coastal Karnataka.",
    phone: "+91 98450 78633",
    email: "marketing@anfalenterprises.com",
    avatarIcon: "zap"
  }
];

const DEFAULT_BRANDS = [
  {
    id: "brand-1",
    name: "Hindustan Unilever Limited",
    shortName: "HUL",
    category: "Consumer Goods & Personal Care",
    active: true,
    order: 1,
    color: "#005A9C",
    imageUrl: "",
    logoSvg: `<svg viewBox="0 0 120 50" fill="none" xmlns="http://www.w3.org/2000/svg" style="height: 36px; max-width: 100%;"><path d="M16 10c0-3.3 2.7-6 6-6s6 2.7 6 6v14c0 6.6-5.4 12-12 12S4 30.6 4 24V10c0-3.3 2.7-6 6-6s6 2.7 6 6v14c0 3.3 2.7 6 6 6s6-2.7 6-6V10z" stroke="#005A9C" stroke-width="2.5" fill="none"/><text x="44" y="24" font-family="'Outfit', sans-serif" font-size="11" font-weight="900" fill="#005A9C" letter-spacing="0.02em">Hindustan Unilever</text><text x="44" y="36" font-family="'Plus Jakarta Sans', sans-serif" font-size="8" font-weight="600" fill="#64748B">Limited</text></svg>`,
    description: "Home care, personal wash, skin care, and foods"
  },
  {
    id: "brand-2",
    name: "P&G",
    shortName: "P&G",
    category: "Household & Grooming",
    active: true,
    order: 2,
    color: "#003CAE",
    imageUrl: "",
    logoSvg: `<svg viewBox="0 0 120 50" fill="none" xmlns="http://www.w3.org/2000/svg" style="height: 38px; max-width: 100%;"><text x="10" y="36" font-family="'Outfit', sans-serif" font-size="28" font-style="italic" font-weight="900" fill="#003CAE" letter-spacing="-0.04em">P&amp;G</text><text x="75" y="32" font-family="'Plus Jakarta Sans', sans-serif" font-size="9" font-weight="700" fill="#64748B">Procter &amp; Gamble</text></svg>`,
    description: "Fabric care, baby care, hair care, and hygiene"
  },
  {
    id: "brand-3",
    name: "Nestlé",
    shortName: "Nestlé",
    category: "Food & Nutrition",
    active: true,
    order: 3,
    color: "#1E398B",
    imageUrl: "",
    logoSvg: `<svg viewBox="0 0 120 50" fill="none" xmlns="http://www.w3.org/2000/svg" style="height: 38px; max-width: 100%;"><text x="8" y="30" font-family="'Outfit', sans-serif" font-size="24" font-weight="900" fill="#1E398B" letter-spacing="-0.02em">Nestle</text><text x="8" y="42" font-family="'Plus Jakarta Sans', sans-serif" font-size="7" font-weight="700" fill="#64748B" letter-spacing="0.04em">Good Food, Good Life</text></svg>`,
    description: "Packaged foods, noodles, beverages, and dairy nutrition"
  },
  {
    id: "brand-4",
    name: "Dabur",
    shortName: "Dabur",
    category: "Health & Ayurvedic Care",
    active: true,
    order: 4,
    color: "#2E7D32",
    imageUrl: "",
    logoSvg: `<svg viewBox="0 0 120 50" fill="none" xmlns="http://www.w3.org/2000/svg" style="height: 38px; max-width: 100%;"><circle cx="20" cy="22" r="14" fill="#E8F5E9" stroke="#2E7D32" stroke-width="1.5"/><path d="M20 12v18M14 20l6-6 6 6M16 26l4-4 4 4" stroke="#2E7D32" stroke-width="2" stroke-linecap="round"/><text x="42" y="28" font-family="'Outfit', sans-serif" font-size="20" font-weight="900" fill="#2E7D32" letter-spacing="0.02em">Dabur</text></svg>`,
    description: "Ayurvedic medicines, health supplements, juices, and personal care"
  },
  {
    id: "brand-5",
    name: "ITC",
    shortName: "ITC",
    category: "Foods & Consumer Goods",
    active: true,
    order: 5,
    color: "#1F2937",
    imageUrl: "",
    logoSvg: `<svg viewBox="0 0 120 50" fill="none" xmlns="http://www.w3.org/2000/svg" style="height: 38px; max-width: 100%;"><polygon points="20,10 32,34 8,34" stroke="#1F2937" stroke-width="2.5" fill="none"/><polygon points="20,16 28,32 12,32" fill="#1F2937"/><text x="44" y="27" font-family="'Outfit', sans-serif" font-size="22" font-weight="900" fill="#1F2937" letter-spacing="0.08em">ITC</text><text x="44" y="38" font-family="'Plus Jakarta Sans', sans-serif" font-size="7" font-weight="700" fill="#64748B" letter-spacing="0.06em">Enduring Value</text></svg>`,
    description: "Staples, biscuits, snacks, confectionery, and personal care"
  },
  {
    id: "brand-6",
    name: "Britannia",
    shortName: "Britannia",
    category: "Bakery & Dairy",
    active: true,
    order: 6,
    color: "#C62828",
    imageUrl: "",
    logoSvg: `<svg viewBox="0 0 120 50" fill="none" xmlns="http://www.w3.org/2000/svg" style="height: 38px; max-width: 100%;"><rect x="4" y="10" width="112" height="30" rx="4" fill="#FFEBEE" stroke="#C62828" stroke-width="2"/><text x="14" y="30" font-family="'Outfit', sans-serif" font-size="16" font-weight="900" fill="#C62828" letter-spacing="0.06em">BRITANNIA</text></svg>`,
    description: "Biscuits, breads, dairy products, cakes, and rusks"
  }
];

const DEFAULT_ENQUIRIES = [
  {
    id: "enq-sample-1",
    name: "Rahil Merchant",
    company: "City Mart Supermarket, Kundapura",
    phone: "+91 98452 98765",
    message: "Looking for regular weekly bulk supply of branded oral care, detergents and confectionery products.",
    date: "2026-09-20 10:45 AM",
    status: "New"
  }
];

const STORAGE_KEYS = {
  COMPANY: "anfal_cms_company_v4",
  BRANDS: "anfal_cms_brands_v3",
  TEAM: "anfal_cms_team_v4",
  ENQUIRIES: "anfal_cms_enquiries_v3"
};

const CMS = {
  getCompanyData() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.COMPANY);
      if (!stored) {
        localStorage.setItem(STORAGE_KEYS.COMPANY, JSON.stringify(DEFAULT_COMPANY_DATA));
        return DEFAULT_COMPANY_DATA;
      }
      return { ...DEFAULT_COMPANY_DATA, ...JSON.parse(stored) };
    } catch (e) {
      return DEFAULT_COMPANY_DATA;
    }
  },

  saveCompanyData(data) {
    try {
      localStorage.setItem(STORAGE_KEYS.COMPANY, JSON.stringify(data));
      window.dispatchEvent(new CustomEvent("cms:company-updated", { detail: data }));
      return true;
    } catch (e) {
      return false;
    }
  },

  getPillars() {
    return DEFAULT_PILLARS;
  },

  getTeam() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.TEAM);
      if (!stored) {
        localStorage.setItem(STORAGE_KEYS.TEAM, JSON.stringify(DEFAULT_TEAM));
        return DEFAULT_TEAM;
      }
      return JSON.parse(stored);
    } catch (e) {
      return DEFAULT_TEAM;
    }
  },

  saveTeam(team) {
    try {
      localStorage.setItem(STORAGE_KEYS.TEAM, JSON.stringify(team));
      window.dispatchEvent(new CustomEvent("cms:team-updated", { detail: team }));
      return true;
    } catch (e) {
      return false;
    }
  },

  getBrands() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.BRANDS);
      if (!stored) {
        localStorage.setItem(STORAGE_KEYS.BRANDS, JSON.stringify(DEFAULT_BRANDS));
        return DEFAULT_BRANDS;
      }
      const brands = JSON.parse(stored);
      return brands.sort((a, b) => (a.order || 99) - (b.order || 99));
    } catch (e) {
      return DEFAULT_BRANDS;
    }
  },

  saveBrands(brands) {
    try {
      localStorage.setItem(STORAGE_KEYS.BRANDS, JSON.stringify(brands));
      window.dispatchEvent(new CustomEvent("cms:brands-updated", { detail: brands }));
      return true;
    } catch (e) {
      return false;
    }
  },

  addBrand(brand) {
    try {
      const brands = this.getBrands();
      const newBrand = {
        id: "brand-" + Date.now(),
        name: brand.name.trim(),
        shortName: brand.shortName ? brand.shortName.trim() : brand.name.trim(),
        category: brand.category ? brand.category.trim() : "FMCG Consumer Goods",
        description: brand.description ? brand.description.trim() : "",
        color: brand.color || "#0F1B2E",
        imageUrl: brand.imageUrl || "",
        logoSvg: brand.logoSvg || "",
        active: true,
        order: brands.length + 1
      };
      brands.push(newBrand);
      return this.saveBrands(brands);
    } catch (e) {
      return false;
    }
  },

  deleteBrand(id) {
    try {
      let brands = this.getBrands();
      brands = brands.filter(b => b.id !== id);
      return this.saveBrands(brands);
    } catch (e) {
      return false;
    }
  },

  getEnquiries() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ENQUIRIES);
      if (!stored) {
        localStorage.setItem(STORAGE_KEYS.ENQUIRIES, JSON.stringify(DEFAULT_ENQUIRIES));
        return DEFAULT_ENQUIRIES;
      }
      return JSON.parse(stored);
    } catch (e) {
      return DEFAULT_ENQUIRIES;
    }
  },

  addEnquiry(enquiry) {
    try {
      const enquiries = this.getEnquiries();
      const newEntry = {
        id: "enq-" + Date.now(),
        name: enquiry.name.trim(),
        company: enquiry.company ? enquiry.company.trim() : "Retail Store",
        phone: enquiry.phone.trim(),
        message: enquiry.message.trim(),
        date: new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }),
        status: "New"
      };
      enquiries.unshift(newEntry);
      localStorage.setItem(STORAGE_KEYS.ENQUIRIES, JSON.stringify(enquiries));
      window.dispatchEvent(new CustomEvent("cms:enquiries-updated", { detail: enquiries }));
      return newEntry;
    } catch (e) {
      return null;
    }
  },

  deleteEnquiry(id) {
    try {
      let enquiries = this.getEnquiries();
      enquiries = enquiries.filter(item => item.id !== id);
      localStorage.setItem(STORAGE_KEYS.ENQUIRIES, JSON.stringify(enquiries));
      window.dispatchEvent(new CustomEvent("cms:enquiries-updated", { detail: enquiries }));
      return true;
    } catch (e) {
      return false;
    }
  },

  resetDefaults() {
    localStorage.setItem(STORAGE_KEYS.COMPANY, JSON.stringify(DEFAULT_COMPANY_DATA));
    localStorage.setItem(STORAGE_KEYS.TEAM, JSON.stringify(DEFAULT_TEAM));
    localStorage.setItem(STORAGE_KEYS.BRANDS, JSON.stringify(DEFAULT_BRANDS));
    localStorage.setItem(STORAGE_KEYS.ENQUIRIES, JSON.stringify(DEFAULT_ENQUIRIES));
    window.dispatchEvent(new CustomEvent("cms:company-updated", { detail: DEFAULT_COMPANY_DATA }));
    window.dispatchEvent(new CustomEvent("cms:team-updated", { detail: DEFAULT_TEAM }));
    window.dispatchEvent(new CustomEvent("cms:brands-updated", { detail: DEFAULT_BRANDS }));
    window.dispatchEvent(new CustomEvent("cms:enquiries-updated", { detail: DEFAULT_ENQUIRIES }));
  }
};
