import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import "./AboutPreview.css";

function AboutPreview() {
  return (
    <section className="academic-manifesto" id="philosophy">
      <div className="site-container academic-manifesto__container">
        {/* Left: Editorial Statement */}
        <div className="academic-manifesto__lead-col">
          <span className="academic-manifesto__eyebrow">OUR PHILOSOPHY</span>

          <h2 className="academic-manifesto__quote">
            Where potential becomes power.
            <span className="academic-manifesto__quote-serif"> Turning curiosity into confidence and ambition into achievement.</span>
          </h2>

          <div className="academic-manifesto__prose">
            <p>
              Operating since 2018 in Vadodara, Inspired Institute was founded on a simple conviction:
              competitive exams and school board excellence should not feel like an overwhelming guessing game.
            </p>
            <p>
              Our classrooms center around concept-driven learning, rigorous derivation, and approachable faculty
              who sit with students to resolve every doubt. We create a disciplined yet encouraging environment
              where students of Classes 6–12 build the clarity required to excel in Board examinations, JEE, NEET, GUJCET, and Olympiads.
            </p>
          </div>

          <div className="academic-manifesto__tenets">
            <div className="academic-manifesto__tenet">
              <span className="academic-manifesto__tenet-idx">01</span>
              <div>
                <strong>Concept-Driven Learning</strong>
                <p>Understanding the root principles of Math and Science rather than mechanical memorization.</p>
              </div>
            </div>

            <div className="academic-manifesto__tenet">
              <span className="academic-manifesto__tenet-idx">02</span>
              <div>
                <strong>Dedicated Doubt Resolution</strong>
                <p>Supportive faculty available to guide students through hurdles until concepts are crystal clear.</p>
              </div>
            </div>

            <div className="academic-manifesto__tenet">
              <span className="academic-manifesto__tenet-idx">03</span>
              <div>
                <strong>Board + Competitive Synergy</strong>
                <p>Harmonized preparation for CBSE, ICSE, and GSEB board marks alongside JEE/NEET rigor.</p>
              </div>
            </div>
          </div>

          <div className="academic-manifesto__link-wrap">
            <Link to="/about" className="academic-manifesto__link">
              <span>Learn More About Our Approach</span>
              <ArrowRight size={16} strokeWidth={2.4} />
            </Link>
          </div>
        </div>

        {/* Right: Visual Composition */}
        <div className="academic-manifesto__visual-col">
          <div className="academic-manifesto__image-card">
            <img
              src="https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=900&q=80"
              alt="Faculty and student in concept study session"
              className="academic-manifesto__image"
              loading="lazy"
            />
            <div className="academic-manifesto__image-caption">
              <span>CONCEPTUAL CLARITY</span>
              <p>Personalized doubt resolution and focused science coaching at Inspired Institute, Vasna Bhayli Main Road, Vadodara.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutPreview;