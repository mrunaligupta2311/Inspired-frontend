import { Award } from "lucide-react";

import "./ResultCard.css";

function ResultCard({
  image,
  category = "Achievement",
  score,
  student,
  achievement,
  badge,
}) {
  return (
    <article className="result-card">
      {image ? (
        <img
          className="result-card__image"
          src={image}
          alt={`${student} achievement`}
          loading="lazy"
        />
      ) : (
        <div className="result-card__placeholder">
          <div className="result-card__placeholder-icon">
            <Award size={34} strokeWidth={1.4} />
          </div>
        </div>
      )}

      <div className="result-card__overlay" />

      {badge && (
        <span className="result-card__badge">
          {badge}
        </span>
      )}

      <div className="result-card__content">
        <span className="result-card__category">
          {category}
        </span>

        <h3 className="result-card__score">
          {score}
        </h3>

        <p className="result-card__student">
          {student}
        </p>

        <p className="result-card__achievement">
          {achievement}
        </p>
      </div>
    </article>
  );
}

export default ResultCard;