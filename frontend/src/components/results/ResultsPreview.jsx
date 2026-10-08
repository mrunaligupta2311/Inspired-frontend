import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import "./ResultsPreview.css";

const API_URL = import.meta.env.VITE_API_URL ?? "";

function ResultsPreview() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchResults = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/api/results?public=true`);
        if (!response.ok) throw new Error("Failed to load results");
        const res = await response.json();
        if (mounted && res.success && Array.isArray(res.data)) {
          setResults(res.data.slice(0, 3));
        }
      } catch (err) {
        console.warn("Results preview fetch notice:", err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchResults();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="academic-results" id="results">
      <div className="site-container">
        {/* Header */}
        <div className="academic-results__header">
          <div className="academic-results__headings">
            <span className="academic-results__eyebrow">VERIFIED SCHOLASTIC ACHIEVEMENTS</span>
            <h2 className="academic-results__title">
              Excellence measured in ranks, percentiles, and premier admissions.
            </h2>
          </div>
          <p className="academic-results__intro">
            Every statistic represents rigorous discipline, months of focused preparation,
            and the collaborative mentorship between scholars, parents, and Inspired faculty.
          </p>
        </div>

        {/* Results Showcase Cards */}
        {loading ? (
          <div className="academic-results__grid">
            {[1, 2, 3].map((n) => (
              <div key={n} className="academic-results__skeleton" />
            ))}
          </div>
        ) : results.length > 0 ? (
          <div className="academic-results__grid">
            {results.map((item, idx) => {
              const examYear = `${item.exam || "Competitive Exam"}${item.year ? ` · ${item.year}` : ""}`;
              const score = item.score || item.percentile || "Distinction";

              return (
                <article key={item.id || idx} className="academic-results__card">
                  <div className="academic-results__card-top">
                    <span className="academic-results__exam">{examYear}</span>
                    {item.rank && (
                      <span className="academic-results__rank-text">
                        {item.rank}
                      </span>
                    )}
                  </div>

                  <div className="academic-results__score-wrap">
                    <span className="academic-results__score tabular-nums">{score}</span>
                    <span className="academic-results__score-label">Official Benchmark</span>
                  </div>

                  <div className="academic-results__student-block">
                    <div className="academic-results__student-info">
                      <h3 className="academic-results__student-name">{item.studentName}</h3>
                      <p className="academic-results__achievement-title">
                        {item.achievementTitle || "Outstanding Performance in Competitive Entrance"}
                      </p>
                    </div>
                  </div>

                  {item.description && (
                    <p className="academic-results__description">
                      {item.description}
                    </p>
                  )}
                </article>
              );
            })}
          </div>
        ) : (
          <div className="academic-results__empty">
            <p>Annual results directory is currently being updated.</p>
          </div>
        )}

        {/* Credibility Footer Strip */}
        <div className="academic-results__footer">
          <p className="academic-results__footer-note">
            Results achieved by classroom coaching students at Inspired Institute, Vadodara.
          </p>

          <Link to="/results" className="academic-results__full-link">
            <span>View All Student Results</span>
            <ArrowRight size={16} strokeWidth={2.4} />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default ResultsPreview;