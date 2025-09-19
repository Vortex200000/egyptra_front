// import { Link } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { MapPin, Clock, Star, Users } from "lucide-react";
// import { Tour } from "@/data/tours";

// interface TourCardProps {
//   tour: Tour;
//   variant?: "default" | "featured";
// }

// const TourCard = ({ tour, variant = "default" }: TourCardProps) => {
//   return (
//     <Card
//       className={`group overflow-hidden transition-smooth hover:shadow-card ${
//         variant === "featured" ? "shadow-glow" : ""
//       }`}
//     >
//       <div className="relative overflow-hidden">
//         <img
//           src={tour.image}
//           alt={tour.name}
//           className="w-full h-48 object-cover transition-smooth group-hover:scale-110"
//         />
//         <div className="absolute top-4 left-4">
//           <Badge variant="secondary" className="bg-white/90 text-primary">
//             {tour.category}
//           </Badge>
//         </div>
//         <div className="absolute top-4 right-4 bg-white/90 rounded-full px-2 py-1 flex items-center text-sm">
//           <Star className="h-3 w-3 text-yellow-500 fill-yellow-500 mr-1" />
//           <span className="text-xs font-medium">{tour.rating}</span>
//         </div>
//       </div>

//       <CardContent className="p-6">
//         <div className="space-y-3">
//           <div>
//             <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-smooth">
//               {tour.name}
//             </h3>
//             <div className="flex items-center text-muted-foreground mt-1">
//               <MapPin className="h-4 w-4 mr-1" />
//               <span className="text-sm">{tour.location}</span>
//             </div>
//           </div>

//           <div className="flex items-center justify-between text-sm text-muted-foreground">
//             <div className="flex items-center">
//               <Clock className="h-4 w-4 mr-1" />
//               {tour.duration}
//             </div>
//             <div className="flex items-center">
//               <Users className="h-4 w-4 mr-1" />
//               Up to {tour.maxCapacity}
//             </div>
//           </div>

//           <p className="text-muted-foreground text-sm line-clamp-2">
//             {tour.description}
//           </p>

//           <div className="flex items-center justify-between pt-2">
//             <div className="text-2xl font-bold text-primary">
//               ${tour.price.toLocaleString()}
//             </div>
//             <div className="space-x-2">
//               <Link to={`/tour/${tour.id}`}>
//                 <Button variant="outline" size="sm">
//                   View Details
//                 </Button>
//               </Link>
//               <Link to={`/booking/${tour.id}`}>
//                 <Button variant="book" size="sm">
//                   Book Now
//                 </Button>
//               </Link>
//             </div>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// export default TourCard;
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Star, Users } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
export interface ApiTour {
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

interface TourCardProps {
  tour: ApiTour;
}

const TourCard = ({ tour }: TourCardProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const handleBookNow = () => {
    if (!user) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to book this tour.",
        variant: "destructive",
      });
      navigate("/auth", {
        state: { from: { pathname: `/booking/${tour.id}` } },
      });
      return;
    }
    navigate(`/booking/${tour.id}`);
  };

  return (
    <Card className="group overflow-hidden transition-smooth hover:shadow-card">
      <div className="relative overflow-hidden">
        <img
          src={tour.cover_photo}
          alt={tour.title}
          className="w-full h-48 object-cover transition-smooth group-hover:scale-110"
        />
        <div className="absolute top-4 left-4">
          <Badge variant="secondary" className="bg-white/90 text-primary">
            {tour.difficulty}
          </Badge>
        </div>
        <div className="absolute top-4 right-4 bg-white/90 rounded-full px-2 py-1 flex items-center text-sm">
          <Star className="h-3 w-3 text-yellow-500 fill-yellow-500 mr-1" />
          <span className="text-xs font-medium">
            {parseFloat(tour.rating).toFixed(1)}
          </span>
        </div>
      </div>

      <CardContent className="p-6">
        <div className="space-y-3">
          <div>
            <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-smooth">
              {tour.title}
            </h3>
            <div className="flex items-center text-muted-foreground mt-1">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="text-sm">{tour.location}</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {tour.duration}
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              Up to {tour.max_persons}
            </div>
          </div>

          <p className="text-muted-foreground text-sm line-clamp-2">
            {tour.short_description}
          </p>

          <div className="flex items-center justify-between pt-2">
            <div className="text-2xl font-bold text-primary">
              ${parseFloat(tour.price).toLocaleString()}
            </div>
            <div className="space-x-2">
              <Link to={`/tour/${tour.id}`}>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </Link>
              <Button variant="book" size="sm" onClick={handleBookNow}>
                Book Now
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TourCard;
