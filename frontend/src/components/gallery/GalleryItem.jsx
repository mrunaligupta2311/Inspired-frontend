import "./GalleryItem.css";

function GalleryItem({
  image,
  title,
  category = "Institute",
}) {
  return (
    <article className="gallery-item">
      {image ? (
        <img src={image} alt={title} loading="lazy" />
      ) : (
        <div className="gallery-item__placeholder">
          <span>Inspired Institute</span>
        </div>
      )}

      <div className="gallery-item__overlay">
        <span className="gallery-item__category">{category}</span>
        <h3 className="gallery-item__title">{title}</h3>
      </div>
    </article>
  );
}

export default GalleryItem;