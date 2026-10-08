import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  GraduationCap,
  Clock,
  ShieldCheck,
  CheckCircle2,
  X,
  ArrowRight,
  BookOpen,
} from "lucide-react";

import AdmissionCTA from "../../components/admission/AdmissionCTA";
import "./Faculty.css";

const API_URL = import.meta.env.VITE_API_URL ?? "";

const DEPARTMENTS = [
  { id: "ALL", label: "All Academic Departments" },
  { id: "Physics", label: "Department of Physics" },
  { id: "Chemistry", label: "Department of Chemistry" },
  { id: "Mathematics", label: "Department of Mathematics" },
  { id: "Biology", label: "Department of Biology & Medical" },
];

const facultyFallbacks = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=85",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=700&q=85",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=700&q=85",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=700&q=85",
  "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=700&q=85",
  "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=700&q=85",
];

function Faculty() {
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeDepartment, setActiveDepartment] = useState("ALL");
  const [selectedFaculty, setSelectedFaculty] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchFaculty = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/api/faculty?public=true`);
        const result = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(result.message || "Failed to fetch faculty directory");
        }

        if (mounted && result.success && Array.isArray(result.data)) {
          setFaculty(result.data);
        }
      } catch (err) {
        console.error("Faculty fetch error:", err);
        if (mounted) setError(err.message || "Unable to load faculty directory.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchFaculty();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setSelectedFaculty(null);
      }
    };
    if (selectedFaculty) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedFaculty]);

  const filteredFaculty = useMemo(() => {
    if (activeDepartment === "ALL") return faculty;

    return faculty.filter((member) => {
      const subj = (member.subject || "").toLowerCase();
      const desig = (member.designation || "").toLowerCase();

      if (activeDepartment === "Physics") {
        return subj.includes("physics");
      }
      if (activeDepartment === "Chemistry") {
        return subj.includes("chemistry");
      }
      if (activeDepartment === "Mathematics") {
        return subj.includes("math") || subj.includes("mathematics");
      }
      if (activeDepartment === "Biology") {
        return subj.includes("bio") || subj.includes("biology") || subj.includes("botany") || subj.includes("zoology") || desig.includes("neet");
      }
      return true;
    });
  }, [faculty, activeDepartment]);

  return (
    <div className="faculty-showcase-page">
      {/* 1. Academic Hero */}
      <section className="faculty-hero">
        <div className="site-container faculty-hero__container">
          <span className="faculty-hero__eyebrow">ACADEMIC FACULTY & MENTORS</span>
          <h1 className="faculty-hero__title">
            Experienced educators dedicated to concept-driven mastery.
          </h1>
          <p className="faculty-hero__lead">
            Meet the faculty team at Inspired Institute in Vadodara. Our educators focus on turning curiosity
            into confidence, building strong subject foundations in Physics, Chemistry, Mathematics, and Biology,
            and providing supportive doubt resolution across Classes 6–12, JEE, NEET, and GUJCET.
          </p>

          {/* Academic Pillars */}
          <div className="faculty-hero__commitments">
            <div className="faculty-hero__commitment-item">
              <strong>Concept-Driven</strong>
              <span>Focus on fundamental theory & derivation</span>
            </div>
            <div className="faculty-hero__commitment-sep" />
            <div className="faculty-hero__commitment-item">
              <strong>Doubt Resolution</strong>
              <span>Dedicated sessions to clear every hurdle</span>
            </div>
            <div className="faculty-hero__commitment-sep" />
            <div className="faculty-hero__commitment-item">
              <strong>Supportive Mentors</strong>
              <span>Approachable guidance for serious students</span>
            </div>
            <div className="faculty-hero__commitment-sep" />
            <div className="faculty-hero__commitment-item">
              <strong>Vadodara Center</strong>
              <span>Vasna Bhayli Main Road coaching center</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Department Filter Tabs */}
      <section className="faculty-filters-section">
        <div className="site-container">
          <div className="faculty-filters-bar">
            <div className="faculty-filters-tabs" role="tablist" aria-label="Academic Departments">
              {DEPARTMENTS.map((dept) => (
                <button
                  key={dept.id}
                  type="button"
                  role="tab"
                  aria-selected={activeDepartment === dept.id}
                  className={`faculty-department-tab ${activeDepartment === dept.id ? "is-active" : ""}`}
                  onClick={() => setActiveDepartment(dept.id)}
                >
                  {dept.label}
                </button>
              ))}
            </div>

            <span className="faculty-count-indicator">
              Showing <strong>{filteredFaculty.length}</strong> Faculty Members
            </span>
          </div>
        </div>
      </section>

      {/* 3. Faculty Grid Showcase */}
      <section className="faculty-grid-section">
        <div className="site-container">
          {loading ? (
            <div className="faculty-cards-grid">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="faculty-skeleton-card" />
              ))}
            </div>
          ) : error && faculty.length === 0 ? (
            <div className="faculty-state-box">
              <p className="faculty-state-error">{error}</p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="faculty-retry-btn"
              >
                Retry Loading Faculty
              </button>
            </div>
          ) : filteredFaculty.length === 0 ? (
            <div className="faculty-state-box">
              <h3>No faculty members listed in this department</h3>
              <p>Try switching to "All Academic Departments".</p>
              <button
                type="button"
                onClick={() => setActiveDepartment("ALL")}
                className="faculty-retry-btn"
              >
                View All Departments
              </button>
            </div>
          ) : (
            <div className="faculty-cards-grid">
              {filteredFaculty.map((member, idx) => {
                const photo =
                  member.profileImage && member.profileImage.trim() !== ""
                    ? member.profileImage
                    : facultyFallbacks[idx % facultyFallbacks.length];

                return (
                  <article
                    key={member.id || idx}
                    className="faculty-member-card is-interactive"
                    onClick={() => setSelectedFaculty(member)}
                    tabIndex={0}
                    role="button"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSelectedFaculty(member);
                      }
                    }}
                    aria-label={`View detailed profile for ${member.name}`}
                  >
                    {/* Portrait Frame */}
                    <div className="faculty-member-portrait-wrap">
                      <img
                        src={photo}
                        alt={`${member.name} — ${member.subject}`}
                        className="faculty-member-portrait"
                        loading="lazy"
                      />
                      <div className="faculty-member-portrait-scrim" />
                      <div className="faculty-member-badge">
                        <span>{member.subject || "Academic Department"}</span>
                      </div>
                    </div>

                    {/* Member Details */}
                    <div className="faculty-member-content">
                      <div className="faculty-member-header">
                        <h2 className="faculty-member-name">{member.name}</h2>
                        <p className="faculty-member-designation">
                          {member.designation || "Senior Faculty Member"}
                        </p>
                      </div>

                      {/* Credentials Strip */}
                      <div className="faculty-member-credentials">
                        {member.qualification && (
                          <div className="faculty-credential-item">
                            <GraduationCap size={15} className="faculty-credential-icon" />
                            <span>{member.qualification}</span>
                          </div>
                        )}
                        {member.experience && (
                          <div className="faculty-credential-item">
                            <Clock size={14} className="faculty-credential-icon" />
                            <span className="tabular-nums">{member.experience}</span>
                          </div>
                        )}
                      </div>

                      {/* Teaching Philosophy / Bio */}
                      <p className="faculty-member-bio">
                        {member.bio ||
                          "Committed to first-principles conceptual derivations, systematic analytical problem solving, and individualized student doubt mentoring for national competitive examinations."}
                      </p>

                      <div className="faculty-member-footer">
                        <span className="faculty-mentor-tag">
                          Department Specialist · Inspired Institute
                        </span>
                        <span className="faculty-view-profile-btn">
                          <span>View Profile</span>
                          <ArrowRight size={13} />
                        </span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* 4. Pedagogical Standards Manifesto */}
      <section className="faculty-standards-section">
        <div className="site-container faculty-standards__container">
          <div className="faculty-standards__left">
            <span className="faculty-standards__eyebrow">PEDAGOGICAL RIGOR</span>
            <h2 className="faculty-standards__title">
              The Inspired faculty covenant: clarity, patience, and uncompromising depth.
            </h2>
            <p className="faculty-standards__prose">
              Our educators do not view competitive exams as mechanical formula tests.
              They approach Physics, Chemistry, Mathematics, and Biology as interconnected intellectual disciplines.
              Every classroom session is designed to transform passive listeners into active problem solvers.
            </p>
          </div>

          <div className="faculty-standards__right">
            <div className="faculty-standards__card">
              <div className="faculty-standards__card-header">
                <ShieldCheck size={20} className="faculty-standards__card-icon" />
                <h3>Four Non-Negotiable Standards</h3>
              </div>

              <ul className="faculty-standards__list">
                <li>
                  <CheckCircle2 size={16} className="faculty-check-icon" />
                  <div>
                    <strong>Proof Before Problem Sets</strong>
                    <p>No shortcut formula is ever taught without demonstrating its derivation from fundamental laws.</p>
                  </div>
                </li>
                <li>
                  <CheckCircle2 size={16} className="faculty-check-icon" />
                  <div>
                    <strong>Open-Door Academic Hours</strong>
                    <p>Dedicated daily slots for scholars to dissect mistakes, clarify doubts, and explore advanced problems.</p>
                  </div>
                </li>
                <li>
                  <CheckCircle2 size={16} className="faculty-check-icon" />
                  <div>
                    <strong>Direct Error Mapping</strong>
                    <p>Faculty directly audit test scripts, identifying whether marks were lost to conceptual gaps or misread constraints.</p>
                  </div>
                </li>
                <li>
                  <CheckCircle2 size={16} className="faculty-check-icon" />
                  <div>
                    <strong>Dual-Track Syllabus Alignment</strong>
                    <p>Equal respect for Board presentation perfection (CBSE/GSEB) and national entrance speed.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Admission Consultation CTA */}
      <AdmissionCTA />

      {/* 6. Interactive Faculty Detail Modal */}
      {selectedFaculty && (
        <div
          className="faculty-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="faculty-modal-title"
          onClick={() => setSelectedFaculty(null)}
        >
          <div
            className="faculty-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="faculty-modal-close"
              onClick={() => setSelectedFaculty(null)}
              aria-label="Close faculty profile"
            >
              <X size={20} />
            </button>

            <div className="faculty-modal-grid">
              <div className="faculty-modal-image-col">
                <img
                  src={
                    selectedFaculty.profileImage && selectedFaculty.profileImage.trim() !== ""
                      ? selectedFaculty.profileImage
                      : facultyFallbacks[0]
                  }
                  alt={selectedFaculty.name}
                  className="faculty-modal-portrait"
                />
                <div className="faculty-modal-badge">
                  <span>{selectedFaculty.subject || "Faculty"}</span>
                </div>
              </div>

              <div className="faculty-modal-info-col">
                <span className="faculty-modal-eyebrow">INSPIRED INSTITUTE FACULTY</span>
                <h2 id="faculty-modal-title" className="faculty-modal-name">
                  {selectedFaculty.name}
                </h2>
                <p className="faculty-modal-desig">
                  {selectedFaculty.designation || "Faculty Member"}
                </p>

                <div className="faculty-modal-credentials">
                  {selectedFaculty.qualification && (
                    <div className="faculty-modal-credential-item">
                      <GraduationCap size={16} />
                      <div>
                        <small>Academic Qualification</small>
                        <strong>{selectedFaculty.qualification}</strong>
                      </div>
                    </div>
                  )}

                  {selectedFaculty.experience && (
                    <div className="faculty-modal-credential-item">
                      <Clock size={16} />
                      <div>
                        <small>Teaching Experience</small>
                        <strong className="tabular-nums">{selectedFaculty.experience}</strong>
                      </div>
                    </div>
                  )}

                  {selectedFaculty.subject && (
                    <div className="faculty-modal-credential-item">
                      <BookOpen size={16} />
                      <div>
                        <small>Department</small>
                        <strong>{selectedFaculty.subject}</strong>
                      </div>
                    </div>
                  )}
                </div>

                <div className="faculty-modal-bio-block">
                  <small>TEACHING APPROACH & BIO</small>
                  <p>
                    {selectedFaculty.bio ||
                      "Focusing on conceptual depth, first-principles derivation, and structured doubt clearing for school board and competitive entrance examinations."}
                  </p>
                </div>

                <div className="faculty-modal-actions">
                  <Link
                    to="/contact"
                    className="faculty-modal-cta"
                    onClick={() => setSelectedFaculty(null)}
                  >
                    <span>Schedule Consultation</span>
                    <ArrowRight size={15} />
                  </Link>

                  <button
                    type="button"
                    className="faculty-modal-dismiss-btn"
                    onClick={() => setSelectedFaculty(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Faculty;