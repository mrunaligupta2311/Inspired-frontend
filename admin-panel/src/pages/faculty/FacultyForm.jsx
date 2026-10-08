 import { useEffect, useState } from "react";
import { LoaderCircle, Save } from "lucide-react";

import apiClient from "../../api/client";

const initialForm = {
  name: "",
  designation: "",
  subject: "",
  qualification: "",
  experience: "",
  bio: "",
  profileImage: "",
  displayOrder: 0,
  isActive: true,
};

function FacultyForm({
  faculty = null,
  onSuccess,
  onCancel,
}) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const isEditing = Boolean(faculty?.id);

  /* =========================================================
     LOAD EDIT DATA
     ========================================================= */

  useEffect(() => {
    if (!faculty) {
      setForm(initialForm);
      setErrors({});
      return;
    }

    setForm({
      name: faculty.name || "",
      designation: faculty.designation || "",
      subject: faculty.subject || "",
      qualification: faculty.qualification || "",
      experience: faculty.experience || "",
      bio: faculty.bio || "",
      profileImage: faculty.profileImage || "",
      displayOrder: faculty.displayOrder ?? 0,
      isActive: faculty.isActive ?? true,
    });

    setErrors({});
  }, [faculty]);

  /* =========================================================
     FIELD CHANGE
     ========================================================= */

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: "",
    }));
  };

  /* =========================================================
     VALIDATION
     ========================================================= */

  const validate = () => {
    const nextErrors = {};

    if (!form.name.trim()) {
      nextErrors.name = "Faculty name is required.";
    }

    if (!form.designation.trim()) {
      nextErrors.designation =
        "Designation is required.";
    }

    if (!form.subject.trim()) {
      nextErrors.subject = "Subject is required.";
    }

    if (!form.qualification.trim()) {
      nextErrors.qualification =
        "Qualification is required.";
    }

    if (!form.experience.trim()) {
      nextErrors.experience =
        "Experience is required.";
    }

    if (
      form.profileImage.trim() &&
      !/^https?:\/\/.+/i.test(form.profileImage.trim())
    ) {
      nextErrors.profileImage =
        "Please enter a valid image URL.";
    }

    const displayOrder = Number(form.displayOrder);

    if (
      form.displayOrder !== "" &&
      (!Number.isFinite(displayOrder) ||
        displayOrder < 0)
    ) {
      nextErrors.displayOrder =
        "Display order must be a positive number or 0.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  /* =========================================================
     SUBMIT
     ========================================================= */

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      setSaving(true);

      const payload = {
        name: form.name.trim(),
        designation: form.designation.trim(),
        subject: form.subject.trim(),
        qualification: form.qualification.trim(),
        experience: form.experience.trim(),
        bio: form.bio.trim(),
        profileImage: form.profileImage.trim(),
        displayOrder:
          form.displayOrder === ""
            ? 0
            : Number(form.displayOrder),
        isActive: Boolean(form.isActive),
      };

      if (isEditing) {
        await apiClient.patch(
          `/faculty/${faculty.id}`,
          payload
        );

        onSuccess?.(
          "Faculty member updated successfully."
        );
      } else {
        await apiClient.post("/faculty", payload);

        onSuccess?.(
          "Faculty member added successfully."
        );
      }
    } catch (error) {
      console.error("Failed to save faculty:", error);

      const message =
        error.message ||
        "Unable to save faculty member. Please try again.";

      setErrors({
        form: message,
      });
    } finally {
      setSaving(false);
    }
  };

  /* =========================================================
     RENDER
     ========================================================= */

  return (
    <form
      className="faculty-form"
      onSubmit={handleSubmit}
      noValidate
    >
      {errors.form && (
        <div className="faculty-form-error">
          {errors.form}
        </div>
      )}

      {/* =====================================================
          BASIC INFORMATION
          ===================================================== */}

      <div className="faculty-form-section">
        <div className="faculty-form-section-heading">
          <h3>Basic Information</h3>

          <p>
            Enter the faculty member's professional
            information.
          </p>
        </div>

        <div className="faculty-form-grid">
          {/* NAME */}
          <div className="faculty-form-field">
            <label htmlFor="faculty-name">
              Name <span>*</span>
            </label>

            <input
              id="faculty-name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Dr. Rajesh Patel"
              autoComplete="name"
              disabled={saving}
            />

            {errors.name && (
              <small>{errors.name}</small>
            )}
          </div>

          {/* DESIGNATION */}
          <div className="faculty-form-field">
            <label htmlFor="faculty-designation">
              Designation <span>*</span>
            </label>

            <input
              id="faculty-designation"
              name="designation"
              type="text"
              value={form.designation}
              onChange={handleChange}
              placeholder="e.g. Senior Physics Faculty"
              disabled={saving}
            />

            {errors.designation && (
              <small>{errors.designation}</small>
            )}
          </div>

          {/* SUBJECT */}
          <div className="faculty-form-field">
            <label htmlFor="faculty-subject">
              Subject <span>*</span>
            </label>

            <input
              id="faculty-subject"
              name="subject"
              type="text"
              value={form.subject}
              onChange={handleChange}
              placeholder="e.g. Physics"
              disabled={saving}
            />

            {errors.subject && (
              <small>{errors.subject}</small>
            )}
          </div>

          {/* QUALIFICATION */}
          <div className="faculty-form-field">
            <label htmlFor="faculty-qualification">
              Qualification <span>*</span>
            </label>

            <input
              id="faculty-qualification"
              name="qualification"
              type="text"
              value={form.qualification}
              onChange={handleChange}
              placeholder="e.g. M.Sc., B.Ed."
              disabled={saving}
            />

            {errors.qualification && (
              <small>{errors.qualification}</small>
            )}
          </div>

          {/* EXPERIENCE */}
          <div className="faculty-form-field">
            <label htmlFor="faculty-experience">
              Experience <span>*</span>
            </label>

            <input
              id="faculty-experience"
              name="experience"
              type="text"
              value={form.experience}
              onChange={handleChange}
              placeholder="e.g. 8+ Years"
              disabled={saving}
            />

            {errors.experience && (
              <small>{errors.experience}</small>
            )}
          </div>

          {/* DISPLAY ORDER */}
          <div className="faculty-form-field">
            <label htmlFor="faculty-display-order">
              Display Order
            </label>

            <input
              id="faculty-display-order"
              name="displayOrder"
              type="number"
              min="0"
              step="1"
              value={form.displayOrder}
              onChange={handleChange}
              placeholder="0"
              disabled={saving}
            />

            {errors.displayOrder && (
              <small>{errors.displayOrder}</small>
            )}
          </div>
        </div>
      </div>

      {/* =====================================================
          PROFILE IMAGE
          ===================================================== */}

      <div className="faculty-form-section">
        <div className="faculty-form-section-heading">
          <h3>Profile Image</h3>

          <p>
            Add a publicly accessible image URL for the
            faculty profile.
          </p>
        </div>

        <div className="faculty-form-field">
          <label htmlFor="faculty-profile-image">
            Profile Image URL
          </label>

          <input
            id="faculty-profile-image"
            name="profileImage"
            type="url"
            value={form.profileImage}
            onChange={handleChange}
            placeholder="https://example.com/faculty.jpg"
            disabled={saving}
          />

          {errors.profileImage && (
            <small>{errors.profileImage}</small>
          )}
        </div>
      </div>

      {/* =====================================================
          BIO
          ===================================================== */}

      <div className="faculty-form-section">
        <div className="faculty-form-section-heading">
          <h3>Biography</h3>

          <p>
            Add a short professional introduction for the
            faculty member.
          </p>
        </div>

        <div className="faculty-form-field">
          <label htmlFor="faculty-bio">
            Bio
          </label>

          <textarea
            id="faculty-bio"
            name="bio"
            value={form.bio}
            onChange={handleChange}
            placeholder="Write a short professional bio..."
            rows={5}
            maxLength={1000}
            disabled={saving}
          />

          <div className="faculty-character-count">
            {form.bio.length}/1000
          </div>
        </div>
      </div>

      {/* =====================================================
          STATUS
          ===================================================== */}

      <div className="faculty-form-section">
        <div className="faculty-form-section-heading">
          <h3>Visibility</h3>

          <p>
            Control whether this faculty member appears
            publicly.
          </p>
        </div>

        <label
          className={`faculty-toggle ${
            form.isActive ? "checked" : ""
          }`}
        >
          <input
            type="checkbox"
            name="isActive"
            checked={form.isActive}
            onChange={handleChange}
            disabled={saving}
          />

          <span className="faculty-toggle-track">
            <span className="faculty-toggle-thumb" />
          </span>

          <span className="faculty-toggle-content">
            <strong>
              {form.isActive ? "Active" : "Inactive"}
            </strong>

            <small>
              {form.isActive
                ? "This faculty member is visible on the website."
                : "This faculty member is hidden from the website."}
            </small>
          </span>
        </label>
      </div>

      {/* =====================================================
          ACTIONS
          ===================================================== */}

      <div className="faculty-form-actions">
        <button
          type="button"
          className="faculty-secondary-button"
          onClick={onCancel}
          disabled={saving}
        >
          Cancel
        </button>

        <button
          type="submit"
          className="faculty-primary-button"
          disabled={saving}
        >
          {saving ? (
            <>
              <LoaderCircle
                size={17}
                className="is-spinning"
              />
              {isEditing
                ? "Updating..."
                : "Saving..."}
            </>
          ) : (
            <>
              <Save size={17} />
              {isEditing
                ? "Update Faculty"
                : "Save Faculty"}
            </>
          )}
        </button>
      </div>
    </form>
  );
}

export default FacultyForm;