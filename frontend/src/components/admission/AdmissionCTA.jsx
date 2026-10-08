import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Phone, MessageCircle, MapPin, Clock } from "lucide-react";

import "./AdmissionCTA.css";

const API_URL = import.meta.env.VITE_API_URL ?? "";

function AdmissionCTA() {
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

  const phone = institute?.phone || "+91 99745 39118";
  const whatsappNumber = institute?.whatsappNumber || "9974539118";
  const whatsappHref = `https://wa.me/${whatsappNumber.replace(/\D/g, "")}`;
  const address =
    institute?.address ||
    "3rd Floor, Akshar Pavilion, Opp. Rosedale Heights, Yogi Nagar Township, Vasna Bhayli Main Road, Vadodara, Gujarat 391410";
  const hours = institute?.workingHours || "Mon–Sat: 7:30 AM–8:00 PM | Sun: 7:30 AM–2:00 PM";

  return (
    <section className="academic-cta" id="admission">
      <div className="academic-cta__ambient" aria-hidden="true" />

      <div className="site-container academic-cta__container">
        <div className="academic-cta__content">
          <span className="academic-cta__eyebrow">ACADEMIC ADMISSIONS</span>

          <h2 className="academic-cta__title">
            The next chapter of your academic journey starts here.
          </h2>

          <p className="academic-cta__desc">
            Where Potential Becomes Power. Consult our faculty in Vadodara to explore the right
            concept-driven preparation pathway for Classes 6–12 Science, Board excellence, JEE, NEET, GUJCET, and Olympiads.
          </p>

          <div className="academic-cta__actions">
            <Link to="/contact" className="academic-cta__primary-btn">
              <span>Submit Admission Enquiry</span>
              <ArrowRight size={16} strokeWidth={2.2} />
            </Link>

            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="academic-cta__whatsapp-btn"
            >
              <MessageCircle size={16} strokeWidth={2} />
              <span>WhatsApp Consultation</span>
            </a>

            <a href={`tel:${phone}`} className="academic-cta__phone-btn">
              <Phone size={15} strokeWidth={2} />
              <span>{phone}</span>
            </a>
          </div>

          <div className="academic-cta__meta-bar">
            <div className="academic-cta__meta-item">
              <MapPin size={15} className="academic-cta__meta-icon" />
              <a
                href="https://www.google.com/maps/search/?api=1&query=Inspired+Institute+Akshar+Pavilion+Vasna+Bhayli+Main+Road+Vadodara+Gujarat+391410"
                target="_blank"
                rel="noopener noreferrer"
                className="academic-cta__address-link"
              >
                {address}
              </a>
            </div>
            <div className="academic-cta__meta-sep" />
            <div className="academic-cta__meta-item">
              <Clock size={15} className="academic-cta__meta-icon" />
              <span>{hours}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AdmissionCTA;
