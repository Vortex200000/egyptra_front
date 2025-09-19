import { Link } from "react-router-dom";
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
} from "lucide-react";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-gradient-sky border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <MapPin className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold bg-clip-text">
                {t("footer.companyName")}
              </span>
            </div>
            <p className="text-muted-foreground text-sm">
              {t("footer.companyDescription")}
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer transition-smooth" />
              <Twitter className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer transition-smooth" />
              <Instagram className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer transition-smooth" />
              <Youtube className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer transition-smooth" />
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">
              {t("footer.quickLinks")}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-muted-foreground hover:text-primary transition-smooth"
                >
                  {t("footer.links.home")}
                </Link>
              </li>
              <li>
                <Link
                  to="/tours"
                  className="text-muted-foreground hover:text-primary transition-smooth"
                >
                  {t("footer.links.tours")}
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-muted-foreground hover:text-primary transition-smooth"
                >
                  {t("footer.links.about")}
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-muted-foreground hover:text-primary transition-smooth"
                >
                  {t("footer.links.contact")}
                </Link>
              </li>
              <li>
                <Link
                  to="/bookings"
                  className="text-muted-foreground hover:text-primary transition-smooth"
                >
                  {t("footer.links.bookings")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Tour Categories */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">
              {t("footer.tourCategories")}
            </h3>
            <ul className="space-y-2">
              <li>
                <span className="text-muted-foreground hover:text-primary cursor-pointer transition-smooth">
                  {t("footer.tours.beach")}
                </span>
              </li>
              <li>
                <span className="text-muted-foreground hover:text-primary cursor-pointer transition-smooth">
                  {t("footer.tours.adventure")}
                </span>
              </li>
              <li>
                <span className="text-muted-foreground hover:text-primary cursor-pointer transition-smooth">
                  {t("footer.tours.cultural")}
                </span>
              </li>
              <li>
                <span className="text-muted-foreground hover:text-primary cursor-pointer transition-smooth">
                  {t("footer.tours.wildlife")}
                </span>
              </li>
              <li>
                <span className="text-muted-foreground hover:text-primary cursor-pointer transition-smooth">
                  {t("footer.tours.city")}
                </span>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">
              {t("footer.contactInfo")}
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground text-sm">
                  {t("footer.contact.phone")}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground text-sm">
                  {t("footer.contact.email")}
                </span>
              </div>
              {/* <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-primary mt-0.5" />
                <span className="text-muted-foreground text-sm">
                  {t("footer.contact.address.line1")}
                  <br />
                  {t("footer.contact.address.line2")}
                </span>
              </div> */}
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-muted-foreground text-sm">
            {t("footer.copyright")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
