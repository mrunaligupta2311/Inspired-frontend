import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, GraduationCap } from "lucide-react";

import "./FacultyPreview.css";

const API_URL = import.meta.env.VITE_API_URL ?? "";

const facultyFallbacks = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
];

function FacultyPreview() {
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchFaculty = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/api/faculty?public=true`);
        if (!response.ok) throw new Error("Failed to load faculty");
        const res = await response.json();
        if (mounted && res.success && Array.isArray(res.data)) {
          setFaculty(res.data.slice(0, 4));
        }
      } catch (err) {
        console.warn("Faculty preview fetch notice:", err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchFaculty();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="academic-faculty" id="faculty">
      <div className="site-container">
        {/* Header */}
        <div className="academic-faculty__header">
          <div className="academic-faculty__headings">
            <span className="academic-faculty__eyebrow">ACADEMIC FACULTY</span>
            <h2 className="academic-faculty__title">
              Guided by experienced and supportive educators.
            </h2>
          </div>
          <p className="academic-faculty__intro">
            Our educators focus on conceptual clarity, rigorous derivation, and supportive doubt resolution
            to help students build confidence in Physics, Chemistry, Mathematics, and Biology.
          </p>
        </div>

        {/* Editorial Faculty Grid */}
        {loading ? (
          <div className="academic-faculty__grid">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="academic-faculty__card academic-faculty__card--skeleton" />
            ))}
          </div>
        ) : faculty.length > 0 ? (
          <div className="academic-faculty__grid">
            {faculty.map((member, idx) => {
              const photo = member.profileImage && member.profileImage.trim() !== ""
                ? member.profileImage
                : facultyFallbacks[idx % facultyFallbacks.length];

              return (
                <article key={member.id || idx} className="academic-faculty__card">
                  <div className="academic-faculty__portrait-frame">
                    <img
                      src={photo}
                      alt={`${member.name} — ${member.subject}`}
                      className="academic-faculty__portrait"
                      loading="lazy"
                    />
                    <div className="academic-faculty__portrait-overlay" />
                    <span className="academic-faculty__subject-tag">
                      {member.subject || "Academic Mentor"}
                    </span>
                  </div>

                  <div className="academic-faculty__details">
                    <h3 className="academic-faculty__name">{member.name}</h3>
                    <p className="academic-faculty__designation">
                      {member.designation || "Senior Faculty"}
                    </p>

                    <div className="academic-faculty__meta">
                      {member.qualification && (
                        <div className="academic-faculty__meta-row">
                          <GraduationCap size={14} className="academic-faculty__meta-icon" />
                          <span>{member.qualification}</span>
                        </div>
                      )}
                      {member.experience && (
                        <div className="academic-faculty__experience">
                          {member.experience}
                        </div>
                      )}
                    </div>

                    {member.bio && (
                      <p className="academic-faculty__bio">
                        {member.bio}
                      </p>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="academic-faculty__empty">
            <p>Faculty directory is being updated for the upcoming academic session.</p>
          </div>
        )}

        {/* Footer */}
        <div className="academic-faculty__footer">
          <Link to="/faculty" className="academic-faculty__directory-link">
            <span>View All Department Faculty Profiles</span>
            <ArrowRight size={16} strokeWidth={2.2} />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default FacultyPreview;