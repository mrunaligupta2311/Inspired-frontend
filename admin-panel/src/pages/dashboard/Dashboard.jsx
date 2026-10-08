import { useCallback, useEffect, useState } from "react";
import {
  ArrowUpRight,
  BookOpen,
  Images,
  Inbox,
  MessageSquare,
  RefreshCw,
  Trophy,
  Users,
} from "lucide-react";

import apiClient from "../../api/client";
import "./Dashboard.css";

const initialStats = {
  courses: 0,
  activeCourses: 0,
  faculty: 0,
  activeFaculty: 0,
  results: 0,
  activeResults: 0,
  gallery: 0,
  activeGallery: 0,
  enquiries: 0,
};

const statCards = [
  {
    key: "courses",
    label: "Total Courses",
    icon: BookOpen,
    metaKey: "activeCourses",
    metaLabel: "active courses",
  },
  {
    key: "faculty",
    label: "Total Faculty",
    icon: Users,
    metaKey: "activeFaculty",
    metaLabel: "active faculty",
  },
  {
    key: "results",
    label: "Total Results",
    icon: Trophy,
    metaKey: "activeResults",
    metaLabel: "published results",
  },
  {
    key: "gallery",
    label: "Gallery Images",
    icon: Images,
    metaKey: "activeGallery",
    metaLabel: "active images",
  },
];

/* ============================================================
   DATA HELPERS
   ============================================================ */

function formatDate(dateValue) {
  if (!dateValue) {
    return "No date";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "No date";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

/* ============================================================
   ENQUIRY HELPERS
   ============================================================ */

function getEnquiryName(enquiry) {
  return (
    enquiry.name ||
    enquiry.studentName ||
    enquiry.fullName ||
    "Unnamed enquiry"
  );
}

function getEnquiryContact(enquiry) {
  return (
    enquiry.phone ||
    enquiry.mobile ||
    enquiry.email ||
    "Contact details unavailable"
  );
}

function getEnquiryStatus(enquiry) {
  return (
    enquiry.status ||
    enquiry.enquiryStatus ||
    "NEW"
  ).toUpperCase();
}

/* ============================================================
   RESULT HELPERS
   ============================================================ */

function getResultTitle(result) {
  return (
    result.studentName ||
    result.achievementTitle ||
    "Unnamed result"
  );
}

function getResultMeta(result) {
  const exam =
    result.exam || "Exam not specified";

  const year =
    result.year || "Year not specified";

  return `${exam} · ${year}`;
}

function getResultBadge(result) {
  if (
    result.percentile !== null &&
    result.percentile !== undefined &&
    result.percentile !== ""
  ) {
    return `${result.percentile}%`;
  }

  if (
    result.rank !== null &&
    result.rank !== undefined &&
    result.rank !== ""
  ) {
    return `Rank ${result.rank}`;
  }

  return "Result";
}

/* ============================================================
   DASHBOARD
   ============================================================ */

function Dashboard() {
  const [stats, setStats] = useState(initialStats);
  const [recentEnquiries, setRecentEnquiries] =
    useState([]);
  const [recentResults, setRecentResults] =
    useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] =
    useState(false);
  const [error, setError] = useState("");

  const fetchDashboardData = useCallback(
    async ({ isRefresh = false } = {}) => {
      try {
        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError("");

        const response =
          await apiClient.get("/dashboard");

        const dashboardData =
          response?.data?.data;

        setStats(
          dashboardData?.stats || initialStats
        );

        setRecentEnquiries(
          Array.isArray(
            dashboardData?.recentEnquiries
          )
            ? dashboardData.recentEnquiries
            : []
        );

        setRecentResults(
          Array.isArray(
            dashboardData?.recentResults
          )
            ? dashboardData.recentResults
            : []
        );
      } catch (err) {
        console.error(
          "Dashboard data fetch failed:",
          err
        );

        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Unable to load dashboard data. Please try again."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  /* ==========================================================
     LOADING STATE
     ========================================================== */

  if (loading) {
    return (
      <section className="dashboard-page">
        <div className="dashboard-page-header">
          <div className="dashboard-page-header-content">
            <h1>Dashboard</h1>

            <p>
              Overview of your institute content and
              recent activity.
            </p>
          </div>
        </div>

        <div className="dashboard-loading">
          {Array.from({ length: 4 }).map(
            (_, index) => (
              <div
                key={index}
                className="dashboard-skeleton-card"
              />
            )
          )}
        </div>
      </section>
    );
  }

  /* ==========================================================
     ERROR STATE
     ========================================================== */

  if (error) {
    return (
      <section className="dashboard-page">
        <div className="dashboard-page-header">
          <div className="dashboard-page-header-content">
            <h1>Dashboard</h1>

            <p>
              Overview of your institute content and
              recent activity.
            </p>
          </div>
        </div>

        <div className="dashboard-error">
          <h3>Something went wrong</h3>

          <p>{error}</p>

          <button
            type="button"
            className="dashboard-retry-button"
            onClick={() => fetchDashboardData()}
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  /* ==========================================================
     MAIN DASHBOARD
     ========================================================== */

  return (
    <section className="dashboard-page">
      {/* =====================================================
          PAGE HEADER
          ===================================================== */}

      <div className="dashboard-page-header">
        <div className="dashboard-page-header-content">
          <h1>Dashboard</h1>

          <p>
            Overview of your institute content and
            recent activity.
          </p>
        </div>

        <button
          type="button"
          className="dashboard-refresh-button"
          onClick={() =>
            fetchDashboardData({
              isRefresh: true,
            })
          }
          disabled={refreshing}
        >
          <RefreshCw
            size={16}
            className={
              refreshing
                ? "dashboard-refresh-icon spinning"
                : "dashboard-refresh-icon"
            }
            aria-hidden="true"
          />

          {refreshing
            ? "Refreshing..."
            : "Refresh"}
        </button>
      </div>

      {/* =====================================================
          PRIMARY STAT CARDS
          ===================================================== */}

      <div className="dashboard-stat-grid">
        {statCards.map(
          ({
            key,
            label,
            icon: Icon,
            metaKey,
            metaLabel,
          }) => (
            <article
              key={key}
              className="dashboard-stat-card"
            >
              <div className="dashboard-stat-top">
                <p className="dashboard-stat-label">
                  {label}
                </p>

                <span className="dashboard-stat-icon">
                  <Icon
                    size={19}
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                </span>
              </div>

              <p className="dashboard-stat-value">
                {stats[key]}
              </p>

              <p className="dashboard-stat-meta">
                {stats[metaKey]} {metaLabel}
              </p>
            </article>
          )
        )}
      </div>

      {/* =====================================================
          SECONDARY STATS
          ===================================================== */}

      <div className="dashboard-secondary-grid">
        <article className="dashboard-secondary-card">
          <div className="dashboard-secondary-card-header">
            <p className="dashboard-secondary-card-label">
              Active Courses
            </p>

            <ArrowUpRight
              size={17}
              color="#082a5e"
              aria-hidden="true"
            />
          </div>

          <p className="dashboard-secondary-card-value">
            {stats.activeCourses}
          </p>

          <p className="dashboard-secondary-card-meta">
            Currently visible on the website
          </p>
        </article>

        <article className="dashboard-secondary-card">
          <div className="dashboard-secondary-card-header">
            <p className="dashboard-secondary-card-label">
              Active Faculty
            </p>

            <ArrowUpRight
              size={17}
              color="#1f5fae"
              aria-hidden="true"
            />
          </div>

          <p className="dashboard-secondary-card-value">
            {stats.activeFaculty}
          </p>

          <p className="dashboard-secondary-card-meta">
            Faculty members marked active
          </p>
        </article>

        <article className="dashboard-secondary-card">
          <div className="dashboard-secondary-card-header">
            <p className="dashboard-secondary-card-label">
              Total Enquiries
            </p>

            <MessageSquare
              size={17}
              color="#f28c28"
              aria-hidden="true"
            />
          </div>

          <p className="dashboard-secondary-card-value">
            {stats.enquiries}
          </p>

          <p className="dashboard-secondary-card-meta">
            Enquiries received by the institute
          </p>
        </article>
      </div>

      {/* =====================================================
          RECENT ACTIVITY
          ===================================================== */}

      <div className="dashboard-content-grid">
        {/* Recent Enquiries */}

        <article className="dashboard-panel">
          <div className="dashboard-panel-header">
            <div>
              <h3 className="dashboard-panel-title">
                Recent Enquiries
              </h3>

              <p className="dashboard-panel-subtitle">
                Latest enquiries received from
                students
              </p>
            </div>

            <Inbox
              size={18}
              color="#082a5e"
              aria-hidden="true"
            />
          </div>

          <div className="dashboard-panel-body">
            {recentEnquiries.length === 0 ? (
              <div className="dashboard-empty">
                <span className="dashboard-empty-icon">
                  <Inbox
                    size={18}
                    aria-hidden="true"
                  />
                </span>

                <p>No enquiries found.</p>
              </div>
            ) : (
              <ul className="dashboard-list">
                {recentEnquiries.map(
                  (enquiry, index) => {
                    const status =
                      getEnquiryStatus(enquiry);

                    return (
                      <li
                        key={
                          enquiry.id ||
                          enquiry._id ||
                          `enquiry-${index}`
                        }
                        className="dashboard-list-item"
                      >
                        <div className="dashboard-list-main">
                          <p className="dashboard-list-title">
                            {getEnquiryName(
                              enquiry
                            )}
                          </p>

                          <p className="dashboard-list-meta">
                            {getEnquiryContact(
                              enquiry
                            )}
                            {" · "}
                            {formatDate(
                              enquiry.createdAt
                            )}
                          </p>
                        </div>

                        <span
                          className={`dashboard-list-badge dashboard-status-${status.toLowerCase()}`}
                        >
                          {status}
                        </span>
                      </li>
                    );
                  }
                )}
              </ul>
            )}
          </div>
        </article>

        {/* Recent Results */}

        <article className="dashboard-panel">
          <div className="dashboard-panel-header">
            <div>
              <h3 className="dashboard-panel-title">
                Recent Results
              </h3>

              <p className="dashboard-panel-subtitle">
                Latest student achievements
              </p>
            </div>

            <Trophy
              size={18}
              color="#f28c28"
              aria-hidden="true"
            />
          </div>

          <div className="dashboard-panel-body">
            {recentResults.length === 0 ? (
              <div className="dashboard-empty">
                <span className="dashboard-empty-icon">
                  <Trophy
                    size={18}
                    aria-hidden="true"
                  />
                </span>

                <p>No results found.</p>
              </div>
            ) : (
              <ul className="dashboard-list">
                {recentResults.map(
                  (result, index) => (
                    <li
                      key={
                        result.id ||
                        result._id ||
                        `result-${index}`
                      }
                      className="dashboard-list-item"
                    >
                      <div className="dashboard-list-main">
                        <p className="dashboard-list-title">
                          {getResultTitle(result)}
                        </p>

                        <p className="dashboard-list-meta">
                          {getResultMeta(result)}
                        </p>
                      </div>

                      <span className="dashboard-list-badge">
                        {getResultBadge(result)}
                      </span>
                    </li>
                  )
                )}
              </ul>
            )}
          </div>
        </article>
      </div>
    </section>
  );
}

export default Dashboard;
