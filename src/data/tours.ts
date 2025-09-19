export interface Tour {
  id: number;
  name: string;
  location: string;
  duration: string;
  price: number;
  image: string;
  category: string;
  description: string;
  highlights: string[];
  itinerary: string[];
  availableDates: string[];
  maxCapacity: number;
  rating: number;
  reviews: number;
}

export const tours: Tour[] = [
  {
    id: 1,
    name: "Tropical Paradise Escape",
    location: "Maldives",
    duration: "7 days",
    price: 2499,
    image: "/src/assets/tour-beach.jpg",
    category: "Beach",
    description: "Experience the ultimate tropical getaway in the pristine waters of the Maldives. Enjoy crystal-clear lagoons, white sandy beaches, and luxury overwater bungalows.",
    highlights: [
      "Overwater bungalow accommodation",
      "Snorkeling with tropical fish",
      "Sunset dolphin cruise",
      "Private beach dinners",
      "Spa treatments"
    ],
    itinerary: [
      "Day 1: Arrival and welcome dinner",
      "Day 2-3: Island hopping and snorkeling",
      "Day 4-5: Water sports and relaxation",
      "Day 6: Cultural village visit",
      "Day 7: Departure"
    ],
    availableDates: ["2024-03-15", "2024-04-20", "2024-05-25", "2024-06-30"],
    maxCapacity: 20,
    rating: 4.9,
    reviews: 156
  },
  {
    id: 2,
    name: "Alpine Adventure Trek",
    location: "Swiss Alps",
    duration: "10 days",
    price: 3299,
    image: "/src/assets/tour-mountain.jpg",
    category: "Adventure",
    description: "Embark on an unforgettable journey through the majestic Swiss Alps. Experience breathtaking mountain views, challenging hikes, and authentic Alpine culture.",
    highlights: [
      "Mountain hut accommodations",
      "Professional mountain guides",
      "Alpine lakes and glaciers",
      "Traditional Swiss cuisine",
      "Cable car experiences"
    ],
    itinerary: [
      "Day 1-2: Arrival in Zermatt",
      "Day 3-4: Gornergrat and Matterhorn views",
      "Day 5-6: Hiking to mountain huts",
      "Day 7-8: Glacier trekking",
      "Day 9-10: Return journey"
    ],
    availableDates: ["2024-06-01", "2024-07-15", "2024-08-20", "2024-09-10"],
    maxCapacity: 12,
    rating: 4.8,
    reviews: 203
  },
  {
    id: 3,
    name: "Ancient Wonders Discovery",
    location: "Egypt",
    duration: "8 days",
    price: 1899,
    image: "/src/assets/tour-cultural.jpg",
    category: "Cultural",
    description: "Discover the mysteries of ancient Egypt with visits to iconic pyramids, temples, and archaeological sites. Learn about pharaohs, hieroglyphs, and ancient civilizations.",
    highlights: [
      "Great Pyramid of Giza",
      "Valley of the Kings",
      "Luxor Temple complex",
      "Nile River cruise",
      "Expert Egyptologist guides"
    ],
    itinerary: [
      "Day 1: Cairo arrival and Giza pyramids",
      "Day 2-3: Egyptian Museum and Old Cairo",
      "Day 4-5: Luxor temples and tombs",
      "Day 6-7: Nile cruise to Aswan",
      "Day 8: Departure from Cairo"
    ],
    availableDates: ["2024-10-05", "2024-11-12", "2024-12-10", "2025-01-15"],
    maxCapacity: 25,
    rating: 4.7,
    reviews: 184
  },
  {
    id: 4,
    name: "Safari Wildlife Experience",
    location: "Kenya",
    duration: "9 days",
    price: 2799,
    image: "/src/assets/tour-beach.jpg",
    category: "Wildlife",
    description: "Experience the thrill of African wildlife in their natural habitat. Witness the Great Migration, spot the Big Five, and enjoy luxury safari lodges.",
    highlights: [
      "Masai Mara game drives",
      "Big Five wildlife viewing",
      "Masai village cultural visit",
      "Luxury safari lodges",
      "Professional safari guides"
    ],
    itinerary: [
      "Day 1-2: Nairobi and transfer to Masai Mara",
      "Day 3-5: Game drives and wildlife viewing",
      "Day 6-7: Cultural experiences",
      "Day 8-9: Return to Nairobi"
    ],
    availableDates: ["2024-07-20", "2024-08-15", "2024-09-25", "2024-10-30"],
    maxCapacity: 16,
    rating: 4.9,
    reviews: 127
  },
  {
    id: 5,
    name: "Northern Lights Adventure",
    location: "Iceland",
    duration: "6 days",
    price: 2199,
    image: "/src/assets/tour-mountain.jpg",
    category: "Adventure",
    description: "Chase the magical Northern Lights across Iceland's dramatic landscapes. Experience geysers, waterfalls, and the unique beauty of the Nordic wilderness.",
    highlights: [
      "Northern Lights viewing",
      "Blue Lagoon geothermal spa",
      "Golden Circle tour",
      "Ice cave exploration",
      "Reykjavik city tour"
    ],
    itinerary: [
      "Day 1: Arrival in Reykjavik",
      "Day 2-3: Golden Circle and Northern Lights",
      "Day 4-5: South Coast and ice caves",
      "Day 6: Blue Lagoon and departure"
    ],
    availableDates: ["2024-11-01", "2024-12-15", "2025-01-20", "2025-02-10"],
    maxCapacity: 18,
    rating: 4.8,
    reviews: 172
  },
  {
    id: 6,
    name: "Mediterranean Coastal Cruise",
    location: "Greece & Italy",
    duration: "12 days",
    price: 3599,
    image: "/src/assets/tour-cultural.jpg",
    category: "Cultural",
    description: "Sail through the stunning Mediterranean, visiting ancient Greek islands and Italian coastal towns. Experience rich history, delicious cuisine, and breathtaking sunsets.",
    highlights: [
      "Luxury cruise ship accommodation",
      "Santorini sunset viewing",
      "Rome and Athens guided tours",
      "Traditional Mediterranean cuisine",
      "Island hopping adventures"
    ],
    itinerary: [
      "Day 1-2: Rome embarkation",
      "Day 3-4: Santorini and Mykonos",
      "Day 5-6: Crete and Rhodes",
      "Day 7-8: Turkish coast",
      "Day 9-10: Naples and Sicily",
      "Day 11-12: Return to Rome"
    ],
    availableDates: ["2024-05-10", "2024-06-20", "2024-09-05", "2024-10-15"],
    maxCapacity: 100,
    rating: 4.6,
    reviews: 298
  }
];

export const categories = ["All", "Beach", "Adventure", "Cultural", "Wildlife"];