import { useEffect, useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  Search,
  GraduationCap,
  X,
  BookOpen,
  Layers,
} from "lucide-react";

import AdmissionCTA from "../../components/admission/AdmissionCTA";
import "./Courses.css";

const API_URL = import.meta.env.VITE_API_URL ?? "";

const DIVISIONS = [
  { id: "ALL", label: "All Disciplines" },
  { id: "Foundation", label: "Foundation (Classes 6–10)" },
  { id: "Senior", label: "Senior Secondary (11–12)" },
  { id: "Competitive", label: "JEE · NEET · GUJCET" },
  { id: "Olympiad", label: "Olympiad & Aptitude" },
];

const CLASS_OPTIONS = [
  { value: "ALL", label: "All Classes" },
  { value: "6", label: "Class 6" },
  { value: "7", label: "Class 7" },
  { value: "8", label: "Class 8" },
  { value: "9", label: "Class 9" },
  { value: "10", label: "Class 10" },
  { value: "11", label: "Class 11" },
  { value: "12", label: "Class 12" },
];

function formatClasses(classes = [], fallback = "") {
  if (!Array.isArray(classes) || classes.length === 0) {
    return fallback || "Classes 6–12";
  }

  const sorted = [...classes]
    .map(Number)
    .filter((n) => n >= 6 && n <= 12)
    .sort((a, b) => a - b);

  if (sorted.length === 0) return fallback || "Classes 6–12";
  if (sorted.length === 1) return `Class ${sorted[0]}`;
  return `Classes ${sorted.join(", ")}`;
}

function Courses() {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "ALL";

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeDivision, setActiveDivision] = useState(initialCategory);
  const [selectedClass, setSelectedClass] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/api/courses?public=true`);
        const result = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(result.message || "Failed to fetch courses");
        }

        if (mounted && result.success && Array.isArray(result.data)) {
          setCourses(result.data);
        }
      } catch (err) {
        console.error("Courses fetch error:", err);
        if (mounted) setError(err.message || "Unable to load courses right now.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchCourses();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setSelectedCourse(null);
    };
    if (selectedCourse) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedCourse]);

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      // 1. Division filter
      if (activeDivision !== "ALL") {
        const cat = (course.category || "").toLowerCase();
        const title = (course.title || "").toLowerCase();
        const target = (course.targetStudents || "").toLowerCase();

        if (activeDivision === "Foundation") {
          const isFound =
            cat.includes("foundation") ||
            target.includes("6") ||
            target.includes("7") ||
            target.includes("8") ||
            target.includes("9") ||
            target.includes("10");
          if (!isFound) return false;
        } else if (activeDivision === "Senior") {
          const isSenior =
            cat.includes("board") ||
            cat.includes("senior") ||
            target.includes("11") ||
            target.includes("12");
          if (!isSenior) return false;
        } else if (activeDivision === "Competitive") {
          const isComp =
            cat.includes("jee") ||
            cat.includes("neet") ||
            cat.includes("gujcet") ||
            cat.includes("nda") ||
            title.includes("jee") ||
            title.includes("neet") ||
            title.includes("gujcet");
          if (!isComp) return false;
        } else if (activeDivision === "Olympiad") {
          const isOly =
            cat.includes("olympiad") ||
            title.includes("olympiad") ||
            cat.includes("aptitude");
          if (!isOly) return false;
        }
      }

      // 2. Class filter
      if (selectedClass !== "ALL") {
        const num = Number(selectedClass);
        if (
          Array.isArray(course.eligibleClasses) &&
          course.eligibleClasses.length > 0
        ) {
          if (!course.eligibleClasses.includes(num)) return false;
        } else if (course.targetStudents) {
          if (!course.targetStudents.includes(selectedClass)) return false;
        }
      }

      // 3. Search query
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase().trim();
        const inTitle = (course.title || "").toLowerCase().includes(q);
        const inDesc = (course.shortDescription || "").toLowerCase().includes(q);
        const inCat = (course.category || "").toLowerCase().includes(q);
        const inTags = Array.isArray(course.tags)
          ? course.tags.some((t) => t.toLowerCase().includes(q))
          : false;

        if (!inTitle && !inDesc && !inCat && !inTags) return false;
      }

      return true;
    });
  }, [courses, activeDivision, selectedClass, searchQuery]);

  return (
    <div className="courses-catalogue-page">
      {/* 1. Institutional Hero */}
      <section className="courses-hero">
        <div className="site-container courses-hero__container">
          <span className="courses-hero__eyebrow">ACADEMIC CURRICULA & PATHWAYS</span>
          <h1 className="courses-hero__title">
            Structured programs engineered for intellectual depth and competitive triumphs.
          </h1>
          <p className="courses-hero__lead">
            Every curriculum at Inspired Institute synchronizes state and national school board syllabi
            (CBSE · ICSE · GSEB) with first-principles competitive entrance mastery across JEE Main & Advanced,
            NEET UG, GUJCET, and National Olympiads in Vadodara.
          </p>

          {/* Academic Trust Strip */}
          <div className="courses-hero__benchmarks">
            <div className="courses-hero__benchmark-item">
              <strong>Classes 6–12</strong>
              <span>Science, Foundation & Senior Secondary</span>
            </div>
            <div className="courses-hero__benchmark-sep" />
            <div className="courses-hero__benchmark-item">
              <strong>Dual-Track</strong>
              <span>Synchronized Board + Entrance Syllabus</span>
            </div>
            <div className="courses-hero__benchmark-sep" />
            <div className="courses-hero__benchmark-item">
              <strong>Concept-Driven</strong>
              <span>Problem Solving & Doubt Clearing Focus</span>
            </div>
            <div className="courses-hero__benchmark-sep" />
            <div className="courses-hero__benchmark-item">
              <strong>Estd. 2018</strong>
              <span>Vadodara Academic Coaching Center</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Interactive Curricular Controls */}
      <section className="courses-filters-section">
        <div className="site-container">
          <div className="courses-filters-bar">
            {/* Division Tabs (Segmented Button Group) */}
            <div className="courses-filters-tabs" role="tablist" aria-label="Curricular Divisions">
              {DIVISIONS.map((div) => (
                <button
                  key={div.id}
                  type="button"
                  role="tab"
                  aria-selected={activeDivision === div.id}
                  className={`courses-division-tab ${activeDivision === div.id ? "is-active" : ""}`}
                  onClick={() => setActiveDivision(div.id)}
                >
                  {div.label}
                </button>
              ))}
            </div>

            {/* Right: Search & Class Select */}
            <div className="courses-filters-secondary">
              <div className="courses-search-wrap">
                <Search size={15} className="courses-search-icon" />
                <input
                  type="text"
                  placeholder="Search subject, exam, keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="courses-search-input"
                  aria-label="Search courses"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="courses-search-clear"
                    aria-label="Clear search"
                  >
                    ×
                  </button>
                )}
              </div>

              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="courses-class-select"
                aria-label="Filter by class"
              >
                {CLASS_OPTIONS.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filter Indicators if filtered */}
          {(activeDivision !== "ALL" || selectedClass !== "ALL" || searchQuery.trim() !== "") && (
            <div className="courses-active-filters-info">
              <span>
                Showing <strong>{filteredCourses.length}</strong> of {courses.length} academic programs
              </span>
              <button
                type="button"
                onClick={() => {
                  setActiveDivision("ALL");
                  setSelectedClass("ALL");
                  setSearchQuery("");
                }}
                className="courses-reset-btn"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 3. Program Catalogue List */}
      <section className="courses-catalogue-section">
        <div className="site-container">
          {loading ? (
            <div className="courses-skeleton-list">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="courses-skeleton-card" />
              ))}
            </div>
          ) : error && courses.length === 0 ? (
            <div className="courses-state-box">
              <p className="courses-state-error">{error}</p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="courses-retry-btn"
              >
                Retry Loading Curricula
              </button>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="courses-state-box">
              <h3>No matching academic curricula found</h3>
              <p>Try widening your search terms or selecting "All Disciplines".</p>
              <button
                type="button"
                onClick={() => {
                  setActiveDivision("ALL");
                  setSelectedClass("ALL");
                  setSearchQuery("");
                }}
                className="courses-retry-btn"
              >
                Clear Search & Filters
              </button>
            </div>
          ) : (
            <div className="courses-catalogue-grid">
              {filteredCourses.map((course, idx) => {
                const formattedClass = formatClasses(course.eligibleClasses, course.targetStudents);
                const tags = Array.isArray(course.tags) && course.tags.length > 0 ? course.tags : [];

                return (
                  <article key={course.id || idx} className="courses-item-card">
                    {/* Top Row: Index & Category */}
                    <div className="courses-item-header">
                      <div className="courses-item-meta-group">
                        <span className="courses-item-index tabular-nums">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        <span className="courses-item-category">
                          {course.category || "Academic Stream"}
                        </span>
                        <span className="courses-item-meta-sep" aria-hidden="true">·</span>
                        <span className="courses-item-cohort">
                          {formattedClass}
                        </span>
                      </div>

                      <span className="courses-item-badge">ACADEMIC SESSION 2026–27</span>
                    </div>

                    {/* Middle: Title & Description */}
                    <div className="courses-item-body">
                      <h2 className="courses-item-title">{course.title}</h2>
                      <p className="courses-item-desc">
                        {course.shortDescription ||
                          "A comprehensive concept-driven program structured around foundational derivations, regular diagnostic testing, and personalized faculty mentorship."}
                      </p>

                      {/* Clean Metadata Tags (Zero-Pill Discipline: unboxed text with · separator) */}
                      {tags.length > 0 && (
                        <div className="courses-item-tags">
                          {tags.slice(0, 5).map((tag, tIdx) => (
                            <span key={tag} className="courses-item-tag-unit">
                              {tag}
                              {tIdx < Math.min(tags.length, 5) - 1 && (
                                <span className="courses-item-tag-sep">·</span>
                              )}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Footer Actions */}
                    <div className="courses-item-footer">
                      <button
                        type="button"
                        onClick={() => setSelectedCourse(course)}
                        className="courses-expand-btn"
                        aria-label={`View full details for ${course.title}`}
                      >
                        <span>View Course Details</span>
                        <ArrowRight size={14} />
                      </button>

                      <div className="courses-footer-cta-group">
                        <Link
                          to={`/contact?course=${encodeURIComponent(course.title)}`}
                          className="courses-enquire-btn"
                        >
                          <span>Enquire for this Course</span>
                          <ArrowRight size={15} strokeWidth={2.2} />
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* 4. Dual-Track Academic Philosophy Banner */}
      <section className="courses-framework-section">
        <div className="site-container courses-framework__container">
          <div className="courses-framework__left">
            <span className="courses-framework__eyebrow">PEDAGOGICAL SYNERGY</span>
            <h2 className="courses-framework__title">
              Why our dual-track curriculum eliminates student burnout.
            </h2>
            <p className="courses-framework__prose">
              Most coaching models force students to lead double lives: attending school for board exams,
              then scrambling through disjointed coaching lectures.
              At Inspired Institute, our academic master-timetable aligns school board syllabus milestones
              (CBSE, ICSE, GSEB) directly with the conceptual demands of JEE, NEET, and Olympiads.
            </p>
          </div>

          <div className="courses-framework__right">
            <div className="courses-framework__card">
              <div className="courses-framework__card-header">
                <GraduationCap size={20} className="courses-framework__icon" />
                <h3>The Dual-Track Architecture</h3>
              </div>
              <ul className="courses-framework__list">
                <li>
                  <strong>Board Precision</strong>
                  <p>Step-by-step subjective derivation, theorem proofs, and board marking-scheme mastery.</p>
                </li>
                <li>
                  <strong>Entrance Speed & Depth</strong>
                  <p>Multi-concept application, cross-chapter problem synthesis, and time triage under exam pressure.</p>
                </li>
                <li>
                  <strong>Unified Calendar</strong>
                  <p>Coordinated examination cycles so board revision and entrance test series never collide.</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Admission Consultation CTA */}
      <AdmissionCTA />

      {/* 6. Comprehensive Course Detail Modal */}
      {selectedCourse && (
        <div
          className="courses-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="course-modal-title"
          onClick={() => setSelectedCourse(null)}
        >
          <div
            className="courses-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="courses-modal-close"
              onClick={() => setSelectedCourse(null)}
              aria-label="Close course details"
            >
              <X size={20} />
            </button>

            <div className="courses-modal-body">
              <div className="courses-modal-header">
                <span className="courses-modal-eyebrow">
                  {selectedCourse.category || "ACADEMIC DISCIPLINE"} · {formatClasses(selectedCourse.eligibleClasses, selectedCourse.targetStudents)}
                </span>
                <h2 id="course-modal-title" className="courses-modal-title">
                  {selectedCourse.title}
                </h2>
                {selectedCourse.shortDescription && (
                  <p className="courses-modal-short-desc">
                    {selectedCourse.shortDescription}
                  </p>
                )}
              </div>

              {/* Real Course Attributes Grid */}
              <div className="courses-modal-meta-grid">
                <div className="courses-modal-meta-item">
                  <GraduationCap size={16} />
                  <div>
                    <small>Target Cohort</small>
                    <strong>{formatClasses(selectedCourse.eligibleClasses, selectedCourse.targetStudents)}</strong>
                  </div>
                </div>

                <div className="courses-modal-meta-item">
                  <Layers size={16} />
                  <div>
                    <small>Category</small>
                    <strong>{selectedCourse.category || "Core Academic"}</strong>
                  </div>
                </div>

                <div className="courses-modal-meta-item">
                  <BookOpen size={16} />
                  <div>
                    <small>Center Location</small>
                    <strong>Vadodara Center</strong>
                  </div>
                </div>
              </div>

              {/* Detailed Description from API */}
              <div className="courses-modal-section">
                <h4 className="courses-modal-section-title">Program Description & Academic Scope</h4>
                <p className="courses-modal-full-desc">
                  {selectedCourse.fullDescription ||
                    selectedCourse.shortDescription ||
                    "This course provides structured learning covering essential conceptual foundations, systematic problem derivation, and comprehensive syllabus synchronization with school boards and competitive entrance exams in Vadodara."}
                </p>
              </div>

              {/* Tags from API */}
              {Array.isArray(selectedCourse.tags) && selectedCourse.tags.length > 0 && (
                <div className="courses-modal-section">
                  <h4 className="courses-modal-section-title">Focus Areas & Subjects</h4>
                  <div className="courses-modal-tags">
                    {selectedCourse.tags.map((tag) => (
                      <span key={tag} className="courses-modal-tag-chip">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="courses-modal-actions">
                <Link
                  to={`/contact?course=${encodeURIComponent(selectedCourse.title)}`}
                  className="courses-modal-primary-cta"
                  onClick={() => setSelectedCourse(null)}
                >
                  <span>Inquire for this Course</span>
                  <ArrowRight size={15} />
                </Link>

                <button
                  type="button"
                  className="courses-modal-dismiss-btn"
                  onClick={() => setSelectedCourse(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Courses;
