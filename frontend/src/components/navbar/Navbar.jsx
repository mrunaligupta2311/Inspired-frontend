import { useEffect, useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { ArrowUpRight, Menu, X, Phone, MessageCircle } from "lucide-react";

import "./Navbar.css";
import logo from "../../assets/inspired_institute_logo.jpeg";

const API_URL = import.meta.env.VITE_API_URL ?? "";

const navigationLinks = [
  { label: "Courses", path: "/courses" },
  { label: "Faculty", path: "/faculty" },
  { label: "Results", path: "/results" },
  { label: "Gallery", path: "/gallery" },
  { label: "About", path: "/about" },
  { label: "Contact", path: "/contact" },
];

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [institute, setInstitute] = useState(null);
  const location = useLocation();
  const [prevPath, setPrevPath] = useState(location.pathname);
  if (location.pathname !== prevPath) {
    setPrevPath(location.pathname);
    setIsMenuOpen(false);
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    let mounted = true;
    const fetchInstitute = async () => {
      try {
        const response = await fetch(`${API_URL}/api/institute`);
        if (response.ok) {
          const res = await response.json();
          if (mounted && res?.data) setInstitute(res.data);
        }
      } catch {
        // Fallback gracefully
      }
    };
    fetchInstitute();
    return () => {
      mounted = false;
    };
  }, []);

  const phone = institute?.phone || "+91 99745 39118";
  const whatsappNumber = institute?.whatsappNumber || "9974539118";
  const whatsappDigits = whatsappNumber.replace(/\D/g, "");
  const whatsappHref = `https://wa.me/${whatsappDigits}?text=${encodeURIComponent(
    "Hello Inspired Institute, I would like to inquire about admissions."
  )}`;
  const address =
    institute?.address ||
    "3rd Floor, Akshar Pavilion, Opp. Rosedale Heights, Yogi Nagar Township, Vasna Bhayli Main Road, Vadodara, Gujarat 391410";

  return (
    <header className={`academic-navbar ${isScrolled ? "is-scrolled" : ""}`}>
      <div className="academic-navbar__container">
        {/* Zone 1: Brand Lockup */}
        <Link to="/" className="academic-navbar__brand" aria-label="Inspired Institute Home">
          <img
            src={logo}
            alt="Inspired Institute Logo"
            className="academic-navbar__logo-img"
          />
          <div className="academic-navbar__brand-text">
            <span className="academic-navbar__title">INSPIRED INSTITUTE</span>
            <span className="academic-navbar__sub">CLASS 6–12 SCIENCE · JEE · NEET · VADODARA</span>
          </div>
        </Link>

        {/* Zone 2: Navigation Links */}
        <nav className="academic-navbar__nav" aria-label="Main Navigation">
          {navigationLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `academic-navbar__link ${isActive ? "is-active" : ""}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Zone 3: Primary Action & Controls */}
        <div className="academic-navbar__actions">
          <a
            href={`tel:${phone}`}
            className="academic-navbar__phone-link"
            title="Speak with Admissions"
          >
            <Phone size={14} strokeWidth={2.2} />
            <span className="tabular-nums">{phone}</span>
          </a>

          <Link to="/contact" className="academic-navbar__cta">
            <span>Admissions</span>
            <ArrowUpRight size={15} strokeWidth={2.4} />
          </Link>

          <button
            type="button"
            className="academic-navbar__toggle"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label={isMenuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X size={22} strokeWidth={2} /> : <Menu size={22} strokeWidth={2} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div className={`academic-navbar__mobile-drawer ${isMenuOpen ? "is-open" : ""}`}>
        <div className="academic-navbar__mobile-content">
          <div className="academic-navbar__mobile-header">
            <span className="academic-navbar__mobile-eyebrow">NAVIGATION DIRECTORY</span>
          </div>

          <nav className="academic-navbar__mobile-nav">
            <NavLink to="/" className="academic-navbar__mobile-link">
              Home
            </NavLink>
            {navigationLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className="academic-navbar__mobile-link"
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="academic-navbar__mobile-footer">
            <Link to="/contact" className="academic-navbar__mobile-cta">
              Schedule Admissions Consultation
            </Link>

            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="academic-navbar__mobile-whatsapp"
            >
              <MessageCircle size={17} strokeWidth={2} />
              <span>Direct WhatsApp Desk</span>
            </a>

            <div className="academic-navbar__mobile-meta">
              <p>Inspired Institute Campus</p>
              <small>{address}</small>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
