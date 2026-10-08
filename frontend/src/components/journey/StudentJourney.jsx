import { useState } from "react";
import "./StudentJourney.css";

const progressionStages = [
  {
    step: "01",
    phase: "DIAGNOSTIC CORE",
    title: "Foundation & Intellectual Appraisal",
    description: "Assessing existing conceptual prerequisites, mathematical agility, and analytical thinking to calibrate an individualized preparation pathway.",
    milestone: "Baseline cognitive map established",
  },
  {
    step: "02",
    phase: "DERIVATIVE RIGOR",
    title: "Concept-First Theory & Derivations",
    description: "Deep dive into fundamental laws of Physics, Chemistry, and Mathematics. Every equation is derived from first principles before problem sets are touched.",
    milestone: "Zero memorization; 100% derivation fluency",
  },
  {
    step: "03",
    phase: "MULTI-CONCEPT SYNTHESIS",
    title: "Advanced Problem Application",
    description: "Transitioning to complex, multi-concept problems characteristic of JEE Advanced and NEET. Training students to cross-apply concepts between chapters.",
    milestone: "Mastery over inter-chapter problem solving",
  },
  {
    step: "04",
    phase: "EMPIRICAL BENCHMARKING",
    title: "Diagnostic Testing & Error Analytics",
    description: "Weekly timed assessments analyzed via granular error matrices — categorizing errors into conceptual gaps, misread constraints, or calculation slips.",
    milestone: "Data-driven elimination of negative marks",
  },
  {
    step: "05",
    phase: "EXAM TEMPERAMENT",
    title: "Strategic Time Triage & Simulation",
    description: "Full-length exam simulations under exact examination hall conditions. Training in pacing, question selection, psychological calm, and stamina.",
    milestone: "Peak test performance under clock pressure",
  },
  {
    step: "06",
    phase: "SUMMIT OUTCOME",
    title: "Dual-Track Academic Distinction",
    description: "The synthesis of board excellence (CBSE / GSEB) and national competitive entrance triumphs — converting steady preparation into verified achievements.",
    milestone: "Admission into premier universities & medical institutes",
  },
];

function StudentJourney() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section className="academic-journey" id="journey">
      <div className="site-container">
        {/* Header */}
        <div className="academic-journey__header">
          <span className="academic-journey__eyebrow">PEDAGOGICAL PROGRESSION</span>
          <h2 className="academic-journey__title">
            The trajectory from foundational curiosity to academic distinction.
          </h2>
          <p className="academic-journey__intro">
            Excellence in competitive academics is not accidental; it is the predictable outcome
            of a structured, 6-stage intellectual progression engineered over years of study.
          </p>
        </div>

        {/* Interactive Milestone Timeline */}
        <div className="academic-journey__timeline">
          <div className="academic-journey__track" aria-hidden="true">
            <div
              className="academic-journey__track-fill"
              style={{ width: `${((activeStep + 1) / progressionStages.length) * 100}%` }}
            />
          </div>

          <div className="academic-journey__steps">
            {progressionStages.map((stage, idx) => {
              const isActive = activeStep === idx;
              const isPast = activeStep > idx;

              return (
                <button
                  key={stage.step}
                  type="button"
                  className={`academic-journey__step-btn ${isActive ? "is-active" : ""} ${isPast ? "is-past" : ""}`}
                  onClick={() => setActiveStep(idx)}
                  aria-label={`View stage ${stage.step}: ${stage.title}`}
                >
                  <span className="academic-journey__node">
                    <span className="academic-journey__node-num tabular-nums">{stage.step}</span>
                  </span>
                  <span className="academic-journey__step-label">{stage.phase}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Stage Editorial Card */}
        <div className="academic-journey__card">
          <div className="academic-journey__card-side">
            <span className="academic-journey__card-idx tabular-nums">
              STAGE {progressionStages[activeStep].step} OF 06
            </span>
            <span className="academic-journey__card-phase">
              {progressionStages[activeStep].phase}
            </span>
            <div className="academic-journey__card-milestone">
              <small>KEY ACADEMIC MILESTONE</small>
              <p>{progressionStages[activeStep].milestone}</p>
            </div>
          </div>

          <div className="academic-journey__card-main">
            <h3 className="academic-journey__card-title">
              {progressionStages[activeStep].title}
            </h3>
            <p className="academic-journey__card-desc">
              {progressionStages[activeStep].description}
            </p>

            <div className="academic-journey__controls">
              <button
                type="button"
                className="academic-journey__nav-btn"
                disabled={activeStep === 0}
                onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
              >
                ← Previous Stage
              </button>
              <button
                type="button"
                className="academic-journey__nav-btn academic-journey__nav-btn--primary"
                disabled={activeStep === progressionStages.length - 1}
                onClick={() => setActiveStep((prev) => Math.min(progressionStages.length - 1, prev + 1))}
              >
                Next Stage →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default StudentJourney;