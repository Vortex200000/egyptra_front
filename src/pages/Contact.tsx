import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import { Phone, Mail, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

const Contact = () => {
  const { toast } = useToast();
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: t("contact.form.errors.missing.title"),
        description: t("contact.form.errors.missing.desc"),
        variant: "destructive",
      });
      return;
    }

    toast({
      title: t("contact.form.success.title"),
      description: t("contact.form.success.desc"),
    });

    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-sky py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-foreground mb-4">
            {t("contact.hero.title")}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t("contact.hero.subtitle")}
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
          {/* Contact Information */}
          <div className="space-y-8">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Phone className="h-5 w-5 mr-2 text-primary" />
                  {t("contact.info.phone.title")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-2">
                  <strong>{t("contact.info.phone.main")}</strong>
                  <br />
                  +20 109 370 6046
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="h-5 w-5 mr-2 text-primary" />
                  {t("contact.info.email.title")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  <strong>{t("contact.info.email.support")}</strong>
                  <br />
                  mimmosafari56@gmail.com
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-glow">
              <CardHeader>
                <CardTitle className="text-2xl">
                  {t("contact.form.title")}
                </CardTitle>
                <p className="text-muted-foreground">
                  {t("contact.form.subtitle")}
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">{t("contact.form.name")}</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        placeholder={t("contact.form.placeholders.name")}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">{t("contact.form.email")}</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        placeholder={t("contact.form.placeholders.email")}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">{t("contact.form.subject")}</Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) =>
                        handleInputChange("subject", e.target.value)
                      }
                      placeholder={t("contact.form.placeholders.subject")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">{t("contact.form.message")}</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) =>
                        handleInputChange("message", e.target.value)
                      }
                      placeholder={t("contact.form.placeholders.message")}
                      rows={6}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="hero"
                    size="lg"
                    className="w-full"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {t("contact.form.send")}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* FAQ Section */}
            <Card className="mt-8 shadow-card">
              <CardHeader>
                <CardTitle>{t("contact.faq.title")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">
                    {t("contact.faq.q1.q")}
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    {t("contact.faq.q1.a")}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">
                    {t("contact.faq.q2.q")}
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    {t("contact.faq.q2.a")}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">
                    {t("contact.faq.q3.q")}
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    {t("contact.faq.q3.a")}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">
                    {t("contact.faq.q4.q")}
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    {t("contact.faq.q4.a")}
                  </p>
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

export default Contact;

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import Navigation from "@/components/Navigation";
// import Footer from "@/components/Footer";
// import ChatWidget from "@/components/ChatWidget";
// import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";

// const Contact = () => {
//   const { toast } = useToast();
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     subject: "",
//     message: "",
//   });

//   const handleInputChange = (field: string, value: string) => {
//     setFormData((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!formData.name || !formData.email || !formData.message) {
//       toast({
//         title: "Missing Information",
//         description: "Please fill in all required fields.",
//         variant: "destructive",
//       });
//       return;
//     }

//     // Simulate form submission
//     toast({
//       title: "Message Sent!",
//       description:
//         "Thank you for contacting us. We'll get back to you within 24 hours.",
//     });

//     // Reset form
//     setFormData({
//       name: "",
//       email: "",
//       subject: "",
//       message: "",
//     });
//   };

//   return (
//     <div className="min-h-screen bg-background">
//       <Navigation />

//       {/* Hero Section */}
//       <section className="bg-gradient-sky py-20">
//         <div className="container mx-auto px-4 text-center">
//           <h1 className="text-5xl font-bold text-foreground mb-4">
//             Get in Touch
//           </h1>
//           <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
//             Have questions about our tours? Need help planning your adventure?
//             We're here to help!
//           </p>
//         </div>
//       </section>

//       <div className="container mx-auto px-4 py-12">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
//           {/* Contact Information */}
//           <div className="space-y-8">
//             {/* <Card className="shadow-card">
//               <CardHeader>
//                 <CardTitle className="flex items-center">
//                   <MapPin className="h-5 w-5 mr-2 text-primary" />
//                   Visit Our Office
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <p className="text-muted-foreground">
//                   123 Adventure Street<br />
//                   Travel City, TC 12345<br />
//                   United States
//                 </p>
//               </CardContent>
//             </Card> */}

//             <Card className="shadow-card">
//               <CardHeader>
//                 <CardTitle className="flex items-center">
//                   <Phone className="h-5 w-5 mr-2 text-primary" />
//                   Call Us
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <p className="text-muted-foreground mb-2">
//                   <strong>Main Office:</strong>
//                   <br />
//                   +20 109 370 6046
//                 </p>
//                 {/* <p className="text-muted-foreground">
//                   <strong>Emergency Line:</strong>
//                   <br />
//                   +1 (555) 987-6543
//                 </p> */}
//               </CardContent>
//             </Card>

//             <Card className="shadow-card">
//               <CardHeader>
//                 <CardTitle className="flex items-center">
//                   <Mail className="h-5 w-5 mr-2 text-primary" />
//                   Email Us
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 {/* <p className="text-muted-foreground mb-2">
//                   <strong>General Inquiries:</strong>
//                   <br />
//                   info@tourguideexplorer.com
//                 </p>
//                 <p className="text-muted-foreground mb-2">
//                   <strong>Bookings:</strong>
//                   <br />
//                   bookings@tourguideexplorer.com
//                 </p> */}
//                 <p className="text-muted-foreground">
//                   <strong>Support:</strong>
//                   <br />
//                   support@tourguideexplorer.com
//                 </p>
//               </CardContent>
//             </Card>

//             {/* <Card className="shadow-card">
//               <CardHeader>
//                 <CardTitle className="flex items-center">
//                   <Clock className="h-5 w-5 mr-2 text-primary" />
//                   Business Hours
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-2 text-muted-foreground">
//                   <div className="flex justify-between">
//                     <span>Monday - Friday:</span>
//                     <span>9:00 AM - 6:00 PM</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span>Saturday:</span>
//                     <span>10:00 AM - 4:00 PM</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span>Sunday:</span>
//                     <span>Closed</span>
//                   </div>
//                   <div className="mt-4 text-sm">
//                     <strong>Emergency Support:</strong>
//                     <br />
//                     Available 24/7 for active tours
//                   </div>
//                 </div>
//               </CardContent>
//             </Card> */}
//           </div>

//           {/* Contact Form */}
//           <div className="lg:col-span-2">
//             <Card className="shadow-glow">
//               <CardHeader>
//                 <CardTitle className="text-2xl">Send us a Message</CardTitle>
//                 <p className="text-muted-foreground">
//                   Fill out the form below and we'll get back to you as soon as
//                   possible.
//                 </p>
//               </CardHeader>
//               <CardContent>
//                 <form onSubmit={handleSubmit} className="space-y-6">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div className="space-y-2">
//                       <Label htmlFor="name">Full Name *</Label>
//                       <Input
//                         id="name"
//                         value={formData.name}
//                         onChange={(e) =>
//                           handleInputChange("name", e.target.value)
//                         }
//                         placeholder="Enter your full name"
//                         required
//                       />
//                     </div>
//                     <div className="space-y-2">
//                       <Label htmlFor="email">Email Address *</Label>
//                       <Input
//                         id="email"
//                         type="email"
//                         value={formData.email}
//                         onChange={(e) =>
//                           handleInputChange("email", e.target.value)
//                         }
//                         placeholder="Enter your email"
//                         required
//                       />
//                     </div>
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="subject">Subject</Label>
//                     <Input
//                       id="subject"
//                       value={formData.subject}
//                       onChange={(e) =>
//                         handleInputChange("subject", e.target.value)
//                       }
//                       placeholder="What is this regarding?"
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="message">Message *</Label>
//                     <Textarea
//                       id="message"
//                       value={formData.message}
//                       onChange={(e) =>
//                         handleInputChange("message", e.target.value)
//                       }
//                       placeholder="Tell us how we can help you..."
//                       rows={6}
//                       required
//                     />
//                   </div>

//                   <Button
//                     type="submit"
//                     variant="hero"
//                     size="lg"
//                     className="w-full"
//                   >
//                     <Send className="h-4 w-4 mr-2" />
//                     Send Message
//                   </Button>
//                 </form>
//               </CardContent>
//             </Card>

//             {/* FAQ Section */}
//             <Card className="mt-8 shadow-card">
//               <CardHeader>
//                 <CardTitle>Frequently Asked Questions</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div>
//                   <h4 className="font-semibold mb-2">
//                     How far in advance should I book?
//                   </h4>
//                   <p className="text-muted-foreground text-sm">
//                     We recommend booking at least 2-3 months in advance for
//                     international tours and 4-6 weeks for domestic tours to
//                     ensure availability.
//                   </p>
//                 </div>
//                 <div>
//                   <h4 className="font-semibold mb-2">
//                     What's included in the tour price?
//                   </h4>
//                   <p className="text-muted-foreground text-sm">
//                     Tour prices typically include accommodation, transportation,
//                     guided activities, and some meals. Check each tour's details
//                     for specific inclusions.
//                   </p>
//                 </div>
//                 <div>
//                   <h4 className="font-semibold mb-2">
//                     Can I customize a tour?
//                   </h4>
//                   <p className="text-muted-foreground text-sm">
//                     Absolutely! Contact us to discuss custom itineraries
//                     tailored to your preferences, group size, and budget.
//                   </p>
//                 </div>
//                 <div>
//                   <h4 className="font-semibold mb-2">
//                     What if I need to cancel?
//                   </h4>
//                   <p className="text-muted-foreground text-sm">
//                     Our cancellation policy varies by tour. Most tours offer
//                     full refunds if cancelled 30+ days in advance. Check
//                     specific terms when booking.
//                   </p>
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

// export default Contact;
