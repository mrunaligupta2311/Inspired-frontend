import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { X, ArrowRight } from "lucide-react";

import AdmissionCTA from "../../components/admission/AdmissionCTA";
import "./Results.css";

const API_URL = import.meta.env.VITE_API_URL ?? "";

const EXAM_CATEGORIES = [
  { id: "ALL", label: "All Achievements" },
  { id: "JEE", label: "JEE Main & Advanced" },
  { id: "NEET", label: "NEET UG Medical" },
  { id: "GUJCET", label: "GUJCET Engineering" },
  { id: "BOARD", label: "CBSE & GSEB Boards" },
  { id: "OLYMPIAD", label: "Olympiads & Aptitude" },
];

function Results() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeExam, setActiveExam] = useState("ALL");
  const [selectedResult, setSelectedResult] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchResults = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/api/results?public=true`);
        const result = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(result.message || "Failed to fetch achievements showcase");
        }

        if (mounted && result.success && Array.isArray(result.data)) {
          setResults(result.data);
        }
      } catch (err) {
        console.error("Results fetch error:", err);
        if (mounted) setError(err.message || "Unable to load student results.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchResults();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setSelectedResult(null);
    };
    if (selectedResult) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedResult]);

  const filteredResults = useMemo(() => {
    if (activeExam === "ALL") return results;

    return results.filter((item) => {
      const ex = (item.exam || "").toLowerCase();
      const title = (item.achievementTitle || "").toLowerCase();

      if (activeExam === "JEE") {
        return ex.includes("jee") || title.includes("jee");
      }
      if (activeExam === "NEET") {
        return ex.includes("neet") || title.includes("neet") || title.includes("medical");
      }
      if (activeExam === "GUJCET") {
        return ex.includes("gujcet") || title.includes("gujcet");
      }
      if (activeExam === "BOARD") {
        return ex.includes("cbse") || ex.includes("gseb") || ex.includes("board") || title.includes("board");
      }
      if (activeExam === "OLYMPIAD") {
        return ex.includes("olympiad") || title.includes("olympiad") || ex.includes("aptitude");
      }
      return true;
    });
  }, [results, activeExam]);

  return (
    <div className="results-showcase-page">
      {/* 1. Hero */}
      <section className="results-hero">
        <div className="site-container results-hero__container">
          <span className="results-hero__eyebrow">STUDENT RESULTS & ACHIEVEMENTS</span>
          <h1 className="results-hero__title">
            Celebrating consistent preparation and student success.
          </h1>
          <p className="results-hero__lead">
            At Inspired Institute, our students' achievements reflect dedication, concept-driven learning,
            and continuous faculty guidance across competitive entrance exams and school boards in Vadodara.
          </p>

          <div className="results-hero__trust-bar">
            <span>Operating Since 2018 in Vadodara</span>
            <span className="results-hero__sep">·</span>
            <span>Classes 6–12 Science</span>
            <span className="results-hero__sep">·</span>
            <span>JEE · NEET · GUJCET · Boards</span>
          </div>
        </div>
      </section>

      {/* 2. Exam Category Filters */}
      <section className="results-filters-section">
        <div className="site-container">
          <div className="results-filters-bar">
            <div className="results-filters-tabs" role="tablist" aria-label="Exam Categories">
              {EXAM_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  role="tab"
                  aria-selected={activeExam === cat.id}
                  className={`results-exam-tab ${activeExam === cat.id ? "is-active" : ""}`}
                  onClick={() => setActiveExam(cat.id)}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <span className="results-count-indicator">
              Showing <strong>{filteredResults.length}</strong> Student Records
            </span>
          </div>
        </div>
      </section>

      {/* 3. Results Cards Showcase Grid */}
      <section className="results-grid-section">
        <div className="site-container">
          {loading ? (
            <div className="results-cards-grid">
              {[1, 2, 3].map((i) => (
                <div key={i} className="results-skeleton-card" />
              ))}
            </div>
          ) : error && results.length === 0 ? (
            <div className="results-state-box">
              <p className="results-state-error">{error}</p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="results-retry-btn"
              >
                Retry Loading Results
              </button>
            </div>
          ) : filteredResults.length === 0 ? (
            <div className="results-state-box">
              <h3>No student records found under this filter</h3>
              <p>Select "All Achievements" to view complete results.</p>
              <button
                type="button"
                onClick={() => setActiveExam("ALL")}
                className="results-retry-btn"
              >
                View All Achievements
              </button>
            </div>
          ) : (
            <div className="results-cards-grid">
              {filteredResults.map((item, idx) => {
                const score = item.score || item.percentile || "Distinction";
                const exam = item.exam || "Competitive Exam";
                const year = item.year ? ` · ${item.year}` : "";

                return (
                  <article
                    key={item.id || idx}
                    className="results-achievement-card is-interactive"
                    onClick={() => setSelectedResult(item)}
                    tabIndex={0}
                    role="button"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSelectedResult(item);
                      }
                    }}
                    aria-label={`View result details for ${item.studentName}`}
                  >
                    {/* Top Row: Exam */}
                    <div className="results-achievement-header">
                      <span className="results-exam-name">{exam}{year}</span>
                      {item.rank && (
                        <span className="results-rank-pill tabular-nums">{item.rank}</span>
                      )}
                    </div>

                    {/* Score Number */}
                    <div className="results-score-block">
                      <span className="results-score-value tabular-nums">{score}</span>
                    </div>

                    {/* Student Info */}
                    <div className="results-student-block">
                      <h2 className="results-student-name">{item.studentName}</h2>
                      <p className="results-achievement-title">
                        {item.achievementTitle || "Outstanding Performance"}
                      </p>

                      {item.description && (
                        <p className="results-achievement-desc">
                          {item.description}
                        </p>
                      )}
                    </div>

                    {/* Card Footer */}
                    <div className="results-achievement-footer">
                      <span className="results-institution-stamp">
                        Inspired Institute · Vadodara
                      </span>
                      <span className="results-view-btn">
                        <span>Details</span>
                        <ArrowRight size={13} />
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* 4. Admission Consultation CTA */}
      <AdmissionCTA />

      {/* 5. Result Detail Modal */}
      {selectedResult && (
        <div
          className="results-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="result-modal-title"
          onClick={() => setSelectedResult(null)}
        >
          <div
            className="results-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="results-modal-close"
              onClick={() => setSelectedResult(null)}
              aria-label="Close result details"
            >
              <X size={20} />
            </button>

            <div className="results-modal-body">
              <span className="results-modal-eyebrow">
                {selectedResult.exam || "COMPETITIVE EXAM"} {selectedResult.year ? `· ${selectedResult.year}` : ""}
              </span>

              <h2 id="result-modal-title" className="results-modal-name">
                {selectedResult.studentName}
              </h2>

              <p className="results-modal-achievement">
                {selectedResult.achievementTitle || "Outstanding Performance"}
              </p>

              <div className="results-modal-stats-grid">
                {(selectedResult.score || selectedResult.percentile) && (
                  <div className="results-modal-stat-box">
                    <small>Official Score / Percentile</small>
                    <strong className="tabular-nums">
                      {selectedResult.score || selectedResult.percentile}
                    </strong>
                  </div>
                )}

                {selectedResult.rank && (
                  <div className="results-modal-stat-box">
                    <small>Secured Rank</small>
                    <strong className="tabular-nums">{selectedResult.rank}</strong>
                  </div>
                )}

                {selectedResult.exam && (
                  <div className="results-modal-stat-box">
                    <small>Examination</small>
                    <strong>{selectedResult.exam}</strong>
                  </div>
                )}
              </div>

              {selectedResult.description && (
                <div className="results-modal-desc-box">
                  <small>STUDENT RECORD & PERFORMANCE NOTES</small>
                  <p>{selectedResult.description}</p>
                </div>
              )}

              <div className="results-modal-footer">
                <Link
                  to="/contact"
                  className="results-modal-cta"
                  onClick={() => setSelectedResult(null)}
                >
                  <span>Inquire for Upcoming Batches</span>
                  <ArrowRight size={15} />
                </Link>

                <button
                  type="button"
                  className="results-modal-dismiss-btn"
                  onClick={() => setSelectedResult(null)}
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

export default Results;
