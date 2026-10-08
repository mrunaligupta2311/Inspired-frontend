import "./FacultyCard.css";

function FacultyCard({
  image,
  name,
  subject,
  experience,
  description,
}) {
  return (
    <article className="faculty-card">
      <div className="faculty-card__image">
        {image ? (
          <img src={image} alt={`${name} - ${subject} faculty`} />
        ) : (
          <div className="faculty-card__placeholder">
            <span>Faculty</span>
          </div>
        )}
      </div>

      <div className="faculty-card__content">
        <span className="faculty-card__subject">{subject}</span>

        <h3 className="faculty-card__name">{name}</h3>

        {experience && (
          <span className="faculty-card__experience">
            {experience} Experience
          </span>
        )}

        {description && (
          <p className="faculty-card__description">{description}</p>
        )}
      </div>
    </article>
  );
}

export default FacultyCard;