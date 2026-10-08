import { useState } from "react";
import "./WhyInspired.css";

const principles = [
  {
    index: "01",
    title: "Concept-Driven Foundation",
    summary: "Derivation before computation. We ensure students understand the scientific principles and mathematical origin of every formula, leaving zero room for rote memory failure.",
  },
  {
    index: "02",
    title: "Personalized Doubt Resolution",
    summary: "No student gets lost in oversized lecture halls. Controlled batch sizes enable faculty to resolve individual doubts promptly and track learning progress.",
  },
  {
    index: "03",
    title: "Supportive Experienced Faculty",
    summary: "Dedicated educators who focus on student growth, clear explanations, and making complex Physics, Chemistry, Math, and Biology topics approachable.",
  },
  {
    index: "04",
    title: "Dual-Track Board & Entrance Synergy",
    summary: "A unified academic timetable preparing students concurrently for CBSE, ICSE, and GSEB board excellence alongside JEE, NEET, and GUJCET competitive benchmarks.",
  },
  {
    index: "05",
    title: "Structured Assessments & Feedback",
    summary: "Regular chapter tests, mock exams, and actionable performance feedback to pinpoint conceptual gaps and strengthen examination temperament.",
  },
  {
    index: "06",
    title: "Culture Focused on Achievers",
    summary: "Cultivating disciplined study habits, academic confidence, and positive peer encouragement to turn ambition into verified achievement.",
  },
];

function WhyInspiredInstitute() {
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <section className="academic-why" id="why-inspired">
      <div className="site-container academic-why__container">
        {/* Left Side: Institutional Statement */}
        <div className="academic-why__statement-col">
          <div className="academic-why__sticky-box">
            <span className="academic-why__eyebrow">TEACHING METHODOLOGY</span>

            <h2 className="academic-why__headline">
              A teaching approach engineered for clarity, confidence, and real mastery.
            </h2>

            <p className="academic-why__prose">
              Operating since 2018 in Vadodara, Inspired Institute combines concept-driven pedagogy with approachable faculty mentorship.
              We foster curiosity, build solid foundations in Science and Mathematics, and equip serious students with the skills to excel.
            </p>

            <div className="academic-why__stat-card">
              <div className="academic-why__stat-item">
                <span className="academic-why__stat-num">Personalized</span>
                <span className="academic-why__stat-desc">Attention & Doubt Clearing in Every Subject</span>
              </div>
              <div className="academic-why__stat-sep" />
              <div className="academic-why__stat-item">
                <span className="academic-why__stat-num">Dual-Track</span>
                <span className="academic-why__stat-desc">Integrated Board (CBSE/ICSE/GSEB) + Entrance Syllabus</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Vertically Stacked Principles */}
        <div className="academic-why__principles-col">
          {principles.map((principle, idx) => {
            const isSelected = activeIdx === idx;

            return (
              <div
                key={principle.index}
                className={`academic-why__item ${isSelected ? "is-selected" : ""}`}
                onMouseEnter={() => setActiveIdx(idx)}
                onClick={() => setActiveIdx(idx)}
              >
                <div className="academic-why__item-header">
                  <span className="academic-why__item-idx tabular-nums">{principle.index}</span>
                  <h3 className="academic-why__item-title">{principle.title}</h3>
                </div>
                <p className="academic-why__item-summary">{principle.summary}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default WhyInspiredInstitute;