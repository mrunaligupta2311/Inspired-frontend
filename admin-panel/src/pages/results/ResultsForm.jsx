import { useEffect, useState } from "react";
import { LoaderCircle, Save } from "lucide-react";

import apiClient from "../../api/client";

const initialForm = {
  studentName: "",
  exam: "",
  year: "",
  score: "",
  percentile: "",
  rank: "",
  achievementTitle: "",
  description: "",
  studentImage: "",
  displayOrder: 0,
  isActive: true,
};

function ResultsForm({
  result = null,
  onSuccess,
  onCancel,
}) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const isEditing = Boolean(result?.id);

  /* =========================================================
     LOAD EDIT DATA
     ========================================================= */

  useEffect(() => {
    if (!result) {
      setForm(initialForm);
      setErrors({});
      return;
    }

    setForm({
      studentName: result.studentName || "",
      exam: result.exam || "",
      year: result.year ?? "",
      score: result.score ?? "",
      percentile: result.percentile ?? "",
      rank: result.rank ?? "",
      achievementTitle:
        result.achievementTitle || "",
      description: result.description || "",
      studentImage: result.studentImage || "",
      displayOrder: result.displayOrder ?? 0,
      isActive: result.isActive ?? true,
    });

    setErrors({});
  }, [result]);

  /* =========================================================
     FIELD CHANGE
     ========================================================= */

  const handleChange = (event) => {
    const { name, value, type, checked } =
      event.target;

    setForm((current) => ({
      ...current,
      [name]:
        type === "checkbox" ? checked : value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: "",
      form: "",
    }));
  };

  /* =========================================================
     VALIDATION
     ========================================================= */

  const validate = () => {
    const nextErrors = {};

    if (!form.studentName.trim()) {
      nextErrors.studentName =
        "Student name is required.";
    }

    if (!form.exam.trim()) {
      nextErrors.exam = "Exam is required.";
    }

    const year = Number(form.year);

    if (
      form.year === "" ||
      !Number.isInteger(year) ||
      year < 2000 ||
      year > 2100
    ) {
      nextErrors.year =
        "Enter a valid year between 2000 and 2100.";
    }

    if (!form.score.toString().trim()) {
      nextErrors.score = "Score is required.";
    }

    if (form.percentile !== "") {
      const percentile = Number(form.percentile);

      if (
        !Number.isFinite(percentile) ||
        percentile < 0 ||
        percentile > 100
      ) {
        nextErrors.percentile =
          "Percentile must be between 0 and 100.";
      }
    }

    if (form.rank !== "") {
      const rank = Number(form.rank);

      if (
        !Number.isInteger(rank) ||
        rank < 1
      ) {
        nextErrors.rank =
          "Rank must be a positive whole number.";
      }
    }

    if (!form.achievementTitle.trim()) {
      nextErrors.achievementTitle =
        "Achievement title is required.";
    }

    if (
      form.studentImage.trim() &&
      !/^https?:\/\/.+/i.test(
        form.studentImage.trim()
      )
    ) {
      nextErrors.studentImage =
        "Please enter a valid image URL.";
    }

    const displayOrder = Number(
      form.displayOrder
    );

    if (
      form.displayOrder !== "" &&
      (!Number.isFinite(displayOrder) ||
        displayOrder < 0)
    ) {
      nextErrors.displayOrder =
        "Display order must be 0 or a positive number.";
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
        studentName: form.studentName.trim(),
        exam: form.exam.trim(),
        year: Number(form.year),
        score: form.score.trim(),
        percentile:
          form.percentile === ""
            ? null
            : Number(form.percentile),
        rank:
          form.rank === ""
            ? null
            : Number(form.rank),
        achievementTitle:
          form.achievementTitle.trim(),
        description: form.description.trim(),
        studentImage:
          form.studentImage.trim(),
        displayOrder:
          form.displayOrder === ""
            ? 0
            : Number(form.displayOrder),
        isActive: Boolean(form.isActive),
      };

      if (isEditing) {
        await apiClient.patch(
          `/results/${result.id}`,
          payload
        );

        onSuccess?.(
          "Result updated successfully."
        );
      } else {
        await apiClient.post(
          "/results",
          payload
        );

        onSuccess?.(
          "Result added successfully."
        );
      }
    } catch (error) {
      console.error(
        "Failed to save result:",
        error
      );

      setErrors({
        form:
          error.message ||
          "Unable to save result. Please try again.",
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
      className="results-form"
      onSubmit={handleSubmit}
      noValidate
    >
      {errors.form && (
        <div className="results-form-error">
          {errors.form}
        </div>
      )}

      {/* =====================================================
          STUDENT INFORMATION
          ===================================================== */}

      <div className="results-form-section">
        <div className="results-form-section-heading">
          <h3>Student Information</h3>

          <p>
            Enter the student's examination and
            achievement details.
          </p>
        </div>

        <div className="results-form-grid">
          {/* STUDENT NAME */}
          <div className="results-form-field">
            <label htmlFor="result-student-name">
              Student Name <span>*</span>
            </label>

            <input
              id="result-student-name"
              name="studentName"
              type="text"
              value={form.studentName}
              onChange={handleChange}
              placeholder="e.g. Aarav Patel"
              disabled={saving}
            />

            {errors.studentName && (
              <small>
                {errors.studentName}
              </small>
            )}
          </div>

          {/* EXAM */}
          <div className="results-form-field">
            <label htmlFor="result-exam">
              Exam <span>*</span>
            </label>

            <input
              id="result-exam"
              name="exam"
              type="text"
              value={form.exam}
              onChange={handleChange}
              placeholder="e.g. JEE Main"
              disabled={saving}
            />

            {errors.exam && (
              <small>{errors.exam}</small>
            )}
          </div>

          {/* YEAR */}
          <div className="results-form-field">
            <label htmlFor="result-year">
              Year <span>*</span>
            </label>

            <input
              id="result-year"
              name="year"
              type="number"
              min="2000"
              max="2100"
              step="1"
              value={form.year}
              onChange={handleChange}
              placeholder="2026"
              disabled={saving}
            />

            {errors.year && (
              <small>{errors.year}</small>
            )}
          </div>

          {/* SCORE */}
          <div className="results-form-field">
            <label htmlFor="result-score">
              Score <span>*</span>
            </label>

            <input
              id="result-score"
              name="score"
              type="text"
              value={form.score}
              onChange={handleChange}
              placeholder="e.g. 285 / 300"
              disabled={saving}
            />

            {errors.score && (
              <small>{errors.score}</small>
            )}
          </div>

          {/* PERCENTILE */}
          <div className="results-form-field">
            <label htmlFor="result-percentile">
              Percentile
            </label>

            <input
              id="result-percentile"
              name="percentile"
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={form.percentile}
              onChange={handleChange}
              placeholder="e.g. 98.75"
              disabled={saving}
            />

            {errors.percentile && (
              <small>
                {errors.percentile}
              </small>
            )}
          </div>

          {/* RANK */}
          <div className="results-form-field">
            <label htmlFor="result-rank">
              Rank
            </label>

            <input
              id="result-rank"
              name="rank"
              type="number"
              min="1"
              step="1"
              value={form.rank}
              onChange={handleChange}
              placeholder="e.g. 1250"
              disabled={saving}
            />

            {errors.rank && (
              <small>{errors.rank}</small>
            )}
          </div>
        </div>
      </div>

      {/* =====================================================
          ACHIEVEMENT
          ===================================================== */}

      <div className="results-form-section">
        <div className="results-form-section-heading">
          <h3>Achievement</h3>

          <p>
            Highlight the student's academic
            achievement.
          </p>
        </div>

        <div className="results-form-field">
          <label htmlFor="result-achievement-title">
            Achievement Title <span>*</span>
          </label>

          <input
            id="result-achievement-title"
            name="achievementTitle"
            type="text"
            value={form.achievementTitle}
            onChange={handleChange}
            placeholder="e.g. Top 1% in JEE Main"
            disabled={saving}
          />

          {errors.achievementTitle && (
            <small>
              {errors.achievementTitle}
            </small>
          )}
        </div>

        <div className="results-form-field">
          <label htmlFor="result-description">
            Description
          </label>

          <textarea
            id="result-description"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Add a short description of the student's achievement..."
            rows={4}
            maxLength={1000}
            disabled={saving}
          />

          <div className="results-character-count">
            {form.description.length}/1000
          </div>
        </div>
      </div>

      {/* =====================================================
          STUDENT IMAGE
          ===================================================== */}

      <div className="results-form-section">
        <div className="results-form-section-heading">
          <h3>Student Image</h3>

          <p>
            Add a publicly accessible image URL for
            the result.
          </p>
        </div>

        <div className="results-form-field">
          <label htmlFor="result-student-image">
            Student Image URL
          </label>

          <input
            id="result-student-image"
            name="studentImage"
            type="url"
            value={form.studentImage}
            onChange={handleChange}
            placeholder="https://example.com/student.jpg"
            disabled={saving}
          />

          {errors.studentImage && (
            <small>
              {errors.studentImage}
            </small>
          )}
        </div>
      </div>

      {/* =====================================================
          DISPLAY SETTINGS
          ===================================================== */}

      <div className="results-form-section">
        <div className="results-form-section-heading">
          <h3>Display Settings</h3>

          <p>
            Control the order and visibility of this
            result on the website.
          </p>
        </div>

        <div className="results-form-grid">
          <div className="results-form-field">
            <label htmlFor="result-display-order">
              Display Order
            </label>

            <input
              id="result-display-order"
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
              <small>
                {errors.displayOrder}
              </small>
            )}
          </div>
        </div>

        <label
          className={`results-toggle ${
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

          <span className="results-toggle-track">
            <span className="results-toggle-thumb" />
          </span>

          <span className="results-toggle-content">
            <strong>
              {form.isActive
                ? "Active"
                : "Inactive"}
            </strong>

            <small>
              {form.isActive
                ? "This result is visible on the website."
                : "This result is hidden from the website."}
            </small>
          </span>
        </label>
      </div>

      {/* =====================================================
          ACTIONS
          ===================================================== */}

      <div className="results-form-actions">
        <button
          type="button"
          className="results-secondary-button"
          onClick={onCancel}
          disabled={saving}
        >
          Cancel
        </button>

        <button
          type="submit"
          className="results-primary-button"
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
                ? "Update Result"
                : "Save Result"}
            </>
          )}
        </button>
      </div>
    </form>
  );
}

export default ResultsForm;