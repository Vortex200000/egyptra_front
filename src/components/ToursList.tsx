// import { useEffect, useState } from "react";
// import TourCard from "@/components/TourCard";

// interface Tour {
//   id: string;
//   title: string;
//   short_description: string;
//   location: string;
//   price: string;
//   duration: string;
//   max_persons: number;
//   cover_photo: string;
//   rating: string;
//   difficulty: string;
// }

// interface Props {
//   searchTerm?: string;
//   category?: string;
//   sortBy?: string;
//   limit?: number;
// }

// const TourList = ({
//   searchTerm = "",
//   category = "All",
//   sortBy = "name",
//   limit,
// }: Props) => {
//   const [tours, setTours] = useState<Tour[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchTours = async () => {
//       try {
//         const res = await fetch("http://127.0.0.1:8000/api/tours/");
//         const data = await res.json();
//         setTours(data.results);
//       } catch (err) {
//         console.error("Failed to fetch tours", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTours();
//   }, []);

//   // Filtering
//   let filtered = tours.filter((tour) => {
//     const matchesSearch =
//       tour.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       tour.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       tour.short_description.toLowerCase().includes(searchTerm.toLowerCase());

//     const matchesCategory = category === "All" || tour.difficulty === category;

//     return matchesSearch && matchesCategory;
//   });

//   // Sorting
//   filtered = filtered.sort((a, b) => {
//     switch (sortBy) {
//       case "price-low":
//         return parseFloat(a.price) - parseFloat(b.price);
//       case "price-high":
//         return parseFloat(b.price) - parseFloat(a.price);
//       case "rating":
//         return parseFloat(b.rating) - parseFloat(a.rating);
//       case "duration":
//         return parseInt(a.duration) - parseInt(b.duration);
//       default:
//         return a.title.localeCompare(b.title);
//     }
//   });

//   // Limit
//   if (limit) filtered = filtered.slice(0, limit);

//   if (loading) return <p className="text-center py-12">Loading tours...</p>;

//   if (filtered.length === 0) {
//     return (
//       <div className="text-center py-16">
//         <div className="text-6xl mb-4">🔍</div>
//         <h3 className="text-2xl font-semibold text-foreground mb-2">
//           No tours found
//         </h3>
//         <p className="text-muted-foreground mb-6">
//           Try adjusting your search criteria or browse all tours.
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//       {filtered.map((tour) => (
//         <TourCard key={tour.id} tour={tour} />
//       ))}
//     </div>
//   );
// };

// export default TourList;
import { useEffect, useState } from "react";
import TourCard from "@/components/TourCard";
import { API_URL } from "../config/api";
interface Tour {
  id: string;
  title: string;
  short_description: string;
  location: string;
  price: string;
  duration: string;
  max_persons: number;
  cover_photo: string;
  rating: string;
  difficulty: string;
}

interface Props {
  searchTerm?: string;
  category?: string;
  sortBy?: string;
  limit?: number;
}

const TourList = ({
  searchTerm = "",
  category = "all", // ✅ default lowercase
  sortBy = "name",
  limit,
}: Props) => {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const res = await fetch(`${API_URL}/api/tours/`);
        const data = await res.json();
        setTours(data.results || data); // ✅ support both paginated and plain list
      } catch (err) {
        console.error("Failed to fetch tours", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

  // Filtering
  let filtered = tours.filter((tour) => {
    const matchesSearch =
      tour.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tour.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tour.short_description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      category === "all" || tour.difficulty.toLowerCase() === category;

    return matchesSearch && matchesCategory;
  });

  // Sorting
  filtered = filtered.sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return parseFloat(a.price) - parseFloat(b.price);
      case "price-high":
        return parseFloat(b.price) - parseFloat(a.price);
      case "rating":
        return parseFloat(b.rating) - parseFloat(a.rating);
      case "duration":
        return parseInt(a.duration) - parseInt(b.duration);
      default:
        return a.title.localeCompare(b.title);
    }
  });

  // Limit
  if (limit) filtered = filtered.slice(0, limit);

  if (loading) return <p className="text-center py-12">Loading tours...</p>;

  if (filtered.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-2xl font-semibold text-foreground mb-2">
          No tours found
        </h3>
        <p className="text-muted-foreground mb-6">
          Try adjusting your search criteria or browse all tours.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {filtered.map((tour) => (
        <TourCard key={tour.id} tour={tour} />
      ))}
    </div>
  );
};

export default TourList;
