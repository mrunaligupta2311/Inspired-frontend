import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  MapPin,
  Phone,
  MessageCircle,
  Mail,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import "./Contact.css";

const API_URL = import.meta.env.VITE_API_URL ?? "";

function Contact() {
  const [searchParams] = useSearchParams();
  const prefilledCourse = searchParams.get("course") || "";
  const prefilledClass = searchParams.get("class") || "";

  const [institute, setInstitute] = useState(null);
  const [courses, setCourses] = useState([]);

  const [form, setForm] = useState(() => ({
    studentName: "",
    phoneNumber: "",
    studentClass: prefilledClass || "",
    interestedCourse: prefilledCourse || "",
    message: "",
  }));

  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      try {
        const [instRes, courseRes] = await Promise.allSettled([
          fetch(`${API_URL}/api/institute`),
          fetch(`${API_URL}/api/courses?public=true`),
        ]);

        if (instRes.status === "fulfilled" && instRes.value.ok) {
          const instData = await instRes.value.json();
          if (mounted && instData?.data) setInstitute(instData.data);
        }

        if (courseRes.status === "fulfilled" && courseRes.value.ok) {
          const cData = await courseRes.value.json();
          if (mounted && cData?.data && Array.isArray(cData.data)) {
            setCourses(cData.data);
          }
        }
      } catch (err) {
        console.warn("Contact load notice:", err.message);
      }
    };

    loadData();
    return () => {
      mounted = false;
    };
  }, []);

  const instituteName = institute?.name || "Inspired Institute";
  const phone = institute?.phone || "+91 99745 39118";
  const email = institute?.email || "";
  const address =
    institute?.address ||
    "3rd Floor, Akshar Pavilion, Opp. Rosedale Heights, Yogi Nagar Township, Vasna Bhayli Main Road, Vadodara, Gujarat 391410";
  const hours = institute?.workingHours || "Mon–Sat: 7:30 AM–8:00 PM | Sun: 7:30 AM–2:00 PM";
  const whatsappNumber = institute?.whatsappNumber || "9974539118";
  const whatsappDigits = whatsappNumber.replace(/\D/g, "");
  const whatsappHref = `https://wa.me/${whatsappDigits}?text=${encodeURIComponent(
    `Hello Inspired Institute, I would like to schedule an academic counseling session for admissions.`
  )}`;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setSubmitSuccess(false);

    if (!form.studentName.trim() || !form.phoneNumber.trim()) {
      setSubmitError("Please provide both the student name and a contact phone number.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/api/enquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const res = await response.json().catch(() => ({}));

      if (!response.ok || !res.success) {
        throw new Error(res.message || "Failed to submit enquiry. Please call us directly.");
      }

      setSubmitSuccess(true);
      setForm({
        studentName: "",
        phoneNumber: "",
        studentClass: "",
        interestedCourse: "",
        message: "",
      });
    } catch (err) {
      setSubmitError(err.message || "Unable to submit enquiry right now. Please try again or reach out on WhatsApp.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="contact-desk-page">
      {/* 1. Academic Hero */}
      <section className="contact-hero">
        <div className="site-container contact-hero__container">
          <span className="contact-hero__eyebrow">ACADEMIC ADMISSIONS & COUNSELING DESK</span>
          <h1 className="contact-hero__title">
            Begin your diagnostic consultation with {instituteName}.
          </h1>
          <p className="contact-hero__lead">
            Admissions at {instituteName} begin with an honest assessment of conceptual fundamentals,
            not high-pressure sales pitches. We invite parents and aspiring scholars to submit an enquiry
            or visit our coaching center at Akshar Pavilion, Vasna Bhayli Main Road, Vadodara.
          </p>

          {/* Quick Direct Desk Contacts */}
          <div className="contact-hero__contacts">
            <div className="contact-hero__contact-item">
              <Phone size={16} className="contact-hero__icon" />
              <div>
                <strong>Admissions Hotline</strong>
                <a href={`tel:${phone}`}>{phone}</a>
              </div>
            </div>
            <div className="contact-hero__contact-sep" />
            <div className="contact-hero__contact-item">
              <MessageCircle size={16} className="contact-hero__icon" />
              <div>
                <strong>WhatsApp Desk</strong>
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                  Direct WhatsApp Chat
                </a>
              </div>
            </div>
            {email && email !== "contact@inspiredinstitute.com" ? (
              <>
                <div className="contact-hero__contact-sep" />
                <div className="contact-hero__contact-item">
                  <Mail size={16} className="contact-hero__icon" />
                  <div>
                    <strong>Email Inquiries</strong>
                    <a href={`mailto:${email}`}>{email}</a>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="contact-hero__contact-sep" />
                <div className="contact-hero__contact-item">
                  <MapPin size={16} className="contact-hero__icon" />
                  <div>
                    <strong>Location</strong>
                    <a
                      href="https://www.google.com/maps/search/?api=1&query=Inspired+Institute+Akshar+Pavilion+Vasna+Bhayli+Main+Road+Vadodara+Gujarat+391410"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Vasna Bhayli Main Rd
                    </a>
                  </div>
                </div>
              </>
            )}
            <div className="contact-hero__contact-sep" />
            <div className="contact-hero__contact-item">
              <Clock size={16} className="contact-hero__icon" />
              <div>
                <strong>Counseling Hours</strong>
                <span>{hours}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Dual-Column Consultation Layout */}
      <section className="contact-content-section">
        <div className="site-container contact-grid">
          {/* Left Column: Campus Visit & Consultation Protocol */}
          <div className="contact-protocol-col">
            <span className="contact-section-kicker">ADMISSIONS PROTOCOL</span>
            <h2 className="contact-protocol-title">
              What to expect during your admissions consultation.
            </h2>
            <p className="contact-protocol-intro">
              Every serious student deserves an individualized roadmap.
              During your visit to our Vadodara center, we follow a structured 3-step appraisal:
            </p>

            <div className="contact-protocol-steps">
              <div className="contact-protocol-step">
                <span className="contact-step-num tabular-nums">01</span>
                <div>
                  <strong>Diagnostic Conceptual Appraisal</strong>
                  <p>
                    A brief, pressure-free evaluation mapping baseline math-science agility and logical derivation skills.
                  </p>
                </div>
              </div>

              <div className="contact-protocol-step">
                <span className="contact-step-num tabular-nums">02</span>
                <div>
                  <strong>1-on-1 Senior Faculty Dialogue</strong>
                  <p>
                    Direct conversation with department heads to understand school board goals and entrance exam timelines.
                  </p>
                </div>
              </div>

              <div className="contact-protocol-step">
                <span className="contact-step-num tabular-nums">03</span>
                <div>
                  <strong>Tailored Dual-Track Schedule</strong>
                  <p>
                    Recommendation of the appropriate batch intake, study hours, and testing frequency without syllabus conflict.
                  </p>
                </div>
              </div>
            </div>

            {/* Campus Location Card */}
            <div className="contact-location-card">
              <div className="contact-location-header">
                <MapPin size={18} className="contact-location-icon" />
                <h3>Vadodara Institute Address</h3>
              </div>
              <p className="contact-location-address">{address}</p>
              <div className="contact-location-meta">
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Inspired+Institute+Akshar+Pavilion+Vasna+Bhayli+Main+Road+Vadodara+Gujarat+391410"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-maps-link"
                >
                  Open in Google Maps / Get Directions →
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Structured Admissions Enquiry Form */}
          <div className="contact-form-col">
            <div className="contact-form-card">
              <div className="contact-form-header">
                <h3 className="contact-form-title">Submit Admission Enquiry</h3>
                <p className="contact-form-sub">
                  Fill in the details below. Our academic counseling coordinator will contact you within 24 hours.
                </p>
              </div>

              {submitSuccess && (
                <div className="contact-success-banner" role="status">
                  <CheckCircle2 size={20} className="contact-success-icon" />
                  <div>
                    <strong>Enquiry Received Successfully</strong>
                    <p>
                      Thank you for contacting Inspired Institute. An academic counselor will call you shortly to discuss batch availability and consultation schedules.
                    </p>
                  </div>
                </div>
              )}

              {submitError && (
                <div className="contact-error-banner" role="alert">
                  <AlertCircle size={20} className="contact-error-icon" />
                  <div>
                    <strong>Submission Notice</strong>
                    <p>{submitError}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="contact-form">
                <div className="contact-form-row">
                  <div className="contact-form-field">
                    <label htmlFor="studentName" className="contact-label">
                      Student Full Name <span className="contact-required">*</span>
                    </label>
                    <input
                      type="text"
                      id="studentName"
                      name="studentName"
                      required
                      placeholder="e.g. Aryan Sharma"
                      value={form.studentName}
                      onChange={handleChange}
                      className="contact-input"
                    />
                  </div>

                  <div className="contact-form-field">
                    <label htmlFor="phoneNumber" className="contact-label">
                      Contact Phone Number <span className="contact-required">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      required
                      placeholder="e.g. +91 98765 43210"
                      value={form.phoneNumber}
                      onChange={handleChange}
                      className="contact-input"
                    />
                  </div>
                </div>

                <div className="contact-form-row">
                  <div className="contact-form-field">
                    <label htmlFor="studentClass" className="contact-label">
                      Current Academic Class
                    </label>
                    <select
                      id="studentClass"
                      name="studentClass"
                      value={form.studentClass}
                      onChange={handleChange}
                      className="contact-select"
                    >
                      <option value="">Select Academic Class</option>
                      <option value="6">Class 6 (Pre-Foundation)</option>
                      <option value="7">Class 7 (Pre-Foundation)</option>
                      <option value="8">Class 8 (Pre-Foundation)</option>
                      <option value="9">Class 9 (High School Foundation)</option>
                      <option value="10">Class 10 (Board & Foundation)</option>
                      <option value="11">Class 11 Science (JEE / NEET)</option>
                      <option value="12">Class 12 Science (Boards + Entrance)</option>
                      <option value="Dropper">Class 12 Passed (Repeater / Dropper)</option>
                    </select>
                  </div>

                  <div className="contact-form-field">
                    <label htmlFor="interestedCourse" className="contact-label">
                      Interested Program / Pathway
                    </label>
                    <select
                      id="interestedCourse"
                      name="interestedCourse"
                      value={form.interestedCourse}
                      onChange={handleChange}
                      className="contact-select"
                    >
                      <option value="">Select Program</option>
                      {courses.length > 0 ? (
                        courses.map((c) => (
                          <option key={c.id} value={c.title}>
                            {c.title}
                          </option>
                        ))
                      ) : (
                        <>
                          <option value="JEE Main & Advanced Program">JEE Main & Advanced Program</option>
                          <option value="NEET UG Medical Entrance">NEET UG Medical Entrance</option>
                          <option value="GUJCET Engineering & Pharmacy">GUJCET Engineering & Pharmacy</option>
                          <option value="Senior Secondary Science (11–12)">Senior Secondary Science (11–12)</option>
                          <option value="High School Foundation (9–10)">High School Foundation (9–10)</option>
                          <option value="Pre-Foundation (6–8)">Pre-Foundation (6–8)</option>
                          <option value="Olympiad & Aptitude Program">Olympiad & Aptitude Program</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>

                <div className="contact-form-field">
                  <label htmlFor="message" className="contact-label">
                    Specific Academic Inquiries or Goals (Optional)
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    placeholder="Mention specific target exams, current school board (CBSE/ICSE/GSEB), or preferred batch timings..."
                    value={form.message}
                    onChange={handleChange}
                    className="contact-textarea"
                  />
                </div>

                <div className="contact-form-submit-row">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="contact-submit-btn"
                  >
                    <span>{submitting ? "Submitting Enquiry..." : "Schedule Diagnostic Consultation"}</span>
                    <ArrowRight size={16} strokeWidth={2.2} />
                  </button>

                  <span className="contact-privacy-note">
                    Your details remain strictly confidential and will never be shared.
                  </span>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contact;