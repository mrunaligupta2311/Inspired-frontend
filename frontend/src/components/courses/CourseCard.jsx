import "./CourseCard.css";

function CourseCard({
  number,
  icon: Icon,
  title,
  description,
  tags = [],
  link = "/courses",
}) {
  return (
    <article className="course-card">
      <span className="course-card__number">
        {String(number).padStart(2, "0")}
      </span>

      {Icon && (
        <div className="course-card__icon">
          <Icon size={22} strokeWidth={1.8} />
        </div>
      )}

      <h3 className="course-card__title">{title}</h3>

      <p className="course-card__description">{description}</p>

      {tags.length > 0 && (
        <div className="course-card__meta">
          {tags.map((tag) => (
            <span className="course-card__tag" key={tag}>
              {tag}
            </span>
          ))}
        </div>
      )}

      <a href={link} className="course-card__link">
        Explore Courses
        <span aria-hidden="true">→</span>
      </a>
    </article>
  );
}

export default CourseCard;