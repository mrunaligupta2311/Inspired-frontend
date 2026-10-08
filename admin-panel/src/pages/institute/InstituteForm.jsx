import { useEffect, useRef, useState } from "react";
import {
  Building2,
  Globe2,
  ImagePlus,
  LoaderCircle,
  Mail,
  MapPin,
  Phone,
  Save,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";

import apiClient from "../../api/client";

const initialForm = {
  name: "",
  phone: "",
  whatsappNumber: "",
  email: "",
  address: "",
  workingHours: "",
  facebookUrl: "",
  instagramUrl: "",
  youtubeUrl: "",
  linkedinUrl: "",
  about: "",
};

function InstituteForm({
  institute,
  onSuccess,
  onCancel,
}) {
  const [form, setForm] =
    useState(initialForm);

  const [errors, setErrors] =
    useState({});

  const [submitting, setSubmitting] =
    useState(false);

  const [heroUploading, setHeroUploading] =
    useState(false);

  const [heroRemoving, setHeroRemoving] =
    useState(false);

  const [heroPreview, setHeroPreview] =
    useState("");

  const heroFileRef = useRef(null);

  // =====================================================
  // INITIALIZE FORM
  // =====================================================

  useEffect(() => {
    if (!institute) {
      setForm(initialForm);
      return;
    }

    setForm({
      name: institute.name || "",
      phone: institute.phone || "",
      whatsappNumber:
        institute.whatsappNumber || "",
      email: institute.email || "",
      address: institute.address || "",
      workingHours:
        institute.workingHours || "",
      facebookUrl:
        institute.facebookUrl || "",
      instagramUrl:
        institute.instagramUrl || "",
      youtubeUrl:
        institute.youtubeUrl || "",
      linkedinUrl:
        institute.linkedinUrl || "",
      about: institute.about || "",
    });

    setHeroPreview(
      institute?.heroMediaUrl || ""
    );

    setErrors({});
  }, [institute]);

  // =====================================================
  // CHANGE HANDLER
  // =====================================================

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setErrors((current) => {
      if (!current[name]) {
        return current;
      }

      const updated = {
        ...current,
      };

      delete updated[name];

      return updated;
    });
  };

  // =====================================================
  // VALIDATION
  // =====================================================

  const validate = () => {
    const nextErrors = {};

    const name =
      form.name.trim();

    const email =
      form.email.trim();

    const phone =
      form.phone.trim();

    const whatsapp =
      form.whatsappNumber.trim();

    const facebook =
      form.facebookUrl.trim();

    const instagram =
      form.instagramUrl.trim();

    const youtube =
      form.youtubeUrl.trim();

    const linkedin =
      form.linkedinUrl.trim();

    if (!name) {
      nextErrors.name =
        "Institute name is required.";
    }

    if (!phone) {
      nextErrors.phone =
        "Phone number is required.";
    }

    if (
      email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email
      )
    ) {
      nextErrors.email =
        "Enter a valid email address.";
    }

    if (
      phone &&
      !/^[+()\d\s-]{7,20}$/.test(phone)
    ) {
      nextErrors.phone =
        "Enter a valid phone number.";
    }

    if (
      whatsapp &&
      !/^[+()\d\s-]{7,20}$/.test(
        whatsapp
      )
    ) {
      nextErrors.whatsappNumber =
        "Enter a valid WhatsApp number.";
    }

    const socialFields = [
      {
        name: "facebookUrl",
        value: facebook,
        label: "Globe2",
      },
      {
        name: "instagramUrl",
        value: instagram,
        label: "Globe2",
      },
      {
        name: "youtubeUrl",
        value: youtube,
        label: "YouTube",
      },
      {
        name: "linkedinUrl",
        value: linkedin,
        label: "LinkedIn",
      },
    ];

    socialFields.forEach(
      ({ name, value, label }) => {
        if (
          value &&
          !/^https?:\/\/.+/i.test(value)
        ) {
          nextErrors[name] =
            `${label} URL must start with http:// or https://.`;
        }
      }
    );

    setErrors(nextErrors);

    return (
      Object.keys(nextErrors).length === 0
    );
  };

  // =====================================================
  // HERO MEDIA
  // =====================================================

  const handleHeroFileChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file || !institute?.id) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setErrors({
        form: "Please select an image file.",
      });
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      setErrors({
        form: "Hero image must be smaller than 100 MB.",
      });
      return;
    }

    try {
      setHeroUploading(true);
      setErrors({});

      const formData = new FormData();
      formData.append("file", file);

      const response = await apiClient.post(
        `/institute/${institute.id}/hero/upload`,
        formData,
        {
          headers: {
            "Content-Type": undefined,
          },
        }
      );

      const updated =
        response?.data?.data;

      setHeroPreview(
        updated?.heroMediaUrl || ""
      );

      onSuccess(
        updated,
        "Hero image updated successfully."
      );
    } catch (error) {
      setErrors({
        form:
          error?.message ||
          "Failed to upload hero image. Please try again.",
      });
    } finally {
      setHeroUploading(false);

      if (heroFileRef.current) {
        heroFileRef.current.value = "";
      }
    }
  };

  const handleHeroRemove = async () => {
    if (!institute?.id || !heroPreview) {
      return;
    }

    try {
      setHeroRemoving(true);
      setErrors({});

      const response = await apiClient.delete(
        `/institute/${institute.id}/hero`
      );

      const updated =
        response?.data?.data;

      setHeroPreview("");

      onSuccess(
        updated,
        "Hero image removed successfully."
      );
    } catch (error) {
      setErrors({
        form:
          error?.message ||
          "Failed to remove hero image. Please try again.",
      });
    } finally {
      setHeroRemoving(false);
    }
  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        name: form.name.trim(),
        phone: form.phone.trim(),
        whatsappNumber:
          form.whatsappNumber.trim(),
        email: form.email.trim(),
        address: form.address.trim(),
        workingHours:
          form.workingHours.trim(),
        facebookUrl:
          form.facebookUrl.trim(),
        instagramUrl:
          form.instagramUrl.trim(),
        youtubeUrl:
          form.youtubeUrl.trim(),
        linkedinUrl:
          form.linkedinUrl.trim(),
        about: form.about.trim(),
      };

      let response;

      if (institute?.id) {
        response =
          await apiClient.patch(
            `/institute/${institute.id}`,
            payload
          );
      } else {
        response =
          await apiClient.post(
            "/institute",
            payload
          );
      }

      const responseData =
        response?.data?.data;

      const updatedInstitute =
        responseData?.institute ||
        responseData?.item ||
        responseData;

      onSuccess(
        updatedInstitute,
        institute?.id
          ? "Institute information updated successfully."
          : "Institute information created successfully."
      );
    } catch (error) {
      setErrors({
        form:
          error?.message ||
          "Failed to save institute information. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // =====================================================
  // INPUT CLASS
  // =====================================================

  const inputClass = (field) =>
    `institute-form-input ${
      errors[field] ? "has-error" : ""
    }`;

  return (
    <form
      className="institute-form"
      onSubmit={handleSubmit}
      noValidate
    >
      {/* =================================================
          FORM ERROR
          ================================================= */}

      {errors.form && (
        <div className="institute-form-error">
          <span />
          <p>{errors.form}</p>
        </div>
      )}

      {/* =================================================
          BASIC INFORMATION
          ================================================= */}

      <section className="institute-form-section">
        <div className="institute-form-section-header">
          <div className="institute-form-section-icon">
            <Building2 size={18} />
          </div>

          <div>
            <h3>Basic Information</h3>

            <p>
              Core information about the
              institute.
            </p>
          </div>
        </div>

        <div className="institute-form-grid">
          <div className="institute-form-field institute-form-field-full">
            <label htmlFor="name">
              Institute Name
              <span>*</span>
            </label>

            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="Inspired Institute"
              className={inputClass("name")}
              disabled={submitting}
            />

            {errors.name && (
              <small>
                {errors.name}
              </small>
            )}
          </div>

          <div className="institute-form-field institute-form-field-full">
            <label htmlFor="about">
              About Institute
            </label>

            <textarea
              id="about"
              name="about"
              value={form.about}
              onChange={handleChange}
              placeholder="Write a short description about Inspired Institute..."
              rows={5}
              className={inputClass("about")}
              disabled={submitting}
            />

            <div className="institute-form-helper">
              This description can be displayed
              on the public website.
            </div>
          </div>
        </div>
      </section>

      {/* =================================================
          HERO IMAGE
          ================================================= */}

      <section className="institute-form-section institute-hero-management">
        <div className="institute-form-section-header">
          <div className="institute-form-section-icon">
            <ImagePlus size={18} />
          </div>

          <div>
            <h3>Hero Image</h3>

            <p>
              Manage the main visual displayed on the public
              website homepage.
            </p>
          </div>
        </div>

        {!institute?.id ? (
          <div className="institute-hero-notice">
            Save the institute information first, then you can
            upload the homepage hero image.
          </div>
        ) : heroPreview ? (
          <div className="institute-hero-preview-card">
            <div className="institute-hero-preview">
              <img
                src={heroPreview}
                alt="Homepage hero"
              />

              <div className="institute-hero-preview-overlay">
                <span>
                  <ImagePlus size={14} />
                  Homepage Hero
                </span>
              </div>
            </div>

            <div className="institute-hero-preview-footer">
              <div>
                <strong>Current hero image</strong>
                <span>
                  This image is currently visible on the
                  public homepage.
                </span>
              </div>

              <div className="institute-hero-actions">
                <label
                  className="institute-hero-replace"
                >
                  <UploadCloud size={15} />
                  Replace

                  <input
                    ref={heroFileRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/jpg"
                    onChange={handleHeroFileChange}
                    disabled={
                      heroUploading ||
                      heroRemoving ||
                      submitting
                    }
                  />
                </label>

                <button
                  type="button"
                  className="institute-hero-remove"
                  onClick={handleHeroRemove}
                  disabled={
                    heroUploading ||
                    heroRemoving ||
                    submitting
                  }
                >
                  {heroRemoving ? (
                    <LoaderCircle
                      size={15}
                      className="institute-spinner"
                    />
                  ) : (
                    <Trash2 size={15} />
                  )}

                  Remove
                </button>
              </div>
            </div>
          </div>
        ) : (
          <label className="institute-hero-upload">
            <input
              ref={heroFileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/jpg"
              onChange={handleHeroFileChange}
              disabled={
                heroUploading ||
                heroRemoving ||
                submitting
              }
            />

            <div className="institute-hero-upload-icon">
              {heroUploading ? (
                <LoaderCircle
                  size={24}
                  className="institute-spinner"
                />
              ) : (
                <UploadCloud size={24} />
              )}
            </div>

            <strong>
              {heroUploading
                ? "Uploading hero image..."
                : "Upload homepage hero image"}
            </strong>

            <span>
              JPG, PNG or WEBP · Recommended 16:10
              landscape image · Max 100 MB
            </span>
          </label>
        )}
      </section>

      {/* =================================================
          CONTACT INFORMATION
          ================================================= */}

      <section className="institute-form-section">
        <div className="institute-form-section-header">
          <div className="institute-form-section-icon">
            <Phone size={18} />
          </div>

          <div>
            <h3>Contact Information</h3>

            <p>
              Contact details students and
              parents can use.
            </p>
          </div>
        </div>

        <div className="institute-form-grid">
          <div className="institute-form-field">
            <label htmlFor="phone">
              Phone Number
              <span>*</span>
            </label>

            <div className="institute-input-with-icon">
              <Phone size={16} />

              <input
                id="phone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className={inputClass(
                  "phone"
                )}
                disabled={submitting}
              />
            </div>

            {errors.phone && (
              <small>
                {errors.phone}
              </small>
            )}
          </div>

          <div className="institute-form-field">
            <label htmlFor="whatsappNumber">
              WhatsApp Number
            </label>

            <div className="institute-input-with-icon">
              <Phone size={16} />

              <input
                id="whatsappNumber"
                name="whatsappNumber"
                type="tel"
                value={
                  form.whatsappNumber
                }
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className={inputClass(
                  "whatsappNumber"
                )}
                disabled={submitting}
              />
            </div>

            {errors.whatsappNumber && (
              <small>
                {
                  errors.whatsappNumber
                }
              </small>
            )}
          </div>

          <div className="institute-form-field">
            <label htmlFor="email">
              Email Address
            </label>

            <div className="institute-input-with-icon">
              <Mail size={16} />

              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="info@inspiredinstitute.in"
                className={inputClass(
                  "email"
                )}
                disabled={submitting}
              />
            </div>

            {errors.email && (
              <small>
                {errors.email}
              </small>
            )}
          </div>

          <div className="institute-form-field">
            <label htmlFor="workingHours">
              Working Hours
            </label>

            <input
              id="workingHours"
              name="workingHours"
              type="text"
              value={
                form.workingHours
              }
              onChange={handleChange}
              placeholder="Mon - Sat, 8:00 AM - 8:00 PM"
              className={inputClass(
                "workingHours"
              )}
              disabled={submitting}
            />
          </div>

          <div className="institute-form-field institute-form-field-full">
            <label htmlFor="address">
              Address
            </label>

            <div className="institute-textarea-with-icon">
              <MapPin size={16} />

              <textarea
                id="address"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Enter complete institute address"
                rows={3}
                className={inputClass(
                  "address"
                )}
                disabled={submitting}
              />
            </div>
          </div>
        </div>
      </section>

      {/* =================================================
          SOCIAL MEDIA
          ================================================= */}

      <section className="institute-form-section">
        <div className="institute-form-section-header">
          <div className="institute-form-section-icon">
            <GlobeIcon />
          </div>

          <div>
            <h3>Social Media</h3>

            <p>
              Add the institute's official
              social media profiles.
            </p>
          </div>
        </div>

        <div className="institute-form-grid">
          <SocialInput
            id="facebookUrl"
            name="facebookUrl"
            label="Globe2"
            icon={<Globe2 size={16} />}
            value={form.facebookUrl}
            onChange={handleChange}
            error={errors.facebookUrl}
            placeholder="https://facebook.com/..."
            disabled={submitting}
          />

          <SocialInput
            id="instagramUrl"
            name="instagramUrl"
            label="Globe2"
            icon={
              <Globe2 size={16} />
            }
            value={form.instagramUrl}
            onChange={handleChange}
            error={errors.instagramUrl}
            placeholder="https://instagram.com/..."
            disabled={submitting}
          />

          <SocialInput
            id="youtubeUrl"
            name="youtubeUrl"
            label="YouTube"
            icon={<Globe2 size={16} />}
            value={form.youtubeUrl}
            onChange={handleChange}
            error={errors.youtubeUrl}
            placeholder="https://youtube.com/..."
            disabled={submitting}
          />

          <SocialInput
            id="linkedinUrl"
            name="linkedinUrl"
            label="LinkedIn"
            icon={
              <Globe2 size={16} />
            }
            value={form.linkedinUrl}
            onChange={handleChange}
            error={errors.linkedinUrl}
            placeholder="https://linkedin.com/..."
            disabled={submitting}
          />
        </div>
      </section>

      {/* =================================================
          ACTIONS
          ================================================= */}

      <div className="institute-form-actions">
        <button
          type="button"
          className="institute-form-cancel"
          onClick={onCancel}
          disabled={submitting}
        >
          Cancel
        </button>

        <button
          type="submit"
          className="institute-form-submit"
          disabled={submitting}
        >
          {submitting ? (
            <>
              <LoaderCircle
                size={17}
                className="institute-spinner"
              />
              Saving...
            </>
          ) : (
            <>
              <Save size={17} />
              Save Information
            </>
          )}
        </button>
      </div>
    </form>
  );
}

// =====================================================
// SOCIAL INPUT
// =====================================================

function SocialInput({
  id,
  name,
  label,
  icon,
  value,
  onChange,
  error,
  placeholder,
  disabled,
}) {
  return (
    <div className="institute-form-field">
      <label htmlFor={id}>
        {label}
      </label>

      <div className="institute-input-with-icon">
        {icon}

        <input
          id={id}
          name={name}
          type="url"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`institute-form-input ${
            error ? "has-error" : ""
          }`}
          disabled={disabled}
        />
      </div>

      {error && (
        <small>{error}</small>
      )}
    </div>
  );
}

// =====================================================
// SMALL ICON HELPER
// =====================================================

function GlobeIcon() {
  return (
    <span className="institute-globe-icon">
      ◎
    </span>
  );
}

export default InstituteForm;