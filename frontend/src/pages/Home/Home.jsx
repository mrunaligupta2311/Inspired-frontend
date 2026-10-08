import Hero from "../../components/hero/Hero";
import TrustStrip from "../../components/trust/TrustStrip";
import AboutPreview from "../../components/about/AboutPreview";
import CoursesPreview from "../../components/courses/CoursesPreview";
import WhyInspiredInstitute from "../../components/why-inspired/WhyInspired";
import StudentJourney from "../../components/journey/StudentJourney";
import FacultyPreview from "../../components/faculty/FacultyPreview";
import ResultsPreview from "../../components/results/ResultsPreview";
import GalleryPreview from "../../components/gallery/GalleryPreview";
import AdmissionCTA from "../../components/admission/AdmissionCTA";

import "./Home.css";

function Home() {
  return (
    <div className="academic-home-page">
      {/* 1. Premium Dark Hero */}
      <Hero />

      {/* 2. Academic Credibility Strip */}
      <TrustStrip />

      {/* 3. Academic Philosophy & Institutional Manifesto */}
      <AboutPreview />

      {/* 4. Curricular Programs Catalogue */}
      <CoursesPreview />

      {/* 5. Why Inspired (The 6 Pedagogical Pillars) */}
      <WhyInspiredInstitute />

      {/* 6. Student Progression Timeline */}
      <StudentJourney />

      {/* 7. Senior Department Faculty */}
      <FacultyPreview />

      {/* 8. Verified Scholastic Achievements */}
      <ResultsPreview />

      {/* 9. Campus Life & Scientific Environment */}
      <GalleryPreview />

      {/* 10. Admission & Strategic Consultation CTA */}
      <AdmissionCTA />
    </div>
  );
}

export default Home;