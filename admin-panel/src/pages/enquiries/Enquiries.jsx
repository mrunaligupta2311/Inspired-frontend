import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  ChevronDown,
  Clock3,
  Eye,
  Mail,
  MessageSquare,
  Phone,
  RefreshCw,
  Search,
  Trash2,
  UserRound,
  X,
  XCircle,
} from "lucide-react";

import apiClient from "../../api/client";
import EnquiryDetails from "./EnquiryDetails";
import "./Enquiries.css";

const STATUS_OPTIONS = [
  "NEW",
  "CONTACTED",
  "CONVERTED",
  "CLOSED",
];

const STATUS_LABELS = {
  NEW: "New",
  CONTACTED: "Contacted",
  CONVERTED: "Converted",
  CLOSED: "Closed",
};

function Enquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [statusMenuId, setStatusMenuId] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [toast, setToast] = useState({
    type: "",
    message: "",
  });

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await apiClient.get("/enquiries");
      const responseData = response?.data?.data;

      const items = Array.isArray(responseData)
        ? responseData
        : Array.isArray(responseData?.items)
        ? responseData.items
        : Array.isArray(responseData?.enquiries)
        ? responseData.enquiries
        : [];

      setEnquiries(items);
    } catch (err) {
      setError(
        err?.message ||
          "Failed to load enquiries. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const showToast = (type, message) => {
    setToast({ type, message });

    window.setTimeout(() => {
      setToast({
        type: "",
        message: "",
      });
    }, 3500);
  };

  const filteredEnquiries = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return [...enquiries]
      .filter((enquiry) => {
        if (!query) return true;

        return [
          enquiry.studentName,
          enquiry.phoneNumber,
          enquiry.studentClass,
          enquiry.interestedCourse,
          enquiry.message,
          enquiry.status,
        ].some((value) =>
          String(value || "")
            .toLowerCase()
            .includes(query)
        );
      })
      .filter((enquiry) => {
        if (statusFilter === "ALL") return true;

        return (
          String(enquiry.status || "NEW").toUpperCase() ===
          statusFilter
        );
      })
      .sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();

        return dateB - dateA;
      });
  }, [enquiries, searchTerm, statusFilter]);

  const statusCounts = useMemo(() => {
    const counts = {
      total: enquiries.length,
      NEW: 0,
      CONTACTED: 0,
      CONVERTED: 0,
      CLOSED: 0,
    };

    enquiries.forEach((enquiry) => {
      const status = String(
        enquiry.status || "NEW"
      ).toUpperCase();

      if (counts[status] !== undefined) {
        counts[status] += 1;
      }
    });

    return counts;
  }, [enquiries]);

  const formatDate = (dateValue) => {
    if (!dateValue) return "—";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "—";
    }

    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  const formatTime = (dateValue) => {
    if (!dateValue) return "—";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "—";
    }

    return new Intl.DateTimeFormat("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const handleStatusUpdate = async (
    enquiry,
    nextStatus
  ) => {
    const enquiryId = enquiry.id;

    if (!enquiryId) return;

    const currentStatus = String(
      enquiry.status || "NEW"
    ).toUpperCase();

    if (currentStatus === nextStatus) {
      setStatusMenuId(null);
      return;
    }

    try {
      setUpdatingStatus(enquiryId);
      setStatusMenuId(null);

      await apiClient.patch(
        `/enquiries/${enquiryId}/status`,
        {
          status: nextStatus,
        }
      );

      setEnquiries((current) =>
        current.map((item) =>
          item.id === enquiryId
            ? {
                ...item,
                status: nextStatus,
              }
            : item
        )
      );

      setSelectedEnquiry((current) =>
        current?.id === enquiryId
          ? {
              ...current,
              status: nextStatus,
            }
          : current
      );

      showToast(
        "success",
        `Enquiry marked as ${STATUS_LABELS[nextStatus]}.`
      );
    } catch (err) {
      showToast(
        "error",
        err?.message ||
          "Failed to update enquiry status."
      );
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleDelete = async (enquiry) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete the enquiry from ${
        enquiry.studentName || "this student"
      }?`
    );

    if (!confirmed || !enquiry.id) return;

    try {
      setDeletingId(enquiry.id);

      await apiClient.delete(
        `/enquiries/${enquiry.id}`
      );

      setEnquiries((current) =>
        current.filter(
          (item) => item.id !== enquiry.id
        )
      );

      if (selectedEnquiry?.id === enquiry.id) {
        setSelectedEnquiry(null);
      }

      showToast(
        "success",
        "Enquiry deleted successfully."
      );
    } catch (err) {
      showToast(
        "error",
        err?.message ||
          "Failed to delete enquiry."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const openDetails = (enquiry) => {
    setSelectedEnquiry(enquiry);
    setStatusMenuId(null);
  };

  const closeDetails = () => {
    setSelectedEnquiry(null);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "CONTACTED":
        return <Phone size={14} />;
      case "CONVERTED":
        return <CheckCircle2 size={14} />;
      case "CLOSED":
        return <XCircle size={14} />;
      case "NEW":
      default:
        return <Clock3 size={14} />;
    }
  };

  if (loading) {
    return (
      <section className="enquiries-page">
        <div className="enquiries-page-header">
          <div>
            <span className="enquiries-page-kicker">
              LEAD MANAGEMENT
            </span>

            <h1>Enquiries</h1>

            <p>
              Manage enquiries received from
              students and parents.
            </p>
          </div>
        </div>

        <div className="enquiries-stats">
          {[1, 2, 3, 4].map((item) => (
            <div
              className="enquiries-stat-card enquiries-skeleton-card"
              key={item}
            >
              <div className="enquiries-skeleton enquiries-skeleton-icon" />

              <div className="enquiries-skeleton-content">
                <div className="enquiries-skeleton enquiries-skeleton-line" />
                <div className="enquiries-skeleton enquiries-skeleton-value" />
              </div>
            </div>
          ))}
        </div>

        <div className="enquiries-table-card">
          <div className="enquiries-loading-list">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                className="enquiries-loading-row"
                key={item}
              >
                <div className="enquiries-skeleton enquiries-loading-name" />
                <div className="enquiries-skeleton enquiries-loading-contact" />
                <div className="enquiries-skeleton enquiries-loading-subject" />
                <div className="enquiries-skeleton enquiries-loading-status" />
                <div className="enquiries-skeleton enquiries-loading-action" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="enquiries-page">
        <div className="enquiries-page-header">
          <div>
            <span className="enquiries-page-kicker">
              LEAD MANAGEMENT
            </span>

            <h1>Enquiries</h1>

            <p>
              Manage enquiries received from
              students and parents.
            </p>
          </div>

          <button
            type="button"
            className="enquiries-secondary-button"
            onClick={fetchEnquiries}
          >
            <RefreshCw size={17} />
            Retry
          </button>
        </div>

        <div className="enquiries-error-state">
          <div className="enquiries-error-icon">
            <MessageSquare size={24} />
          </div>

          <h2>Unable to load enquiries</h2>

          <p>{error}</p>

          <button
            type="button"
            className="enquiries-primary-button"
            onClick={fetchEnquiries}
          >
            <RefreshCw size={17} />
            Try Again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="enquiries-page">
      <div className="enquiries-page-header">
        <div>
          <span className="enquiries-page-kicker">
            LEAD MANAGEMENT
          </span>

          <h1>Enquiries</h1>

          <p>
            Manage enquiries received from
            students and parents.
          </p>
        </div>

        <button
          type="button"
          className="enquiries-secondary-button"
          onClick={fetchEnquiries}
        >
          <RefreshCw size={17} />
          Refresh
        </button>
      </div>

      <div className="enquiries-stats">
        <div className="enquiries-stat-card">
          <div className="enquiries-stat-icon enquiries-stat-icon-blue">
            <MessageSquare size={20} />
          </div>

          <div>
            <span>Total Enquiries</span>
            <strong>{statusCounts.total}</strong>
          </div>
        </div>

        <div className="enquiries-stat-card">
          <div className="enquiries-stat-icon enquiries-stat-icon-orange">
            <Clock3 size={20} />
          </div>

          <div>
            <span>New</span>
            <strong>{statusCounts.NEW}</strong>
          </div>
        </div>

        <div className="enquiries-stat-card">
          <div className="enquiries-stat-icon enquiries-stat-icon-blue-light">
            <Phone size={20} />
          </div>

          <div>
            <span>Contacted</span>
            <strong>{statusCounts.CONTACTED}</strong>
          </div>
        </div>

        <div className="enquiries-stat-card">
          <div className="enquiries-stat-icon enquiries-stat-icon-green">
            <CheckCircle2 size={20} />
          </div>

          <div>
            <span>Converted</span>
            <strong>{statusCounts.CONVERTED}</strong>
          </div>
        </div>
      </div>

      <div className="enquiries-filter-card">
        <div className="enquiries-search-wrapper">
          <Search
            size={18}
            className="enquiries-search-icon"
          />

          <input
            type="search"
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
            placeholder="Search student, phone, course, class..."
            aria-label="Search enquiries"
          />
        </div>

        <div className="enquiries-filter-group">
          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
            aria-label="Filter enquiries by status"
          >
            <option value="ALL">All Statuses</option>

            {STATUS_OPTIONS.map((status) => (
              <option value={status} key={status}>
                {STATUS_LABELS[status]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="enquiries-table-card">
        <div className="enquiries-table-header">
          <div>
            <h2>Recent Enquiries</h2>

            <span>
              Showing {filteredEnquiries.length} of{" "}
              {enquiries.length} enquiries
            </span>
          </div>
        </div>

        {filteredEnquiries.length === 0 ? (
          <div className="enquiries-empty-state">
            <div className="enquiries-empty-icon">
              <InboxIcon />
            </div>

            <h3>
              {enquiries.length === 0
                ? "No enquiries yet"
                : "No matching enquiries"}
            </h3>

            <p>
              {enquiries.length === 0
                ? "New enquiries submitted through the website will appear here."
                : "Try changing your search or status filter."}
            </p>
          </div>
        ) : (
          <div className="enquiries-table-wrapper">
            <table className="enquiries-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Contact</th>
                  <th>Course / Class</th>
                  <th>Received</th>
                  <th>Status</th>
                  <th className="enquiries-actions-column">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredEnquiries.map((enquiry) => {
                  const status = String(
                    enquiry.status || "NEW"
                  ).toUpperCase();

                  const isUpdating =
                    updatingStatus === enquiry.id;

                  const isDeleting =
                    deletingId === enquiry.id;

                  return (
                    <tr key={enquiry.id}>
                      <td>
                        <div className="enquiries-person-cell">
                          <div className="enquiries-person-avatar">
                            {enquiry.studentName
                              ?.trim()
                              ?.charAt(0)
                              ?.toUpperCase() || (
                              <UserRound size={17} />
                            )}
                          </div>

                          <div className="enquiries-person-info">
                            <strong>
                              {enquiry.studentName ||
                                "Unknown Student"}
                            </strong>

                          </div>
                        </div>
                      </td>

                      <td>
                        <div className="enquiries-contact-cell">
                          {enquiry.phoneNumber && (
                            <a
                              href={`tel:${enquiry.phoneNumber}`}
                            >
                              <Phone size={14} />
                              {enquiry.phoneNumber}
                            </a>
                          )}

                          {!enquiry.phoneNumber && (
                              <span className="enquiries-muted">
                                No contact
                              </span>
                            )}
                        </div>
                      </td>

                      <td>
                        <div className="enquiries-subject-cell">
                          <strong>
                            {enquiry.interestedCourse ||
                              "Course not specified"}
                          </strong>

                          {enquiry.studentClass && (
                            <span>
                              Class: {enquiry.studentClass}
                            </span>
                          )}
                        </div>
                      </td>

                      <td>
                        <div className="enquiries-date-cell">
                          <strong>
                            {formatDate(enquiry.createdAt)}
                          </strong>

                          <span>
                            {formatTime(enquiry.createdAt)}
                          </span>
                        </div>
                      </td>

                      <td>
                        <div className="enquiries-status-wrapper">
                          <button
                            type="button"
                            className={`enquiries-status-badge ${status.toLowerCase()}`}
                            onClick={() =>
                              setStatusMenuId(
                                statusMenuId === enquiry.id
                                  ? null
                                  : enquiry.id
                              )
                            }
                            disabled={isUpdating}
                          >
                            {isUpdating ? (
                              <RefreshCw
                                size={14}
                                className="enquiries-spin"
                              />
                            ) : (
                              getStatusIcon(status)
                            )}

                            <span>
                              {STATUS_LABELS[status] ||
                                status}
                            </span>

                            <ChevronDown size={13} />
                          </button>

                          {statusMenuId === enquiry.id && (
                            <div className="enquiries-status-menu">
                              {STATUS_OPTIONS.map(
                                (option) => (
                                  <button
                                    type="button"
                                    key={option}
                                    className={
                                      option === status
                                        ? "selected"
                                        : ""
                                    }
                                    onClick={() =>
                                      handleStatusUpdate(
                                        enquiry,
                                        option
                                      )
                                    }
                                  >
                                    {getStatusIcon(option)}

                                    <span>
                                      {
                                        STATUS_LABELS[
                                          option
                                        ]
                                      }
                                    </span>

                                    {option === status && (
                                      <CheckCircle2
                                        size={14}
                                      />
                                    )}
                                  </button>
                                )
                              )}
                            </div>
                          )}
                        </div>
                      </td>

                      <td>
                        <div className="enquiries-row-actions">
                          <button
                            type="button"
                            className="enquiries-icon-button view"
                            onClick={() =>
                              openDetails(enquiry)
                            }
                            title="View enquiry"
                            aria-label="View enquiry"
                          >
                            <Eye size={16} />
                          </button>

                          <button
                            type="button"
                            className="enquiries-icon-button delete"
                            onClick={() =>
                              handleDelete(enquiry)
                            }
                            disabled={isDeleting}
                            title="Delete enquiry"
                            aria-label="Delete enquiry"
                          >
                            {isDeleting ? (
                              <RefreshCw
                                size={16}
                                className="enquiries-spin"
                              />
                            ) : (
                              <Trash2 size={16} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedEnquiry && (
        <div
          className="enquiries-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeDetails();
            }
          }}
        >
          <div
            className="enquiries-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="enquiry-details-title"
          >
            <div className="enquiries-modal-header">
              <div>
                <span className="enquiries-modal-kicker">
                  ENQUIRY DETAILS
                </span>

                <h2 id="enquiry-details-title">
                  Enquiry Information
                </h2>

                <p>
                  Review the enquiry and update its
                  current status.
                </p>
              </div>

              <button
                type="button"
                className="enquiries-modal-close"
                onClick={closeDetails}
                aria-label="Close enquiry details"
              >
                <X size={20} />
              </button>
            </div>

            <div className="enquiries-modal-body">
              <EnquiryDetails
                enquiry={selectedEnquiry}
                onStatusUpdate={handleStatusUpdate}
                updating={
                  updatingStatus === selectedEnquiry.id
                }
                onDelete={() =>
                  handleDelete(selectedEnquiry)
                }
                deleting={
                  deletingId === selectedEnquiry.id
                }
              />
            </div>
          </div>
        </div>
      )}

      {toast.message && (
        <div
          className={`enquiries-toast ${
            toast.type === "error"
              ? "error"
              : "success"
          }`}
          role="status"
        >
          <span className="enquiries-toast-indicator" />
          <span>{toast.message}</span>
        </div>
      )}
    </section>
  );
}

function InboxIcon() {
  return <MessageSquare size={25} />;
}

export default Enquiries;
