// import { useEffect, useState } from "react";
// import Navigation from "@/components/Navigation";
// import Footer from "@/components/Footer";
// import ChatWidget from "@/components/ChatWidget";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "@/hooks/useAuth";
// import { toast, useToast } from "@/hooks/use-toast";
// import { useTranslation } from "react-i18next";

// import {
//   Calendar,
//   MapPin,
//   Users,
//   CreditCard,
//   Download,
//   MessageCircle,
// } from "lucide-react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectTrigger,
//   SelectContent,
//   SelectItem,
//   SelectValue,
// } from "@/components/ui/select";
// import { Textarea } from "@/components/ui/textarea";

// import { API_URL } from "@/config/api";

// interface Booking {
//   id: string;
//   booking_reference: string;
//   full_name: string;
//   tour_title: string;
//   tour_cover_photo: string;
//   tour_location: string;
//   preferred_date: string;
//   number_of_travelers: number;
//   total_amount: string;
//   booking_status: string;
//   booking_status_display: string;
//   payment_status: string;
//   payment_status_display: string;
//   can_be_cancelled: string;
//   created_at: string;
// }

// const getVoucher = async (bookingRef: string) => {
//   try {
//     const res = await fetch(`${API_URL}/api/bookings/${bookingRef}/voucher/`, {
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem("access")}`,
//       },
//     });

//     if (!res.ok) throw new Error("Failed to fetch voucher");

//     // Convert response into Blob (binary data)
//     const blob = await res.blob();

//     // Create a download link
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `voucher-${bookingRef}.pdf`; // filename
//     document.body.appendChild(a);
//     a.click();

//     // Cleanup
//     a.remove();
//     window.URL.revokeObjectURL(url);
//   } catch (error) {
//     console.error(error);
//   }
// };

// const Bookings = () => {
//   const [openCancel, setOpenCancel] = useState(false);
//   const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
//   const [reason, setReason] = useState("");
//   const [detail, setDetail] = useState("");
//   const [submitting, setSubmitting] = useState(false);
//   const { user } = useAuth();
//   const { t } = useTranslation();
//   const REASONS = [
//     { value: "customer_request", label: "Customer Request" },
//     { value: "tour_cancelled", label: "Tour Cancelled" },
//     { value: "weather", label: "Weather Conditions" },
//     { value: "insufficient_participants", label: "Insufficient Participants" },
//     { value: "force_majeure", label: "Force Majeure" },
//     { value: "other", label: "Other" },
//   ];
//   const [bookings, setBookings] = useState<Booking[]>([]);
//   const [loading, setLoading] = useState(true);

//   const navigate = useNavigate();

//   const token = localStorage.getItem("access");

//   useEffect(() => {
//     if (!user) {
//       toast({
//         title: "Sign In Required",
//         description: "Please sign in to book this tour.",
//         variant: "destructive",
//       });
//       navigate("/auth");
//     }
//   }, [user, navigate]);
//   const fetchBookings = async () => {
//     try {
//       const res = await fetch(`${API_URL}/api/bookings/my-bookings`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("access")}`,
//         },
//       });
//       if (!res.ok) throw new Error("Failed to fetch bookings");
//       const data = await res.json();
//       setBookings(data.results || []);
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchBookings();
//   }, []);

//   const getStatusColor = (status: string) => {
//     switch (status.toLowerCase()) {
//       case "confirmed":
//         return "bg-green-100 text-green-800 border-green-200";
//       case "pending":
//         return "bg-yellow-100 text-yellow-800 border-yellow-200";
//       case "cancelled":
//         return "bg-red-100 text-red-800 border-red-200";
//       default:
//         return "bg-gray-100 text-gray-800 border-gray-200";
//     }
//   };
//   const handleCancelBooking = async () => {
//     if (!selectedBooking) return;
//     setSubmitting(true);

//     try {
//       const res = await fetch(
//         `${API_URL}/api/bookings/my-bookings/${selectedBooking.booking_reference}/cancel/`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${localStorage.getItem("access")}`,
//           },
//           body: JSON.stringify({
//             email: localStorage.getItem("user_email"), // or pass email from props/state
//             reason,
//             detail,
//           }),
//         }
//       );

//       if (!res.ok) throw new Error("Failed to cancel booking");

//       await fetchBookings(); // refresh list
//       setOpenCancel(false);
//       setReason("");
//       setDetail("");
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setSubmitting(false);
//     }
//   };
//   return (
//     <div className="min-h-screen bg-background">
//       <Navigation />

//       {/* Header */}
//       <section className="bg-gradient-sky py-20">
//         <div className="container mx-auto px-4 text-center">
//           <h1 className="text-5xl font-bold text-foreground mb-4">
//             {t("bookings.title")}
//           </h1>
//           <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
//             {t("bookings.subtitle")}
//           </p>
//         </div>
//       </section>

//       <div className="container mx-auto px-4 py-12">
//         {/* Loading */}
//         {loading ? (
//           <div className="text-center py-12">{t("common.loading")}</div>
//         ) : bookings.length > 0 ? (
//           <div className="space-y-6">
//             {bookings.map((booking) => (
//               <Card
//                 key={booking.id}
//                 className="shadow-card hover:shadow-glow transition-smooth"
//               >
//                 <CardContent className="p-0">
//                   <div className="flex flex-col md:flex-row">
//                     {/* Image */}
//                     <div className="md:w-1/4">
//                       <img
//                         src={booking.tour_cover_photo}
//                         alt={booking.tour_title}
//                         className="w-full h-48 md:h-full object-cover rounded-l-lg"
//                       />
//                     </div>

//                     {/* Content */}
//                     <div className="flex-1 p-6">
//                       <div className="flex items-start justify-between mb-4">
//                         <div>
//                           <h3 className="text-xl font-semibold text-foreground mb-2">
//                             {booking.tour_title}
//                           </h3>
//                           <div className="flex items-center text-muted-foreground mb-2">
//                             <MapPin className="h-4 w-4 mr-1" />
//                             <span>{booking.tour_location}</span>
//                           </div>
//                         </div>
//                         <Badge
//                           className={getStatusColor(booking.booking_status)}
//                         >
//                           {booking.booking_status_display}
//                         </Badge>
//                       </div>

//                       {/* Details */}
//                       <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//                         <div className="flex items-center text-sm">
//                           <Calendar className="h-4 w-4 mr-2 text-primary" />
//                           <div>
//                             <div className="font-medium">
//                               {t("bookings.tour_date")}
//                             </div>
//                             <div className="text-muted-foreground">
//                               {new Date(
//                                 booking.preferred_date
//                               ).toLocaleDateString()}
//                             </div>
//                           </div>
//                         </div>

//                         <div className="flex items-center text-sm">
//                           <Users className="h-4 w-4 mr-2 text-primary" />
//                           <div>
//                             <div className="font-medium">
//                               {t("bookings.travelers")}
//                             </div>
//                             <div className="text-muted-foreground">
//                               {booking.number_of_travelers}
//                             </div>
//                           </div>
//                         </div>

//                         <div className="flex items-center text-sm">
//                           <CreditCard className="h-4 w-4 mr-2 text-primary" />
//                           <div>
//                             <div className="font-medium">
//                               {t("bookings.total_price")}
//                             </div>
//                             <div className="text-muted-foreground">
//                               $
//                               {parseFloat(
//                                 booking.total_amount
//                               ).toLocaleString()}
//                             </div>
//                           </div>
//                         </div>

//                         <div className="text-sm">
//                           <div className="font-medium">{t("bookings.ref")}</div>
//                           <div className="text-muted-foreground">
//                             {booking.booking_reference}
//                           </div>
//                         </div>
//                       </div>

//                       {/* Actions */}
//                       <div className="flex flex-wrap gap-3">
//                         {booking.booking_status === "confirmed" && (
//                           <>
//                             <Button
//                               variant="outline"
//                               size="sm"
//                               onClick={() =>
//                                 getVoucher(booking.booking_reference)
//                               }
//                             >
//                               <Download className="h-4 w-4 mr-2" />
//                               {t("bookings.download_voucher")}
//                             </Button>
//                             <Button variant="outline" size="sm">
//                               {t("bookings.view_itinerary")}
//                             </Button>
//                             <Button variant="book" size="sm">
//                               {t("bookings.manage")}
//                             </Button>
//                           </>
//                         )}

//                         {booking.booking_status === "pending" &&
//                           booking.can_be_cancelled && (
//                             <Button
//                               variant="outline"
//                               size="sm"
//                               onClick={() => {
//                                 setSelectedBooking(booking);
//                                 setOpenCancel(true);
//                                 handleCancelBooking();
//                               }}
//                             >
//                               {t("bookings.cancel")}
//                             </Button>
//                           )}

//                         {booking.booking_status === "cancelled" && (
//                           <Button variant="outline" size="sm" disabled>
//                             {t("bookings.cancelled")}
//                           </Button>
//                         )}

//                         <Button
//                           variant="ghost"
//                           size="sm"
//                           onClick={() => navigate("/contact")}
//                         >
//                           <MessageCircle className="h-4 w-4 mr-2" />
//                           {t("bookings.support")}
//                         </Button>
//                       </div>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         ) : (
//           <Card className="text-center p-12 shadow-card">
//             <h3 className="text-2xl font-semibold text-foreground mb-2">
//               {t("bookings.none")}
//             </h3>
//             <p className="text-muted-foreground mb-6">
//               {t("bookings.none_desc")}
//             </p>
//             <Button variant="hero" size="lg">
//               {t("bookings.browse")}
//             </Button>
//           </Card>
//         )}
//       </div>
//       <Dialog open={openCancel} onOpenChange={setOpenCancel}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Cancel Booking</DialogTitle>
//           </DialogHeader>

//           <div className="space-y-4">
//             <div>
//               <Label>Reason</Label>
//               <Select onValueChange={setReason}>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select a reason" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {REASONS.map((r) => (
//                     <SelectItem key={r.value} value={r.value}>
//                       {r.label}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             <div>
//               <Label>Details</Label>
//               <Textarea
//                 placeholder="Tell us more..."
//                 value={detail}
//                 onChange={(e) => setDetail(e.target.value)}
//               />
//             </div>
//           </div>

//           <DialogFooter>
//             <Button
//               variant="outline"
//               onClick={() => setOpenCancel(false)}
//               disabled={submitting}
//             >
//               Close
//             </Button>
//             <Button
//               variant="destructive"
//               onClick={handleCancelBooking}
//               disabled={submitting || !reason}
//             >
//               {submitting ? "Cancelling..." : "Confirm Cancel"}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default Bookings;
import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { toast, useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

import {
  Calendar,
  MapPin,
  Users,
  CreditCard,
  Download,
  MessageCircle,
  Check,
  X,
  Filter,
  RefreshCw,
  Eye,
  Clock,
  Mail,
  User,
  Phone,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { API_URL } from "@/config/api";

interface Booking {
  id: string;
  booking_reference: string;
  full_name: string;
  tour_title: string;
  tour_cover_photo: string;
  tour_location: string;
  preferred_date: string;
  number_of_travelers: number;
  total_amount: string;
  booking_status: string;
  booking_status_display: string;
  payment_status: string;
  payment_status_display: string;
  can_be_cancelled: string;
  created_at: string;
}

interface AdminBooking {
  id: string;
  booking_reference: string;
  customer_name: string;
  customer_email: string;
  tour_title: string;
  tour_location: string;
  preferred_date: string;
  preferred_time: string | null;
  number_of_travelers: number;
  total_amount: string;
  booking_status: string;
  payment_status: string;
  created_at: string;
  can_confirm: boolean;
  can_decline: boolean;
  special_requests: string;
  username: string;
}

const getVoucher = async (bookingRef: string) => {
  try {
    const res = await fetch(`${API_URL}/api/bookings/${bookingRef}/voucher/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
      },
    });

    if (!res.ok) throw new Error("Failed to fetch voucher");

    // Convert response into Blob (binary data)
    const blob = await res.blob();

    // Create a download link
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `voucher-${bookingRef}.pdf`; // filename
    document.body.appendChild(a);
    a.click();

    // Cleanup
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error(error);
    toast({
      title: "Error",
      description: "Failed to download voucher",
      variant: "destructive",
    });
  }
};

const getAdminVoucher = async (bookingRef: string) => {
  try {
    const res = await fetch(`${API_URL}/api/bookings/admin/${bookingRef}/voucher/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
      },
    });

    if (!res.ok) throw new Error("Failed to fetch admin voucher");

    // Convert response into Blob (binary data)
    const blob = await res.blob();

    // Create a download link
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `admin-voucher-${bookingRef}.pdf`; // filename
    document.body.appendChild(a);
    a.click();

    // Cleanup
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error(error);
    toast({
      title: "Error",
      description: "Failed to download admin voucher",
      variant: "destructive",
    });
  }
};

const Bookings = () => {
  const [openCancel, setOpenCancel] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [reason, setReason] = useState("");
  const [detail, setDetail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  
  // Admin states
  const [adminBookings, setAdminBookings] = useState<AdminBooking[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedAdminBooking, setSelectedAdminBooking] = useState<AdminBooking | null>(null);
  const [declineDialog, setDeclineDialog] = useState(false);
  const [viewDialog, setViewDialog] = useState(false);
  const [declineReason, setDeclineReason] = useState("");
  const [processing, setProcessing] = useState(false);
  
  const { user } = useAuth();
  const { t } = useTranslation();
  const isadmin = localStorage.getItem('role') == 'admin';
  const REASONS = [
    { value: "customer_request", label: "Customer Request" },
    { value: "tour_cancelled", label: "Tour Cancelled" },
    { value: "weather", label: "Weather Conditions" },
    { value: "insufficient_participants", label: "Insufficient Participants" },
    { value: "force_majeure", label: "Force Majeure" },
    { value: "other", label: "Other" },
  ];
  
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const token = localStorage.getItem("access");

  useEffect(() => {
    if (!user) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to book this tour.",
        variant: "destructive",
      });
      navigate("/auth");
    }
  }, [user, navigate]);

  // Regular user bookings fetch
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/bookings/my-bookings`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch bookings");
      const data = await res.json();
      setBookings(data.results || []);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to load bookings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Admin bookings fetch
  const fetchAdminBookings = async () => {
    try {
      setLoading(true);
      const statusParam = statusFilter !== "all" ? `?status=${statusFilter}` : "";
      const res = await fetch(`${API_URL}/api/bookings/admin/all/${statusParam}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Failed to fetch admin bookings");

      const data = await res.json();
      setAdminBookings(data.results || data.bookings || []);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to load admin bookings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isadmin) {
      fetchAdminBookings();
    } else {
      fetchBookings();
    }
  }, [user, statusFilter]);

  // Admin functions
  const confirmBooking = async (bookingReference: string) => {
    try {
      setProcessing(true);
      
      const response = await fetch(`${API_URL}/api/bookings/admin/${bookingReference}/confirm/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("access")}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to confirm booking');

      const data = await response.json();
      
      toast({
        title: "Success",
        description: data.message || "Booking confirmed successfully!",
        variant: "default",
      });

      fetchAdminBookings(); // Refresh the list
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to confirm booking",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const declineBooking = async () => {
    if (!selectedAdminBooking || !declineReason) return;

    try {
      setProcessing(true);
      
      const response = await fetch(`${API_URL}/api/bookings/admin/${selectedAdminBooking.booking_reference}/decline/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("access")}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          reason: declineReason
        })
      });

      if (!response.ok) throw new Error('Failed to decline booking');

      const data = await response.json();
      
      toast({
        title: "Success",
        description: data.message || "Booking declined successfully!",
        variant: "default",
      });

      setDeclineDialog(false);
      setDeclineReason("");
      setSelectedAdminBooking(null);
      fetchAdminBookings(); // Refresh the list
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to decline booking",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleCancelBooking = async () => {
    if (!selectedBooking) return;
    setSubmitting(true);

    try {
      const res = await fetch(
        `${API_URL}/api/bookings/my-bookings/${selectedBooking.booking_reference}/cancel/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
          body: JSON.stringify({
            email: localStorage.getItem("user_email"), // or pass email from props/state
            reason,
            detail,
          }),
        }
      );

      if (!res.ok) throw new Error("Failed to cancel booking");

      await fetchBookings(); // refresh list
      setOpenCancel(false);
      setReason("");
      setDetail("");
      toast({
        title: "Success",
        description: "Booking cancelled successfully",
        variant: "default",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to cancel booking",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string | null) => {
    if (!timeString) return "Not specified";
    return timeString;
  };

  // Admin Layout
  if (isadmin) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />

        {/* Admin Header */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
                <p className="text-blue-100">Manage all bookings and customer requests</p>
              </div>
              <Button
                onClick={fetchAdminBookings}
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Clock className="h-8 w-8 text-yellow-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Pending</p>
                    <p className="text-2xl font-bold">
                      {adminBookings.filter(b => b.booking_status === 'pending').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Check className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Confirmed</p>
                    <p className="text-2xl font-bold">
                      {adminBookings.filter(b => b.booking_status === 'confirmed').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <X className="h-8 w-8 text-red-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Cancelled</p>
                    <p className="text-2xl font-bold">
                      {adminBookings.filter(b => b.booking_status === 'cancelled').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <CreditCard className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                    <p className="text-2xl font-bold">
                      ${adminBookings
                        .filter(b => b.booking_status === 'confirmed')
                        .reduce((sum, b) => sum + parseFloat(b.total_amount), 0)
                        .toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Filter Bookings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <Label htmlFor="status-filter">Status</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Bookings</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center">
                  <p className="text-sm text-muted-foreground">
                    Showing {adminBookings.length} bookings
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bookings List */}
          {loading ? (
            <Card>
              <CardContent className="p-12 text-center">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Loading bookings...</p>
              </CardContent>
            </Card>
          ) : adminBookings.length > 0 ? (
            <div className="space-y-4">
              {adminBookings.map((booking) => (
                <Card key={booking.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold">{booking.tour_title}</h3>
                          <Badge className={getStatusColor(booking.booking_status)}>
                            {booking.booking_status.charAt(0).toUpperCase() + booking.booking_status.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Ref: {booking.booking_reference}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">
                          ${parseFloat(booking.total_amount).toLocaleString()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {booking.payment_status}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
                      <div className="flex items-center text-sm">
                        <User className="h-4 w-4 mr-2 text-primary" />
                        <div>
                          <div className="font-medium">Customer</div>
                          <div className="text-muted-foreground">{booking.customer_name}</div>
                        </div>
                      </div>

                      <div className="flex items-center text-sm">
                        <Mail className="h-4 w-4 mr-2 text-primary" />
                        <div>
                          <div className="font-medium">Email</div>
                          <div className="text-muted-foreground">{booking.customer_email}</div>
                        </div>
                      </div>

                      <div className="flex items-center text-sm">
                        <MapPin className="h-4 w-4 mr-2 text-primary" />
                        <div>
                          <div className="font-medium">Location</div>
                          <div className="text-muted-foreground">{booking.tour_location}</div>
                        </div>
                      </div>

                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-2 text-primary" />
                        <div>
                          <div className="font-medium">Date & Time</div>
                          <div className="text-muted-foreground">
                            {formatDate(booking.preferred_date)} at {formatTime(booking.preferred_time)}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center text-sm">
                        <Users className="h-4 w-4 mr-2 text-primary" />
                        <div>
                          <div className="font-medium">Travelers</div>
                          <div className="text-muted-foreground">{booking.number_of_travelers}</div>
                        </div>
                      </div>
                    </div>

                    {booking.special_requests && (
                      <div className="mb-4 p-3 bg-muted rounded-lg">
                        <p className="text-sm font-medium mb-1">Special Requests:</p>
                        <p className="text-sm text-muted-foreground">{booking.special_requests}</p>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedAdminBooking(booking);
                          setViewDialog(true);
                        }}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>

                      {booking.can_confirm && (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => confirmBooking(booking.booking_reference)}
                          disabled={processing}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Check className="h-4 w-4 mr-2" />
                          Confirm Booking
                        </Button>
                      )}

                      {booking.can_decline && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            setSelectedAdminBooking(booking);
                            setDeclineDialog(true);
                          }}
                          disabled={processing}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Decline
                        </Button>
                      )}

                      {booking.booking_status === "confirmed" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => getAdminVoucher(booking.booking_reference)}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download Voucher
                        </Button>
                      )}

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(`mailto:${booking.customer_email}`)}
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Contact Customer
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No bookings found</h3>
                <p className="text-muted-foreground">
                  No bookings match your current filter criteria.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Decline Dialog */}
        <Dialog open={declineDialog} onOpenChange={setDeclineDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Decline Booking</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label>Reason for Decline</Label>
                <Select onValueChange={setDeclineReason}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a reason" />
                  </SelectTrigger>
                  <SelectContent>
                    {REASONS.map((r) => (
                      <SelectItem key={r.value} value={r.value}>
                        {r.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedAdminBooking && (
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm font-medium mb-2">Booking Details:</p>
                  <p className="text-sm">Customer: {selectedAdminBooking.customer_name}</p>
                  <p className="text-sm">Tour: {selectedAdminBooking.tour_title}</p>
                  <p className="text-sm">Reference: {selectedAdminBooking.booking_reference}</p>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setDeclineDialog(false);
                  setDeclineReason("");
                  setSelectedAdminBooking(null);
                }}
                disabled={processing}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={declineBooking}
                disabled={processing || !declineReason}
              >
                {processing ? "Declining..." : "Decline Booking"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Details Dialog */}
        <Dialog open={viewDialog} onOpenChange={setViewDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Booking Details</DialogTitle>
            </DialogHeader>
            
            {selectedAdminBooking && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Booking Reference</Label>
                    <p className="mt-1">{selectedAdminBooking.booking_reference}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Status</Label>
                    <div className="mt-1">
                      <Badge className={getStatusColor(selectedAdminBooking.booking_status)}>
                        {selectedAdminBooking.booking_status.charAt(0).toUpperCase() + selectedAdminBooking.booking_status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Customer Name</Label>
                    <p className="mt-1">{selectedAdminBooking.customer_name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Email</Label>
                    <p className="mt-1">{selectedAdminBooking.customer_email}</p>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Tour</Label>
                  <p className="mt-1 font-semibold">{selectedAdminBooking.tour_title}</p>
                  <p className="text-sm text-muted-foreground">{selectedAdminBooking.tour_location}</p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Date</Label>
                    <p className="mt-1">{formatDate(selectedAdminBooking.preferred_date)}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Time</Label>
                    <p className="mt-1">{formatTime(selectedAdminBooking.preferred_time)}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Travelers</Label>
                    <p className="mt-1">{selectedAdminBooking.number_of_travelers}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Total Amount</Label>
                    <p className="mt-1 text-2xl font-bold text-primary">
                      ${parseFloat(selectedAdminBooking.total_amount).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Payment Status</Label>
                    <p className="mt-1">{selectedAdminBooking.payment_status}</p>
                  </div>
                </div>

                {selectedAdminBooking.special_requests && (
                  <div>
                    <Label className="text-sm font-medium">Special Requests</Label>
                    <p className="mt-1 p-3 bg-muted rounded-lg">
                      {selectedAdminBooking.special_requests}
                    </p>
                  </div>
                )}

                <div>
                  <Label className="text-sm font-medium">Booking Created</Label>
                  <p className="mt-1">{formatDate(selectedAdminBooking.created_at)}</p>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setViewDialog(false);
                  setSelectedAdminBooking(null);
                }}
              >
                Close
              </Button>
              {selectedAdminBooking?.customer_email && (
                <Button
                  variant="default"
                  onClick={() => window.open(`mailto:${selectedAdminBooking.customer_email}`)}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Contact Customer
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Footer />
      </div>
    );
  }

  // Regular user bookings view
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Header */}
      <section className="bg-gradient-sky py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-foreground mb-4">
            {t("bookings.title")}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t("bookings.subtitle")}
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Loading */}
        {loading ? (
          <div className="text-center py-12">{t("common.loading")}</div>
        ) : bookings.length > 0 ? (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <Card
                key={booking.id}
                className="shadow-card hover:shadow-glow transition-smooth"
              >
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    {/* Image */}
                    <div className="md:w-1/4">
                      <img
                        src={booking.tour_cover_photo}
                        alt={booking.tour_title}
                        className="w-full h-48 md:h-full object-cover rounded-l-lg"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-foreground mb-2">
                            {booking.tour_title}
                          </h3>
                          <div className="flex items-center text-muted-foreground mb-2">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span>{booking.tour_location}</span>
                          </div>
                        </div>
                        <Badge
                          className={getStatusColor(booking.booking_status)}
                        >
                          {booking.booking_status_display}
                        </Badge>
                      </div>

                      {/* Details */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="flex items-center text-sm">
                          <Calendar className="h-4 w-4 mr-2 text-primary" />
                          <div>
                            <div className="font-medium">
                              {t("bookings.tour_date")}
                            </div>
                            <div className="text-muted-foreground">
                              {new Date(
                                booking.preferred_date
                              ).toLocaleDateString()}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center text-sm">
                          <Users className="h-4 w-4 mr-2 text-primary" />
                          <div>
                            <div className="font-medium">
                              {t("bookings.travelers")}
                            </div>
                            <div className="text-muted-foreground">
                              {booking.number_of_travelers}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center text-sm">
                          <CreditCard className="h-4 w-4 mr-2 text-primary" />
                          <div>
                            <div className="font-medium">
                              {t("bookings.total_price")}
                            </div>
                            <div className="text-muted-foreground">
                              $
                              {parseFloat(
                                booking.total_amount
                              ).toLocaleString()}
                            </div>
                          </div>
                        </div>

                        <div className="text-sm">
                          <div className="font-medium">{t("bookings.ref")}</div>
                          <div className="text-muted-foreground">
                            {booking.booking_reference}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-3">
                        {booking.booking_status === "confirmed" && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                getVoucher(booking.booking_reference)
                              }
                            >
                              <Download className="h-4 w-4 mr-2" />
                              {t("bookings.download_voucher")}
                            </Button>
                            <Button variant="outline" size="sm">
                              {t("bookings.view_itinerary")}
                            </Button>
                            <Button variant="book" size="sm">
                              {t("bookings.manage")}
                            </Button>
                          </>
                        )}

                        {booking.booking_status === "pending" &&
                          booking.can_be_cancelled && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedBooking(booking);
                                setOpenCancel(true);
                              }}
                            >
                              {t("bookings.cancel")}
                            </Button>
                          )}

                        {booking.booking_status === "cancelled" && (
                          <Button variant="outline" size="sm" disabled>
                            {t("bookings.cancelled")}
                          </Button>
                        )}

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate("/contact")}
                        >
                          <MessageCircle className="h-4 w-4 mr-2" />
                          {t("bookings.support")}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center p-12 shadow-card">
            <h3 className="text-2xl font-semibold text-foreground mb-2">
              {t("bookings.none")}
            </h3>
            <p className="text-muted-foreground mb-6">
              {t("bookings.none_desc")}
            </p>
            <Button variant="hero" size="lg">
              {t("bookings.browse")}
            </Button>
          </Card>
        )}
      </div>
      
      {/* Cancel Booking Dialog */}
      <Dialog open={openCancel} onOpenChange={setOpenCancel}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Booking</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Reason</Label>
              <Select onValueChange={setReason}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a reason" />
                </SelectTrigger>
                <SelectContent>
                  {REASONS.map((r) => (
                    <SelectItem key={r.value} value={r.value}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Details</Label>
              <Textarea
                placeholder="Tell us more..."
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpenCancel(false)}
              disabled={submitting}
            >
              Close
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelBooking}
              disabled={submitting || !reason}
            >
              {submitting ? "Cancelling..." : "Confirm Cancel"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ChatWidget />
      <Footer />
    </div>
  );
};

export default Bookings;