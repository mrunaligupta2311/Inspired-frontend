import { useEffect, useState } from "react";
import {
  Check,
  LoaderCircle,
  Plus,
  Save,
  Tag,
  X,
} from "lucide-react";

import apiClient from "../../api/client";

const INITIAL_FORM = {
  title: "",
  shortDescription: "",
  fullDescription: "",
  targetStudents: "",
  category: "",
  tags: [],
  status: "ACTIVE",
  displayOrder: 0,
  eligibleClasses: [],
};

function getInitialForm(course) {
  if (!course) {
    return INITIAL_FORM;
  }

  return {
    title: course.title || "",
    shortDescription:
      course.shortDescription || "",
    fullDescription:
      course.fullDescription || "",
    targetStudents:
      course.targetStudents || "",
    category: course.category || "",
    tags: Array.isArray(course.tags)
      ? course.tags
      : [],
    eligibleClasses: Array.isArray(course.eligibleClasses)
      ? course.eligibleClasses
          .map(Number)
          .filter((classNumber) => classNumber >= 6 && classNumber <= 12)
      : [],
    status: course.status || "ACTIVE",
    displayOrder:
      Number.isFinite(
        Number(course.displayOrder)
      )
        ? Number(course.displayOrder)
        : 0,
  };
}

function getErrorMessage(error) {
  return (
    error?.message ||
    error?.response?.data?.message ||
    "Something went wrong. Please try again."
  );
}

function CourseForm({
  course,
  onClose,
  onSuccess,
  onError,
}) {
  const [form, setForm] = useState(() =>
    getInitialForm(course)
  );

  const [tagInput, setTagInput] = useState("");
  const [errors, setErrors] = useState({});

  const [submitting, setSubmitting] =
    useState(false);

  const isEditing = Boolean(course?.id);

  useEffect(() => {
    setForm(getInitialForm(course));
    setTagInput("");
    setErrors({});
  }, [course]);

  useEffect(() => {
    const handleEscape = (event) => {
      if (
        event.key === "Escape" &&
        !submitting
      ) {
        onClose();
      }
    };

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [onClose, submitting]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]:
        name === "displayOrder"
          ? value === ""
            ? ""
            : Number(value)
          : value,
    }));

    setErrors((current) => {
      if (!current[name]) {
        return current;
      }

      const next = {
        ...current,
      };

      delete next[name];

      return next;
    });
  };

  const addTag = () => {
    const normalizedTag =
      tagInput.trim();

    if (!normalizedTag) {
      return;
    }

    const alreadyExists = form.tags.some(
      (tag) =>
        tag.toLowerCase() ===
        normalizedTag.toLowerCase()
    );

    if (alreadyExists) {
      setTagInput("");
      return;
    }

    setForm((current) => ({
      ...current,
      tags: [
        ...current.tags,
        normalizedTag,
      ],
    }));

    setTagInput("");
  };

  const removeTag = (tagToRemove) => {
    setForm((current) => ({
      ...current,
      tags: current.tags.filter(
        (tag) => tag !== tagToRemove
      ),
    }));
  };

  const toggleEligibleClass = (classNumber) => {
    setForm((current) => ({
      ...current,
      eligibleClasses: current.eligibleClasses.includes(classNumber)
        ? current.eligibleClasses.filter(
            (value) => value !== classNumber
          )
        : [...current.eligibleClasses, classNumber].sort(
            (a, b) => a - b
          ),
    }));
  };

  const handleTagKeyDown = (event) => {
    if (
      event.key === "Enter" ||
      event.key === ","
    ) {
      event.preventDefault();
      addTag();
    }

    if (
      event.key === "Backspace" &&
      !tagInput &&
      form.tags.length > 0
    ) {
      removeTag(
        form.tags[form.tags.length - 1]
      );
    }
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!form.title.trim()) {
      nextErrors.title =
        "Course title is required.";
    }

    if (!form.shortDescription.trim()) {
      nextErrors.shortDescription =
        "Short description is required.";
    }

    if (!form.fullDescription.trim()) {
      nextErrors.fullDescription =
        "Full description is required.";
    }

    if (!form.targetStudents.trim()) {
      nextErrors.targetStudents =
        "Target students is required.";
    }

    if (!form.category.trim()) {
      nextErrors.category =
        "Category is required.";
    }

    if (
      form.displayOrder === "" ||
      Number(form.displayOrder) < 0
    ) {
      nextErrors.displayOrder =
        "Display order must be 0 or greater.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        title: form.title.trim(),
        shortDescription:
          form.shortDescription.trim(),
        fullDescription:
          form.fullDescription.trim(),
        targetStudents:
          form.targetStudents.trim(),
        category: form.category.trim(),
        tags: form.tags,
        eligibleClasses: form.eligibleClasses,
        status: form.status,
        displayOrder:
          Number(form.displayOrder) || 0,
      };

      let response;

      if (isEditing) {
        response = await apiClient.patch(
          `/courses/${course.id}`,
          payload
        );
      } else {
        response = await apiClient.post(
          "/courses",
          payload
        );
      }

      const savedCourse =
        response?.data?.data;

      if (!savedCourse) {
        throw new Error(
          "Course was saved, but the server returned an invalid response."
        );
      }

      onSuccess(
        savedCourse,
        isEditing
          ? "Course updated successfully."
          : "Course created successfully."
      );
    } catch (error) {
      console.error(
        "Course save failed:",
        error
      );

      const message =
        getErrorMessage(error);

      onError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="courses-modal-overlay"
      role="presentation"
      onMouseDown={(event) => {
        if (
          event.target ===
            event.currentTarget &&
          !submitting
        ) {
          onClose();
        }
      }}
    >
      <div
        className="courses-form-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="course-form-title"
      >
        {/* =================================================
            MODAL HEADER
            ================================================= */}

        <div className="courses-form-header">
          <div className="courses-form-heading">
            <div className="courses-form-icon">
              {isEditing ? (
                <Save size={19} />
              ) : (
                <Plus size={19} />
              )}
            </div>

            <div>
              <h2 id="course-form-title">
                {isEditing
                  ? "Edit Course"
                  : "Add Course"}
              </h2>

              <p>
                {isEditing
                  ? "Update course information and website visibility."
                  : "Create a new course for the institute website."}
              </p>
            </div>
          </div>

          <button
            type="button"
            className="courses-modal-close"
            onClick={onClose}
            disabled={submitting}
            aria-label="Close course form"
          >
            <X size={19} />
          </button>
        </div>

        {/* =================================================
            FORM
            ================================================= */}

        <form
          className="courses-form"
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="courses-form-body">
            {/* ---------------------------------------------
                BASIC INFORMATION
                --------------------------------------------- */}

            <div className="courses-form-section">
              <div className="courses-form-section-heading">
                <h3>Basic Information</h3>
                <p>
                  Provide the main information
                  students will see.
                </p>
              </div>

              <div className="courses-form-grid">
                <div className="courses-form-field courses-form-field-full">
                  <label htmlFor="course-title">
                    Course Title{" "}
                    <span>*</span>
                  </label>

                  <input
                    id="course-title"
                    name="title"
                    type="text"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="e.g. JEE Foundation"
                    className={
                      errors.title
                        ? "has-error"
                        : ""
                    }
                    disabled={submitting}
                  />

                  {errors.title && (
                    <small className="courses-field-error">
                      {errors.title}
                    </small>
                  )}
                </div>

                <div className="courses-form-field courses-form-field-full">
                  <label htmlFor="course-short-description">
                    Short Description{" "}
                    <span>*</span>
                  </label>

                  <input
                    id="course-short-description"
                    name="shortDescription"
                    type="text"
                    value={
                      form.shortDescription
                    }
                    onChange={handleChange}
                    placeholder="A short summary of the course"
                    maxLength={300}
                    className={
                      errors.shortDescription
                        ? "has-error"
                        : ""
                    }
                    disabled={submitting}
                  />

                  <div className="courses-field-meta">
                    <span>
                      {form.shortDescription
                        .length}{" "}
                      / 300
                    </span>
                  </div>

                  {errors.shortDescription && (
                    <small className="courses-field-error">
                      {
                        errors.shortDescription
                      }
                    </small>
                  )}
                </div>

                <div className="courses-form-field courses-form-field-full">
                  <label htmlFor="course-full-description">
                    Full Description{" "}
                    <span>*</span>
                  </label>

                  <textarea
                    id="course-full-description"
                    name="fullDescription"
                    value={
                      form.fullDescription
                    }
                    onChange={handleChange}
                    placeholder="Describe the course, preparation approach, subjects, outcomes, and other important details."
                    rows={5}
                    className={
                      errors.fullDescription
                        ? "has-error"
                        : ""
                    }
                    disabled={submitting}
                  />

                  {errors.fullDescription && (
                    <small className="courses-field-error">
                      {errors.fullDescription}
                    </small>
                  )}
                </div>
              </div>
            </div>

            {/* ---------------------------------------------
                COURSE DETAILS
                --------------------------------------------- */}

            <div className="courses-form-section">
              <div className="courses-form-section-heading">
                <h3>Course Details</h3>
                <p>
                  Configure category, audience,
                  tags, and website order.
                </p>
              </div>

              <div className="courses-form-grid courses-form-grid-two">
                <div className="courses-form-field">
                  <label htmlFor="course-target-students">
                    Target Students{" "}
                    <span>*</span>
                  </label>

                  <input
                    id="course-target-students"
                    name="targetStudents"
                    type="text"
                    value={
                      form.targetStudents
                    }
                    onChange={handleChange}
                    placeholder="e.g. Class 9 to 12"
                    className={
                      errors.targetStudents
                        ? "has-error"
                        : ""
                    }
                    disabled={submitting}
                  />

                  {errors.targetStudents && (
                    <small className="courses-field-error">
                      {errors.targetStudents}
                    </small>
                  )}
                </div>

                <div className="courses-form-field">
                  <label htmlFor="course-category">
                    Category{" "}
                    <span>*</span>
                  </label>

                  <input
                    id="course-category"
                    name="category"
                    type="text"
                    value={form.category}
                    onChange={handleChange}
                    placeholder="e.g. JEE"
                    className={
                      errors.category
                        ? "has-error"
                        : ""
                    }
                    disabled={submitting}
                  />

                  {errors.category && (
                    <small className="courses-field-error">
                      {errors.category}
                    </small>
                  )}
                </div>

                <div className="courses-form-field courses-form-field-full">
                  <div className="courses-class-header">
                    <div>
                      <label>
                        Eligible Classes <span>*</span>
                      </label>

                      <p className="courses-class-description">
                        Select every class this course is offered to.
                      </p>
                    </div>

                    <div className="courses-class-actions">
                      <button
                        type="button"
                        className="courses-class-action"
                        onClick={() =>
                          setForm((current) => ({
                            ...current,
                            eligibleClasses: [6, 7, 8, 9, 10, 11, 12],
                          }))
                        }
                        disabled={submitting}
                      >
                        Select all
                      </button>

                      <button
                        type="button"
                        className="courses-class-action"
                        onClick={() =>
                          setForm((current) => ({
                            ...current,
                            eligibleClasses: [],
                          }))
                        }
                        disabled={submitting}
                      >
                        Clear
                      </button>
                    </div>
                  </div>

                  <div className="courses-class-selection-summary">
                    <span>
                      {form.eligibleClasses.length > 0
                        ? `${form.eligibleClasses.length} ${
                            form.eligibleClasses.length === 1
                              ? "class"
                              : "classes"
                          } selected`
                        : "No classes selected"}
                    </span>

                    {form.eligibleClasses.length > 0 && (
                      <strong>
                        {form.eligibleClasses
                          .slice()
                          .sort((a, b) => a - b)
                          .map((classNumber) => `Class ${classNumber}`)
                          .join(" • ")}
                      </strong>
                    )}
                  </div>

                  <div className="courses-class-selector">
                    {Array.from({ length: 7 }, (_, index) => index + 6).map(
                      (classNumber) => {
                        const selected =
                          form.eligibleClasses.includes(classNumber);

                        return (
                          <button
                            key={classNumber}
                            type="button"
                            className={
                              selected
                                ? "courses-class-option selected"
                                : "courses-class-option"
                            }
                            onClick={() =>
                              toggleEligibleClass(classNumber)
                            }
                            disabled={submitting}
                            aria-pressed={selected}
                          >
                            <span className="courses-class-option-check">
                              {selected ? <Check size={13} /> : null}
                            </span>

                            <span>Class {classNumber}</span>
                          </button>
                        );
                      }
                    )}
                  </div>

                  <small className="courses-field-help">
                    Click a class to include or remove it from this course.
                  </small>
                </div>

                <div className="courses-form-field">
                  <label htmlFor="course-status">
                    Status{" "}
                    <span>*</span>
                  </label>

                  <select
                    id="course-status"
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    disabled={submitting}
                  >
                    <option value="ACTIVE">
                      Active
                    </option>

                    <option value="INACTIVE">
                      Inactive
                    </option>
                  </select>

                  <small className="courses-field-help">
                    Active courses can be
                    displayed on the website.
                  </small>
                </div>

                <div className="courses-form-field">
                  <label htmlFor="course-display-order">
                    Display Order
                  </label>

                  <input
                    id="course-display-order"
                    name="displayOrder"
                    type="number"
                    min="0"
                    step="1"
                    value={form.displayOrder}
                    onChange={handleChange}
                    placeholder="0"
                    className={
                      errors.displayOrder
                        ? "has-error"
                        : ""
                    }
                    disabled={submitting}
                  />

                  <small className="courses-field-help">
                    Lower numbers appear first.
                  </small>

                  {errors.displayOrder && (
                    <small className="courses-field-error">
                      {errors.displayOrder}
                    </small>
                  )}
                </div>
              </div>
            </div>

            {/* ---------------------------------------------
                TAGS
                --------------------------------------------- */}

            <div className="courses-form-section">
              <div className="courses-form-section-heading">
                <h3>Tags</h3>
                <p>
                  Add useful keywords for course
                  classification.
                </p>
              </div>

              <div className="courses-form-field">
                <label htmlFor="course-tags">
                  Course Tags
                </label>

                <div className="courses-tags-input">
                  <Tag
                    size={16}
                    className="courses-tags-input-icon"
                  />

                  <input
                    id="course-tags"
                    type="text"
                    value={tagInput}
                    onChange={(event) =>
                      setTagInput(
                        event.target.value
                      )
                    }
                    onKeyDown={
                      handleTagKeyDown
                    }
                    placeholder="Type a tag and press Enter"
                    disabled={submitting}
                  />

                  <button
                    type="button"
                    onClick={addTag}
                    disabled={
                      submitting ||
                      !tagInput.trim()
                    }
                  >
                    <Plus size={15} />
                    Add
                  </button>
                </div>

                {form.tags.length > 0 && (
                  <div className="courses-form-tags">
                    {form.tags.map(
                      (tag, index) => (
                        <span
                          key={`${tag}-${index}`}
                          className="courses-form-tag"
                        >
                          {tag}

                          <button
                            type="button"
                            onClick={() =>
                              removeTag(
                                tag
                              )
                            }
                            disabled={
                              submitting
                            }
                            aria-label={`Remove ${tag}`}
                          >
                            <X size={13} />
                          </button>
                        </span>
                      )
                    )}
                  </div>
                )}

                <small className="courses-field-help">
                  Press Enter or click Add to
                  create a tag.
                </small>
              </div>
            </div>
          </div>

          {/* =================================================
              MODAL FOOTER
              ================================================= */}

          <div className="courses-form-footer">
            <button
              type="button"
              className="courses-secondary-button"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="courses-primary-button"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <LoaderCircle
                    size={16}
                    className="courses-refresh-icon spinning"
                  />

                  {isEditing
                    ? "Saving..."
                    : "Creating..."}
                </>
              ) : (
                <>
                  {isEditing ? (
                    <Check size={16} />
                  ) : (
                    <Plus size={16} />
                  )}

                  {isEditing
                    ? "Save Changes"
                    : "Create Course"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CourseForm;
