// import { useParams, Link } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import Navigation from "@/components/Navigation";
// import Footer from "@/components/Footer";
// import ChatWidget from "@/components/ChatWidget";
// import { API_URL } from "@/config/api";
// import {
//   MapPin,
//   Clock,
//   Users,
//   Star,
//   Calendar,
//   Check,
//   ArrowLeft,
// } from "lucide-react";

// interface Tour {
//   id: number;
//   name: string;
//   location: string;
//   description: string;
//   image: string;
//   category: string;
//   duration: string;
//   maxCapacity: number;
//   rating: number;
//   reviews: number;
//  availableDates: Array<{
//     id: number;
//     date: string;
//     start_time: string;
//     end_time: string;
//     spots: number;
//   }>;
//   highlights: string[];
//   itinerary: string[];
//   price: number;
// }

// const TourDetails = () => {
//   const { id } = useParams<{ id: string }>();
//   const [tour, setTour] = useState<Tour | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchTour = async () => {
//       try {
//         const response = await fetch(`${API_URL}/api/tours/${id}/`);
//         if (!response.ok) throw new Error("Tour not found");
//         const data = await response.json();

//         // Map API fields to your frontend model
//         const mappedTour: Tour = {
//           id: data.id,
//           name: data.title,
//           location: data.location,
//           description: data.description,
//           image: data.cover_photo,
//           category: data.category ?? "Uncategorized",
//           duration: data.duration,
//           maxCapacity: data.max_persons,
//           rating: parseFloat(data.rating),
//           reviews: data.review_count,
//           availableDates: data.availability_slots || [], // map correctly
//           highlights: data.includes_list || [],
//           itinerary: data.includes_list || [], // <-- if itinerary = includes_list
//           price: parseFloat(data.price),
//         };

//         setTour(mappedTour);
//       } catch (error) {
//         console.error("Error fetching tour:", error);
//         setTour(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTour();
//   }, [id]);

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-background flex items-center justify-center">
//         <p className="text-lg text-muted-foreground">Loading tour details...</p>
//       </div>
//     );
//   }

//   if (!tour) {
//     return (
//       <div className="min-h-screen bg-background">
//         <Navigation />
//         <div className="container mx-auto px-4 py-20 text-center">
//           <h1 className="text-4xl font-bold text-foreground mb-4">
//             Tour Not Found
//           </h1>
//           <p className="text-muted-foreground mb-8">
//             The tour you're looking for doesn't exist.
//           </p>
//           <Link to="/tours">
//             <Button variant="hero">Back to Tours</Button>
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       <Navigation />

//       {/* Hero Image Section */}
//       <section className="relative h-96 overflow-hidden">
//         <img
//           src={tour.image}
//           alt={tour.name}
//           className="w-full h-full object-cover"
//         />
//         <div className="absolute inset-0 bg-gradient-hero opacity-60" />
//         <div className="absolute bottom-8 left-8">
//           <Link to="/tours">
//             <Button
//               variant="outline"
//               className="mb-4 bg-white/10 border-white/30 text-white hover:bg-white hover:text-foreground"
//             >
//               <ArrowLeft className="h-4 w-4 mr-2" />
//               Back to Tours
//             </Button>
//           </Link>
//           <Badge
//             variant="secondary"
//             className="bg-white/90 text-primary mb-2 ml-4"
//           >
//             {" "}
//             {/* Added ml-4 */}
//             {tour.category}
//           </Badge>
//           <h1 className="text-4xl font-bold text-white mb-2">{tour.name}</h1>
//           <div className="flex items-center text-white/90">
//             <MapPin className="h-5 w-5 mr-2" />
//             <span className="text-lg">{tour.location}</span>
//           </div>
//         </div>
//       </section>

//       <div className="container mx-auto px-4 py-12">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
//           {/* Main Content */}
//           <div className="lg:col-span-2 space-y-8">
//             {/* Overview */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-2xl">Tour Overview</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <p className="text-muted-foreground text-lg leading-relaxed">
//                   {tour.description}
//                 </p>

//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
//                   <div className="text-center p-4 bg-gradient-sky rounded-lg">
//                     <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
//                     <div className="font-semibold">{tour.duration}</div>
//                     <div className="text-sm text-muted-foreground">
//                       Duration
//                     </div>
//                   </div>
//                   <div className="text-center p-4 bg-gradient-sky rounded-lg">
//                     <Users className="h-8 w-8 text-primary mx-auto mb-2" />
//                     <div className="font-semibold">
//                       Up to {tour.maxCapacity}
//                     </div>
//                     <div className="text-sm text-muted-foreground">
//                       Group Size
//                     </div>
//                   </div>
//                   <div className="text-center p-4 bg-gradient-sky rounded-lg">
//                     <Star className="h-8 w-8 text-primary mx-auto mb-2" />
//                     <div className="font-semibold">{tour.rating}/5</div>
//                     <div className="text-sm text-muted-foreground">
//                       {tour.reviews} Reviews
//                     </div>
//                   </div>
//                   <div className="text-center p-4 bg-gradient-sky rounded-lg">
//                     <Calendar className="h-8 w-8 text-primary mx-auto mb-2" />
//                     <div className="font-semibold">
//                       {tour.availableDates.length}
//                     </div>
//                     <div className="text-sm text-muted-foreground">
//                       Available Dates
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Highlights */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-2xl">Tour Highlights</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   {tour.highlights.map((highlight, index) => (
//                     <div key={index} className="flex items-start space-x-3">
//                       <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
//                       <span className="text-muted-foreground">{highlight}</span>
//                     </div>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Itinerary */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-2xl">Detailed Itinerary</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   {tour.itinerary.map((day, index) => (
//                     <div
//                       key={index}
//                       className="flex items-start space-x-4 p-4 bg-gradient-sky rounded-lg"
//                     >
//                       <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold flex-shrink-0">
//                         {index + 1}
//                       </div>
//                       <div className="text-muted-foreground">{day}</div>
//                     </div>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Booking Sidebar */}
//           <div className="lg:col-span-1">
//             <Card className="sticky top-8 shadow-glow">
//               <CardHeader>
//                 <CardTitle className="text-2xl text-center">
//                   <span className="text-3xl font-bold text-primary">
//                     ${tour.price.toLocaleString()}
//                   </span>
//                   <span className="text-lg text-muted-foreground ml-2">
//                     per person
//                   </span>
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-6">
//                 <div>
//                   <h4 className="font-semibold mb-3">Available Dates</h4>
//                   <div className="space-y-2">
//                     {tour.availableDates.map((slot) => (
//                       <div
//                         key={slot.id}
                        
//                         className="p-3 bg-gradient-sky rounded-lg text-center"
//                       >
//                         <div className="font-medium">
//                           {new Date(slot.date).toLocaleDateString("en-US", {
//                             weekday: "long",
//                             year: "numeric",
//                             month: "long",
//                             day: "numeric",
//                           })}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 <div className="space-y-3">
//                   <Link to={`/booking/${tour.id}`}>
//                     <Button
//                       variant="hero"
//                       size="lg"
//                       className="w-full text-lg py-4 bg-black text-primary hover:bg-primary hover:text-black transition"
//                     >
//                       Book This Tour
//                     </Button>
//                   </Link>
//                   <Link to="/chat">
//                     <Button variant="outline" size="lg" className="w-full">
//                       Ask Questions
//                     </Button>
//                   </Link>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </div>

//       <Footer />
//       <ChatWidget />
//     </div>
//   );
// };

// export default TourDetails;
// translations
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import { API_URL } from "@/config/api";
import {
  MapPin,
  Clock,
  Users,
  Star,
  Calendar,
  Check,
  ArrowLeft,
} from "lucide-react";

interface Tour {
  id: number;
  name: string;
  location: string;
  description: string;
  image: string;
  category: string;
  duration: string;
  maxCapacity: number;
  rating: number;
  reviews: number;
  availableDates: Array<{
    id: number;
    date: string;
    start_time: string;
    end_time: string;
    spots: number;
  }>;
  highlights: string[];
  itinerary: string[];
  excludes: string[];
  requirements : string;
  price: number;
}

const TourDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const { t, i18n } = useTranslation();

  const processRequirements = (requirementsString) => {
    if (!requirementsString) return [];
    
    return requirementsString
      .split(/\r?\n/) // Split by line breaks (handles both \n and \r\n)
      .map(item => item.trim()) // Remove whitespace
      .filter(item => item.length > 0); // Remove empty items
  };

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const response = await fetch(`${API_URL}/api/tours/${id}/`);
        if (!response.ok) throw new Error("Tour not found");
        const data = await response.json();

        const mappedTour: Tour = {
          id: data.id,
          name: data.title,
          location: data.location,
          description: data.description,
          image: data.cover_photo,
          category: data.category ?? "Uncategorized",
          duration: data.duration,
          maxCapacity: data.max_persons,
          rating: parseFloat(data.rating),
          reviews: data.review_count,
          availableDates: data.availability_slots || [],
          highlights: data.includes_list || [],
          itinerary: data.includes_list || [],
          excludes:data.excludes_list || [] , 
          requirements : data.requirements,

          price: parseFloat(data.price),
        };

        setTour(mappedTour);
      } catch (error) {
        console.error("Error fetching tour:", error);
        setTour(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTour();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-lg text-muted-foreground">{t("tour.loading")}</p>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            {t("tour.not_found.title")}
          </h1>
          <p className="text-muted-foreground mb-8">
            {t("tour.not_found.description")}
          </p>
          <Link to="/tours">
            <Button variant="hero">{t("tour.not_found.back")}</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Image Section */}
      <section className="relative h-96 overflow-hidden">
        <img
          src={tour.image}
          alt={tour.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-hero opacity-60" />
        <div className="absolute bottom-8 left-8">
          <Link to="/tours">
            <Button
              variant="outline"
              className="mb-4 bg-white/10 border-white/30 text-white hover:bg-white hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t("tour.back")}
            </Button>
          </Link>
          <Badge
            variant="secondary"
            className="bg-white/90 text-primary mb-2 ml-4"
          >
            {tour.category}
          </Badge>
          <h1 className="text-4xl font-bold text-white mb-2">{tour.name}</h1>
          <div className="flex items-center text-white/90">
            <MapPin className="h-5 w-5 mr-2" />
            <span className="text-lg">{tour.location}</span>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{t("tour.overview")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {tour.description}
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                  <div className="text-center p-4 bg-gradient-sky rounded-lg">
                    <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
                    <div className="font-semibold">{tour.duration}</div>
                    <div className="text-sm text-muted-foreground">
                      {t("tour.duration")}
                    </div>
                  </div>
                  <div className="text-center p-4 bg-gradient-sky rounded-lg">
                    <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                    <div className="font-semibold">
                      {t("tour.group_size_value", { count: tour.maxCapacity })}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {t("tour.group_size")}
                    </div>
                  </div>
                  <div className="text-center p-4 bg-gradient-sky rounded-lg">
                    <Star className="h-8 w-8 text-primary mx-auto mb-2" />
                    <div className="font-semibold">{tour.rating}/5</div>
                    <div className="text-sm text-muted-foreground">
                      {t("tour.reviews", { count: tour.reviews })}
                    </div>
                  </div>
                  <div className="text-center p-4 bg-gradient-sky rounded-lg">
                    <Calendar className="h-8 w-8 text-primary mx-auto mb-2" />
                    <div className="font-semibold">
                      {tour.availableDates.length}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {t("tour.available_dates")}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Highlights */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{t("tour.highlights")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tour.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{highlight}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Itinerary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{t("tour.itinerary")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tour.itinerary.map((day, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-4 p-4 bg-gradient-sky rounded-lg"
                    >
                      <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold flex-shrink-0">
                        {index + 1}
                      </div>
                      <div className="text-muted-foreground">{day}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
              
              <CardHeader>
                <CardTitle className="text-2xl">{t("tour.excludes")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tour.excludes.map((day, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-4 p-4 bg-gradient-sky rounded-lg"
                    >
                      <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold flex-shrink-0">
                        {index + 1}
                      </div>
                      <div className="text-muted-foreground">{day}</div>
                    </div>
                  ))}
                </div>
              </CardContent>

              <CardHeader>
  <CardTitle className="text-2xl">{t("tour.requirements")}</CardTitle>
</CardHeader>
<CardContent>
  <div className="space-y-4">
    {processRequirements(tour.requirements).map((requirement, index) => (
      <div
        key={index}
        className="flex items-start space-x-4 p-4 bg-gradient-sky rounded-lg"
      >
        <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold flex-shrink-0">
          {index + 1}
        </div>
        <div className="text-muted-foreground">{requirement}</div>
      </div>
    ))}
  </div>
</CardContent>
            </Card>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8 shadow-glow">
              <CardHeader>
                <CardTitle className="text-2xl text-center">
                  <span className="text-3xl font-bold text-primary">
                    ${tour.price.toLocaleString()}
                  </span>
                  <span className="text-lg text-muted-foreground ml-2">
                    {t("tour.per_person")}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">{t("tour.available_dates")}</h4>
                  <div className="space-y-2">
                    {tour.availableDates.map((slot) => (
                      <div
                        key={slot.id}
                        className="p-3 bg-gradient-sky rounded-lg text-center"
                      >
                        <div className="font-medium">
                          {new Date(slot.date).toLocaleDateString(
                            i18n.language, // ✅ dynamic locale
                            {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Link to={`/booking/${tour.id}`}>
                    <Button
                      variant="hero"
                      size="lg"
                      className="w-full text-lg py-4 bg-black text-primary hover:bg-primary hover:text-black transition"
                    >
                      {t("tour.book")}
                    </Button>
                  </Link>
                  <Link to="/chat">
                    <Button variant="outline" size="lg" className="w-full">
                      {t("tour.ask")}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
      <ChatWidget />
    </div>
  );
};

export default TourDetails;
