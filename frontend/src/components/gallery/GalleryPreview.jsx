import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import "./GalleryPreview.css";

const API_URL = import.meta.env.VITE_API_URL ?? "";

function GalleryPreview() {
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchGallery = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/api/gallery?public=true`);
        if (!response.ok) throw new Error("Failed to load gallery");
        const res = await response.json();
        if (mounted && res.success && Array.isArray(res.data)) {
          setGalleryItems(res.data.slice(0, 5));
        }
      } catch (err) {
        console.warn("Gallery preview fetch notice:", err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchGallery();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="academic-gallery" id="gallery">
      <div className="site-container">
        {/* Header */}
        <div className="academic-gallery__header">
          <div className="academic-gallery__headings">
            <span className="academic-gallery__eyebrow">GALLERY & ACTIVITIES</span>
            <h2 className="academic-gallery__title">
              Moments of classroom learning and student activities.
            </h2>
          </div>
          <p className="academic-gallery__intro">
            A look inside our classrooms, science practicals, and academic events at Inspired Institute in Vadodara.
          </p>
        </div>

        {/* Asymmetric Editorial Gallery Grid */}
        {loading ? (
          <div className="academic-gallery__asymmetric-grid">
            <div className="academic-gallery__skeleton academic-gallery__skeleton--large" />
            <div className="academic-gallery__skeleton academic-gallery__skeleton--side" />
            <div className="academic-gallery__skeleton academic-gallery__skeleton--side" />
          </div>
        ) : galleryItems.length > 0 ? (
          <div className="academic-gallery__asymmetric-grid">
            {/* Lead Large Item */}
            {galleryItems[0] && (
              <div className="academic-gallery__card academic-gallery__card--lead">
                <img
                  src={galleryItems[0].imageUrl || galleryItems[0].mediaUrl}
                  alt={galleryItems[0].title || "Academic Lecture Session"}
                  className="academic-gallery__img"
                  loading="lazy"
                />
                <div className="academic-gallery__scrim" />
                <div className="academic-gallery__card-meta">
                  <span className="academic-gallery__card-category">
                    {galleryItems[0].category || "Campus Life"}
                  </span>
                  <h3 className="academic-gallery__card-title">
                    {galleryItems[0].title || "Interactive Classroom Sessions"}
                  </h3>
                </div>
              </div>
            )}

            {/* Stacked Side Items */}
            <div className="academic-gallery__side-col">
              {galleryItems.slice(1, 3).map((item, idx) => (
                <div key={item.id || idx} className="academic-gallery__card academic-gallery__card--sub">
                  <img
                    src={item.imageUrl || item.mediaUrl}
                    alt={item.title || "Scholastic moment"}
                    className="academic-gallery__img"
                    loading="lazy"
                  />
                  <div className="academic-gallery__scrim" />
                  <div className="academic-gallery__card-meta">
                    <span className="academic-gallery__card-category">
                      {item.category || "Laboratory & Practice"}
                    </span>
                    <h3 className="academic-gallery__card-title">
                      {item.title || "Academic Practicals"}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="academic-gallery__empty">
            <p>Campus photo archives are being updated.</p>
          </div>
        )}

        {/* Footer */}
        <div className="academic-gallery__footer">
          <Link to="/gallery" className="academic-gallery__full-link">
            <span>Explore Complete Campus Photo & Activity Archive</span>
            <ArrowRight size={16} strokeWidth={2.2} />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default GalleryPreview;