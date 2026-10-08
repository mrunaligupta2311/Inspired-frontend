import {
  CheckCircle2,
  Clock3,
  MessageSquare,
  Phone,
  UserRound,
  XCircle,
} from "lucide-react";

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

function EnquiryDetails({
  enquiry,
  onStatusUpdate,
  updating = false,
  onDelete,
  deleting = false,
}) {
  if (!enquiry) {
    return null;
  }

  const status = String(
    enquiry.status || "NEW"
  ).toUpperCase();

  const formatDateTime = (dateValue) => {
    if (!dateValue) return "—";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "—";
    }

    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const getStatusIcon = (value) => {
    switch (value) {
      case "CONTACTED":
        return <Phone size={15} />;
      case "CONVERTED":
        return <CheckCircle2 size={15} />;
      case "CLOSED":
        return <XCircle size={15} />;
      case "NEW":
      default:
        return <Clock3 size={15} />;
    }
  };

  return (
    <div className="enquiry-details">
      <div className="enquiry-details-profile">
        <div className="enquiry-details-avatar">
          {enquiry.studentName
            ?.trim()
            ?.charAt(0)
            ?.toUpperCase() || (
            <UserRound size={25} />
          )}
        </div>

        <div className="enquiry-details-profile-info">
          <h3>
            {enquiry.studentName ||
              "Unknown Student"}
          </h3>

          <span>
            Enquiry received on{" "}
            {formatDateTime(enquiry.createdAt)}
          </span>
        </div>

        <span
          className={`enquiry-details-status ${status.toLowerCase()}`}
        >
          {getStatusIcon(status)}
          {STATUS_LABELS[status] || status}
        </span>
      </div>

      <section className="enquiry-details-section">
        <div className="enquiry-details-section-heading">
          <UserRound size={17} />

          <div>
            <h4>Contact Information</h4>

            <p>
              Student contact details.
            </p>
          </div>
        </div>

        <div className="enquiry-details-info-grid">
          <div className="enquiry-details-info-item">
            <span>Student</span>

            <strong>
              {enquiry.studentName ||
                "Not provided"}
            </strong>
          </div>

          <div className="enquiry-details-info-item">
            <span>Phone</span>

            {enquiry.phoneNumber ? (
              <a
                href={`tel:${enquiry.phoneNumber}`}
              >
                <Phone size={15} />
                {enquiry.phoneNumber}
              </a>
            ) : (
              <strong>Not provided</strong>
            )}
          </div>
        </div>
      </section>

      <section className="enquiry-details-section">
        <div className="enquiry-details-section-heading">
          <MessageSquare size={17} />

          <div>
            <h4>Enquiry Information</h4>

            <p>
              Details submitted through the
              institute website.
            </p>
          </div>
        </div>

        <div className="enquiry-details-info-grid">
          <div className="enquiry-details-info-item">
            <span>Interested Course</span>

            <strong>
              {enquiry.interestedCourse ||
                "Not specified"}
            </strong>
          </div>

          <div className="enquiry-details-info-item">
            <span>Class / Standard</span>

            <strong>
              {enquiry.studentClass ||
                "Not specified"}
            </strong>
          </div>

          <div className="enquiry-details-info-item">
            <span>Submitted</span>

            <strong>
              {formatDateTime(enquiry.createdAt)}
            </strong>
          </div>

          <div className="enquiry-details-info-item">
            <span>Status</span>

            <strong>
              {STATUS_LABELS[status] || status}
            </strong>
          </div>
        </div>
      </section>

      <section className="enquiry-details-section">
        <div className="enquiry-details-section-heading">
          <MessageSquare size={17} />

          <div>
            <h4>Message</h4>

            <p>
              Message submitted with this enquiry.
            </p>
          </div>
        </div>

        <div className="enquiry-details-message">
          {enquiry.message ? (
            <p>{enquiry.message}</p>
          ) : (
            <span>No message was provided.</span>
          )}
        </div>
      </section>

      <section className="enquiry-details-section">
        <div className="enquiry-details-section-heading">
          <Clock3 size={17} />

          <div>
            <h4>Update Status</h4>

            <p>
              Track the current progress of this
              enquiry.
            </p>
          </div>
        </div>

        <div className="enquiry-details-status-actions">
          {STATUS_OPTIONS.map((option) => (
            <button
              type="button"
              key={option}
              className={`enquiry-details-status-button ${
                option === status ? "selected" : ""
              } ${option.toLowerCase()}`}
              onClick={() =>
                onStatusUpdate?.(
                  enquiry,
                  option
                )
              }
              disabled={
                updating || option === status
              }
            >
              {getStatusIcon(option)}

              <span>
                {STATUS_LABELS[option]}
              </span>

              {option === status && (
                <CheckCircle2
                  size={14}
                  className="enquiry-details-selected-icon"
                />
              )}
            </button>
          ))}
        </div>
      </section>

      <div className="enquiry-details-actions">
        <div className="enquiry-details-contact-actions">
          {enquiry.email && (
            <a
              href={`mailto:${enquiry.email}`}
              className="enquiry-details-contact-button"
            >
              <Mail size={16} />
              Send Email
            </a>
          )}

          {enquiry.phoneNumber && (
            <a
              href={`tel:${enquiry.phoneNumber}`}
              className="enquiry-details-contact-button"
            >
              <Phone size={16} />
              Call
            </a>
          )}
        </div>

        <button
          type="button"
          className="enquiry-details-delete-button"
          onClick={onDelete}
          disabled={deleting}
        >
          {deleting ? (
            <>
              <Clock3
                size={16}
                className="enquiry-details-spin"
              />
              Deleting...
            </>
          ) : (
            <>
              <XCircle size={16} />
              Delete Enquiry
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default EnquiryDetails;
