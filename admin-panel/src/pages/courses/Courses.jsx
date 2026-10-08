import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  Edit3,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  X,
} from "lucide-react";

import apiClient from "../../api/client";
import CourseForm from "./CourseForm";
import "./Courses.css";

const STATUS_OPTIONS = [
  {
    value: "ALL",
    label: "All Status",
  },
  {
    value: "ACTIVE",
    label: "Active",
  },
  {
    value: "INACTIVE",
    label: "Inactive",
  },
];

function getCoursesFromResponse(response) {
  const data = response?.data?.data;

  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.items)) {
    return data.items;
  }

  return [];
}

function getErrorMessage(error) {
  return (
    error?.message ||
    error?.response?.data?.message ||
    "Something went wrong. Please try again."
  );
}

function formatStatus(status) {
  return status === "ACTIVE" ? "Active" : "Inactive";
}

function Courses() {
  const [courses, setCourses] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  const [deletingCourse, setDeletingCourse] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [toast, setToast] = useState(null);

  const showToast = (type, message) => {
    setToast({
      type,
      message,
    });

    window.setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const fetchCourses = async ({ isRefresh = false } = {}) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await apiClient.get("/courses");

      setCourses(getCoursesFromResponse(response));
    } catch (err) {
      console.error("Courses fetch failed:", err);

      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const filteredCourses = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return courses.filter((course) => {
      const matchesStatus =
        statusFilter === "ALL" ||
        course.status === statusFilter;

      if (!matchesStatus) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      const searchableText = [
        course.title,
        course.shortDescription,
        course.fullDescription,
        course.targetStudents,
        course.category,
        ...(Array.isArray(course.tags)
          ? course.tags
          : []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(
        normalizedSearch
      );
    });
  }, [courses, search, statusFilter]);

  const handleAddCourse = () => {
    setEditingCourse(null);
    setShowForm(true);
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingCourse(null);
  };

  const handleFormSuccess = (course, message) => {
    setCourses((currentCourses) => {
      const existingIndex = currentCourses.findIndex(
        (item) => item.id === course.id
      );

      if (existingIndex === -1) {
        return [course, ...currentCourses];
      }

      return currentCourses.map((item) =>
        item.id === course.id ? course : item
      );
    });

    handleFormClose();

    showToast(
      "success",
      message ||
        "Course saved successfully."
    );
  };

  const handleDeleteCourse = async () => {
    if (!deletingCourse?.id) {
      return;
    }

    try {
      setDeleteLoading(true);

      await apiClient.delete(
        `/courses/${deletingCourse.id}`
      );

      setCourses((currentCourses) =>
        currentCourses.filter(
          (course) =>
            course.id !== deletingCourse.id
        )
      );

      showToast(
        "success",
        "Course deleted successfully."
      );

      setDeletingCourse(null);
    } catch (err) {
      console.error(
        "Course delete failed:",
        err
      );

      showToast(
        "error",
        getErrorMessage(err)
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="courses-page">
        <div className="courses-page-header">
          <div>
            <h1>Courses</h1>
            <p>
              Manage courses displayed on the
              institute website.
            </p>
          </div>
        </div>

        <div className="courses-loading-toolbar">
          <div className="courses-skeleton courses-skeleton-search" />
          <div className="courses-skeleton courses-skeleton-filter" />
          <div className="courses-skeleton courses-skeleton-button" />
        </div>

        <div className="courses-table-card">
          <div className="courses-skeleton-table-header" />

          {Array.from({ length: 6 }).map(
            (_, index) => (
              <div
                key={index}
                className="courses-skeleton-table-row"
              >
                <div className="courses-skeleton courses-skeleton-title" />
                <div className="courses-skeleton courses-skeleton-text" />
                <div className="courses-skeleton courses-skeleton-status" />
                <div className="courses-skeleton courses-skeleton-actions" />
              </div>
            )
          )}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="courses-page">
        <div className="courses-page-header">
          <div>
            <h1>Courses</h1>
            <p>
              Manage courses displayed on the
              institute website.
            </p>
          </div>
        </div>

        <div className="courses-error-state">
          <div className="courses-state-icon courses-error-icon">
            <BookOpen size={20} />
          </div>

          <h3>Unable to load courses</h3>

          <p>{error}</p>

          <button
            type="button"
            className="courses-primary-button"
            onClick={() => fetchCourses()}
          >
            <RefreshCw size={16} />
            Try Again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="courses-page">
      {/* =====================================================
          PAGE HEADER
          ===================================================== */}

      <div className="courses-page-header">
        <div className="courses-page-header-content">
          <div className="courses-title-row">
            <div className="courses-title-icon">
              <BookOpen
                size={19}
                strokeWidth={1.8}
              />
            </div>

            <div>
              <h1>Courses</h1>

              <p>
                Manage courses displayed on the
                institute website.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="courses-primary-button"
          onClick={handleAddCourse}
        >
          <Plus size={17} />
          Add Course
        </button>
      </div>

      {/* =====================================================
          FILTERS
          ===================================================== */}

      <div className="courses-toolbar">
        <div className="courses-search-wrapper">
          <Search
            size={17}
            className="courses-search-icon"
          />

          <input
            type="search"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search courses..."
            aria-label="Search courses"
          />

          {search && (
            <button
              type="button"
              className="courses-search-clear"
              onClick={() => setSearch("")}
              aria-label="Clear search"
            >
              <X size={15} />
            </button>
          )}
        </div>

        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(event.target.value)
          }
          className="courses-filter-select"
          aria-label="Filter courses by status"
        >
          {STATUS_OPTIONS.map((option) => (
            <option
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>

        <button
          type="button"
          className="courses-refresh-button"
          onClick={() =>
            fetchCourses({
              isRefresh: true,
            })
          }
          disabled={refreshing}
        >
          <RefreshCw
            size={16}
            className={
              refreshing
                ? "courses-refresh-icon spinning"
                : ""
            }
          />

          {refreshing
            ? "Refreshing..."
            : "Refresh"}
        </button>
      </div>

      {/* =====================================================
          RESULTS INFO
          ===================================================== */}

      <div className="courses-results-info">
        <span>
          Showing{" "}
          <strong>
            {filteredCourses.length}
          </strong>{" "}
          of{" "}
          <strong>{courses.length}</strong>{" "}
          courses
        </span>

        {(search || statusFilter !== "ALL") && (
          <button
            type="button"
            className="courses-clear-filters"
            onClick={() => {
              setSearch("");
              setStatusFilter("ALL");
            }}
          >
            Clear filters
          </button>
        )}
      </div>

      {/* =====================================================
          TABLE
          ===================================================== */}

      {filteredCourses.length === 0 ? (
        <div className="courses-empty-state">
          <div className="courses-state-icon">
            <BookOpen size={20} />
          </div>

          <h3>
            {courses.length === 0
              ? "No courses yet"
              : "No courses found"}
          </h3>

          <p>
            {courses.length === 0
              ? "Create your first course to start managing institute programs."
              : "Try changing your search or status filter."}
          </p>

          {courses.length === 0 ? (
            <button
              type="button"
              className="courses-primary-button"
              onClick={handleAddCourse}
            >
              <Plus size={16} />
              Add Course
            </button>
          ) : (
            <button
              type="button"
              className="courses-secondary-button"
              onClick={() => {
                setSearch("");
                setStatusFilter("ALL");
              }}
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className="courses-table-card">
          <div className="courses-table-scroll">
            <table className="courses-table">
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Category</th>
                  <th>Target Students</th>
                  <th>Tags</th>
                  <th>Status</th>
                  <th>Order</th>
                  <th className="courses-actions-header">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredCourses.map(
                  (course) => (
                    <tr key={course.id}>
                      <td>
                        <div className="courses-course-cell">
                          <div className="courses-course-icon">
                            <BookOpen
                              size={17}
                            />
                          </div>

                          <div className="courses-course-content">
                            <strong>
                              {course.title}
                            </strong>

                            <span>
                              {course.shortDescription ||
                                "No short description"}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className="courses-category">
                          {course.category ||
                            "—"}
                        </span>
                      </td>

                      <td>
                        <span className="courses-target">
                          {course.targetStudents ||
                            "—"}
                        </span>
                      </td>

                      <td>
                        <div className="courses-tags">
                          {Array.isArray(
                            course.tags
                          ) &&
                          course.tags.length > 0 ? (
                            <>
                              {course.tags
                                .slice(0, 3)
                                .map(
                                  (
                                    tag,
                                    index
                                  ) => (
                                    <span
                                      key={`${tag}-${index}`}
                                      className="courses-tag"
                                    >
                                      {tag}
                                    </span>
                                  )
                                )}

                              {course.tags
                                .length > 3 && (
                                <span className="courses-tag-more">
                                  +
                                  {course
                                    .tags
                                    .length -
                                    3}
                                </span>
                              )}
                            </>
                          ) : (
                            <span className="courses-no-tags">
                              No tags
                            </span>
                          )}
                        </div>
                      </td>

                      <td>
                        <span
                          className={`courses-status-badge courses-status-${(
                            course.status ||
                            "INACTIVE"
                          ).toLowerCase()}`}
                        >
                          <span className="courses-status-dot" />
                          {formatStatus(
                            course.status
                          )}
                        </span>
                      </td>

                      <td>
                        <span className="courses-order">
                          {course.displayOrder ??
                            "—"}
                        </span>
                      </td>

                      <td>
                        <div className="courses-row-actions">
                          <button
                            type="button"
                            className="courses-icon-button courses-edit-button"
                            onClick={() =>
                              handleEditCourse(
                                course
                              )
                            }
                            aria-label={`Edit ${course.title}`}
                            title="Edit course"
                          >
                            <Edit3
                              size={16}
                            />
                          </button>

                          <button
                            type="button"
                            className="courses-icon-button courses-delete-button"
                            onClick={() =>
                              setDeletingCourse(
                                course
                              )
                            }
                            aria-label={`Delete ${course.title}`}
                            title="Delete course"
                          >
                            <Trash2
                              size={16}
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =====================================================
          COURSE FORM MODAL
          ===================================================== */}

      {showForm && (
        <CourseForm
          course={editingCourse}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
          onError={(message) =>
            showToast("error", message)
          }
        />
      )}

      {/* =====================================================
          DELETE MODAL
          ===================================================== */}

      {deletingCourse && (
        <div
          className="courses-modal-overlay"
          role="presentation"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              if (!deleteLoading) {
                setDeletingCourse(null);
              }
            }
          }}
        >
          <div
            className="courses-delete-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-course-title"
          >
            <div className="courses-delete-icon">
              <Trash2 size={20} />
            </div>

            <div className="courses-delete-content">
              <h3 id="delete-course-title">
                Delete course?
              </h3>

              <p>
                Are you sure you want to delete{" "}
                <strong>
                  {deletingCourse.title}
                </strong>
                ? This action cannot be
                undone.
              </p>
            </div>

            <div className="courses-delete-actions">
              <button
                type="button"
                className="courses-secondary-button"
                onClick={() =>
                  setDeletingCourse(null)
                }
                disabled={deleteLoading}
              >
                Cancel
              </button>

              <button
                type="button"
                className="courses-danger-button"
                onClick={handleDeleteCourse}
                disabled={deleteLoading}
              >
                {deleteLoading ? (
                  <>
                    <RefreshCw
                      size={15}
                      className="courses-refresh-icon spinning"
                    />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={15} />
                    Delete Course
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          TOAST
          ===================================================== */}

      {toast && (
        <div
          className={`courses-toast courses-toast-${toast.type}`}
          role="status"
        >
          <span className="courses-toast-indicator" />

          <p>{toast.message}</p>

          <button
            type="button"
            onClick={() => setToast(null)}
            aria-label="Close notification"
          >
            <X size={15} />
          </button>
        </div>
      )}
    </section>
  );
}

export default Courses;
