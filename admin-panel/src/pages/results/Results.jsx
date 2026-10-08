import { useEffect, useMemo, useState } from "react";
import {
  Edit3,
  Plus,
  RefreshCw,
  Search,
  Trophy,
  Trash2,
  UserRound,
  X,
} from "lucide-react";

import apiClient from "../../api/client";
import ResultsForm from "./ResultsForm";
import "./Results.css";

function Results() {
  const [results, setResults] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [formOpen, setFormOpen] = useState(false);
  const [editingResult, setEditingResult] = useState(null);

  const [toast, setToast] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  /* =========================================================
     LOAD RESULTS
     ========================================================= */

  const loadResults = async ({ showLoader = true } = {}) => {
    try {
      if (showLoader) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      setError("");

      const response = await apiClient.get("/results");

      const responseData = response.data?.data;

      const items = Array.isArray(responseData)
        ? responseData
        : Array.isArray(responseData?.items)
          ? responseData.items
          : Array.isArray(responseData?.results)
            ? responseData.results
            : [];

      setResults(items);
    } catch (err) {
      console.error("Failed to load results:", err);

      setError(
        err.message ||
          "Unable to load results. Please try again."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadResults();
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
     FILTERED RESULTS
     ========================================================= */

  const filteredResults = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return [...results]
      .filter((result) => {
        if (statusFilter === "ALL") {
          return true;
        }

        return statusFilter === "ACTIVE"
          ? result.isActive === true
          : result.isActive === false;
      })
      .filter((result) => {
        if (!normalizedSearch) {
          return true;
        }

        const searchableText = [
          result.studentName,
          result.exam,
          result.year,
          result.score,
          result.percentile,
          result.rank,
          result.achievementTitle,
          result.description,
        ]
          .filter(
            (value) =>
              value !== null &&
              value !== undefined
          )
          .join(" ")
          .toLowerCase();

        return searchableText.includes(
          normalizedSearch
        );
      })
      .sort(
        (a, b) =>
          Number(a.displayOrder ?? 0) -
          Number(b.displayOrder ?? 0)
      );
  }, [results, search, statusFilter]);

  /* =========================================================
     COUNTS
     ========================================================= */

  const activeCount = results.filter(
    (result) => result.isActive === true
  ).length;

  const inactiveCount = results.filter(
    (result) => result.isActive === false
  ).length;

  /* =========================================================
     ADD RESULT
     ========================================================= */

  const handleAddResult = () => {
    setEditingResult(null);
    setFormOpen(true);
  };

  /* =========================================================
     EDIT RESULT
     ========================================================= */

  const handleEditResult = (result) => {
    setEditingResult(result);
    setFormOpen(true);
  };

  /* =========================================================
     FORM SUCCESS
     ========================================================= */

  const handleFormSuccess = async (message) => {
    setFormOpen(false);
    setEditingResult(null);

    showToast("success", message);

    await loadResults({
      showLoader: false,
    });
  };

  /* =========================================================
     FORM CLOSE
     ========================================================= */

  const handleFormClose = () => {
    if (deletingId) {
      return;
    }

    setFormOpen(false);
    setEditingResult(null);
  };

  /* =========================================================
     DELETE RESULT
     ========================================================= */

  const handleDeleteResult = async (result) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete the result of "${result.studentName}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(result.id);

      await apiClient.delete(`/results/${result.id}`);

      setResults((current) =>
        current.filter(
          (item) => item.id !== result.id
        )
      );

      showToast(
        "success",
        "Result deleted successfully."
      );
    } catch (err) {
      console.error("Failed to delete result:", err);

      showToast(
        "error",
        err.message ||
          "Unable to delete result. Please try again."
      );
    } finally {
      setDeletingId(null);
    }
  };

  /* =========================================================
     LOADING STATE
     ========================================================= */

  if (loading) {
    return (
      <section className="results-page">
        <div className="results-page-header">
          <div>
            <div className="results-skeleton results-skeleton-title" />
            <div className="results-skeleton results-skeleton-subtitle" />
          </div>

          <div className="results-skeleton results-skeleton-button" />
        </div>

        <div className="results-toolbar">
          <div className="results-skeleton results-skeleton-search" />
          <div className="results-skeleton results-skeleton-filter" />
        </div>

        <div className="results-table-card">
          <div className="results-skeleton-table">
            {Array.from({ length: 6 }).map(
              (_, index) => (
                <div
                  className="results-skeleton-row"
                  key={index}
                >
                  <div className="results-skeleton results-skeleton-avatar" />

                  <div className="results-skeleton-content">
                    <div className="results-skeleton results-skeleton-line" />
                    <div className="results-skeleton results-skeleton-line short" />
                  </div>

                  <div className="results-skeleton results-skeleton-cell" />
                  <div className="results-skeleton results-skeleton-cell" />
                  <div className="results-skeleton results-skeleton-cell" />
                </div>
              )
            )}
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
      <section className="results-page">
        <div className="results-page-header">
          <div>
            <p className="results-eyebrow">
              RESULT MANAGEMENT
            </p>

            <h1>Results</h1>

            <p>
              Manage student achievements and academic
              results.
            </p>
          </div>
        </div>

        <div className="results-state-card results-error-state">
          <div className="results-state-icon">
            <X size={22} />
          </div>

          <h2>Unable to load results</h2>

          <p>{error}</p>

          <button
            type="button"
            className="results-primary-button"
            onClick={() => loadResults()}
          >
            <RefreshCw size={17} />
            Retry
          </button>
        </div>
      </section>
    );
  }

  /* =========================================================
     MAIN UI
     ========================================================= */

  return (
    <section className="results-page">
      {/* =====================================================
          PAGE HEADER
          ===================================================== */}

      <div className="results-page-header">
        <div>
          <p className="results-eyebrow">
            RESULT MANAGEMENT
          </p>

          <h1>Results</h1>

          <p>
            Manage student achievements and academic
            results.
          </p>
        </div>

        <button
          type="button"
          className="results-primary-button"
          onClick={handleAddResult}
        >
          <Plus size={18} strokeWidth={2} />
          Add Result
        </button>
      </div>

      {/* =====================================================
          SUMMARY
          ===================================================== */}

      <div className="results-summary">
        <div className="results-summary-card">
          <span>Total Results</span>
          <strong>{results.length}</strong>
        </div>

        <div className="results-summary-card">
          <span>Active</span>
          <strong>{activeCount}</strong>
        </div>

        <div className="results-summary-card">
          <span>Inactive</span>
          <strong>{inactiveCount}</strong>
        </div>
      </div>

      {/* =====================================================
          TOOLBAR
          ===================================================== */}

      <div className="results-toolbar">
        <div className="results-search">
          <Search size={18} />

          <input
            type="search"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search results..."
            aria-label="Search results"
          />

          {search && (
            <button
              type="button"
              className="results-clear-search"
              onClick={() => setSearch("")}
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <select
          className="results-status-filter"
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(event.target.value)
          }
          aria-label="Filter results by status"
        >
          <option value="ALL">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>

        <button
          type="button"
          className="results-refresh-button"
          onClick={() =>
            loadResults({
              showLoader: false,
            })
          }
          disabled={refreshing}
          aria-label="Refresh results"
        >
          <RefreshCw
            size={17}
            className={
              refreshing ? "is-spinning" : ""
            }
          />
          Refresh
        </button>
      </div>

      {/* =====================================================
          EMPTY / TABLE
          ===================================================== */}

      {results.length === 0 ? (
        <div className="results-state-card">
          <div className="results-state-icon">
            <Trophy size={24} />
          </div>

          <h2>No results yet</h2>

          <p>
            Add your first student result or achievement
            to start managing results.
          </p>

          <button
            type="button"
            className="results-primary-button"
            onClick={handleAddResult}
          >
            <Plus size={17} />
            Add Result
          </button>
        </div>
      ) : filteredResults.length === 0 ? (
        <div className="results-state-card">
          <div className="results-state-icon">
            <Search size={24} />
          </div>

          <h2>No matching results</h2>

          <p>
            Try changing your search or status filter.
          </p>

          <button
            type="button"
            className="results-secondary-button"
            onClick={() => {
              setSearch("");
              setStatusFilter("ALL");
            }}
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="results-table-card">
          <div className="results-table-wrapper">
            <table className="results-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Exam</th>
                  <th>Year</th>
                  <th>Score</th>
                  <th>Percentile</th>
                  <th>Rank</th>
                  <th>Achievement</th>
                  <th>Status</th>
                  <th className="results-actions-column">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredResults.map((result) => (
                  <tr key={result.id}>
                    {/* STUDENT */}
                    <td>
                      <div className="results-person">
                        {result.studentImage ? (
                          <img
                            src={result.studentImage}
                            alt={result.studentName}
                            className="results-student-image"
                          />
                        ) : (
                          <div className="results-student-placeholder">
                            <UserRound size={18} />
                          </div>
                        )}

                        <div className="results-person-info">
                          <strong>
                            {result.studentName}
                          </strong>

                          {result.description && (
                            <span>
                              {result.description
                                .length > 55
                                ? `${result.description.slice(
                                    0,
                                    55
                                  )}...`
                                : result.description}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* EXAM */}
                    <td>
                      <span className="results-exam">
                        {result.exam || "—"}
                      </span>
                    </td>

                    {/* YEAR */}
                    <td>
                      <span className="results-table-text">
                        {result.year || "—"}
                      </span>
                    </td>

                    {/* SCORE */}
                    <td>
                      <span className="results-score">
                        {result.score || "—"}
                      </span>
                    </td>

                    {/* PERCENTILE */}
                    <td>
                      <span className="results-table-text">
                        {result.percentile
                          ? `${result.percentile}%`
                          : "—"}
                      </span>
                    </td>

                    {/* RANK */}
                    <td>
                      <span className="results-rank">
                        {result.rank
                          ? `#${result.rank}`
                          : "—"}
                      </span>
                    </td>

                    {/* ACHIEVEMENT */}
                    <td>
                      <span className="results-achievement">
                        {result.achievementTitle ||
                          "—"}
                      </span>
                    </td>

                    {/* STATUS */}
                    <td>
                      <span
                        className={`results-status ${
                          result.isActive
                            ? "active"
                            : "inactive"
                        }`}
                      >
                        <span className="results-status-dot" />

                        {result.isActive
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </td>

                    {/* ACTIONS */}
                    <td>
                      <div className="results-actions">
                        <button
                          type="button"
                          className="results-icon-button"
                          onClick={() =>
                            handleEditResult(result)
                          }
                          aria-label={`Edit result of ${result.studentName}`}
                          title="Edit"
                        >
                          <Edit3 size={16} />
                        </button>

                        <button
                          type="button"
                          className="results-icon-button danger"
                          onClick={() =>
                            handleDeleteResult(result)
                          }
                          disabled={
                            deletingId === result.id
                          }
                          aria-label={`Delete result of ${result.studentName}`}
                          title="Delete"
                        >
                          {deletingId === result.id ? (
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

          <div className="results-table-footer">
            <span>
              Showing{" "}
              <strong>
                {filteredResults.length}
              </strong>{" "}
              of <strong>{results.length}</strong>{" "}
              results
            </span>
          </div>
        </div>
      )}

      {/* =====================================================
          FORM MODAL
          ===================================================== */}

      {formOpen && (
        <div
          className="results-modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              handleFormClose();
            }
          }}
        >
          <div
            className="results-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="results-form-title"
          >
            <div className="results-modal-header">
              <div>
                <p className="results-eyebrow">
                  {editingResult
                    ? "EDIT RESULT"
                    : "NEW RESULT"}
                </p>

                <h2 id="results-form-title">
                  {editingResult
                    ? "Edit Result"
                    : "Add Result"}
                </h2>
              </div>

              <button
                type="button"
                className="results-modal-close"
                onClick={handleFormClose}
                aria-label="Close result form"
              >
                <X size={20} />
              </button>
            </div>

            <ResultsForm
              result={editingResult}
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
          className={`results-toast ${toast.type}`}
          role="status"
        >
          <span className="results-toast-dot" />
          <span>{toast.message}</span>
        </div>
      )}
    </section>
  );
}

export default Results;