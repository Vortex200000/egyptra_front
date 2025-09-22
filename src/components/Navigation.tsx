// import { useState } from "react";
// import { Link, useLocation } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
// import { Menu, MapPin, MessageCircle } from "lucide-react";

// const Navigation = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const location = useLocation();

//   const navItems = [
//     { name: "Home", path: "/" },
//     { name: "Tours", path: "/tours" },
//     { name: "About", path: "/about" },
//     { name: "Contact", path: "/contact" },
//     { name: "Chat", path: "/chat" },
//     { name: "Bookings", path: "/bookings" },
//   ];

//   const isActive = (path: string) => location.pathname === path;

//   return (
//     <nav className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
//       <div className="container mx-auto px-4">
//         <div className="flex items-center justify-between h-16">
//           {/* Logo */}
//           <Link to="/" className="flex items-center space-x-2">
//             <MapPin className="h-8 w-8 text-primary" />
//             <span className="text-xl font-bold  bg-clip-text ">
//               TourGuide Explorer
//             </span>
//           </Link>

//           {/* Desktop Navigation */}
//           <div className="hidden md:flex items-center space-x-1">
//             {navItems.map((item) => (
//               <Link key={item.name} to={item.path}>
//                 <Button
//                   variant={isActive(item.path) ? "default" : "ghost"}
//                   className="transition-smooth"
//                 >
//                   {item.name === "Chat" && (
//                     <MessageCircle className="h-4 w-4 mr-2" />
//                   )}
//                   {item.name}
//                 </Button>
//               </Link>
//             ))}
//           </div>

//           {/* Mobile Navigation */}
//           <Sheet open={isOpen} onOpenChange={setIsOpen}>
//             <SheetTrigger asChild className="md:hidden">
//               <Button variant="ghost" size="sm">
//                 <Menu className="h-5 w-5" />
//               </Button>
//             </SheetTrigger>
//             <SheetContent side="right" className="w-[300px] sm:w-[400px]">
//               <div className="flex flex-col space-y-4 mt-8">
//                 <Link to="/" className="flex items-center space-x-2 mb-6">
//                   <MapPin className="h-6 w-6 text-primary" />
//                   <span className="text-lg font-bold bg-gradient-ocean bg-clip-text text-transparent">
//                     TourGuide Explorer
//                   </span>
//                 </Link>
//                 {navItems.map((item) => (
//                   <Link
//                     key={item.name}
//                     to={item.path}
//                     onClick={() => setIsOpen(false)}
//                   >
//                     <Button
//                       variant={isActive(item.path) ? "default" : "ghost"}
//                       className="w-full justify-start transition-smooth"
//                     >
//                       {item.name === "Chat" && (
//                         <MessageCircle className="h-4 w-4 mr-2" />
//                       )}
//                       {item.name}
//                     </Button>
//                   </Link>
//                 ))}
//               </div>
//             </SheetContent>
//           </Sheet>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navigation;
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Menu,
  MapPin,
  MessageCircle,
  User,
  LogOut,
  Globe,
  EyeIcon,
} from "lucide-react";
import EyeOfRaAnkh from "../assets/icons/Eye-of-Ra-Ankh.svg";
import EyeOfRaAnkh2 from "../assets/icons/nata.png";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "react-i18next";

interface Language {
  code: string;
  name: string;
  flag: string;
}

const languages: Language[] = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "it", name: "Italiano", flag: "🇮🇹" },
];

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, signOut, loading } = useAuth();
  const { i18n, t } = useTranslation();

  const navItems = [
    { name: t("navigation.home", "Home"), path: "/" },
    { name: t("navigation.tours", "Tours"), path: "/tours" },
    { name: t("navigation.about", "About"), path: "/about" },
    { name: t("navigation.contact", "Contact"), path: "/contact" },
    { name: t("navigation.chat", "Chat"), path: "/chat" },
    { name: t("navigation.bookings", "Bookings"), path: "/bookings" },
  ];

  const changeLanguage = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
  };

  const currentLanguage =
    languages.find((lang) => lang.code === i18n.language) || languages[0];

  const isActive = (path: string) => location.pathname === path;

  const LanguageSwitcher = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">{currentLanguage.name}</span>
          <span className="sm:hidden">{currentLanguage.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => changeLanguage(language.code)}
            className={`gap-2 ${
              i18n.language === language.code ? "bg-accent" : ""
            }`}
          >
            <span className="text-lg">{language.flag}</span>
            <span>{language.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <nav className="bg-background border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img src={EyeOfRaAnkh2} alt="Eye of Ra" className="h-20 w-20  object-contain" />
            <span className="text-xl font-bold text-black">
              {t("brand.name")}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link key={item.name} to={item.path}>
                <Button
                  variant={isActive(item.path) ? "default" : "ghost"}
                  className="transition-smooth"
                >
                  {item.name === t("nav.chat", "Chat") && (
                    <MessageCircle className="h-4 w-4 mr-2" />
                  )}
                  {item.name}
                </Button>
              </Link>
            ))}

            {/* Language Switcher - Desktop */}
            <div className="ml-2">
              <LanguageSwitcher />
            </div>

            {!loading && (
              <div className="flex items-center space-x-2 ml-4">
                {user ? (
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <User className="h-4 w-4" />
                      <span>{user.email}</span>
                    </div>
                    <Button onClick={signOut} variant="ghost" size="sm">
                      <LogOut className="h-4 w-4 mr-2" />
                      {t("auth.signOut", "Sign Out")}
                    </Button>
                  </div>
                ) : (
                  <Link to="/auth">
                    <Button
                      variant="hero"
                      size="sm"
                      className="w-full justify-start bg-yellow-500 text-black hover:bg-primary hover:text-black"
                    >
                      <User className="h-4 w-4 mr-2" />
                      {t("auth.signIn", "Sign In")}
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="sm" className="text-black">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col space-y-4 mt-8">
                <Link to="/" className="flex items-center space-x-2 mb-6">
                  <MapPin className="h-6 w-6 text-gray-600" />
                  <span className="text-lg font-bold text-black">
                    {t("brand.name", "TourGuide Explorer")}
                  </span>
                </Link>

                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                  >
                    <Button
                      variant={isActive(item.path) ? "default" : "ghost"}
                      className="w-full justify-start transition-smooth"
                    >
                      {item.name === t("nav.chat", "Chat") && (
                        <MessageCircle className="h-4 w-4 mr-2" />
                      )}
                      {item.name}
                    </Button>
                  </Link>
                ))}

                {/* Language Switcher - Mobile */}
                <div className="pt-2 border-t border-border">
                  <div className="px-2 mb-2">
                    <span className="text-sm text-muted-foreground">
                      {t("nav.language", "Language")}
                    </span>
                  </div>
                  <LanguageSwitcher />
                </div>

                {!loading && (
                  <div className="pt-4 border-t border-border">
                    {user ? (
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 px-3 py-2 text-sm text-muted-foreground">
                          <User className="h-4 w-4" />
                          <span>{user.email}</span>
                        </div>
                        <Button
                          onClick={() => {
                            signOut();
                            setIsOpen(false);
                          }}
                          variant="ghost"
                          className="w-full justify-start"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          {t("auth.signOut", "Sign Out")}
                        </Button>
                      </div>
                    ) : (
                      <Link to="/auth" onClick={() => setIsOpen(false)}>
                        <Button
                          variant="hero"
                          className="w-full justify-start bg-yellow-500 text-black hover:bg-primary hover:text-yellow-500"
                        >
                          <User className="h-4 w-4 mr-2" />
                          {t("auth.signIn", "Sign In")}
                        </Button>
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
