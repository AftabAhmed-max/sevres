// src/lib/constants.ts

export const SALON = {
  name: "Sèvres & Co.",
  tagline: "Where refinement is ritual.",
  email: "hello@sevresandco.com",
  phone: "+91 98200 12345",
  address: {
    line1: "14, Linking Road",
    line2: "Bandra West",
    city: "Mumbai",
    state: "Maharashtra",
    pin: "400050",
    country: "India",
    full: "14, Linking Road, Bandra West, Mumbai 400050",
  },
  hours: {
    weekdays: "Tuesday – Saturday: 10:00 AM – 8:00 PM",
    sunday: "Sunday: 11:00 AM – 6:00 PM",
    monday: "Monday: Closed",
    short: {
      "Tuesday – Saturday": "10:00 AM – 8:00 PM",
      "Sunday": "11:00 AM – 6:00 PM",
      "Monday": "Closed",
    },
  },
  social: {
    instagram: "https://instagram.com/sevresandco",
    facebook: "https://facebook.com/sevresandco",
    pinterest: "https://pinterest.com/sevresandco",
  },
  map: {
    // OpenStreetMap embed — never Google Maps
    embedUrl:
      "https://www.openstreetmap.org/export/embed.html?bbox=72.8250%2C19.0530%2C72.8350%2C19.0620&layer=mapnik&marker=19.0596%2C72.8295",
    lat: 19.0596,
    lng: 72.8295,
  },
} as const;

// ─────────────────────────────────────────────
// BOOKING CONFIG
// ─────────────────────────────────────────────

export const BOOKING = {
  // Time slots generated from open to close, every 30 min
  slotDurationMinutes: 30,
  firstSlot: "10:00",
  lastSlot: "19:30", // last bookable start time
  sundayFirstSlot: "11:00",
  sundayLastSlot: "17:30",

  // Statuses stored in Supabase
  status: {
    PENDING: "pending",
    CONFIRMED: "confirmed",
    CANCELLED: "cancelled",
  } as const,

  // Days salon is closed (0 = Sunday open, 1 = Monday closed)
  closedDays: [1], // Monday
} as const;

// ─────────────────────────────────────────────
// SERVICE CATEGORIES
// ─────────────────────────────────────────────

export const SERVICE_CATEGORIES = [
  { id: "hair",    label: "Hair",    icon: "✦" },
  { id: "skin",    label: "Skin",    icon: "✦" },
  { id: "nails",   label: "Nails",   icon: "✦" },
  { id: "massage", label: "Massage", icon: "✦" },
] as const;

export type ServiceCategory = typeof SERVICE_CATEGORIES[number]["id"];

// ─────────────────────────────────────────────
// SEED SERVICES (used to populate Supabase initially)
// ─────────────────────────────────────────────

export const SEED_SERVICES = [
  // HAIR — 5 services
  {
    name: "Signature Blowout",
    category: "hair",
    duration: 60,
    price: 2500,
    description: "A luxurious wash, condition, and style tailored to your hair type.",
    active: true,
  },
  {
    name: "Full Colour",
    category: "hair",
    duration: 120,
    price: 6500,
    description: "All-over colour with premium Wella or L'Oréal Professionnel shades.",
    active: true,
  },
  {
    name: "Balayage & Highlights",
    category: "hair",
    duration: 150,
    price: 9500,
    description: "Hand-painted highlights for a natural, sun-kissed dimension.",
    active: true,
  },
  {
    name: "Keratin Smoothing Treatment",
    category: "hair",
    duration: 180,
    price: 11000,
    description: "Frizz-free, glossy results that last up to four months.",
    active: true,
  },
  {
    name: "Precision Haircut",
    category: "hair",
    duration: 60,
    price: 1800,
    description: "A tailored cut crafted to your face shape and lifestyle.",
    active: true,
  },

  // SKIN — 4 services
  {
    name: "Classic European Facial",
    category: "skin",
    duration: 75,
    price: 3500,
    description: "Deep cleanse, exfoliation, and hydration for luminous skin.",
    active: true,
  },
  {
    name: "Gold Radiance Facial",
    category: "skin",
    duration: 90,
    price: 5500,
    description: "24K gold-infused treatment to firm, brighten, and rejuvenate.",
    active: true,
  },
  {
    name: "Microdermabrasion",
    category: "skin",
    duration: 60,
    price: 4200,
    description: "Crystal exfoliation to resurface and refine skin texture.",
    active: true,
  },
  {
    name: "LED Light Therapy",
    category: "skin",
    duration: 45,
    price: 3000,
    description: "Red and blue light therapy to target acne, ageing, and inflammation.",
    active: true,
  },

  // NAILS — 4 services
  {
    name: "Classic Manicure",
    category: "nails",
    duration: 45,
    price: 1200,
    description: "Shaping, cuticle care, and polish with your choice of colour.",
    active: true,
  },
  {
    name: "Gel Manicure",
    category: "nails",
    duration: 60,
    price: 1800,
    description: "Long-lasting gel colour cured under UV for a flawless, chip-free finish.",
    active: true,
  },
  {
    name: "Luxury Spa Pedicure",
    category: "nails",
    duration: 75,
    price: 2200,
    description: "Soak, scrub, mask, and polish — a complete foot revival ritual.",
    active: true,
  },
  {
    name: "Nail Art & Extensions",
    category: "nails",
    duration: 90,
    price: 3500,
    description: "Bespoke nail extensions with hand-painted art by our nail artists.",
    active: true,
  },

  // MASSAGE — 4 services
  {
    name: "Swedish Relaxation Massage",
    category: "massage",
    duration: 60,
    price: 3800,
    description: "Gentle, flowing strokes to melt tension and restore calm.",
    active: true,
  },
  {
    name: "Deep Tissue Massage",
    category: "massage",
    duration: 75,
    price: 4500,
    description: "Targeted pressure on deep muscle layers for lasting relief.",
    active: true,
  },
  {
    name: "Hot Stone Ritual",
    category: "massage",
    duration: 90,
    price: 5800,
    description: "Warmed basalt stones combined with aromatherapy oil for profound relaxation.",
    active: true,
  },
  {
    name: "Himalayan Salt Scrub",
    category: "massage",
    duration: 60,
    price: 4200,
    description: "Full-body exfoliation with mineral-rich Himalayan salt and nourishing oils.",
    active: true,
  },
] as const;

// ─────────────────────────────────────────────
// SEED STYLISTS
// ─────────────────────────────────────────────

export const SEED_STYLISTS = [
  {
    name: "Isabelle Morel",
    bio: "Trained at Vidal Sassoon London, Isabelle brings 14 years of colour mastery to every appointment. Her balayage technique is sought after by Mumbai's most discerning clientele.",
    specialties: ["Balayage", "Colour", "Keratin"],
    active: true,
  },
  {
    name: "Priya Nair",
    bio: "A certified skin therapist with advanced training in LED therapy and gold facials. Priya believes radiant skin begins with understanding the individual.",
    specialties: ["Facials", "LED Therapy", "Microdermabrasion"],
    active: true,
  },
  {
    name: "Zara Khan",
    bio: "Nail artist and extension specialist with a background in fine art. Zara's nail designs have been featured in Vogue India and Elle Beauty.",
    specialties: ["Nail Art", "Gel", "Extensions"],
    active: true,
  },
  {
    name: "Amélie Dupont",
    bio: "A holistic therapist trained in Bali and Paris, Amélie's massage treatments are rituals in themselves. Her hot stone sessions are fully booked weeks in advance.",
    specialties: ["Hot Stone", "Swedish", "Deep Tissue"],
    active: true,
  },
  {
    name: "Rohan Mehta",
    bio: "Precision haircut specialist with a decade of experience at luxury salons in Dubai and Mumbai. Rohan's style philosophy: structure first, beauty follows.",
    specialties: ["Haircut", "Blowout", "Styling"],
    active: true,
  },
  {
    name: "Sofia Alves",
    bio: "Brazilian-born spa therapist specialising in body rituals and scrubs. Sofia's Himalayan Salt Scrub has a devoted following among Sèvres regulars.",
    specialties: ["Body Rituals", "Scrubs", "Relaxation"],
    active: true,
  },
] as const;

// ─────────────────────────────────────────────
// NAVIGATION LINKS
// ─────────────────────────────────────────────

export const NAV_LINKS = [
  { label: "Home",       href: "/" },
  { label: "Services",   href: "/services" },
  { label: "Book",       href: "/book" },
  { label: "About",      href: "/about" },
  { label: "Contact",    href: "/contact" },
  { label: "My Account", href: "/account" },
] as const;

// ─────────────────────────────────────────────
// TESTIMONIALS (static — no DB needed)
// ─────────────────────────────────────────────

export const TESTIMONIALS = [
  {
    name: "Aanya Sharma",
    role: "Regular Client",
    text: "Sèvres has completely ruined every other salon for me. Isabelle's balayage is a work of art and the atmosphere makes you feel like you've stepped into Paris.",
    rating: 5,
  },
  {
    name: "Meera Kapoor",
    role: "Skin & Wellness Client",
    text: "Priya's Gold Radiance Facial left my skin glowing for weeks. The attention to detail, the products, the calm — nothing in Mumbai comes close.",
    rating: 5,
  },
  {
    name: "Tara Malhotra",
    role: "Nail Art Enthusiast",
    text: "Zara is a genius. I came in with a vague idea and left with nails that stopped strangers on the street. Booking is effortless and the space is gorgeous.",
    rating: 5,
  },
  {
    name: "Rina D'Souza",
    role: "Spa Regular",
    text: "Amélie's hot stone ritual is the only thing that truly resets me after a brutal week. I leave feeling like a completely different person.",
    rating: 5,
  },
  {
    name: "Kavya Reddy",
    role: "New Client",
    text: "I booked on a whim and now I'm a convert. From the moment you walk in to the final blow-dry, every detail is considered. Truly exceptional.",
    rating: 5,
  },
] as const;

// ─────────────────────────────────────────────
// HOW IT WORKS STEPS
// ─────────────────────────────────────────────

export const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Choose Your Service",
    description:
      "Browse our curated menu of hair, skin, nail, and massage treatments. Every service is designed to deliver a premium, results-driven experience.",
  },
  {
    step: "02",
    title: "Select Your Specialist",
    description:
      "Choose from our team of internationally trained specialists, each with their own area of mastery and a devoted clientele.",
  },
  {
    step: "03",
    title: "Confirm Your Ritual",
    description:
      "Pick your preferred date and time, review your booking summary, and confirm. A detailed confirmation is sent to your inbox instantly.",
  },
] as const;

// ─────────────────────────────────────────────
// ADMIN
// ─────────────────────────────────────────────

export const ADMIN = {
  sessionKey: "sevres_admin_session",
  sessionDuration: 1000 * 60 * 60 * 8, // 8 hours in ms
} as const;

// ─────────────────────────────────────────────
// FEATURED SERVICES (shown on home page preview)
// ─────────────────────────────────────────────

export const FEATURED_SERVICE_NAMES = [
  "Balayage & Highlights",
  "Gold Radiance Facial",
  "Hot Stone Ritual",
  "Nail Art & Extensions",
] as const;

// ─────────────────────────────────────────────
// GALLERY IMAGES (Unsplash — atmospheric, no people)
// ─────────────────────────────────────────────

export const GALLERY_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&q=80",
    alt: "Salon interior with warm lighting",
  },
  {
    src: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80",
    alt: "Beauty treatment in progress",
  },
  {
    src: "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?w=600&q=80",
    alt: "Luxury skincare products",
  },
  {
    src: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=600&q=80",
    alt: "Nail art detail",
  },
  {
    src: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80",
    alt: "Facial treatment",
  },
  {
    src: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&q=80",
    alt: "Spa relaxation",
  },
] as const;