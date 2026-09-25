/**
 * CMS STORAGE LAYER & DATABASE ENGINE FOR ANFAL ENTERPRISES
 * Provides structured models, localStorage persistence, real-time event broadcasting,
 * and complete CRUD operations for both the storefront and admin panel.
 */

// ==========================================
// 1. DEFAULT HOME HERO DATA
// ==========================================
const DEFAULT_HOME_DATA = {
  heroBadge: "Direct Wholesale Distribution",
  heroHeading: "DAILY FMCG ESSENTIALS",
  heroTagline: "Certified manufacturer-direct wholesale inventory for coastal Karnataka. 600+ verified daily staples with zero-delay delivery.",
  heroCtaText: "Get Wholesale Price List",
  heroCtaLink: "#contact",
  heroImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuDmiFvDadZeBQCYdVFbgufV7fvWSPenhWX-OOrTH8iAdB8LhKn6LxZo8_9xFRYxMBCalGDD-54m2iWXVIzUNxuG20GxdALxdZcWNsFbf23ooWtSR94yjDV2kNAY04Asov1ZWtR_PiDSEldDE-LYYus1Idnemben_awbiHWj0GX-qTa5Cq2WvWo8NysgjO1XGOhkc1oD88Re4VIWJzEqUWUCUT8_r1Pp6H5DNouhSnsSqZVbHIHxtrpD"
};

// ==========================================
// 2. DEFAULT FEATURED HOME PRODUCTS
// ==========================================
const DEFAULT_FEATURED_PRODUCTS = [
  {
    id: "prod-1",
    name: "Britannia Treats",
    brand: "Britannia",
    category: "Confectionery",
    badge: "Direct",
    order: 1,
    active: true,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB57C98vpg2YdZznkg_Byx0y2jXylAk8J_6QkF8PCeQRP3JBJ5HgxrY296UBom6etPXc2WTCXobGt2kyq8gXFyT4Au8nGj7xdFn-_l3KkcpXZ6GyJJftwGFI0xj7ZrKHJ8-WO23Wd6PcvpXvu5NOdrLP9HvUUvvUBKorxPJYhSXqjMXHU6i99EUEEAPrsyIFmi2Sf0qDiEjvmxLT92Z1oIMhv-CcDzkTcKoC1q3eh2wCLMJqBbfsraP",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuB57C98vpg2YdZznkg_Byx0y2jXylAk8J_6QkF8PCeQRP3JBJ5HgxrY296UBom6etPXc2WTCXobGt2kyq8gXFyT4Au8nGj7xdFn-_l3KkcpXZ6GyJJftwGFI0xj7ZrKHJ8-WO23Wd6PcvpXvu5NOdrLP9HvUUvvUBKorxPJYhSXqjMXHU6i99EUEEAPrsyIFmi2Sf0qDiEjvmxLT92Z1oIMhv-CcDzkTcKoC1q3eh2wCLMJqBbfsraP"
  },
  {
    id: "prod-2",
    name: "Surf Excel Care",
    brand: "HUL",
    category: "Home Care",
    badge: "Master Slabs",
    order: 2,
    active: true,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuALrDEjfQf7dLOxJam8hpC26v7jVNyPF2GvCCtSeG8GF5nHiyPJQz_-1d2sf2q1sne-7Ci0aZkH6QM9Ra2Of_Qa5IOUsTiCWiTvhU_kCJc89_BWGAy7-98o9wHgloX3ScqWU2PIh1Czi4qhkvcaBjXCha0MLd7t8oAK0CEPL3NC06PKRizJiZ3X8Y8eI_Ii3eKUZta9kZyWtLKRq2BCbPn5iIzRyMLWQvt1NH-keng7hbpnrRJGr6EY",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuALrDEjfQf7dLOxJam8hpC26v7jVNyPF2GvCCtSeG8GF5nHiyPJQz_-1d2sf2q1sne-7Ci0aZkH6QM9Ra2Of_Qa5IOUsTiCWiTvhU_kCJc89_BWGAy7-98o9wHgloX3ScqWU2PIh1Czi4qhkvcaBjXCha0MLd7t8oAK0CEPL3NC06PKRizJiZ3X8Y8eI_Ii3eKUZta9kZyWtLKRq2BCbPn5iIzRyMLWQvt1NH-keng7hbpnrRJGr6EY"
  },
  {
    id: "prod-3",
    name: "Bingo! & Staples",
    brand: "ITC Foods",
    category: "Snacks",
    badge: "Factory Slabs",
    order: 3,
    active: true,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDweiGxyI0jDj6JorFXR7uXXVnyIJEQBKeycn9mMz7umpH0nDbYoSrzeLM0arPLKyUqV0fhS613m4hFhZ4_0P--NjTQYWbHfSmk8I_yQ4fs5WwSI9otAxsb-sHhMwkoF3E5ymWpzau7xYJBV-K6-GlYO5kBm_rB9AJj1COlGzMyYfjS6bDTDVym1XDndod0pnTnJvIlfKJEU95_Ory2Z71f6itqHqiorPPuWkSJ3ZStIQpj-1h2QRS1",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDweiGxyI0jDj6JorFXR7uXXVnyIJEQBKeycn9mMz7umpH0nDbYoSrzeLM0arPLKyUqV0fhS613m4hFhZ4_0P--NjTQYWbHfSmk8I_yQ4fs5WwSI9otAxsb-sHhMwkoF3E5ymWpzau7xYJBV-K6-GlYO5kBm_rB9AJj1COlGzMyYfjS6bDTDVym1XDndod0pnTnJvIlfKJEU95_Ory2Z71f6itqHqiorPPuWkSJ3ZStIQpj-1h2QRS1"
  },
  {
    id: "prod-4",
    name: "Nestlé Staples",
    brand: "Nestlé",
    category: "Packaged Foods",
    badge: "600+ SKUs",
    order: 4,
    active: true,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDdLrZNa86UN8Xyyg7BWo5ZHseGv4D3x6eJ2nWo3fR0GDofPkcN2XDQ_GmzSNfJbK2O-4g_yBAXAKj1gjsNWstxwvEY41VO4S5WLO7jihxPF0NSB-m9fwLXipvV9HmkgAHqEm_0wSclaOkuNMMiXdI-8TuXZ0Hxhjg1VxLnE_E8CCEuQiyA2_H73sLjE5jYx0OUc1MmzN8BhbyLQbw8r1FDsQ0EBgvtVO033UTGShVek4yaCb_PxOVT",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDdLrZNa86UN8Xyyg7BWo5ZHseGv4D3x6eJ2nWo3fR0GDofPkcN2XDQ_GmzSNfJbK2O-4g_yBAXAKj1gjsNWstxwvEY41VO4S5WLO7jihxPF0NSB-m9fwLXipvV9HmkgAHqEm_0wSclaOkuNMMiXdI-8TuXZ0Hxhjg1VxLnE_E8CCEuQiyA2_H73sLjE5jYx0OUc1MmzN8BhbyLQbw8r1FDsQ0EBgvtVO033UTGShVek4yaCb_PxOVT"
  }
];

// ==========================================
// 3. DEFAULT FACILITY SECTION DATA
// ==========================================
const DEFAULT_FACILITY_DATA = {
  locationPill: "Coastal Karnataka • 24/7 Distribution",
  eyebrow: "COMPANY OVERVIEW",
  heading: "ABOUT ANFAL ENTERPRISES",
  tagline: "Reliable FMCG Distribution. Built on Trust.",
  backgroundImage: "assets/images/facility-full.jpg",
  bgImage: "assets/images/facility-full.jpg",
  features: [
    { title: "High-Capacity Depot", desc: "20,000+ sq. ft. modern facility" },
    { title: "Highway Connectivity", desc: "Direct NH 66 corridor access" },
    { title: "Direct Sourcing", desc: "Authorized manufacturer contracts" },
    { title: "Transparent B2B Billing", desc: "Rapid digital invoicing & credit" }
  ],
  feature1Title: "High-Capacity Depot",
  feature1Desc: "20,000+ sq. ft. modern facility",
  feature2Title: "Highway Connectivity",
  feature2Desc: "Direct NH 66 corridor access",
  feature3Title: "Direct Sourcing",
  feature3Desc: "Authorized manufacturer contracts",
  feature4Title: "Transparent B2B Billing",
  feature4Desc: "Rapid digital invoicing & credit",
  bottomLeaderTag: "COASTAL KARNATAKA DISTRIBUTION LEADER",
  leaderTag: "COASTAL KARNATAKA DISTRIBUTION LEADER",
  ctaText: "Schedule Facility Inspection",
  ctaLink: "#contact"
};

// ==========================================
// 4. DEFAULT LEADERSHIP TEAM ROSTER
// ==========================================
const DEFAULT_TEAM = [
  {
    id: "team-1",
    name: "Mohammed Anfal",
    role: "Founder & CEO",
    bio: "Strategic commercial direction & manufacturer relations.",
    phone: "+91 8385 226700",
    email: "info@anfalenterprises.com",
    whatsapp: "+91 94481 23456",
    order: 1,
    active: true,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCzXet3G6Dxc9P40KmdSELxt7EmW62ftIEC5bFRTwOqtfW3NRBBrJJg7eko9NLQYDI0EHgYxxWMrBQnbB5V0D5UEPcogmqNwm1VU4eMOTtrBEjhPaobg889vbYJsABOQvOyQAj8l3uo8RsnWFshoRCXZWeREEZKK1jUmDcdDg08QdsR35ypCuO4RarlLgVW-2CuPYRnifxMRjY6mztgn68VRiviemeQ_9nel9ZEPed55s5v-ICCweD8",
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCzXet3G6Dxc9P40KmdSELxt7EmW62ftIEC5bFRTwOqtfW3NRBBrJJg7eko9NLQYDI0EHgYxxWMrBQnbB5V0D5UEPcogmqNwm1VU4eMOTtrBEjhPaobg889vbYJsABOQvOyQAj8l3uo8RsnWFshoRCXZWeREEZKK1jUmDcdDg08QdsR35ypCuO4RarlLgVW-2CuPYRnifxMRjY6mztgn68VRiviemeQ_9nel9ZEPed55s5v-ICCweD8"
  },
  {
    id: "team-2",
    name: "Ibrahim Siddique",
    role: "General Manager",
    bio: "Depot fulfillment, yard management & zero-delay logistics.",
    phone: "+91 8385 226700",
    email: "info@anfalenterprises.com",
    whatsapp: "+91 94481 23456",
    order: 2,
    active: true,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDW2yo9N6KmXKAOO01dnqwgot_ionyGIaUh-afxhTXyFEVe4K1bye57uexPwXv5ZoZcXuesNWiimJlGErk2PjBLjqCEQi8MpTjHRDY2iQMIDSG0DrZdJpsjeLd7WkA7MVykRj18m-TJzWMg8NT2t82josPiZcRQ6R6ZA3qbxE-ZhK8-DOpCbXo3q7v6ub1KRR_D3kExd4N7rtH_8rOL0n0wXj-K9tLDoUBUIsiCUY3fZ-18o2UOFKc3",
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDW2yo9N6KmXKAOO01dnqwgot_ionyGIaUh-afxhTXyFEVe4K1bye57uexPwXv5ZoZcXuesNWiimJlGErk2PjBLjqCEQi8MpTjHRDY2iQMIDSG0DrZdJpsjeLd7WkA7MVykRj18m-TJzWMg8NT2t82josPiZcRQ6R6ZA3qbxE-ZhK8-DOpCbXo3q7v6ub1KRR_D3kExd4N7rtH_8rOL0n0wXj-K9tLDoUBUIsiCUY3fZ-18o2UOFKc3"
  },
  {
    id: "team-3",
    name: "Tariq Kola",
    role: "Sales Manager",
    bio: "Retail partnerships, supermarket chains & slab accounts.",
    phone: "+91 8385 226700",
    email: "info@anfalenterprises.com",
    whatsapp: "+91 94481 23456",
    order: 3,
    active: true,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCoby5xCdBGaqFadUY0UsTKHTNcXNlxUmS1cONSdLUAnC1lhFg-hqdgRutjsFKfZL_LdwsUgJ3IAZ9hGM-FJY244Cpvk6ULLlnadGxrOkkXVopGwjKv9t3K_nQg4h0clA-qBsNfN2f7AwytB9_yGB8G-xnkYJmcVVlqPTjSp5WLl4ThBdW8NzMTG6OwHFHfUF5t6jPZ9jydM-RF2ZV8Zbj3AzOB-5L4-w8miXlFsaS_it1H6unEnGKP",
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCoby5xCdBGaqFadUY0UsTKHTNcXNlxUmS1cONSdLUAnC1lhFg-hqdgRutjsFKfZL_LdwsUgJ3IAZ9hGM-FJY244Cpvk6ULLlnadGxrOkkXVopGwjKv9t3K_nQg4h0clA-qBsNfN2f7AwytB9_yGB8G-xnkYJmcVVlqPTjSp5WLl4ThBdW8NzMTG6OwHFHfUF5t6jPZ9jydM-RF2ZV8Zbj3AzOB-5L4-w8miXlFsaS_it1H6unEnGKP"
  },
  {
    id: "team-4",
    name: "Zameer Shaikh",
    role: "Marketing Lead",
    bio: "Coastal market penetration & merchant loyalty programs.",
    phone: "+91 8385 226700",
    email: "info@anfalenterprises.com",
    whatsapp: "+91 94481 23456",
    order: 4,
    active: true,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDM9Y5mJwxbOcS1QUwUQTnOd5eguJDnXp5w5P6PD2iB_QQchu--s0aqMC46SwpVVSTePuxmXapWk8XV_Pb_6SLh-jhmKdz1mgRWGrF1-4r6XJI5W1CClmPZww8F9XvWCUKvLUxloIf62yIBY5FVbYmYhkH9RUxJN1UhCbmBcYwCoGxrhN6t8KIlL325xcHidHe3VFBf_OVl5387MDRBkCPgj5wNT5u4VhOLmdDfWzRtxZX-6XDPt74h",
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDM9Y5mJwxbOcS1QUwUQTnOd5eguJDnXp5w5P6PD2iB_QQchu--s0aqMC46SwpVVSTePuxmXapWk8XV_Pb_6SLh-jhmKdz1mgRWGrF1-4r6XJI5W1CClmPZww8F9XvWCUKvLUxloIf62yIBY5FVbYmYhkH9RUxJN1UhCbmBcYwCoGxrhN6t8KIlL325xcHidHe3VFBf_OVl5387MDRBkCPgj5wNT5u4VhOLmdDfWzRtxZX-6XDPt74h"
  }
];

// ==========================================
// 5. DEFAULT CONTACT & LIVE MAP DATA
// ==========================================
const DEFAULT_CONTACT_DATA = {
  heading: "Connect With Anfal Enterprises",
  subtitle: "Rapid quote generation and customized bulk delivery scheduling.",
  address: "National Highway 66, Near Coastal Bypass, Bhatkal, Karnataka 581320",
  phone: "+91 (08385) 226700",
  whatsapp: "+91 94481 23456",
  email: "info@anfalenterprises.com",
  hours: "Mon - Sat: 08:30 - 19:30 IST",
  mapLocationName: "Anfal Wholesale Depot (Bhatkal)",
  mapLatitude: 13.9872,
  mapLongitude: 74.5539,
  mapZoom: 15,
  googleMapsUrl: "https://maps.google.com/?q=13.9872,74.5539",
  enquiryReasons: [
    "Wholesale Supply / Bulk Purchase",
    "Brands & Product Distribution",
    "Retailer Partnership",
    "Depot Logistics & Transportation",
    "Institutional & Enterprise Supply",
    "General Inquiry"
  ],
  // Aliases for compatibility
  locationName: "Anfal Wholesale Depot (Bhatkal)",
  latitude: 13.9872,
  longitude: 74.5539,
  operatingHours: "Mon - Sat: 08:30 - 19:30 IST",
  directionsUrl: "https://maps.google.com/?q=13.9872,74.5539"
};

// ==========================================
// 6. DEFAULT VERIFIED BRANDS PORTFOLIO
// ==========================================
const DEFAULT_BRANDS = [
  {
    id: "brand-1",
    name: "Hindustan Unilever",
    monogram: "HUL",
    shortName: "HUL",
    category: "PERSONAL CARE & HYGIENE",
    icon: "spa",
    categoryIcon: "spa",
    products: ["Lifebuoy", "Dove", "Surf Excel", "Rin", "Lux", "Pepsodent"],
    productLine: "Lifebuoy • Dove • Surf Excel • Rin • Lux • Pepsodent",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCM84fWMUM09FKi15_nMHLrrWJd_-i11TQXyzO9Dbon5Yt_uHwwk_RK4HMoOg-Hc8_hXAmXzjBiqAMIuBrO8QpIu8jJYCPHNHsB79sR0VTkumBWIgrFdAhzpr3Hz-h0D1Vk3Xb7TZw_PxlJM_QNgHh0S5dGdd1J6QcCxjev_HbpqwyJjADHRaxcqId82FufAzysEJzWNQ1_wYvBb-io85Qwz3KN-KwI1QvnkA_v8nfogdKDvoPLTGxN",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCM84fWMUM09FKi15_nMHLrrWJd_-i11TQXyzO9Dbon5Yt_uHwwk_RK4HMoOg-Hc8_hXAmXzjBiqAMIuBrO8QpIu8jJYCPHNHsB79sR0VTkumBWIgrFdAhzpr3Hz-h0D1Vk3Xb7TZw_PxlJM_QNgHh0S5dGdd1J6QcCxjev_HbpqwyJjADHRaxcqId82FufAzysEJzWNQ1_wYvBb-io85Qwz3KN-KwI1QvnkA_v8nfogdKDvoPLTGxN",
    active: true,
    order: 1
  },
  {
    id: "brand-2",
    name: "Procter & Gamble",
    monogram: "P&G",
    shortName: "P&G",
    category: "FABRIC & HOME CARE",
    icon: "clean_hands",
    categoryIcon: "clean_hands",
    products: ["Ariel", "Tide", "Pantene", "Head & Shoulders", "Gillette"],
    productLine: "Ariel • Tide • Pantene • Head & Shoulders • Gillette",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCVn5xx_eqmJm-k9tHbIbhzHjEF40oVvpqN26lx2tGjLkiD43kdOGDr2zO3oCfLRJhYZJ-A8i96ZPL_EctH0GmSoiXuiOOobW4dfFjDkn8q6I7lK14UkcTb64VFqF6We6LO1PlCW00IdIFoeC1KKlopHVkRz2ItTYuzG2fEBfGfcK51XwPcn96GO5aKt7Aa62o4A5WvNxZGAbGOmwhKiciu46b434mcNAkHdI_tUgkYiIiNghKj05W",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCVn5xx_eqmJm-k9tHbIbhzHjEF40oVvpqN26lx2tGjLkiD43kdOGDr2zO3oCfLRJhYZJ-A8i96ZPL_EctH0GmSoiXuiOOobW4dfFjDkn8q6I7lK14UkcTb64VFqF6We6LO1PlCW00IdIFoeC1KKlopHVkRz2ItTYuzG2fEBfGfcK51XwPcn96GO5aKt7Aa62o4A5WvNxZGAbGOmwhKiciu46b434mcNAkHdI_tUgkYiIiNghKj05W",
    active: true,
    order: 2
  },
  {
    id: "brand-3",
    name: "Nestlé",
    monogram: "Nestlé",
    shortName: "NESTLÉ",
    category: "FOODS & BEVERAGES",
    icon: "ramen_dining",
    categoryIcon: "ramen_dining",
    products: ["Maggi", "Nescafé", "KitKat", "Everyday Dairy", "Milkmaid"],
    productLine: "Maggi • Nescafé • KitKat • Everyday Dairy • Milkmaid",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDdLrZNa86UN8Xyyg7BWo5ZHseGv4D3x6eJ2nWo3fR0GDofPkcN2XDQ_GmzSNfJbK2O-4g_yBAXAKj1gjsNWstxwvEY41VO4S5WLO7jihxPF0NSB-m9fwLXipvV9HmkgAHqEm_0wSclaOkuNMMiXdI-8TuXZ0Hxhjg1VxLnE_E8CCEuQiyA2_H73sLjE5jYx0OUc1MmzN8BhbyLQbw8r1FDsQ0EBgvtVO033UTGShVek4yaCb_PxOVT",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDdLrZNa86UN8Xyyg7BWo5ZHseGv4D3x6eJ2nWo3fR0GDofPkcN2XDQ_GmzSNfJbK2O-4g_yBAXAKj1gjsNWstxwvEY41VO4S5WLO7jihxPF0NSB-m9fwLXipvV9HmkgAHqEm_0wSclaOkuNMMiXdI-8TuXZ0Hxhjg1VxLnE_E8CCEuQiyA2_H73sLjE5jYx0OUc1MmzN8BhbyLQbw8r1FDsQ0EBgvtVO033UTGShVek4yaCb_PxOVT",
    active: true,
    order: 3
  },
  {
    id: "brand-4",
    name: "Britannia",
    monogram: "BRITANNIA",
    shortName: "BRITANNIA",
    category: "BAKERY & SNACKS",
    icon: "cookie",
    categoryIcon: "cookie",
    products: ["Good Day", "Marie Gold", "Treat", "Milk Bikis", "50-50"],
    productLine: "Good Day • Marie Gold • Treat • Milk Bikis • 50-50",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCmwx-5Bm2tZMphEQ2GMD_cMhtGz4ZaniB5ABQlJ0SkxmQi7Al81RmafiQxcw86r3SBZ9fORlC6cZUhWBVdnw8zO7rpu-wekYLH_3ngd2nY0ywVQjj6k6ZBKO8J3TTfscyNjuDjx0UKoEHpI22ZqlJuDOrD163TL06FYz75Qh-o9DVYEd0SB0RbjBcZZn6K2_sTYIG6XiZ9SxvTurcMI6MHrOZJnBLB1BAxBk9D3NU-BC_fYS_ky8UY",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCmwx-5Bm2tZMphEQ2GMD_cMhtGz4ZaniB5ABQlJ0SkxmQi7Al81RmafiQxcw86r3SBZ9fORlC6cZUhWBVdnw8zO7rpu-wekYLH_3ngd2nY0ywVQjj6k6ZBKO8J3TTfscyNjuDjx0UKoEHpI22ZqlJuDOrD163TL06FYz75Qh-o9DVYEd0SB0RbjBcZZn6K2_sTYIG6XiZ9SxvTurcMI6MHrOZJnBLB1BAxBk9D3NU-BC_fYS_ky8UY",
    active: true,
    order: 4
  },
  {
    id: "brand-5",
    name: "Dabur",
    monogram: "Dabur",
    shortName: "DABUR",
    category: "HEALTH & WELLNESS",
    icon: "medical_services",
    categoryIcon: "medical_services",
    products: ["Chyawanprash", "Honey", "Amla", "Red Paste", "Vatika"],
    productLine: "Chyawanprash • Honey • Amla • Red Paste • Vatika",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC4aQ9VgSmDoqLf8md4AhYvOmGIbLpaM9c_FI8wFAcWBs00UabkkMKtc241XiwORBnA-Wwj7oEjRajawv1kxgjdUunI0BaEinZnjLNIlAJkVIW1k3kegWpi0CgpKHuj471LFQ3uEa0hmsVqjLs6vkp04HQjXUoV4xhMGLqYZp5EEG7v27Zf9uV4C4kkCKlOBY3ZkqHAFD73ev9IdFxnbhH1XnOFM8B33eGlYksryGrdIqOcJO4rlx9R",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuC4aQ9VgSmDoqLf8md4AhYvOmGIbLpaM9c_FI8wFAcWBs00UabkkMKtc241XiwORBnA-Wwj7oEjRajawv1kxgjdUunI0BaEinZnjLNIlAJkVIW1k3kegWpi0CgpKHuj471LFQ3uEa0hmsVqjLs6vkp04HQjXUoV4xhMGLqYZp5EEG7v27Zf9uV4C4kkCKlOBY3ZkqHAFD73ev9IdFxnbhH1XnOFM8B33eGlYksryGrdIqOcJO4rlx9R",
    active: true,
    order: 5
  },
  {
    id: "brand-6",
    name: "Saffola",
    monogram: "Saffola",
    shortName: "SAFFOLA",
    category: "HEALTHY FOODS",
    icon: "favorite",
    categoryIcon: "favorite",
    products: ["Saffola Gold", "Saffola Oats", "Saffola Masala Oats"],
    productLine: "Saffola Gold • Saffola Oats • Saffola Masala Oats",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDt-PflYgKe0RcEzHwDtx9smFwvlojmBd4-msU--QrUrC9PzTepKflLX8UawK5HXjuqr5SQcua-dwGyJ41pC1si7rI6YMVLNJ0p9_ZI0NxGVUqsAdzEx1jRXaF1aUkbTlUk2LyXoRlKw9_CgL6wbMdC_eOAjAKv2JM87JOnjTkaDb_PFsFSZ4K1cY0CCKe2d2r_myXZp8JnjduHZgPCc0FHk5jG1bQIxU35K2W_WjVkB6WgjmWDBD_S",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDt-PflYgKe0RcEzHwDtx9smFwvlojmBd4-msU--QrUrC9PzTepKflLX8UawK5HXjuqr5SQcua-dwGyJ41pC1si7rI6YMVLNJ0p9_ZI0NxGVUqsAdzEx1jRXaF1aUkbTlUk2LyXoRlKw9_CgL6wbMdC_eOAjAKv2JM87JOnjTkaDb_PFsFSZ4K1cY0CCKe2d2r_myXZp8JnjduHZgPCc0FHk5jG1bQIxU35K2W_WjVkB6WgjmWDBD_S",
    active: true,
    order: 6
  },
  {
    id: "brand-7",
    name: "ITC Foods",
    monogram: "ITC",
    shortName: "ITC",
    category: "FOODS & PERSONAL CARE",
    icon: "fastfood",
    categoryIcon: "fastfood",
    products: ["Aashirvaad", "Sunfeast", "Fiama", "Engage", "Classmate"],
    productLine: "Aashirvaad • Sunfeast • Fiama • Engage • Classmate",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDweiGxyI0jDj6JorFXR7uXXVnyIJEQBKeycn9mMz7umpH0nDbYoSrzeLM0arPLKyUqV0fhS613m4hFhZ4_0P--NjTQYWbHfSmk8I_yQ4fs5WwSI9otAxsb-sHhMwkoF3E5ymWpzau7xYJBV-K6-GlYO5kBm_rB9AJj1COlGzMyYfjS6bDTDVym1XDndod0pnTnJvIlfKJEU95_Ory2Z71f6itqHqiorPPuWkSJ3ZStIQpj-1h2QRS1",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDweiGxyI0jDj6JorFXR7uXXVnyIJEQBKeycn9mMz7umpH0nDbYoSrzeLM0arPLKyUqV0fhS613m4hFhZ4_0P--NjTQYWbHfSmk8I_yQ4fs5WwSI9otAxsb-sHhMwkoF3E5ymWpzau7xYJBV-K6-GlYO5kBm_rB9AJj1COlGzMyYfjS6bDTDVym1XDndod0pnTnJvIlfKJEU95_Ory2Z71f6itqHqiorPPuWkSJ3ZStIQpj-1h2QRS1",
    active: true,
    order: 7
  },
  {
    id: "brand-8",
    name: "Colgate",
    monogram: "Colgate",
    shortName: "COLGATE",
    category: "ORAL CARE",
    icon: "dentistry",
    categoryIcon: "dentistry",
    products: ["Colgate", "Colgate Plax", "Colgate Total"],
    productLine: "Colgate • Colgate Plax • Colgate Total",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuALrDEjfQf7dLOxJam8hpC26v7jVNyPF2GvCCtSeG8GF5nHiyPJQz_-1d2sf2q1sne-7Ci0aZkH6QM9Ra2Of_Qa5IOUsTiCWiTvhU_kCJc89_BWGAy7-98o9wHgloX3ScqWU2PIh1Czi4qhkvcaBjXCha0MLd7t8oAK0CEPL3NC06PKRizJiZ3X8Y8eI_Ii3eKUZta9kZyWtLKRq2BCbPn5iIzRyMLWQvt1NH-keng7hbpnrRJGr6EY",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuALrDEjfQf7dLOxJam8hpC26v7jVNyPF2GvCCtSeG8GF5nHiyPJQz_-1d2sf2q1sne-7Ci0aZkH6QM9Ra2Of_Qa5IOUsTiCWiTvhU_kCJc89_BWGAy7-98o9wHgloX3ScqWU2PIh1Czi4qhkvcaBjXCha0MLd7t8oAK0CEPL3NC06PKRizJiZ3X8Y8eI_Ii3eKUZta9kZyWtLKRq2BCbPn5iIzRyMLWQvt1NH-keng7hbpnrRJGr6EY",
    active: true,
    order: 8
  },
  {
    id: "brand-9",
    name: "Pears",
    monogram: "Pears",
    shortName: "PEARS",
    category: "BATH & SKIN CARE",
    icon: "shower",
    categoryIcon: "shower",
    products: ["Pears Soap", "Pears Body Wash"],
    productLine: "Pears Soap • Pears Body Wash",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB57C98vpg2YdZznkg_Byx0y2jXylAk8J_6QkF8PCeQRP3JBJ5HgxrY296UBom6etPXc2WTCXobGt2kyq8gXFyT4Au8nGj7xdFn-_l3KkcpXZ6GyJJftwGFI0xj7ZrKHJ8-WO23Wd6PcvpXvu5NOdrLP9HvUUvvUBKorxPJYhSXqjMXHU6i99EUEEAPrsyIFmi2Sf0qDiEjvmxLT92Z1oIMhv-CcDzkTcKoC1q3eh2wCLMJqBbfsraP",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuB57C98vpg2YdZznkg_Byx0y2jXylAk8J_6QkF8PCeQRP3JBJ5HgxrY296UBom6etPXc2WTCXobGt2kyq8gXFyT4Au8nGj7xdFn-_l3KkcpXZ6GyJJftwGFI0xj7ZrKHJ8-WO23Wd6PcvpXvu5NOdrLP9HvUUvvUBKorxPJYhSXqjMXHU6i99EUEEAPrsyIFmi2Sf0qDiEjvmxLT92Z1oIMhv-CcDzkTcKoC1q3eh2wCLMJqBbfsraP",
    active: true,
    order: 9
  }
];

// ==========================================
// 7. DEFAULT WHOLESALE ENQUIRIES
// ==========================================
const DEFAULT_ENQUIRIES = [
  {
    id: "enq-sample-1",
    name: "Salim Ahmed",
    company: "Coastal Hypermarket (Bhatkal)",
    phone: "+91 98765 43210",
    town: "Bhatkal",
    reason: "Wholesale Supply / Bulk Purchase",
    message: "[Town: Bhatkal] [Reason: Wholesale Supply / Bulk Purchase] Note: Need master cartons and weekly scheduled dispatch.",
    date: "2026-09-24 02:30 PM",
    status: "New"
  },
  {
    id: "enq-sample-2",
    name: "Rahil Merchant",
    company: "City Mart Supermarket (Kundapura)",
    phone: "+91 98452 98765",
    town: "Kundapura",
    reason: "Brands & Product Distribution",
    message: "[Town: Kundapura] [Reason: Brands & Product Distribution] Note: Looking for direct manufacturer price slabs and dealership onboarding.",
    date: "2026-09-22 11:15 AM",
    status: "Contacted"
  }
];

// ==========================================
// STORAGE KEYS
// ==========================================
const STORAGE_KEYS = {
  HOME: "anfal_cms_home",
  PRODUCTS: "anfal_cms_products",
  FACILITY: "anfal_cms_facility",
  TEAM: "anfal_cms_team",
  CONTACT: "anfal_cms_contact",
  BRANDS: "anfal_cms_brands",
  ENQUIRIES: "anfal_cms_enquiries",
  ACTIVITY: "anfal_cms_activity"
};

// ==========================================
// CMS CORE ENGINE WITH FULL COMPATIBILITY
// ==========================================
const CMS = {
  // --- Activity Logger ---
  logActivity(action, details = "") {
    try {
      const logs = this.getActivityLog();
      const entry = {
        id: "act-" + Date.now(),
        message: `${action}: ${details}`,
        action,
        details,
        time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
        timestamp: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
        date: new Date().toLocaleDateString("en-IN")
      };
      logs.unshift(entry);
      localStorage.setItem(STORAGE_KEYS.ACTIVITY, JSON.stringify(logs.slice(0, 25)));
    } catch (e) {
      console.warn("CMS Activity Logging Error", e);
    }
  },

  getActivityLog() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ACTIVITY);
      return stored ? JSON.parse(stored) : [
        { id: "act-init-1", message: "Facility Background Saved", time: "15:40", date: "Today" },
        { id: "act-init-2", message: "Brand Catalog Synchronized", time: "15:30", date: "Today" }
      ];
    } catch (e) {
      return [];
    }
  },

  // --- 1. Home Section ---
  getHomeData() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.HOME);
      if (!stored) {
        localStorage.setItem(STORAGE_KEYS.HOME, JSON.stringify(DEFAULT_HOME_DATA));
        return { ...DEFAULT_HOME_DATA };
      }
      return { ...DEFAULT_HOME_DATA, ...JSON.parse(stored) };
    } catch (e) {
      return { ...DEFAULT_HOME_DATA };
    }
  },

  saveHomeData(data) {
    try {
      const merged = { ...this.getHomeData(), ...data };
      localStorage.setItem(STORAGE_KEYS.HOME, JSON.stringify(merged));
      this.logActivity("Home Content Updated", merged.heroHeading || "Hero Section");
      window.dispatchEvent(new CustomEvent("cms:home-updated", { detail: merged }));
      return true;
    } catch (e) {
      return false;
    }
  },

  // --- 2. Featured Home Products ---
  getFeaturedProducts() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      let list = stored ? JSON.parse(stored) : DEFAULT_FEATURED_PRODUCTS;
      if (!Array.isArray(list) || list.length === 0) {
        list = DEFAULT_FEATURED_PRODUCTS;
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(list));
      }
      // Normalize product fields
      return list.map(p => ({
        id: p.id || "prod-" + Math.random().toString(36).substr(2, 6),
        name: p.name || "Product",
        brand: p.brand || "Brand",
        category: p.category || "FMCG",
        badge: p.badge || "Direct",
        order: p.order || 1,
        active: p.active !== false,
        image: p.image || p.imageUrl || DEFAULT_FEATURED_PRODUCTS[0].image,
        imageUrl: p.imageUrl || p.image || DEFAULT_FEATURED_PRODUCTS[0].image
      })).sort((a, b) => (a.order || 99) - (b.order || 99));
    } catch (e) {
      return DEFAULT_FEATURED_PRODUCTS;
    }
  },

  getFeaturedProductById(id) {
    const list = this.getFeaturedProducts();
    return list.find(p => p.id === id) || null;
  },

  getProductById(id) {
    return this.getFeaturedProductById(id);
  },

  saveFeaturedProducts(products) {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
      this.logActivity("Featured Products Saved", `${products.length} Products`);
      window.dispatchEvent(new CustomEvent("cms:products-updated", { detail: products }));
      return true;
    } catch (e) {
      return false;
    }
  },

  addProduct(product) {
    try {
      const list = this.getFeaturedProducts();
      const img = product.image || product.imageUrl || DEFAULT_FEATURED_PRODUCTS[0].image;
      const newProd = {
        id: "prod-" + Date.now(),
        name: (product.name || "New Product").trim(),
        brand: (product.brand || "Brand").trim(),
        category: (product.category || "General").trim(),
        badge: (product.badge || "Direct Wholesale").trim(),
        order: product.order ? parseInt(product.order) : list.length + 1,
        active: product.active !== false,
        image: img,
        imageUrl: img
      };
      list.push(newProd);
      this.logActivity("Product Added", newProd.name);
      return this.saveFeaturedProducts(list);
    } catch (e) {
      return false;
    }
  },

  addFeaturedProduct(product) {
    return this.addProduct(product);
  },

  updateProduct(id, updatedFields) {
    try {
      let list = this.getFeaturedProducts();
      const img = updatedFields.image || updatedFields.imageUrl;
      list = list.map(p => {
        if (p.id === id) {
          const merged = { ...p, ...updatedFields };
          if (img) {
            merged.image = img;
            merged.imageUrl = img;
          }
          return merged;
        }
        return p;
      });
      this.logActivity("Product Updated", updatedFields.name || id);
      return this.saveFeaturedProducts(list);
    } catch (e) {
      return false;
    }
  },

  updateFeaturedProduct(id, updatedFields) {
    return this.updateProduct(id, updatedFields);
  },

  deleteProduct(id) {
    try {
      let list = this.getFeaturedProducts();
      const target = list.find(p => p.id === id);
      list = list.filter(p => p.id !== id);
      this.logActivity("Product Deleted", target?.name || id);
      return this.saveFeaturedProducts(list);
    } catch (e) {
      return false;
    }
  },

  deleteFeaturedProduct(id) {
    return this.deleteProduct(id);
  },

  // --- 3. Facility Section ---
  getFacilityData() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.FACILITY);
      const data = stored ? JSON.parse(stored) : DEFAULT_FACILITY_DATA;
      const merged = { ...DEFAULT_FACILITY_DATA, ...data };

      // Normalize features array & individual fields
      if (!merged.features || !Array.isArray(merged.features) || merged.features.length < 4) {
        merged.features = [
          { title: merged.feature1Title || "High-Capacity Depot", desc: merged.feature1Desc || "20,000+ sq. ft. modern facility" },
          { title: merged.feature2Title || "Highway Connectivity", desc: merged.feature2Desc || "Direct NH 66 corridor access" },
          { title: merged.feature3Title || "Direct Sourcing", desc: merged.feature3Desc || "Authorized manufacturer contracts" },
          { title: merged.feature4Title || "Transparent B2B Billing", desc: merged.feature4Desc || "Rapid digital invoicing & credit" }
        ];
      }

      merged.backgroundImage = merged.backgroundImage || merged.bgImage || DEFAULT_FACILITY_DATA.backgroundImage;
      merged.bgImage = merged.backgroundImage;
      merged.bottomLeaderTag = merged.bottomLeaderTag || merged.leaderTag || DEFAULT_FACILITY_DATA.bottomLeaderTag;
      merged.leaderTag = merged.bottomLeaderTag;

      return merged;
    } catch (e) {
      return { ...DEFAULT_FACILITY_DATA };
    }
  },

  saveFacilityData(data) {
    try {
      const current = this.getFacilityData();
      const merged = { ...current, ...data };

      if (merged.features && Array.isArray(merged.features)) {
        if (merged.features[0]) {
          merged.feature1Title = merged.features[0].title;
          merged.feature1Desc = merged.features[0].desc;
        }
        if (merged.features[1]) {
          merged.feature2Title = merged.features[1].title;
          merged.feature2Desc = merged.features[1].desc;
        }
        if (merged.features[2]) {
          merged.feature3Title = merged.features[2].title;
          merged.feature3Desc = merged.features[2].desc;
        }
        if (merged.features[3]) {
          merged.feature4Title = merged.features[3].title;
          merged.feature4Desc = merged.features[3].desc;
        }
      }

      merged.bgImage = merged.backgroundImage || merged.bgImage;
      merged.backgroundImage = merged.bgImage;
      merged.leaderTag = merged.bottomLeaderTag || merged.leaderTag;
      merged.bottomLeaderTag = merged.leaderTag;

      localStorage.setItem(STORAGE_KEYS.FACILITY, JSON.stringify(merged));
      this.logActivity("Facility Section Updated", merged.heading || "Depot Overview");
      window.dispatchEvent(new CustomEvent("cms:facility-updated", { detail: merged }));
      return true;
    } catch (e) {
      return false;
    }
  },

  // --- 4. Leadership Team ---
  getTeam() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.TEAM);
      let list = stored ? JSON.parse(stored) : DEFAULT_TEAM;
      if (!Array.isArray(list) || list.length === 0) {
        list = DEFAULT_TEAM;
        localStorage.setItem(STORAGE_KEYS.TEAM, JSON.stringify(list));
      }
      return list.map(m => ({
        id: m.id || "team-" + Math.random().toString(36).substr(2, 6),
        name: m.name || "Executive Member",
        role: m.role || "Executive",
        bio: m.bio || "Commercial management.",
        phone: m.phone || "+91 8385 226700",
        email: m.email || "info@anfalenterprises.com",
        whatsapp: m.whatsapp || "+91 94481 23456",
        order: m.order || 1,
        active: m.active !== false,
        image: m.image || m.avatarUrl || DEFAULT_TEAM[0].image,
        avatarUrl: m.avatarUrl || m.image || DEFAULT_TEAM[0].image
      })).sort((a, b) => (a.order || 99) - (b.order || 99));
    } catch (e) {
      return DEFAULT_TEAM;
    }
  },

  getTeamMemberById(id) {
    const list = this.getTeam();
    return list.find(m => m.id === id) || null;
  },

  saveTeam(team) {
    try {
      localStorage.setItem(STORAGE_KEYS.TEAM, JSON.stringify(team));
      this.logActivity("Team Roster Saved", `${team.length} Members`);
      window.dispatchEvent(new CustomEvent("cms:team-updated", { detail: team }));
      return true;
    } catch (e) {
      return false;
    }
  },

  addTeamMember(member) {
    try {
      const list = this.getTeam();
      const img = member.image || member.avatarUrl || DEFAULT_TEAM[0].image;
      const newMember = {
        id: "team-" + Date.now(),
        name: (member.name || "Team Member").trim(),
        role: (member.role || "Executive").trim(),
        bio: (member.bio || "Commercial distribution operations.").trim(),
        phone: (member.phone || "+91 8385 226700").trim(),
        email: (member.email || "info@anfalenterprises.com").trim(),
        whatsapp: (member.whatsapp || "+91 94481 23456").trim(),
        order: member.order ? parseInt(member.order) : list.length + 1,
        active: member.active !== false,
        image: img,
        avatarUrl: img
      };
      list.push(newMember);
      this.logActivity("Team Member Added", newMember.name);
      return this.saveTeam(list);
    } catch (e) {
      return false;
    }
  },

  updateTeamMember(id, fields) {
    try {
      let team = this.getTeam();
      const img = fields.image || fields.avatarUrl;
      team = team.map(m => {
        if (m.id === id) {
          const merged = { ...m, ...fields };
          if (img) {
            merged.image = img;
            merged.avatarUrl = img;
          }
          return merged;
        }
        return m;
      });
      this.logActivity("Team Member Updated", fields.name || id);
      return this.saveTeam(team);
    } catch (e) {
      return false;
    }
  },

  deleteTeamMember(id) {
    try {
      let team = this.getTeam();
      const target = team.find(m => m.id === id);
      team = team.filter(m => m.id !== id);
      this.logActivity("Team Member Removed", target?.name || id);
      return this.saveTeam(team);
    } catch (e) {
      return false;
    }
  },

  // --- 5. Contact & Live Interactive Map ---
  getContactData() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CONTACT);
      const data = stored ? JSON.parse(stored) : DEFAULT_CONTACT_DATA;
      const merged = { ...DEFAULT_CONTACT_DATA, ...data };

      // Normalize map attributes
      merged.mapLatitude = parseFloat(merged.mapLatitude || merged.latitude || DEFAULT_CONTACT_DATA.mapLatitude);
      merged.mapLongitude = parseFloat(merged.mapLongitude || merged.longitude || DEFAULT_CONTACT_DATA.mapLongitude);
      merged.latitude = merged.mapLatitude;
      merged.longitude = merged.mapLongitude;
      merged.mapLocationName = merged.mapLocationName || merged.locationName || DEFAULT_CONTACT_DATA.mapLocationName;
      merged.locationName = merged.mapLocationName;
      merged.googleMapsUrl = merged.googleMapsUrl || merged.directionsUrl || `https://maps.google.com/?q=${merged.mapLatitude},${merged.mapLongitude}`;
      merged.directionsUrl = merged.googleMapsUrl;
      merged.hours = merged.hours || merged.operatingHours || DEFAULT_CONTACT_DATA.hours;
      merged.operatingHours = merged.hours;

      return merged;
    } catch (e) {
      return { ...DEFAULT_CONTACT_DATA };
    }
  },

  saveContactData(data) {
    try {
      const current = this.getContactData();
      const merged = { ...current, ...data };

      merged.mapLatitude = parseFloat(merged.mapLatitude || merged.latitude || DEFAULT_CONTACT_DATA.mapLatitude);
      merged.mapLongitude = parseFloat(merged.mapLongitude || merged.longitude || DEFAULT_CONTACT_DATA.mapLongitude);
      merged.latitude = merged.mapLatitude;
      merged.longitude = merged.mapLongitude;
      merged.locationName = merged.mapLocationName || merged.locationName;
      merged.mapLocationName = merged.locationName;
      merged.directionsUrl = merged.googleMapsUrl || merged.directionsUrl;
      merged.googleMapsUrl = merged.directionsUrl;
      merged.operatingHours = merged.hours || merged.operatingHours;
      merged.hours = merged.operatingHours;

      localStorage.setItem(STORAGE_KEYS.CONTACT, JSON.stringify(merged));
      this.logActivity("Contact & Map Updated", `${merged.mapLatitude}, ${merged.mapLongitude}`);
      window.dispatchEvent(new CustomEvent("cms:contact-updated", { detail: merged }));
      return true;
    } catch (e) {
      return false;
    }
  },

  // --- 6. Brands Portfolio ---
  getBrands() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.BRANDS);
      let list = stored ? JSON.parse(stored) : DEFAULT_BRANDS;
      if (!Array.isArray(list) || list.length === 0) {
        list = DEFAULT_BRANDS;
        localStorage.setItem(STORAGE_KEYS.BRANDS, JSON.stringify(list));
      }
      return list.map(b => {
        const prodArr = Array.isArray(b.products) ? b.products : (typeof b.productLine === "string" ? b.productLine.split("•").map(s => s.trim()) : []);
        const prodStr = typeof b.productLine === "string" ? b.productLine : prodArr.join(" • ");
        const img = b.image || b.imageUrl || DEFAULT_BRANDS[0].image;
        const short = b.monogram || b.shortName || (b.name || "BRND").substring(0, 4).toUpperCase();
        const ic = b.icon || b.categoryIcon || "category";

        return {
          id: b.id || "brand-" + Math.random().toString(36).substr(2, 6),
          name: b.name || "Brand Name",
          monogram: short,
          shortName: short,
          logoMark: b.logoMark || short,
          category: b.category || "FMCG",
          icon: ic,
          categoryIcon: ic,
          products: prodArr,
          productLine: prodStr,
          image: img,
          imageUrl: img,
          dominantColor: b.dominantColor || "#0a192f",
          accentColor: b.accentColor || "#ffffff",
          active: b.active !== false,
          order: b.order || 1
        };
      }).sort((a, b) => (a.order || 99) - (b.order || 99));
    } catch (e) {
      return DEFAULT_BRANDS;
    }
  },

  getBrandById(id) {
    const brands = this.getBrands();
    return brands.find(b => b.id === id) || null;
  },

  saveBrands(brands) {
    try {
      localStorage.setItem(STORAGE_KEYS.BRANDS, JSON.stringify(brands));
      this.logActivity("Brands Saved", `${brands.length} Brands`);
      window.dispatchEvent(new CustomEvent("cms:brands-updated", { detail: brands }));
      return true;
    } catch (e) {
      return false;
    }
  },

  addBrand(brand) {
    try {
      const brands = this.getBrands();
      const img = brand.image || brand.imageUrl || DEFAULT_BRANDS[0].image;
      const prodArr = Array.isArray(brand.products) ? brand.products : (typeof brand.productLine === "string" ? brand.productLine.split("•").map(s => s.trim()) : []);
      const prodStr = typeof brand.productLine === "string" ? brand.productLine : prodArr.join(" • ");
      const short = brand.monogram || brand.shortName || (brand.name || "BRND").substring(0, 4).toUpperCase();
      const ic = brand.icon || brand.categoryIcon || "category";

      const newBrand = {
        id: "brand-" + Date.now(),
        name: brand.name ? brand.name.trim() : "New FMCG Brand",
        monogram: short,
        shortName: short,
        logoMark: brand.logoMark || short,
        category: brand.category ? brand.category.trim() : "FMCG PRODUCTS",
        icon: ic,
        categoryIcon: ic,
        products: prodArr,
        productLine: prodStr,
        image: img,
        imageUrl: img,
        dominantColor: brand.dominantColor || "#0a192f",
        accentColor: brand.accentColor || "#ffffff",
        active: brand.active !== false,
        order: brand.order ? parseInt(brand.order) : brands.length + 1
      };
      brands.push(newBrand);
      this.logActivity("Brand Added", newBrand.name);
      return this.saveBrands(brands);
    } catch (e) {
      return false;
    }
  },

  updateBrand(id, updatedFields) {
    try {
      let brands = this.getBrands();
      const img = updatedFields.image || updatedFields.imageUrl;
      brands = brands.map(b => {
        if (b.id === id) {
          const merged = { ...b, ...updatedFields };
          if (img) {
            merged.image = img;
            merged.imageUrl = img;
          }
          if (updatedFields.products) {
            merged.products = Array.isArray(updatedFields.products) ? updatedFields.products : updatedFields.products.split("•").map(s => s.trim());
            merged.productLine = merged.products.join(" • ");
          } else if (updatedFields.productLine) {
            merged.productLine = updatedFields.productLine;
            merged.products = updatedFields.productLine.split("•").map(s => s.trim());
          }
          if (updatedFields.monogram) {
            merged.monogram = updatedFields.monogram;
            merged.shortName = updatedFields.monogram;
          }
          if (updatedFields.icon) {
            merged.icon = updatedFields.icon;
            merged.categoryIcon = updatedFields.icon;
          }
          return merged;
        }
        return b;
      });
      this.logActivity("Brand Updated", updatedFields.name || id);
      return this.saveBrands(brands);
    } catch (e) {
      return false;
    }
  },

  deleteBrand(id) {
    try {
      let brands = this.getBrands();
      const target = brands.find(b => b.id === id);
      brands = brands.filter(b => b.id !== id);
      this.logActivity("Brand Removed", target?.name || id);
      return this.saveBrands(brands);
    } catch (e) {
      return false;
    }
  },

  // --- 7. Wholesale Enquiries ---
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

  getEnquiryReasons() {
    try {
      const contact = this.getContactData();
      if (contact && Array.isArray(contact.enquiryReasons) && contact.enquiryReasons.length > 0) {
        return contact.enquiryReasons;
      }
      return [
        "Wholesale Supply / Bulk Purchase",
        "Brands & Product Distribution",
        "Retailer Partnership",
        "Depot Logistics & Transportation",
        "Institutional & Enterprise Supply",
        "General Inquiry"
      ];
    } catch (e) {
      return [
        "Wholesale Supply / Bulk Purchase",
        "Brands & Product Distribution",
        "Retailer Partnership",
        "Depot Logistics & Transportation",
        "Institutional & Enterprise Supply",
        "General Inquiry"
      ];
    }
  },

  saveEnquiryReasons(reasons) {
    try {
      const contact = this.getContactData();
      contact.enquiryReasons = reasons;
      return this.saveContactData(contact);
    } catch (e) {
      return false;
    }
  },

  getEnquiryById(id) {
    const list = this.getEnquiries();
    return list.find(e => e.id === id) || null;
  },

  addEnquiry(enquiry) {
    try {
      const enquiries = this.getEnquiries();
      const reasonVal = (enquiry.reason || "Wholesale Supply / Bulk Purchase").trim();
      const newEntry = {
        id: "enq-" + Date.now(),
        name: (enquiry.name || "Wholesale Buyer").trim(),
        company: enquiry.company ? enquiry.company.trim() : "Retail Store",
        phone: (enquiry.phone || "").trim(),
        town: (enquiry.town || "").trim(),
        reason: reasonVal,
        message: (enquiry.message || "").trim(),
        date: new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }),
        status: "New"
      };
      enquiries.unshift(newEntry);
      localStorage.setItem(STORAGE_KEYS.ENQUIRIES, JSON.stringify(enquiries));
      this.logActivity("New Enquiry Received", `${newEntry.company} - ${reasonVal}`);
      window.dispatchEvent(new CustomEvent("cms:enquiries-updated", { detail: enquiries }));
      return newEntry;
    } catch (e) {
      return null;
    }
  },

  updateEnquiryStatus(id, status) {
    try {
      let enquiries = this.getEnquiries();
      enquiries = enquiries.map(e => e.id === id ? { ...e, status: status } : e);
      localStorage.setItem(STORAGE_KEYS.ENQUIRIES, JSON.stringify(enquiries));
      this.logActivity("Enquiry Status Changed", `${id} -> ${status}`);
      window.dispatchEvent(new CustomEvent("cms:enquiries-updated", { detail: enquiries }));
      return true;
    } catch (e) {
      return false;
    }
  },

  deleteEnquiry(id) {
    try {
      let enquiries = this.getEnquiries();
      enquiries = enquiries.filter(item => item.id !== id);
      localStorage.setItem(STORAGE_KEYS.ENQUIRIES, JSON.stringify(enquiries));
      this.logActivity("Enquiry Deleted", id);
      window.dispatchEvent(new CustomEvent("cms:enquiries-updated", { detail: enquiries }));
      return true;
    } catch (e) {
      return false;
    }
  },

  clearAllEnquiries() {
    try {
      localStorage.setItem(STORAGE_KEYS.ENQUIRIES, JSON.stringify([]));
      this.logActivity("All Enquiries Cleared", "Trash");
      window.dispatchEvent(new CustomEvent("cms:enquiries-updated", { detail: [] }));
      return true;
    } catch (e) {
      return false;
    }
  },

  // --- 8. System Backup, Import & Factory Reset ---
  resetDefaults() {
    return this.resetToFactoryDefaults();
  },

  resetToFactoryDefaults() {
    localStorage.setItem(STORAGE_KEYS.HOME, JSON.stringify(DEFAULT_HOME_DATA));
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(DEFAULT_FEATURED_PRODUCTS));
    localStorage.setItem(STORAGE_KEYS.FACILITY, JSON.stringify(DEFAULT_FACILITY_DATA));
    localStorage.setItem(STORAGE_KEYS.TEAM, JSON.stringify(DEFAULT_TEAM));
    localStorage.setItem(STORAGE_KEYS.CONTACT, JSON.stringify(DEFAULT_CONTACT_DATA));
    localStorage.setItem(STORAGE_KEYS.BRANDS, JSON.stringify(DEFAULT_BRANDS));
    localStorage.setItem(STORAGE_KEYS.ENQUIRIES, JSON.stringify(DEFAULT_ENQUIRIES));

    this.logActivity("Factory Reset Performed", "All defaults restored");

    window.dispatchEvent(new CustomEvent("cms:home-updated", { detail: DEFAULT_HOME_DATA }));
    window.dispatchEvent(new CustomEvent("cms:products-updated", { detail: DEFAULT_FEATURED_PRODUCTS }));
    window.dispatchEvent(new CustomEvent("cms:facility-updated", { detail: DEFAULT_FACILITY_DATA }));
    window.dispatchEvent(new CustomEvent("cms:team-updated", { detail: DEFAULT_TEAM }));
    window.dispatchEvent(new CustomEvent("cms:contact-updated", { detail: DEFAULT_CONTACT_DATA }));
    window.dispatchEvent(new CustomEvent("cms:brands-updated", { detail: DEFAULT_BRANDS }));
    window.dispatchEvent(new CustomEvent("cms:enquiries-updated", { detail: DEFAULT_ENQUIRIES }));
    return true;
  },

  exportDatabaseJSON() {
    return this.exportDatabaseSnapshot();
  },

  exportDatabaseSnapshot() {
    const data = {
      home: this.getHomeData(),
      products: this.getFeaturedProducts(),
      facility: this.getFacilityData(),
      team: this.getTeam(),
      contact: this.getContactData(),
      brands: this.getBrands(),
      enquiries: this.getEnquiries(),
      exportedAt: new Date().toISOString()
    };
    return JSON.stringify(data, null, 2);
  },

  importDatabaseJSON(jsonStr) {
    return this.importDatabaseSnapshot(jsonStr);
  },

  importDatabaseSnapshot(jsonStr) {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.home) this.saveHomeData(parsed.home);
      if (parsed.products) this.saveFeaturedProducts(parsed.products);
      if (parsed.facility) this.saveFacilityData(parsed.facility);
      if (parsed.team) this.saveTeam(parsed.team);
      if (parsed.contact) this.saveContactData(parsed.contact);
      if (parsed.brands) this.saveBrands(parsed.brands);
      if (parsed.enquiries) {
        localStorage.setItem(STORAGE_KEYS.ENQUIRIES, JSON.stringify(parsed.enquiries));
        window.dispatchEvent(new CustomEvent("cms:enquiries-updated", { detail: parsed.enquiries }));
      }
      this.logActivity("Database Restored", "Imported from JSON snapshot");
      return true;
    } catch (e) {
      return false;
    }
  }
};

// Global export
window.CMS = CMS;
