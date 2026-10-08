import "./TrustStrip.css";

const credibilityPillars = [
  {
    kicker: "ESTABLISHED",
    title: "Operating Since 2018",
    detail: "Focused science & competitive coaching in Vadodara",
  },
  {
    kicker: "GOOGLE REPUTATION",
    title: "5.0 ★ · 63+ Reviews",
    detail: "Rated for supportive teachers and concept-driven clarity",
    isGoogle: true,
  },
  {
    kicker: "ACADEMIC SPAN",
    title: "Classes 6 to 12 Science",
    detail: "Pre-Foundation, High School & Senior Secondary",
  },
  {
    kicker: "EXAM PATHWAYS",
    title: "JEE · NEET · GUJCET · NDA",
    detail: "Dual-track synchrony with CBSE, ICSE & GSEB boards",
  },
];

function TrustStrip() {
  return (
    <section className="academic-strip" aria-label="Institutional Credentials">
      <div className="site-container academic-strip__container">
        {credibilityPillars.map((pillar, idx) => (
          <div key={pillar.title} className="academic-strip__col">
            <span className="academic-strip__kicker">{pillar.kicker}</span>
            <div className="academic-strip__title-wrap">
              <h3 className="academic-strip__title">{pillar.title}</h3>
            </div>
            <p className="academic-strip__detail">{pillar.detail}</p>
            {idx < credibilityPillars.length - 1 && (
              <span className="academic-strip__sep" aria-hidden="true" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default TrustStrip;