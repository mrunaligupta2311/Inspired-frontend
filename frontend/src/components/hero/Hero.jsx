import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Star, MapPin } from "lucide-react";

import "./Hero.css";

const API_URL = import.meta.env.VITE_API_URL ?? "";

function Hero() {
  const [heroImage, setHeroImage] = useState("");
  const [topResult, setTopResult] = useState(null);

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      try {
        const [instRes, resRes] = await Promise.allSettled([
          fetch(`${API_URL}/api/institute`),
          fetch(`${API_URL}/api/results?public=true`),
        ]);

        if (instRes.status === "fulfilled" && instRes.value.ok) {
          const instData = await instRes.value.json();
          if (mounted && instData?.data) {
            setHeroImage(instData.data.heroImageUrl || instData.data.heroMediaUrl || "");
          }
        }

        if (resRes.status === "fulfilled" && resRes.value.ok) {
          const resData = await resRes.value.json();
          if (mounted && resData?.data && Array.isArray(resData.data) && resData.data.length > 0) {
            setTopResult(resData.data[0]);
          }
        }
      } catch (err) {
        console.warn("Hero fetch notice:", err.message);
      }
    };

    loadData();
    return () => {
      mounted = false;
    };
  }, []);

  const defaultHeroImg =
    "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=85";
  const displayImage = heroImage && heroImage.trim() !== "" ? heroImage : defaultHeroImg;

  return (
    <section className="inspired-hero" id="home">
      <div className="inspired-hero__ambient" aria-hidden="true" />

      <div className="site-container inspired-hero__container">
        {/* Left Column: Brand & Academic Story */}
        <div className="inspired-hero__text-col">
          {/* Brand Kicker with Google Rating & Established Year */}
          <div className="inspired-hero__kicker-strip">
            <span className="inspired-hero__badge">
              <span className="inspired-hero__badge-dot" />
              ESTD. 2018 · VADODARA
            </span>

            <a
              href="https://www.google.com/maps/search/?api=1&query=Inspired+Institute+Akshar+Pavilion+Vasna+Bhayli+Main+Road+Vadodara+Gujarat+391410"
              target="_blank"
              rel="noopener noreferrer"
              className="inspired-hero__google-badge"
              title="View Inspired Institute on Google Maps"
            >
              <div className="inspired-hero__stars">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={12} fill="#f59e0b" color="#f59e0b" />
                ))}
              </div>
              <span className="inspired-hero__google-text">5.0 on Google · 63+ Reviews</span>
            </a>
          </div>

          <h1 className="inspired-hero__headline">
            Where Potential
            <br />
            <span className="inspired-hero__headline-accent">Becomes Power.</span>
          </h1>

          <p className="inspired-hero__statement">
            Operating since 2018 in Vadodara, Inspired Institute transforms academic curiosity into confidence
            and student ambition into measurable achievement through concept-driven learning for Classes 6–12 Science,
            JEE, NEET, GUJCET, NDA, and Olympiad preparation.
          </p>

          <div className="inspired-hero__actions">
            <Link to="/courses" className="inspired-hero__primary-btn">
              <span>Explore Academic Courses</span>
              <ArrowRight size={16} strokeWidth={2.4} />
            </Link>

            <Link to="/contact" className="inspired-hero__secondary-btn">
              <span>Schedule Consultation</span>
              <ArrowUpRight size={16} strokeWidth={2.2} />
            </Link>
          </div>

          {/* Academic Scope Strip */}
          <div className="inspired-hero__scope-strip">
            <div className="inspired-hero__scope-item">
              <span className="inspired-hero__scope-value">Classes 6–12</span>
              <span className="inspired-hero__scope-label">Science & Foundation</span>
            </div>
            <div className="inspired-hero__scope-divider" aria-hidden="true" />
            <div className="inspired-hero__scope-item">
              <span className="inspired-hero__scope-value">JEE · NEET · GUJCET</span>
              <span className="inspired-hero__scope-label">Competitive Pathways</span>
            </div>
            <div className="inspired-hero__scope-divider" aria-hidden="true" />
            <div className="inspired-hero__scope-item">
              <span className="inspired-hero__scope-value">CBSE · ICSE · GSEB</span>
              <span className="inspired-hero__scope-label">Board Syllabus Synergy</span>
            </div>
          </div>
        </div>

        {/* Right Column: Visual Frame with Real Achievements Card */}
        <div className="inspired-hero__media-col">
          <div className="inspired-hero__media-frame">
            <div className="inspired-hero__media-inner">
              <img
                src={displayImage}
                alt="Inspired Institute Academic Study Environment"
                className="inspired-hero__image"
                loading="eager"
              />
              <div className="inspired-hero__media-gradient" />
            </div>

            {/* Location Pill */}
            <div className="inspired-hero__location-badge">
              <MapPin size={14} className="inspired-hero__location-icon" />
              <span>Vasna Bhayli Main Road, Vadodara</span>
            </div>

            {/* Achievement Card — Rendered ONLY if real data is available */}
            {topResult && (
              <div className="inspired-hero__result-card">
                <span className="inspired-hero__result-exam">
                  {topResult.exam || "Competitive Exam"}
                </span>
                <strong className="inspired-hero__result-score tabular-nums">
                  {topResult.score || topResult.percentile}
                </strong>
                <p className="inspired-hero__result-student">
                  {topResult.studentName} {topResult.rank ? `· ${topResult.rank}` : ""}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
