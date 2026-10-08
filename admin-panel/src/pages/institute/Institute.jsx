
import { useEffect, useState } from "react";
import {
  Building2,
  Edit3,
  ExternalLink,
  Globe2,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  X,
  Clock3,
} from "lucide-react";

import apiClient from "../../api/client";
import InstituteForm from "./InstituteForm";
import "./Institute.css";

function Institute() {
  const [institute, setInstitute] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);

  const [toast, setToast] = useState({
    type: "",
    message: "",
  });

  // =====================================================
  // FETCH INSTITUTE
  // =====================================================

  const fetchInstitute = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await apiClient.get("/institute");

      const responseData = response?.data?.data;

      const data =
        responseData?.institute ||
        responseData?.item ||
        responseData ||
        null;

      setInstitute(data);
    } catch (err) {
      setError(
        err?.message ||
          "Failed to load institute information. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstitute();
  }, []);

  // =====================================================
  // TOAST
  // =====================================================

  const showToast = (type, message) => {
    setToast({
      type,
      message,
    });

    window.setTimeout(() => {
      setToast({
        type: "",
        message: "",
      });
    }, 3500);
  };

  // =====================================================
  // MODAL
  // =====================================================

  const openEditModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleFormSuccess = (updatedInstitute, message) => {
    setInstitute(updatedInstitute);
    closeModal();

    showToast(
      "success",
      message || "Institute information updated successfully."
    );
  };

  // =====================================================
  // URL HELPERS
  // =====================================================

  const normalizeUrl = (url) => {
    if (!url) return "";

    const value = String(url).trim();

    if (!value) return "";

    if (
      value.startsWith("http://") ||
      value.startsWith("https://")
    ) {
      return value;
    }

    return `https://${value}`;
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <section className="institute-page">
        <div className="institute-page-header">
          <div>
            <span className="institute-page-kicker">
              INSTITUTE SETTINGS
            </span>

            <h1>Institute Information</h1>

            <p>
              Manage the institute information displayed across the website.
            </p>
          </div>
        </div>

        <div className="institute-loading-card">
          <div className="institute-skeleton institute-skeleton-title" />

          <div className="institute-skeleton-grid">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                className="institute-skeleton-group"
                key={item}
              >
                <div className="institute-skeleton institute-skeleton-label" />

                <div className="institute-skeleton institute-skeleton-value" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <section className="institute-page">
        <div className="institute-page-header">
          <div>
            <span className="institute-page-kicker">
              INSTITUTE SETTINGS
            </span>

            <h1>Institute Information</h1>

            <p>
              Manage the institute information displayed across the website.
            </p>
          </div>

          <button
            type="button"
            className="institute-secondary-button"
            onClick={fetchInstitute}
          >
            <RefreshCw size={17} />
            Retry
          </button>
        </div>

        <div className="institute-error-state">
          <div className="institute-error-icon">
            <Building2 size={24} />
          </div>

          <h2>Unable to load institute information</h2>

          <p>{error}</p>

          <button
            type="button"
            className="institute-primary-button"
            onClick={fetchInstitute}
          >
            <RefreshCw size={17} />
            Try Again
          </button>
        </div>
      </section>
    );
  }

  // =====================================================
  // MAIN
  // =====================================================

  return (
    <section className="institute-page">
      {/* =================================================
          PAGE HEADER
          ================================================= */}

      <div className="institute-page-header">
        <div>
          <span className="institute-page-kicker">
            INSTITUTE SETTINGS
          </span>

          <h1>Institute Information</h1>

          <p>
            Manage the institute information displayed across the website.
          </p>
        </div>

        <div className="institute-header-actions">
          <button
            type="button"
            className="institute-secondary-button"
            onClick={fetchInstitute}
          >
            <RefreshCw size={17} />
            Refresh
          </button>

          <button
            type="button"
            className="institute-primary-button"
            onClick={openEditModal}
          >
            <Edit3 size={17} />
            Edit Information
          </button>
        </div>
      </div>

      {!institute ? (
        <div className="institute-empty-state">
          <div className="institute-empty-icon">
            <Building2 size={25} />
          </div>

          <h2>Institute information not found</h2>

          <p>
            Add your institute information to manage the details displayed on
            the website.
          </p>

          <button
            type="button"
            className="institute-primary-button"
            onClick={openEditModal}
          >
            <Edit3 size={17} />
            Add Information
          </button>
        </div>
      ) : (
        <div className="institute-content">
          {/* =================================================
              INSTITUTE OVERVIEW
              ================================================= */}

          <div className="institute-overview-card">
            <div className="institute-overview-icon">
              <Building2 size={27} />
            </div>

            <div className="institute-overview-content">
              <span className="institute-overview-label">
                INSTITUTE PROFILE
              </span>

              <h2>
                {institute.name || "Inspired Institute"}
              </h2>

              <p>
                {institute.about ||
                  "Institute information and contact details."}
              </p>
            </div>
          </div>

          {/* =================================================
              CONTACT INFORMATION
              ================================================= */}

          <div className="institute-section-card">
            <div className="institute-section-header">
              <div className="institute-section-heading">
                <div className="institute-section-icon">
                  <Phone size={18} />
                </div>

                <div>
                  <h3>Contact Information</h3>

                  <p>
                    Primary contact details of the institute.
                  </p>
                </div>
              </div>
            </div>

            <div className="institute-info-grid">
              <div className="institute-info-item">
                <span>
                  <Phone size={15} />
                  Phone
                </span>

                {institute.phone ? (
                  <strong>{institute.phone}</strong>
                ) : (
                  <strong>Not provided</strong>
                )}
              </div>

              <div className="institute-info-item">
                <span>
                  <Phone size={15} />
                  WhatsApp
                </span>

                {institute.whatsappNumber ? (
                  <strong>{institute.whatsappNumber}</strong>
                ) : (
                  <strong>Not provided</strong>
                )}
              </div>

              <div className="institute-info-item">
                <span>
                  <Mail size={15} />
                  Email
                </span>

                {institute.email ? (
                  <a href={`mailto:${institute.email}`}>
                    {institute.email}
                  </a>
                ) : (
                  <strong>Not provided</strong>
                )}
              </div>

              <div className="institute-info-item institute-info-item-full">
                <span>
                  <MapPin size={15} />
                  Address
                </span>

                <strong>
                  {institute.address || "Not provided"}
                </strong>
              </div>

              <div className="institute-info-item institute-info-item-full">
                <span>
                  <Clock3 size={15} />
                  Working Hours
                </span>

                <strong>
                  {institute.workingHours || "Not provided"}
                </strong>
              </div>
            </div>
          </div>

          {/* =================================================
              ABOUT
              ================================================= */}

          <div className="institute-section-card">
            <div className="institute-section-header">
              <div className="institute-section-heading">
                <div className="institute-section-icon">
                  <Building2 size={18} />
                </div>

                <div>
                  <h3>About Institute</h3>

                  <p>
                    Public-facing institute description.
                  </p>
                </div>
              </div>
            </div>

            <div className="institute-about-content">
              {institute.about ? (
                <p>{institute.about}</p>
              ) : (
                <span>
                  No institute description has been added yet.
                </span>
              )}
            </div>
          </div>

          {/* =================================================
              SOCIAL LINKS
              ================================================= */}

          <div className="institute-section-card">
            <div className="institute-section-header">
              <div className="institute-section-heading">
                <div className="institute-section-icon">
                  <Globe2 size={18} />
                </div>

                <div>
                  <h3>Social Media</h3>

                  <p>
                    Social profiles displayed on the public website.
                  </p>
                </div>
              </div>
            </div>

            <div className="institute-social-grid">
              <SocialLink
                icon={<Globe2 size={17} />}
                label="Facebook"
                url={institute.facebookUrl}
                normalizeUrl={normalizeUrl}
              />

              <SocialLink
                icon={<Globe2 size={17} />}
                label="Instagram"
                url={institute.instagramUrl}
                normalizeUrl={normalizeUrl}
              />

              <SocialLink
                icon={<Globe2 size={17} />}
                label="YouTube"
                url={institute.youtubeUrl}
                normalizeUrl={normalizeUrl}
              />

              <SocialLink
                icon={<LinkedinIcon />}
                label="LinkedIn"
                url={institute.linkedinUrl}
                normalizeUrl={normalizeUrl}
              />
            </div>
          </div>
        </div>
      )}

      {/* =================================================
          EDIT MODAL
          ================================================= */}

      {modalOpen && (
        <div
          className="institute-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >
          <div
            className="institute-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="institute-modal-title"
          >
            <div className="institute-modal-header">
              <div>
                <span className="institute-modal-kicker">
                  INSTITUTE SETTINGS
                </span>

                <h2 id="institute-modal-title">
                  Edit Institute Information
                </h2>

                <p>
                  Update the information shown across the public website.
                </p>
              </div>

              <button
                type="button"
                className="institute-modal-close"
                onClick={closeModal}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <div className="institute-modal-body">
              <InstituteForm
                institute={institute}
                onSuccess={handleFormSuccess}
                onCancel={closeModal}
              />
            </div>
          </div>
        </div>
      )}

      {/* =================================================
          TOAST
          ================================================= */}

      {toast.message && (
        <div
          className={`institute-toast ${
            toast.type === "error" ? "error" : "success"
          }`}
          role="status"
        >
          <span className="institute-toast-indicator" />

          <span>{toast.message}</span>
        </div>
      )}
    </section>
  );
}

// =====================================================
// SOCIAL LINK
// =====================================================

function SocialLink({
  icon,
  label,
  url,
  normalizeUrl,
}) {
  const normalizedUrl = normalizeUrl(url);

  return (
    <div className="institute-social-item">
      <div className="institute-social-icon">
        {icon}
      </div>

      <div className="institute-social-content">
        <span>{label}</span>

        {normalizedUrl ? (
          <a
            href={normalizedUrl}
            target="_blank"
            rel="noreferrer"
          >
            {url}
            <ExternalLink size={13} />
          </a>
        ) : (
          <strong>Not provided</strong>
        )}
      </div>
    </div>
  );
}

// =====================================================
// SMALL ICON HELPERS
// =====================================================

function LinkedinIcon() {
  return (
    <span className="institute-linkedin-icon">
      in
    </span>
  );
}

export default Institute;
