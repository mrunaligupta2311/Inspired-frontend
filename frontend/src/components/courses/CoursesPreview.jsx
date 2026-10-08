import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import "./CoursesPreview.css";

const API_URL = import.meta.env.VITE_API_URL ?? "";

const CATEGORIES = [
  { id: "ALL", label: "All Disciplines" },
  { id: "Foundation", label: "Middle & High School (6–10)" },
  { id: "Senior Secondary", label: "Senior Secondary (11–12)" },
  { id: "Competitive", label: "JEE · NEET · GUJCET" },
  { id: "Olympiad", label: "Olympiad & Aptitude" },
];

function CoursesPreview() {
  const [courses, setCourses] = useState([]);
  const [activeTab, setActiveTab] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${API_URL}/api/courses?public=true`);
        const res = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(res.message || "Failed to load courses");
        if (mounted && res.success && Array.isArray(res.data)) {
          setCourses(res.data);
        }
      } catch (err) {
        console.warn("Courses preview fetch notice:", err.message);
        if (mounted) setError(err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchCourses();
    return () => {
      mounted = false;
    };
  }, []);

  const filteredCourses = useMemo(() => {
    if (activeTab === "ALL") return courses.slice(0, 6);

    return courses.filter((c) => {
      const cat = (c.category || "").toLowerCase();
      const title = (c.title || "").toLowerCase();
      const target = (c.targetStudents || "").toLowerCase();

      if (activeTab === "Foundation") {
        return cat.includes("foundation") || target.includes("6") || target.includes("8") || target.includes("10");
      }
      if (activeTab === "Senior Secondary") {
        return cat.includes("board") || cat.includes("senior") || target.includes("11") || target.includes("12");
      }
      if (activeTab === "Competitive") {
        return cat.includes("jee") || cat.includes("neet") || cat.includes("gujcet") || title.includes("jee") || title.includes("neet");
      }
      if (activeTab === "Olympiad") {
        return cat.includes("olympiad") || title.includes("olympiad") || cat.includes("research");
      }
      return true;
    }).slice(0, 6);
  }, [courses, activeTab]);

  return (
    <section className="academic-programs" id="courses">
      <div className="site-container">
        {/* Header */}
        <div className="academic-programs__header">
          <div className="academic-programs__headings">
            <span className="academic-programs__eyebrow">ACADEMIC COURSES</span>
            <h2 className="academic-programs__title">
              Academic courses designed for intellectual depth.
            </h2>
          </div>
          <p className="academic-programs__intro">
            From early cognitive foundations to high-intensity national entrance preparation,
            each curriculum is structured around rigorous conceptual clarity, problem derivation, and structured testing.
          </p>
        </div>

        {/* Filter Segmented Controls */}
        <div className="academic-programs__tabs" role="tablist" aria-label="Program categories">
          {CATEGORIES.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              className={`academic-programs__tab ${activeTab === tab.id ? "is-active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Catalog List */}
        {loading ? (
          <div className="academic-programs__list">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="academic-programs__skeleton" />
            ))}
          </div>
        ) : error && courses.length === 0 ? (
          <div className="academic-programs__error">
            <p>{error}</p>
            <button onClick={() => window.location.reload()} className="academic-programs__retry-btn">
              Retry Loading Programs
            </button>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="academic-programs__empty">
            <p>No programs currently catalogued under this division.</p>
            <Link to="/courses" className="academic-programs__view-all-link">
              View Complete Course Directory
            </Link>
          </div>
        ) : (
          <div className="academic-programs__list">
            {filteredCourses.map((course, idx) => {
              const tags = Array.isArray(course.tags) && course.tags.length > 0 ? course.tags : [];
              const eligibleClasses = Array.isArray(course.eligibleClasses) && course.eligibleClasses.length > 0
                ? `Classes ${course.eligibleClasses.join(", ")}`
                : course.targetStudents || "Classes 6–12";

              return (
                <article key={course.id || idx} className="academic-programs__row">
                  <div className="academic-programs__col-meta">
                    <span className="academic-programs__index tabular-nums">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <span className="academic-programs__division">
                      {course.category || "Academic Division"}
                    </span>
                  </div>

                  <div className="academic-programs__col-main">
                    <div className="academic-programs__title-group">
                      <h3 className="academic-programs__name">{course.title}</h3>
                      <span className="academic-programs__cohort">
                        {eligibleClasses}
                      </span>
                    </div>

                    <p className="academic-programs__desc">
                      {course.shortDescription || course.fullDescription || "Structured concept-driven curriculum emphasizing first-principles understanding and examination performance."}
                    </p>

                    {tags.length > 0 && (
                      <div className="academic-programs__tags-strip">
                        {tags.slice(0, 4).map((tag, tIdx) => (
                          <span key={tag} className="academic-programs__tag-item">
                            {tag}
                            {tIdx < Math.min(tags.length, 4) - 1 && <span className="academic-programs__tag-sep">·</span>}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="academic-programs__col-action">
                    <Link to="/courses" className="academic-programs__row-btn" aria-label={`View details for ${course.title}`}>
                      <span>Curriculum Details</span>
                      <ArrowUpRight size={15} strokeWidth={2.2} />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Footer Link */}
        <div className="academic-programs__footer">
          <p className="academic-programs__footer-note">
            All courses incorporate dual-track preparation for respective state and central boards alongside entrance syllabi.
          </p>
          <Link to="/courses" className="academic-programs__full-catalog-link">
            <span>Explore All Academic Courses</span>
            <ArrowRight size={16} strokeWidth={2.2} />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default CoursesPreview;