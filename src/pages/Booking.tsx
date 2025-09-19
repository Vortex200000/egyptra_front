// import { useEffect, useState } from "react";
// import { useParams, Link, useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { API_URL } from "@/config/api";
// import { useAuth } from "@/hooks/useAuth";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Separator } from "@/components/ui/separator";
// import Navigation from "@/components/Navigation";
// import Footer from "@/components/Footer";
// import ChatWidget from "@/components/ChatWidget";

// import {
//   ArrowLeft,
//   Calendar,
//   Users,
//   CreditCard,
//   MapPin,
//   Loader2,
// } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";

// interface Tour {
//   id: string;
//   name: string;
//   location: string;
//   description: string;
//   image: string;
//   category: string;
//   duration: string;
//   maxCapacity: number;
//   rating: number;
//   reviews: number;
//   availableDates: Array<{
//     id: number;
//     date: string;
//     start_time: string;
//     end_time: string;
//     spots: number;
//   }>;
//   highlights: string[];
//   itinerary: string[];
//   price: number;
//   slug?: string;
// }

// const formatTime = (timeString: string): string => {
//   const [hours, minutes] = timeString.split(":");
//   const hour24 = parseInt(hours);
//   const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
//   const ampm = hour24 >= 12 ? "PM" : "AM";
//   return `${hour12}:${minutes} ${ampm}`;
// };

// const Booking = () => {
//   const { id } = useParams<{ id: string }>();
//   const [tour, setTour] = useState<Tour | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [isBooking, setIsBooking] = useState(false); // New loading state for booking
//   const { toast } = useToast();
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     firstName: user?.username || "",
//     lastName: user?.last_name || "",
//     email: user?.email || "",
//     phone: "",
//     travelers: "1",
//     selectedDate: "",
//     specialRequests: "",
//     selectedTime: "",
//   });

//   const [accessToken, setAccessToken] = useState<string | null>(
//     localStorage.getItem("access") || null
//   );

//   useEffect(() => {
//     if (user) {
//       setFormData((prev) => ({
//         ...prev,
//         firstName: user.username || "",
//         lastName: user.last_name || "",
//         email: user.email || "",
//       }));
//     }
//   }, [user]);

//   useEffect(() => {
//     if (!user) {
//       navigate("/");
//     }
//   }, [user, navigate]);

//   const travelers = parseInt(formData.travelers) || 1;
//   const totalPrice = tour ? tour.price * travelers : 0;

//   const handleInputChange = (field: string, value: string) => {
//     setFormData((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (
//       !formData.firstName ||
//       !formData.lastName ||
//       !formData.email ||
//       !formData.selectedDate
//     ) {
//       toast({
//         title: "Missing Information",
//         description: "Please fill in all required fields.",
//         variant: "destructive",
//       });
//       return;
//     }

//     setIsBooking(true); // Start loading

//     try {
//       const response = await fetch(`${API_URL}/api/bookings/create/`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${accessToken}`,
//         },
//         body: JSON.stringify({
//           tour_id: tour?.id,
//           first_name: formData.firstName,
//           last_name: formData.lastName,
//           email: formData.email,
//           number_of_travelers: travelers,
//           preferred_date: formData.selectedDate,
//           preferred_time: formData.selectedTime,
//         }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         toast({
//           title: "Booking Failed",
//           description: `There was an error processing your booking. ${errorData.message}`,
//           variant: "destructive",
//         });
//       } else {
//         const responseData = await response.json();
//         toast({
//           title: "Booking Successful",
//           description:
//             "Your booking has been confirmed. Check your email for details.",
//           variant: "default",
//         });

//         // Optionally redirect to booking details or success page
//         if (responseData.booking?.booking_reference) {
//           setTimeout(() => {
//             navigate(`/bookings/`);
//           }, 2000);
//         }
//       }
//     } catch (error: any) {
//       toast({
//         title: "Booking Failed",
//         description:
//           error.message || "There was an error processing your booking.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsBooking(false); // End loading
//     }
//   };

//   useEffect(() => {
//     const fetchTour = async () => {
//       try {
//         const response = await fetch(`${API_URL}/api/tours/${id}/`);
//         if (!response.ok) throw new Error("Tour not found");
//         const data = await response.json();

//         const mappedTour: Tour = {
//           id: data.id,
//           name: data.title,
//           location: data.location,
//           description: data.description,
//           image: data.cover_photo,
//           category: data.category?.name || "Uncategorized",
//           duration: data.duration,
//           maxCapacity: data.max_persons,
//           rating: parseFloat(data.rating),
//           reviews: data.review_count,
//           availableDates: (data.availability_slots || [])
//             .filter((slot: any) => slot.is_available && slot.is_active)
//             .map((slot: any) => ({
//               id: slot.id,
//               date: slot.date,
//               start_time: slot.start_time,
//               end_time: slot.end_time,
//               spots: slot.available_spots,
//             })),
//           highlights: data.includes_list || [],
//           itinerary: data.includes_list || [],
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
//         <div className="text-center space-y-4">
//           <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
//           <p className="text-lg text-muted-foreground">
//             Loading tour details...
//           </p>
//         </div>
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
//             The tour you're trying to book doesn't exist.
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

//       {/* Loading Overlay */}
//       {isBooking && (
//         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
//           <div className="bg-white rounded-lg p-8 shadow-2xl text-center space-y-4 mx-4">
//             <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
//             <h3 className="text-xl font-semibold text-foreground">
//               Processing Your Booking
//             </h3>
//             <p className="text-muted-foreground">
//               Please wait while we confirm your reservation...
//             </p>
//             <div className="text-sm text-muted-foreground">
//               This may take a few moments
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Header */}
//       <section className="bg-gradient-sky py-12">
//         <div className="container mx-auto px-4">
//           <Link to={`/tour/${tour.id}`}>
//             <Button variant="outline" className="mb-4" disabled={isBooking}>
//               <ArrowLeft className="h-4 w-4 mr-2" />
//               Back to Tour Details
//             </Button>
//           </Link>
//           <h1 className="text-4xl font-bold text-foreground mb-2">
//             Book Your Adventure
//           </h1>
//           <p className="text-xl text-muted-foreground">
//             Complete your booking for {tour.name}
//           </p>
//         </div>
//       </section>

//       <div className="container mx-auto px-4 py-12">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
//           {/* Booking Form */}
//           <div className="lg:col-span-2">
//             <form onSubmit={handleSubmit} className="space-y-8">
//               {/* Personal Information */}
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="flex items-center">
//                     <Users className="h-5 w-5 mr-2" />
//                     Personal Information
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div className="space-y-2">
//                       <Label htmlFor="firstName">First Name</Label>
//                       <Input
//                         id="firstName"
//                         value={formData.firstName}
//                         onChange={(e) =>
//                           handleInputChange("firstName", e.target.value)
//                         }
//                         disabled={isBooking}
//                       />
//                     </div>
//                     <div className="space-y-2">
//                       <Label htmlFor="lastName">Last Name</Label>
//                       <Input
//                         id="lastName"
//                         value={formData.lastName}
//                         onChange={(e) =>
//                           handleInputChange("lastName", e.target.value)
//                         }
//                         disabled={isBooking}
//                       />
//                     </div>
//                   </div>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div className="space-y-2">
//                       <Label htmlFor="email">Email Address</Label>
//                       <Input
//                         id="email"
//                         type="email"
//                         value={formData.email}
//                         onChange={(e) =>
//                           handleInputChange("email", e.target.value)
//                         }
//                         disabled={isBooking}
//                       />
//                     </div>
//                     <div className="space-y-2">
//                       <Label htmlFor="phone">Phone Number</Label>
//                       <Input
//                         id="phone"
//                         type="tel"
//                         value={formData.phone}
//                         onChange={(e) =>
//                           handleInputChange("phone", e.target.value)
//                         }
//                         placeholder="Enter your phone number"
//                         disabled={isBooking}
//                       />
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>

//               {/* Tour Details */}
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="flex items-center">
//                     <Calendar className="h-5 w-5 mr-2" />
//                     Tour Details
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div className="space-y-2">
//                       <Label htmlFor="travelers">Number of Travelers *</Label>
//                       <Select
//                         value={formData.travelers}
//                         onValueChange={(value) =>
//                           handleInputChange("travelers", value)
//                         }
//                         disabled={isBooking}
//                       >
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select travelers" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           {Array.from(
//                             { length: Math.min(tour.maxCapacity, 10) },
//                             (_, i) => (
//                               <SelectItem
//                                 key={i + 1}
//                                 value={(i + 1).toString()}
//                               >
//                                 {i + 1} {i + 1 === 1 ? "Traveler" : "Travelers"}
//                               </SelectItem>
//                             )
//                           )}
//                         </SelectContent>
//                       </Select>
//                     </div>
//                     <div className="space-y-2">
//                       <Label htmlFor="selectedDate">
//                         Preferred Date & Time *
//                       </Label>
//                       <Select
//                         value={
//                           formData.selectedDate
//                             ? `${formData.selectedDate}|${formData.selectedTime}`
//                             : ""
//                         }
//                         onValueChange={(value) => {
//                           const [date, time] = value.split("|");
//                           handleInputChange("selectedDate", date);
//                           handleInputChange("selectedTime", time);
//                         }}
//                         disabled={isBooking}
//                       >
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select a date and time" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           {tour.availableDates.map((slot) => (
//                             <SelectItem
//                               key={slot.id}
//                               value={`${slot.date}|${slot.start_time}`}
//                             >
//                               {new Date(slot.date).toLocaleDateString("en-US", {
//                                 weekday: "short",
//                                 month: "short",
//                                 day: "numeric",
//                                 year: "numeric",
//                               })}{" "}
//                               at {formatTime(slot.start_time)} -{" "}
//                               {formatTime(slot.end_time)} ({slot.spots} spots
//                               available)
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                     </div>
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="specialRequests">Special Requests</Label>
//                     <Input
//                       id="specialRequests"
//                       value={formData.specialRequests}
//                       onChange={(e) =>
//                         handleInputChange("specialRequests", e.target.value)
//                       }
//                       placeholder="Any dietary restrictions, accessibility needs, etc."
//                       disabled={isBooking}
//                     />
//                   </div>
//                 </CardContent>
//               </Card>

//               {/* Payment Section */}
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="flex items-center">
//                     <CreditCard className="h-5 w-5 mr-2" />
//                     Payment Information
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="bg-gradient-sky p-6 rounded-lg text-center">
//                     <p className="text-muted-foreground mb-4">
//                       Secure payment processing is currently being set up.
//                     </p>
//                     <p className="text-sm text-muted-foreground">
//                       For now, you can submit your booking request and our team
//                       will contact you with payment instructions.
//                     </p>
//                   </div>
//                 </CardContent>
//               </Card>

//               <Button
//                 type="submit"
//                 variant="hero"
//                 size="lg"
//                 className="w-full text-lg px-8 py-4 bg-black text-primary hover:bg-primary hover:text-black transition"
//                 disabled={isBooking}
//               >
//                 {isBooking ? (
//                   <>
//                     <Loader2 className="h-5 w-5 mr-2 animate-spin" />
//                     Processing...
//                   </>
//                 ) : (
//                   "Submit Booking Request"
//                 )}
//               </Button>
//             </form>
//           </div>

//           {/* Booking Summary */}
//           <div className="lg:col-span-1">
//             <Card
//               className={`sticky top-8 shadow-glow ${
//                 isBooking ? "opacity-50" : ""
//               }`}
//             >
//               <CardHeader>
//                 <CardTitle>Booking Summary</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="space-y-3">
//                   <div className="aspect-video overflow-hidden rounded-lg">
//                     <img
//                       src={tour.image}
//                       alt={tour.name}
//                       className="w-full h-full object-cover"
//                     />
//                   </div>
//                   <div>
//                     <h3 className="font-semibold text-lg">{tour.name}</h3>
//                     <div className="flex items-center text-muted-foreground mt-1">
//                       <MapPin className="h-4 w-4 mr-1" />
//                       <span className="text-sm">{tour.location}</span>
//                     </div>
//                   </div>
//                 </div>

//                 <Separator />

//                 <div className="space-y-2">
//                   <div className="flex justify-between">
//                     <span>Duration:</span>
//                     <span className="font-medium">{tour.duration}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span>Travelers:</span>
//                     <span className="font-medium">{travelers}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span>Price per person:</span>
//                     <span className="font-medium">
//                       ${tour.price.toLocaleString()}
//                     </span>
//                   </div>
//                   {formData.selectedDate && formData.selectedTime && (
//                     <div className="flex justify-between">
//                       <span>Selected Date & Time:</span>
//                       <div className="text-right">
//                         <div className="font-medium text-sm">
//                           {new Date(formData.selectedDate).toLocaleDateString()}
//                         </div>
//                         <div className="font-medium text-sm text-primary">
//                           {formatTime(formData.selectedTime)}
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 <Separator />

//                 <div className="flex justify-between text-lg font-bold">
//                   <span>Total:</span>
//                   <span className="text-primary">
//                     ${totalPrice.toLocaleString()}
//                   </span>
//                 </div>

//                 <div className="text-xs text-muted-foreground space-y-1">
//                   <p>Free cancellation up to 24 hours before</p>
//                   <p>Instant confirmation</p>
//                   <p>Mobile tickets accepted</p>
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

// export default Booking;
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next"; 
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { API_URL } from "@/config/api";
import { useAuth } from "@/hooks/useAuth";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";

import {
  ArrowLeft,
  Calendar,
  Users,
  CreditCard,
  MapPin,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Tour {
  id: string;
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
  price: number;
  slug?: string;
}

const formatTime = (timeString: string): string => {
  const [hours, minutes] = timeString.split(":");
  const hour24 = parseInt(hours);
  const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
  const ampm = hour24 >= 12 ? "PM" : "AM";
  return `${hour12}:${minutes} ${ampm}`;
};

const Booking = () => {
  const { t } = useTranslation(); // Add translation hook
  const { id } = useParams<{ id: string }>();
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: user?.username || "",
    lastName: user?.last_name || "",
    email: user?.email || "",
    phone: "",
    travelers: "1",
    selectedDate: "",
    specialRequests: "",
    selectedTime: "",
  });

  const [accessToken, setAccessToken] = useState<string | null>(
    localStorage.getItem("access") || null
  );

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        firstName: user.username || "",
        lastName: user.last_name || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  const travelers = parseInt(formData.travelers) || 1;
  const totalPrice = tour ? tour.price * travelers : 0;

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.selectedDate
    ) {
      toast({
        title: t("booking.missing_info"),
        description: t("booking.missing_info"),
        variant: "destructive",
      });
      return;
    }

    setIsBooking(true);

    try {
      const response = await fetch(`${API_URL}/api/bookings/create/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          tour_id: tour?.id,
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          number_of_travelers: travelers,
          preferred_date: formData.selectedDate,
          preferred_time: formData.selectedTime,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast({
          title: t("errors.something_went_wrong"),
          description: `${t("booking.error_message")} ${errorData.message}`,
          variant: "destructive",
        });
      } else {
        const responseData = await response.json();
        toast({
          title: t("common.success"),
          description: t("booking.success_message"),
          variant: "default",
        });

        if (responseData.booking?.booking_reference) {
          setTimeout(() => {
            navigate(`/bookings`);
          }, 2000);
        }
      }
    } catch (error: any) {
      toast({
        title: t("errors.something_went_wrong"),
        description: error.message || t("booking.error_message"),
        variant: "destructive",
      });
    } finally {
      setIsBooking(false);
    }
  };

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const response = await fetch(`${API_URL}/api/tours/${id}/`);
        if (!response.ok) throw new Error(t("errors.tour_not_found"));
        const data = await response.json();

        const mappedTour: Tour = {
          id: data.id,
          name: data.title,
          location: data.location,
          description: data.description,
          image: data.cover_photo,
          category: data.category?.name || "Uncategorized",
          duration: data.duration,
          maxCapacity: data.max_persons,
          rating: parseFloat(data.rating),
          reviews: data.review_count,
          availableDates: (data.availability_slots || [])
            .filter((slot: any) => slot.is_available && slot.is_active)
            .map((slot: any) => ({
              id: slot.id,
              date: slot.date,
              start_time: slot.start_time,
              end_time: slot.end_time,
              spots: slot.available_spots,
            })),
          highlights: data.includes_list || [],
          itinerary: data.includes_list || [],
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
  }, [id, t]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-lg text-muted-foreground">{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            {t("errors.tour_not_found")}
          </h1>
          <p className="text-muted-foreground mb-8">
            {t("errors.tour_not_found_desc")}
          </p>
          <Link to="/tours">
            <Button variant="hero">{t("navigation.tours")}</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Loading Overlay */}
      {isBooking && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 shadow-2xl text-center space-y-4 mx-4">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
            <h3 className="text-xl font-semibold text-foreground">
              {t("booking.processing")}
            </h3>
            <p className="text-muted-foreground">
              {t("booking.processing_message")}
            </p>
            <div className="text-sm text-muted-foreground">
              {t("common.loading")}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <section className="bg-gradient-sky py-12">
        <div className="container mx-auto px-4">
          <Link to={`/tour/${tour.id}`}>
            <Button variant="outline" className="mb-4" disabled={isBooking}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t("common.back")}
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            {t("booking.title")}
          </h1>
          <p className="text-xl text-muted-foreground">
            {t("booking.subtitle", { tourName: tour.name })}
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    {t("booking.personal_info")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">
                        {t("booking.first_name")}
                      </Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) =>
                          handleInputChange("firstName", e.target.value)
                        }
                        disabled={isBooking}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">{t("booking.last_name")}</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) =>
                          handleInputChange("lastName", e.target.value)
                        }
                        disabled={isBooking}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">{t("booking.email")}</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        disabled={isBooking}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">{t("booking.phone")}</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                        placeholder={t("booking.phone")}
                        disabled={isBooking}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tour Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    {t("booking.tour_details")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="travelers">
                        {t("booking.travelers")} *
                      </Label>
                      <Select
                        value={formData.travelers}
                        onValueChange={(value) =>
                          handleInputChange("travelers", value)
                        }
                        disabled={isBooking}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t("common.select")} />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from(
                            { length: Math.min(tour.maxCapacity, 10) },
                            (_, i) => (
                              <SelectItem
                                key={i + 1}
                                value={(i + 1).toString()}
                              >
                                {i + 1}{" "}
                                {i + 1 === 1
                                  ? t("tours.traveler")
                                  : t("tours.travelers")}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="selectedDate">
                        {t("booking.preferred_date")} *
                      </Label>
                      <Select
                        value={
                          formData.selectedDate
                            ? `${formData.selectedDate}|${formData.selectedTime}`
                            : ""
                        }
                        onValueChange={(value) => {
                          const [date, time] = value.split("|");
                          handleInputChange("selectedDate", date);
                          handleInputChange("selectedTime", time);
                        }}
                        disabled={isBooking}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t("common.select")} />
                        </SelectTrigger>
                        <SelectContent>
                          {tour.availableDates.map((slot) => (
                            <SelectItem
                              key={slot.id}
                              value={`${slot.date}|${slot.start_time}`}
                            >
                              {new Date(slot.date).toLocaleDateString("en-US", {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}{" "}
                              at {formatTime(slot.start_time)} -{" "}
                              {formatTime(slot.end_time)} ({slot.spots} spots
                              available)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="specialRequests">
                      {t("booking.special_requests")}
                    </Label>
                    <Input
                      id="specialRequests"
                      value={formData.specialRequests}
                      onChange={(e) =>
                        handleInputChange("specialRequests", e.target.value)
                      }
                      placeholder={t("booking.special_requests")}
                      disabled={isBooking}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Payment Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-2" />
                    {t("booking.payment_info")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gradient-sky p-6 rounded-lg text-center">
                    <p className="text-muted-foreground mb-4">
                      Secure payment processing is currently being set up.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      For now, you can submit your booking request and our team
                      will contact you with payment instructions.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Button
                type="submit"
                variant="hero"
                size="lg"
                className="w-full text-lg px-8 py-4 bg-black text-primary hover:bg-primary hover:text-black transition"
                disabled={isBooking}
              >
                {isBooking ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    {t("booking.processing")}
                  </>
                ) : (
                  t("booking.submit_booking")
                )}
              </Button>
            </form>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <Card
              className={`sticky top-8 shadow-glow ${
                isBooking ? "opacity-50" : ""
              }`}
            >
              <CardHeader>
                <CardTitle>{t("booking.booking_summary")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="aspect-video overflow-hidden rounded-lg">
                    <img
                      src={tour.image}
                      alt={tour.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{tour.name}</h3>
                    <div className="flex items-center text-muted-foreground mt-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm">{tour.location}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>{t("booking.duration")}:</span>
                    <span className="font-medium">{tour.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t("booking.travelers")}:</span>
                    <span className="font-medium">{travelers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t("booking.price_per_person")}:</span>
                    <span className="font-medium">
                      ${tour.price.toLocaleString()}
                    </span>
                  </div>
                  {formData.selectedDate && formData.selectedTime && (
                    <div className="flex justify-between">
                      <span>{t("booking.preferred_date")}:</span>
                      <div className="text-right">
                        <div className="font-medium text-sm">
                          {new Date(formData.selectedDate).toLocaleDateString()}
                        </div>
                        <div className="font-medium text-sm text-primary">
                          {formatTime(formData.selectedTime)}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>{t("booking.total")}:</span>
                  <span className="text-primary">
                    ${totalPrice.toLocaleString()}
                  </span>
                </div>

                <div className="text-xs text-muted-foreground space-y-1">
                  <p>Free cancellation up to 24 hours before</p>
                  <p>Instant confirmation</p>
                  <p>Mobile tickets accepted</p>
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

export default Booking;
