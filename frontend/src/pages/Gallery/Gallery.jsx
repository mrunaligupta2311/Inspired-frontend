import { useEffect, useState, useMemo, useCallback } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
} from "lucide-react";

import AdmissionCTA from "../../components/admission/AdmissionCTA";
import "./Gallery.css";

const API_URL = import.meta.env.VITE_API_URL ?? "";

const CATEGORIES = [
  { id: "ALL", label: "All Campus Archives" },
  { id: "Classroom", label: "Lecture Theatres" },
  { id: "Laboratory", label: "Science Practicals & Labs" },
  { id: "Doubt", label: "Mentorship & Doubt Desks" },
  { id: "Seminar", label: "Seminars & Counseling" },
  { id: "Awards", label: "Felicitations & Awards" },
];

const galleryFallbacks = [
  {
    title: "Interactive Classroom Session",
    category: "Lecture Theatres",
    description: "Deep concept derivation and problem solving under senior faculty mentorship.",
    imageUrl: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=85",
  },
  {
    title: "Experimental Scientific Practicals",
    category: "Science Practicals & Labs",
    description: "Hands-on verification of Physics and Chemistry principles in our dedicated student laboratory.",
    imageUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1200&q=85",
  },
  {
    title: "Individual Doubt Resolution",
    category: "Mentorship & Doubt Desks",
    description: "Daily dedicated one-on-one sessions for scholars to analyze mistakes and clarify conceptual doubts.",
    imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=85",
  },
  {
    title: "Annual Scholastic Felicitation",
    category: "Felicitations & Awards",
    description: "Honoring our state rankers and national competitive entrance qualifiers with parents.",
    imageUrl: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=85",
  },
  {
    title: "Academic Strategy Seminar",
    category: "Seminars & Counseling",
    description: "Guiding aspirants through examination hall time-triage and stress mitigation protocols.",
    imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=85",
  },
  {
    title: "Collaborative Study Commons",
    category: "Lecture Theatres",
    description: "Scholars engaged in peer problem solving and competitive mock examination reviews.",
    imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=85",
  },
];

function Gallery() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchGallery = async () => {
      try {
        setLoading(true);

        const response = await fetch(`${API_URL}/api/gallery?public=true`);
        const result = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(result.message || "Failed to fetch gallery items");
        }

        if (mounted && result.success && Array.isArray(result.data)) {
          // If database has gallery items use them, else fallback gracefully
          if (result.data.length > 0) {
            setItems(result.data);
          } else {
            setItems(galleryFallbacks);
          }
        }
      } catch (err) {
        console.error("Gallery fetch error:", err);
        if (mounted) setItems(galleryFallbacks);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchGallery();
    return () => {
      mounted = false;
    };
  }, []);

  const filteredItems = useMemo(() => {
    if (activeCategory === "ALL") return items;

    return items.filter((item) => {
      const cat = (item.category || "").toLowerCase();
      const title = (item.title || "").toLowerCase();

      if (activeCategory === "Classroom") {
        return cat.includes("class") || cat.includes("theatre") || title.includes("class") || title.includes("lecture");
      }
      if (activeCategory === "Laboratory") {
        return cat.includes("lab") || cat.includes("practical") || title.includes("lab") || title.includes("science");
      }
      if (activeCategory === "Doubt") {
        return cat.includes("doubt") || cat.includes("mentor") || title.includes("doubt") || title.includes("one");
      }
      if (activeCategory === "Seminar") {
        return cat.includes("seminar") || cat.includes("counsel") || title.includes("seminar") || title.includes("strategy");
      }
      if (activeCategory === "Awards") {
        return cat.includes("award") || cat.includes("felicitation") || title.includes("award") || title.includes("felicitation");
      }
      return true;
    });
  }, [items, activeCategory]);

  const openLightbox = (index) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const nextImage = useCallback(() => {
    if (lightboxIndex !== null && filteredItems.length > 0) {
      setLightboxIndex((prev) => (prev + 1) % filteredItems.length);
    }
  }, [lightboxIndex, filteredItems.length]);

  const prevImage = useCallback(() => {
    if (lightboxIndex !== null && filteredItems.length > 0) {
      setLightboxIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
    }
  }, [lightboxIndex, filteredItems.length]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, nextImage, prevImage]);

  return (
    <div className="gallery-showcase-page">
      {/* 1. Academic Hero */}
      <section className="gallery-hero">
        <div className="site-container gallery-hero__container">
          <span className="gallery-hero__eyebrow">PHOTO & ACTIVITY ARCHIVE</span>
          <h1 className="gallery-hero__title">
            Inside the classroom and student moments at Inspired Institute.
          </h1>
          <p className="gallery-hero__lead">
            Visual glimpses of classroom learning, practical sessions, academic seminars,
            and student celebrations at Inspired Institute, Vasna Bhayli Main Road, Vadodara.
          </p>

          {/* Real Institute Pillars */}
          <div className="gallery-hero__features">
            <div className="gallery-hero__feature-item">
              <strong>Classes 6–12 Science</strong>
              <span>Interactive concept-driven lectures</span>
            </div>
            <div className="gallery-hero__feature-sep" />
            <div className="gallery-hero__feature-item">
              <strong>Supportive Faculty</strong>
              <span>Dedicated student doubt clearing</span>
            </div>
            <div className="gallery-hero__feature-sep" />
            <div className="gallery-hero__feature-item">
              <strong>Competitive Prep</strong>
              <span>JEE · NEET · GUJCET · Olympiad focus</span>
            </div>
            <div className="gallery-hero__feature-sep" />
            <div className="gallery-hero__feature-item">
              <strong>Since 2018</strong>
              <span>Akshar Pavilion, Vadodara</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Category Filters Bar */}
      <section className="gallery-filters-section">
        <div className="site-container">
          <div className="gallery-filters-bar">
            <div className="gallery-filters-tabs" role="tablist" aria-label="Campus Categories">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  role="tab"
                  aria-selected={activeCategory === cat.id}
                  className={`gallery-category-tab ${activeCategory === cat.id ? "is-active" : ""}`}
                  onClick={() => setActiveCategory(cat.id)}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <span className="gallery-count-indicator">
              Showing <strong>{filteredItems.length}</strong> Campus Records
            </span>
          </div>
        </div>
      </section>

      {/* 3. Editorial Gallery Grid */}
      <section className="gallery-grid-section">
        <div className="site-container">
          {loading ? (
            <div className="gallery-masonry-grid">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="gallery-skeleton-card" />
              ))}
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="gallery-state-box">
              <h3>No photographs found under this filter</h3>
              <p>Select "All Campus Archives" to view all records.</p>
              <button
                type="button"
                onClick={() => setActiveCategory("ALL")}
                className="gallery-retry-btn"
              >
                View All Archives
              </button>
            </div>
          ) : (
            <div className="gallery-masonry-grid">
              {filteredItems.map((item, idx) => {
                const img = item.imageUrl || item.mediaUrl || galleryFallbacks[0].imageUrl;

                return (
                  <article
                    key={item.id || idx}
                    className="gallery-frame-card"
                    onClick={() => openLightbox(idx)}
                  >
                    <div className="gallery-frame-media">
                      <img
                        src={img}
                        alt={item.title || "Inspired Institute Campus"}
                        className="gallery-frame-image"
                        loading="lazy"
                      />
                      <div className="gallery-frame-overlay" />
                      <div className="gallery-frame-zoom-icon" aria-hidden="true">
                        <Maximize2 size={18} />
                      </div>
                    </div>

                    <div className="gallery-frame-details">
                      <span className="gallery-frame-category">
                        {item.category || "Campus Moment"}
                      </span>
                      <h2 className="gallery-frame-title">{item.title}</h2>
                      {item.description && (
                        <p className="gallery-frame-description">{item.description}</p>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>



      {/* 5. Lightbox Modal */}
      {lightboxIndex !== null && filteredItems[lightboxIndex] && (
        <div className="gallery-lightbox" onClick={closeLightbox}>
          <div
            className="gallery-lightbox__dialog"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Image Preview"
          >
            <button
              type="button"
              className="gallery-lightbox__close"
              onClick={closeLightbox}
              aria-label="Close image preview"
            >
              <X size={22} />
            </button>

            <button
              type="button"
              className="gallery-lightbox__nav gallery-lightbox__nav--prev"
              onClick={prevImage}
              aria-label="Previous image"
            >
              <ChevronLeft size={26} />
            </button>

            <button
              type="button"
              className="gallery-lightbox__nav gallery-lightbox__nav--next"
              onClick={nextImage}
              aria-label="Next image"
            >
              <ChevronRight size={26} />
            </button>

            <div className="gallery-lightbox__media-wrap">
              <img
                src={
                  filteredItems[lightboxIndex].imageUrl ||
                  filteredItems[lightboxIndex].mediaUrl ||
                  galleryFallbacks[0].imageUrl
                }
                alt={filteredItems[lightboxIndex].title}
                className="gallery-lightbox__image"
              />
            </div>

            <div className="gallery-lightbox__caption">
              <span className="gallery-lightbox__category">
                {filteredItems[lightboxIndex].category || "Campus Moment"}
              </span>
              <h3 className="gallery-lightbox__title">
                {filteredItems[lightboxIndex].title}
              </h3>
              {filteredItems[lightboxIndex].description && (
                <p className="gallery-lightbox__desc">
                  {filteredItems[lightboxIndex].description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 6. Admission Consultation CTA */}
      <AdmissionCTA />
    </div>
  );
}

export default Gallery;
