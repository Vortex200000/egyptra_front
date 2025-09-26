export interface Review {
  id: number;
  userName: string;
  avatar: string;
  rating: number;
  tourId: number;
  tourName: string;
  date: string;
  title: string;
  content: string;
  helpful: number;
  images?: string[];
}

// In-memory storage for reviews (UI only)
let reviewsState: Review[] = [
  {
    id: 1,
    userName: "Sarah Johnson",
    avatar: "SJ",
    rating: 5,
    tourId: 1,
    tourName: "Great Pyramids & Sphinx Discovery",
    date: "2024-02-15",
    title: "Absolutely breathtaking experience!",
    content: "The pyramids exceeded all my expectations. Our guide Ahmed was incredibly knowledgeable and passionate about Egyptian history. Going inside the Great Pyramid was a once-in-a-lifetime experience. The sunset camel ride was magical!",
    helpful: 24,
    images: ["/src/assets/egyptian-pyramids.jpg"]
  },
  {
    id: 2,
    userName: "Michael Chen",
    avatar: "MC",
    rating: 5,
    tourId: 2,
    tourName: "Luxor Temple & Valley of Kings",
    date: "2024-01-28",
    title: "History comes alive in Luxor",
    content: "Visiting Tutankhamun's tomb was incredible. The hot air balloon ride over the Valley of Kings at sunrise is something I'll never forget. The Karnak Temple complex is massive and beautiful. Highly recommend this tour!",
    helpful: 18,
    images: ["/src/assets/egyptian-valley-kings.jpg"]
  },
  {
    id: 3,
    userName: "Emma Rodriguez",
    avatar: "ER",
    rating: 5,
    tourId: 3,
    tourName: "Nile River Luxury Cruise",
    date: "2024-01-10",
    title: "Luxury and history combined perfectly",
    content: "The cruise ship was absolutely luxurious with amazing service. Abu Simbel was jaw-dropping - the scale and preservation are remarkable. Sailing the Nile while watching ancient temples pass by felt like traveling through time.",
    helpful: 31,
    images: ["/src/assets/egyptian-nile.jpg"]
  },
  {
    id: 4,
    userName: "David Thompson",
    avatar: "DT",
    rating: 5,
    tourId: 4,
    tourName: "Red Sea Diving Adventure",
    date: "2023-12-20",
    title: "Best diving experience ever!",
    content: "The coral reefs are pristine and the marine life is incredible. Saw dolphins, sea turtles, and countless colorful fish species. The dive instructors were professional and made sure everyone felt safe. Ras Mohammed is truly a underwater paradise.",
    helpful: 15,
    images: ["/src/assets/egyptian-red-sea.jpg"]
  },
  {
    id: 5,
    userName: "Lisa Anderson",
    avatar: "LA",
    rating: 4,
    tourId: 5,
    tourName: "Siwa Oasis Desert Safari",
    date: "2023-12-05",
    title: "Off the beaten path adventure",
    content: "Siwa Oasis is a hidden gem! The desert safari was thrilling and the stargazing at night was spectacular. Cleopatra's Pool was refreshing after a day in the desert. The Berber culture experience was authentic and heartwarming.",
    helpful: 22,
    images: ["/src/assets/egyptian-siwa-oasis.jpg"]
  },
  {
    id: 6,
    userName: "Ahmed Hassan",
    avatar: "AH",
    rating: 5,
    tourId: 6,
    tourName: "Ancient Temples of Upper Egypt",
    date: "2023-11-18",
    title: "Comprehensive temple tour",
    content: "As an Egyptian, I was impressed by how well this tour showcased our ancient heritage. Abu Simbel at sunrise is magnificent. The Egyptologist guide provided fascinating insights into hieroglyphics and ancient Egyptian beliefs.",
    helpful: 28,
    images: ["/src/assets/egyptian-temple.jpg"]
  },
  {
    id: 7,
    userName: "Jennifer Williams",
    avatar: "JW",
    rating: 5,
    tourId: 1,
    tourName: "Great Pyramids & Sphinx Discovery",
    date: "2023-11-03",
    title: "Bucket list experience completed!",
    content: "Standing next to the Great Pyramid makes you feel so small yet connected to history. The Egyptian Museum was fascinating with so many artifacts. Khan el-Khalili bazaar shopping was fun and our guide helped us negotiate good prices.",
    helpful: 19
  },
  {
    id: 8,
    userName: "Robert Kumar",
    avatar: "RK",
    rating: 4,
    tourId: 3,
    tourName: "Nile River Luxury Cruise",
    date: "2023-10-22",
    title: "Relaxing way to see Egypt",
    content: "Perfect for those who want comfort while exploring. The meals on board were excellent with both international and Egyptian cuisine. The Nubian village visit was culturally enriching. Only wish we had more time at each temple.",
    helpful: 16
  },
  {
    id: 9,
    userName: "Maria Santos",
    avatar: "MS",
    rating: 5,
    tourId: 4,
    tourName: "Red Sea Diving Adventure",
    date: "2023-10-08",
    title: "Underwater wonderland",
    content: "Got my PADI certification during this trip! The instructors were patient and professional. The wreck diving was adventurous and the coral reefs are some of the most beautiful I've ever seen. Great for both beginners and experienced divers.",
    helpful: 21
  },
  {
    id: 10,
    userName: "James Miller",
    avatar: "JM",
    rating: 5,
    tourId: 2,
    tourName: "Luxor Temple & Valley of Kings",
    date: "2023-09-30",
    title: "Exceeded all expectations",
    content: "The preservation of the tomb paintings is remarkable. Our guide's storytelling brought ancient Egypt to life. The sound and light show at Karnak was spectacular. This tour is a must for anyone interested in ancient civilizations.",
    helpful: 26
  }
];

// Export reviews getter
export const getReviews = (): Review[] => {
  return reviewsState;
};

// Add new review function
export const addReview = (review: Review): void => {
  reviewsState = [review, ...reviewsState];
};

export const getReviewsByTourId = (tourId: number): Review[] => {
  return reviewsState.filter(review => review.tourId === tourId);
};

export const getAverageRating = (): number => {
  const totalRating = reviewsState.reduce((sum, review) => sum + review.rating, 0);
  return Number((totalRating / reviewsState.length).toFixed(1));
};

export const getTotalReviews = (): number => {
  return reviewsState.length;
};