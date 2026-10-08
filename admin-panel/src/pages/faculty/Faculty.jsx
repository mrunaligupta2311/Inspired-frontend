 import { useEffect, useMemo, useState } from "react";
import {
  Edit3,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  UserRound,
  X,
} from "lucide-react";

import apiClient from "../../api/client";
import FacultyForm from "./FacultyForm";
import "./Faculty.css";

function Faculty() {
  const [faculty, setFaculty] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [formOpen, setFormOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState(null);

  const [toast, setToast] = useState(null);

  /* =========================================================
     LOAD FACULTY
     ========================================================= */

  const loadFaculty = async ({ showLoader = true } = {}) => {
    try {
      if (showLoader) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      setError("");

      const response = await apiClient.get("/faculty");

      const responseData = response.data?.data;

      let items = [];

      if (Array.isArray(responseData)) {
        items = responseData;
      } else if (Array.isArray(responseData?.items)) {
        items = responseData.items;
      } else if (Array.isArray(responseData?.faculty)) {
        items = responseData.faculty;
      }

      setFaculty(items);
    } catch (err) {
      console.error("Failed to load faculty:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to load faculty members. Please try again."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadFaculty();
  }, []);

  /* =========================================================
     TOAST
     ========================================================= */

  const showToast = (type, message) => {
    setToast({
      type,
      message,
    });

    window.setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  /* =========================================================
     FILTER + SORT
     ========================================================= */

  const filteredFaculty = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return faculty
      .filter((member) => {
        if (statusFilter === "ALL") {
          return true;
        }

        if (statusFilter === "ACTIVE") {
          return member.isActive === true;
        }

        if (statusFilter === "INACTIVE") {
          return member.isActive === false;
        }

        return true;
      })
      .filter((member) => {
        if (!normalizedSearch) {
          return true;
        }

        const searchableText = [
          member.name,
          member.designation,
          member.subject,
          member.qualification,
          member.experience,
          member.bio,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return searchableText.includes(normalizedSearch);
      })
      .sort((a, b) => {
        const orderA = Number(a.displayOrder ?? 0);
        const orderB = Number(b.displayOrder ?? 0);

        return orderA - orderB;
      });
  }, [faculty, search, statusFilter]);

  /* =========================================================
     COUNTS
     ========================================================= */

  const totalCount = faculty.length;

  const activeCount = faculty.filter(
    (member) => member.isActive === true
  ).length;

  const inactiveCount = faculty.filter(
    (member) => member.isActive === false
  ).length;

  /* =========================================================
     ADD FACULTY
     ========================================================= */

  const handleAddFaculty = () => {
    setEditingFaculty(null);
    setFormOpen(true);
  };

  /* =========================================================
     EDIT FACULTY
     ========================================================= */

  const handleEditFaculty = (member) => {
    setEditingFaculty(member);
    setFormOpen(true);
  };

  /* =========================================================
     FORM SUCCESS
     ========================================================= */

  const handleFormSuccess = async (message) => {
    setFormOpen(false);
    setEditingFaculty(null);

    showToast(
      "success",
      message || "Faculty member saved successfully."
    );

    await loadFaculty({ showLoader: false });
  };

  /* =========================================================
     FORM CLOSE
     ========================================================= */

  const handleFormClose = () => {
    if (deletingId) {
      return;
    }

    setFormOpen(false);
    setEditingFaculty(null);
  };

  /* =========================================================
     DELETE FACULTY
     ========================================================= */

  const handleDeleteFaculty = async (member) => {
    if (!member?.id || deletingId) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${member.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(member.id);

      await apiClient.delete(`/faculty/${member.id}`);

      setFaculty((currentFaculty) =>
        currentFaculty.filter(
          (item) => item.id !== member.id
        )
      );

      showToast(
        "success",
        "Faculty member deleted successfully."
      );
    } catch (err) {
      console.error("Failed to delete faculty:", err);

      showToast(
        "error",
        err.response?.data?.message ||
          err.message ||
          "Unable to delete faculty member. Please try again."
      );
    } finally {
      setDeletingId(null);
    }
  };

  /* =========================================================
     CLEAR FILTERS
     ========================================================= */

  const handleClearFilters = () => {
    setSearch("");
    setStatusFilter("ALL");
  };

  /* =========================================================
     RENDER LOADING
     ========================================================= */

  if (loading) {
    return (
      <section className="faculty-page">
        <div className="faculty-page-header">
          <div>
            <div className="faculty-skeleton faculty-skeleton-title" />
            <div className="faculty-skeleton faculty-skeleton-subtitle" />
          </div>

          <div className="faculty-skeleton faculty-skeleton-button" />
        </div>

        <div className="faculty-toolbar">
          <div className="faculty-skeleton faculty-skeleton-search" />
          <div className="faculty-skeleton faculty-skeleton-filter" />
          <div className="faculty-skeleton faculty-skeleton-filter" />
        </div>

        <div className="faculty-table-card">
          <div className="faculty-skeleton-table">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                className="faculty-skeleton-row"
                key={index}
              >
                <div className="faculty-skeleton faculty-skeleton-avatar" />

                <div className="faculty-skeleton-content">
                  <div className="faculty-skeleton faculty-skeleton-line" />
                  <div className="faculty-skeleton faculty-skeleton-line short" />
                </div>

                <div className="faculty-skeleton faculty-skeleton-cell" />
                <div className="faculty-skeleton faculty-skeleton-cell" />
                <div className="faculty-skeleton faculty-skeleton-cell" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  /* =========================================================
     ERROR STATE
     ========================================================= */

  if (error) {
    return (
      <section className="faculty-page">
        <div className="faculty-page-header">
          <div>
            <p className="faculty-eyebrow">
              FACULTY MANAGEMENT
            </p>

            <h1>Faculty</h1>

            <p>
              Manage your institute faculty members and their
              profiles.
            </p>
          </div>

          <button
            type="button"
            className="faculty-secondary-button"
            onClick={() => loadFaculty()}
          >
            <RefreshCw size={17} />
            Retry
          </button>
        </div>

        <div className="faculty-state-card faculty-error-state">
          <div className="faculty-state-icon">
            <X size={22} />
          </div>

          <h2>Unable to load faculty</h2>

          <p>{error}</p>

          <button
            type="button"
            className="faculty-primary-button"
            onClick={() => loadFaculty()}
          >
            <RefreshCw size={17} />
            Try Again
          </button>
        </div>
      </section>
    );
  }

  /* =========================================================
     MAIN UI
     ========================================================= */

  return (
    <section className="faculty-page">
      {/* =====================================================
          PAGE HEADER
          ===================================================== */}

      <div className="faculty-page-header">
        <div>
          <p className="faculty-eyebrow">
            FACULTY MANAGEMENT
          </p>

          <h1>Faculty</h1>

          <p>
            Manage your institute faculty members and their
            profiles.
          </p>
        </div>

        <button
          type="button"
          className="faculty-primary-button"
          onClick={handleAddFaculty}
        >
          <Plus size={18} strokeWidth={2} />
          Add Faculty
        </button>
      </div>

      {/* =====================================================
          SUMMARY
          ===================================================== */}

      <div className="faculty-summary">
        <div className="faculty-summary-card">
          <span>Total Faculty</span>
          <strong>{totalCount}</strong>
        </div>

        <div className="faculty-summary-card">
          <span>Active</span>
          <strong>{activeCount}</strong>
        </div>

        <div className="faculty-summary-card">
          <span>Inactive</span>
          <strong>{inactiveCount}</strong>
        </div>
      </div>

      {/* =====================================================
          TOOLBAR
          ===================================================== */}

      <div className="faculty-toolbar">
        <div className="faculty-search">
          <Search size={18} />

          <input
            type="search"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search faculty..."
            aria-label="Search faculty"
          />

          {search && (
            <button
              type="button"
              className="faculty-clear-search"
              onClick={() => setSearch("")}
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <select
          className="faculty-status-filter"
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(event.target.value)
          }
          aria-label="Filter faculty by status"
        >
          <option value="ALL">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>

        <button
          type="button"
          className="faculty-refresh-button"
          onClick={() =>
            loadFaculty({ showLoader: false })
          }
          disabled={refreshing}
        >
          <RefreshCw
            size={17}
            className={refreshing ? "is-spinning" : ""}
          />

          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* =====================================================
          TABLE / EMPTY STATES
          ===================================================== */}

      {faculty.length === 0 ? (
        <div className="faculty-state-card">
          <div className="faculty-state-icon">
            <UserRound size={24} />
          </div>

          <h2>No faculty members yet</h2>

          <p>
            Add your first faculty member to start managing
            faculty profiles.
          </p>

          <button
            type="button"
            className="faculty-primary-button"
            onClick={handleAddFaculty}
          >
            <Plus size={17} />
            Add Faculty
          </button>
        </div>
      ) : filteredFaculty.length === 0 ? (
        <div className="faculty-state-card">
          <div className="faculty-state-icon">
            <Search size={24} />
          </div>

          <h2>No matching faculty</h2>

          <p>
            Try changing your search or status filter.
          </p>

          <button
            type="button"
            className="faculty-secondary-button"
            onClick={handleClearFilters}
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="faculty-table-card">
          <div className="faculty-table-wrapper">
            <table className="faculty-table">
              <thead>
                <tr>
                  <th>Faculty</th>
                  <th>Designation</th>
                  <th>Subject</th>
                  <th>Qualification</th>
                  <th>Experience</th>
                  <th>Status</th>
                  <th className="faculty-actions-column">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredFaculty.map((member) => (
                  <tr key={member.id}>
                    {/* FACULTY */}

                    <td>
                      <div className="faculty-person">
                        {member.profileImage ? (
                          <img
                            src={member.profileImage}
                            alt={member.name || "Faculty"}
                            className="faculty-profile-image"
                          />
                        ) : (
                          <div className="faculty-profile-placeholder">
                            <UserRound size={18} />
                          </div>
                        )}

                        <div className="faculty-person-info">
                          <strong>
                            {member.name || "Unnamed Faculty"}
                          </strong>

                          {member.bio && (
                            <span>
                              {member.bio.length > 70
                                ? `${member.bio.slice(0, 70)}...`
                                : member.bio}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* DESIGNATION */}

                    <td>
                      <span className="faculty-table-text">
                        {member.designation || "—"}
                      </span>
                    </td>

                    {/* SUBJECT */}

                    <td>
                      <span className="faculty-subject">
                        {member.subject || "—"}
                      </span>
                    </td>

                    {/* QUALIFICATION */}

                    <td>
                      <span className="faculty-table-text">
                        {member.qualification || "—"}
                      </span>
                    </td>

                    {/* EXPERIENCE */}

                    <td>
                      <span className="faculty-table-text">
                        {member.experience || "—"}
                      </span>
                    </td>

                    {/* STATUS */}

                    <td>
                      <span
                        className={`faculty-status ${
                          member.isActive
                            ? "active"
                            : "inactive"
                        }`}
                      >
                        <span className="faculty-status-dot" />

                        {member.isActive
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </td>

                    {/* ACTIONS */}

                    <td>
                      <div className="faculty-actions">
                        <button
                          type="button"
                          className="faculty-icon-button"
                          onClick={() =>
                            handleEditFaculty(member)
                          }
                          disabled={Boolean(deletingId)}
                          aria-label={`Edit ${
                            member.name || "faculty"
                          }`}
                          title="Edit"
                        >
                          <Edit3 size={16} />
                        </button>

                        <button
                          type="button"
                          className="faculty-icon-button danger"
                          onClick={() =>
                            handleDeleteFaculty(member)
                          }
                          disabled={
                            deletingId === member.id ||
                            Boolean(deletingId)
                          }
                          aria-label={`Delete ${
                            member.name || "faculty"
                          }`}
                          title="Delete"
                        >
                          {deletingId === member.id ? (
                            <RefreshCw
                              size={16}
                              className="is-spinning"
                            />
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="faculty-table-footer">
            <span>
              Showing{" "}
              <strong>{filteredFaculty.length}</strong>{" "}
              of <strong>{faculty.length}</strong> faculty
              members
            </span>
          </div>
        </div>
      )}

      {/* =====================================================
          FACULTY FORM MODAL
          ===================================================== */}

      {formOpen && (
        <div
          className="faculty-modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              handleFormClose();
            }
          }}
        >
          <div
            className="faculty-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="faculty-form-title"
          >
            <div className="faculty-modal-header">
              <div>
                <p className="faculty-eyebrow">
                  {editingFaculty
                    ? "EDIT FACULTY"
                    : "NEW FACULTY"}
                </p>

                <h2 id="faculty-form-title">
                  {editingFaculty
                    ? "Edit Faculty"
                    : "Add Faculty"}
                </h2>
              </div>

              <button
                type="button"
                className="faculty-modal-close"
                onClick={handleFormClose}
                aria-label="Close faculty form"
              >
                <X size={20} />
              </button>
            </div>

            <FacultyForm
              faculty={editingFaculty}
              onSuccess={handleFormSuccess}
              onCancel={handleFormClose}
            />
          </div>
        </div>
      )}

      {/* =====================================================
          TOAST
          ===================================================== */}

      {toast && (
        <div
          className={`faculty-toast ${toast.type}`}
          role="status"
          aria-live="polite"
        >
          <span className="faculty-toast-dot" />

          <span>{toast.message}</span>
        </div>
      )}
    </section>
  );
}

export default Faculty;