import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import AdmissionCTA from "../../components/admission/AdmissionCTA";
import "./About.css";

const API_URL = import.meta.env.VITE_API_URL ?? "";

function About() {
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
      } catch (e) {
        console.warn("About institute fetch notice:", e.message);
      }
    };
    fetchInstitute();
    return () => {
      mounted = false;
    };
  }, []);

  const instituteName = institute?.name || "Inspired Institute";
  const aboutText = institute?.about || "Inspired Institute is a premier academic institution in Vadodara dedicated to concept-based mastery, scientific reasoning, and competitive entrance excellence.";

  return (
    <div className="about-document">
      {/* 1. Header Hero */}
      <section className="about-hero">
        <div className="site-container about-hero__container">
          <span className="about-hero__eyebrow">ABOUT INSPIRED INSTITUTE</span>
          <h1 className="about-hero__title">
            Where Potential Becomes Power.
          </h1>
          <p className="about-hero__lead">
            {aboutText} Operating since 2018 in Vadodara, {instituteName} turns curiosity into confidence
            and ambition into achievement through concept-driven learning for Classes 6–12 Science,
            JEE, NEET, GUJCET, NDA, and Olympiad preparation.
          </p>
        </div>
      </section>

      {/* 2. Manifesto / Why Inspired Exists */}
      <section className="about-section about-section--manifesto">
        <div className="site-container about-grid">
          <div className="about-col-label">
            <span className="about-label-badge">ORIGIN & PURPOSE</span>
            <h2 className="about-section-heading">
              Why Inspired Institute exists.
            </h2>
          </div>

          <div className="about-col-content">
            <p className="about-prose-highlight">
              In an era where coaching centers enroll hundreds of students into impersonal auditorium lectures, true education gets lost in the crowd.
            </p>
            <p className="about-prose">
              Students are taught to memorize tricks, solve formula templates, and guess answers. But when national competitive examinations like JEE Advanced or NEET present non-standard, multi-concept problems, memorization invariably fails.
            </p>
            <p className="about-prose">
              Inspired Institute was established on a single non-negotiable premise: <strong>every fundamental law must be understood, derived, and mastered from first principles.</strong> We limit class intake to maintain true academic dialogue between master educators and aspiring minds.
            </p>

            <div className="about-quote-box">
              <blockquote>
                "A student who understands why an equation works can reconstruct it under any exam constraint. A student who only memorized it is at the mercy of the question setter."
              </blockquote>
              <cite>— Academic Directorate, Inspired Institute</cite>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The 4 Pedagogical Standards */}
      <section className="about-section about-section--standards">
        <div className="site-container">
          <div className="about-section-header">
            <span className="about-label-badge">PEDAGOGICAL ARCHITECTURE</span>
            <h2 className="about-section-heading">
              The four pillars of the Inspired learning model.
            </h2>
            <p className="about-section-sub">
              Our academic framework is engineered to harmonize rigorous school board performance with national entrance benchmarks.
            </p>
          </div>

          <div className="about-pillars-grid">
            <div className="about-pillar-card">
              <span className="about-pillar-idx tabular-nums">01</span>
              <h3 className="about-pillar-title">First-Principles Derivation</h3>
              <p className="about-pillar-desc">
                From Newton's mechanics and calculus integration to chemical thermodynamics and molecular biology, we deconstruct every principle before problem sets begin.
              </p>
            </div>

            <div className="about-pillar-card">
              <span className="about-pillar-idx tabular-nums">02</span>
              <h3 className="about-pillar-title">Integrated Dual-Track Syllabus</h3>
              <p className="about-pillar-desc">
                Board preparation (CBSE, ICSE, GSEB) and competitive entrance training (JEE, NEET, GUJCET) are synchronized into a single coherent schedule, eliminating duplication of effort.
              </p>
            </div>

            <div className="about-pillar-card">
              <span className="about-pillar-idx tabular-nums">03</span>
              <h3 className="about-pillar-title">Controlled Cohorts & Doubt Resolution</h3>
              <p className="about-pillar-desc">
                Strict limits on batch intake ensure our senior faculty personally know every scholar's learning pace, tracking recurring errors and resolving doubts immediately.
              </p>
            </div>

            <div className="about-pillar-card">
              <span className="about-pillar-idx tabular-nums">04</span>
              <h3 className="about-pillar-title">Granular Test Analytics</h3>
              <p className="about-pillar-desc">
                Weekly chapter tests and cumulative simulated exams provide deep diagnostic feedback — categorizing mistakes into conceptual lapses, reading slips, or time mismanagement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Institutional Standards & Ethics */}
      <section className="about-section about-section--ethics">
        <div className="site-container about-grid">
          <div className="about-col-label">
            <span className="about-label-badge">ACADEMIC STANDARDS</span>
            <h2 className="about-section-heading">
              Our institutional commitments to parents and scholars.
            </h2>
          </div>

          <div className="about-col-content">
            <div className="about-commitments-list">
              <div className="about-commitment-item">
                <CheckCircle2 size={20} className="about-check-icon" />
                <div>
                  <strong>Only Senior Subject Specialists</strong>
                  <p>All core lectures in Physics, Chemistry, Mathematics, and Biology are conducted by experienced subject heads with a proven coaching track record.</p>
                </div>
              </div>

              <div className="about-commitment-item">
                <CheckCircle2 size={20} className="about-check-icon" />
                <div>
                  <strong>Transparent Progress Reporting</strong>
                  <p>Parents receive detailed bi-weekly performance matrices, test analytics, attendance logs, and personal faculty feedback sessions.</p>
                </div>
              </div>

              <div className="about-commitment-item">
                <CheckCircle2 size={20} className="about-check-icon" />
                <div>
                  <strong>Holistic Psychological Resilience</strong>
                  <p>We train students in stress management, examination temperament, and intellectual endurance, preventing exam-season burnout.</p>
                </div>
              </div>
            </div>

            <div className="about-explore-strip">
              <Link to="/faculty" className="about-explore-btn">
                <span>Meet Department Faculty</span>
                <ArrowRight size={15} strokeWidth={2.2} />
              </Link>
              <Link to="/courses" className="about-explore-btn about-explore-btn--secondary">
                <span>Inspect Academic Curricula</span>
                <ArrowRight size={15} strokeWidth={2.2} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Admission CTA */}
      <AdmissionCTA />
    </div>
  );
}

export default About;