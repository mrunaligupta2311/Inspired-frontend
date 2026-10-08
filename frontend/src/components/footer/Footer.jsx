import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Phone, Mail, MessageCircle, MapPin, Clock } from "lucide-react";

import "./Footer.css";
import logo from "../../assets/inspired_institute_logo.jpeg";

const API_URL = import.meta.env.VITE_API_URL ?? "";

function Footer() {
  const [institute, setInstitute] = useState(null);

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

  const instituteName = institute?.name || "Inspired Institute";
  const phone = institute?.phone || "+91 98765 43210";
  const email = institute?.email || "contact@inspiredinstitute.com";
  const address = institute?.address || "Alkapuri, Vadodara, Gujarat 390007";
  const hours = institute?.workingHours || "Monday – Saturday: 8:00 AM – 8:00 PM";
  const whatsappNumber = institute?.whatsappNumber || "919876543210";
  const whatsappHref = `https://wa.me/${whatsappNumber.replace(/\D/g, "")}`;

  const instagramUrl = institute?.instagramUrl || "#";
  const facebookUrl = institute?.facebookUrl || "#";
  const youtubeUrl = institute?.youtubeUrl || "#";
  const linkedinUrl = institute?.linkedinUrl || "#";

  return (
    <footer className="academic-footer">
      <div className="site-container academic-footer__container">
        {/* Top 4-Column Grid */}
        <div className="academic-footer__grid">
          {/* Col 1: Brand & Philosophy */}
          <div className="academic-footer__col academic-footer__col--brand">
            <Link to="/" className="academic-footer__brand" aria-label="Inspired Institute Home">
              <img
                src={logo}
                alt="Inspired Institute Crest"
                className="academic-footer__logo-img"
              />
              <div className="academic-footer__brand-text">
                <span className="academic-footer__brand-name">{instituteName}</span>
                <span className="academic-footer__brand-tag">LEARN · PREPARE · ACHIEVE</span>
              </div>
            </Link>

            <p className="academic-footer__about-text">
              A premier academic coaching institution in Vadodara dedicated to concept-first learning,
              rigorous scientific reasoning, and competitive entrance preparation across Classes 6–12,
              JEE, NEET, GUJCET, and Olympiads.
            </p>

            <div className="academic-footer__social-links">
              {instagramUrl && instagramUrl !== "#" && (
                <a href={instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </a>
              )}
              {facebookUrl && facebookUrl !== "#" && (
                <a href={facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                </a>
              )}
              {youtubeUrl && youtubeUrl !== "#" && (
                <a href={youtubeUrl} target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="#030b17"></polygon></svg>
                </a>
              )}
              {linkedinUrl && linkedinUrl !== "#" && (
                <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                </a>
              )}
            </div>
          </div>

          {/* Col 2: Academic Programs */}
          <div className="academic-footer__col">
            <h4 className="academic-footer__col-title">Academic Curricula</h4>
            <ul className="academic-footer__links">
              <li><Link to="/courses">Pre-Foundation Program (Class 6–8)</Link></li>
              <li><Link to="/courses">High School Foundation (Class 9–10)</Link></li>
              <li><Link to="/courses">Senior Secondary Science (Class 11–12)</Link></li>
              <li><Link to="/courses">JEE Main & Advanced Program</Link></li>
              <li><Link to="/courses">NEET UG Medical Entrance</Link></li>
              <li><Link to="/courses">GUJCET Engineering & Pharmacy</Link></li>
              <li><Link to="/courses">Olympiad & Aptitude Pathways</Link></li>
            </ul>
          </div>

          {/* Col 3: Institutional Navigation */}
          <div className="academic-footer__col">
            <h4 className="academic-footer__col-title">Institution</h4>
            <ul className="academic-footer__links">
              <li><Link to="/about">Our Philosophy & Pedagogy</Link></li>
              <li><Link to="/courses">Academic Curricula & Courses</Link></li>
              <li><Link to="/faculty">Faculty & Mentors</Link></li>
              <li><Link to="/results">Student Results & Achievements</Link></li>
              <li><Link to="/gallery">Campus Life & Activities</Link></li>
              <li><Link to="/contact">Admissions & Counseling Desk</Link></li>
            </ul>
          </div>

          {/* Col 4: Campus Desk & Contact */}
          <div className="academic-footer__col">
            <h4 className="academic-footer__col-title">Admissions Office</h4>
            <div className="academic-footer__contact-items">
              <div className="academic-footer__contact-item">
                <MapPin size={15} className="academic-footer__contact-icon" />
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Inspired+Institute+Akshar+Pavilion+Vasna+Bhayli+Main+Road+Vadodara+Gujarat+391410"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="academic-footer__address-link"
                >
                  {address}
                </a>
              </div>
              <div className="academic-footer__contact-item">
                <Phone size={15} className="academic-footer__contact-icon" />
                <a href={`tel:${phone}`}>{phone}</a>
              </div>
              <div className="academic-footer__contact-item">
                <MessageCircle size={15} className="academic-footer__contact-icon" />
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                  WhatsApp Direct Consultation
                </a>
              </div>
              {email && email !== "contact@inspiredinstitute.com" && (
                <div className="academic-footer__contact-item">
                  <Mail size={15} className="academic-footer__contact-icon" />
                  <a href={`mailto:${email}`}>{email}</a>
                </div>
              )}
              <div className="academic-footer__contact-item">
                <Clock size={15} className="academic-footer__contact-icon" />
                <span>{hours}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="academic-footer__bottom">
          <p className="academic-footer__copyright">
            © {new Date().getFullYear()} Inspired Institute, Vadodara. All rights reserved.
          </p>
          <div className="academic-footer__legal-links">
            <span>Aligned with CBSE · ICSE · GSEB Curricular Standards</span>
            <span className="academic-footer__legal-sep">·</span>
            <span>Non-commercial Concept-First Academic Coaching</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
