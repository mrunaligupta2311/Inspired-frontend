import { useEffect, useRef, useState } from "react";
import {
  ImagePlus,
  LoaderCircle,
  Save,
  UploadCloud,
  Video,
  X,
  FileVideo,
  FileImage,
} from "lucide-react";
import apiClient from "../../api/client";

const GalleryForm = ({ item, onSuccess, onClose }) => {
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    title: item?.title || "",
    description: item?.description || "",
    category: item?.category || "",
    displayOrder: item?.displayOrder ?? 0,
    isActive: item?.isActive ?? true,
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(
    item?.mediaUrl || item?.imageUrl || ""
  );
  const [previewType, setPreviewType] = useState(
    item?.mediaType || "IMAGE"
  );

  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const isEditing = Boolean(item);

  useEffect(() => {
    return () => {
      if (previewUrl && selectedFile) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl, selectedFile]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const processFile = (file) => {
    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/jpg",
      "video/mp4",
      "video/webm",
      "video/quicktime",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Please select a JPG, PNG, WEBP, MP4, WEBM, or MOV file.");
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      setError("Maximum file size is 100 MB.");
      return;
    }

    setError("");

    if (previewUrl && selectedFile) {
      URL.revokeObjectURL(previewUrl);
    }

    const url = URL.createObjectURL(file);
    const type = file.type.startsWith("video/") ? "VIDEO" : "IMAGE";

    setSelectedFile(file);
    setPreviewUrl(url);
    setPreviewType(type);
  };

  const handleFileChange = (event) => {
    processFile(event.target.files?.[0]);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);

    processFile(event.dataTransfer.files?.[0]);
  };

  const removeSelectedFile = () => {
    if (previewUrl && selectedFile) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedFile(null);
    setPreviewUrl(item?.mediaUrl || item?.imageUrl || "");
    setPreviewType(item?.mediaType || "IMAGE");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 KB";

    const mb = bytes / (1024 * 1024);

    if (mb >= 1) {
      return `${mb.toFixed(1)} MB`;
    }

    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  };

  const uploadMedia = async () => {
    if (!selectedFile) {
      return null;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    setUploading(true);

    try {
      const response = await apiClient.post(
        "/gallery/upload",
        formData,
        {
          headers: {
            "Content-Type": undefined,
          },
        }
      );

      return response.data.data;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!isEditing && !selectedFile) {
      setError("Please select an image or video.");
      return;
    }

    setSaving(true);

    try {
      let mediaData = null;

      if (selectedFile) {
        mediaData = await uploadMedia();
      }

      const payload = {
        title: form.title.trim() || null,
        description: form.description.trim() || null,
        category: form.category.trim() || null,
        displayOrder: Number(form.displayOrder) || 0,
        isActive: form.isActive,
      };

      if (mediaData) {
        payload.mediaUrl = mediaData.mediaUrl;
        payload.mediaType = mediaData.mediaType;
        payload.cloudinaryPublicId = mediaData.cloudinaryPublicId;
      }

      if (isEditing) {
        await apiClient.patch(`/gallery/${item.id}`, payload);
      } else {
        await apiClient.post("/gallery", payload);
      }

      onSuccess();
    } catch (requestError) {
      setError(
        requestError?.message ||
          requestError?.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const busy = uploading || saving;

  return (
    <form className="gallery-form" onSubmit={handleSubmit}>
      <div className="gallery-form-body">
        {error && (
          <div className="gallery-form-error">
            <span>{error}</span>
          </div>
        )}

        <section className="gallery-form-media-section">
          <div className="gallery-form-section-heading">
            <div>
              <h3>Media</h3>
              <p>
                Upload a high-quality image or video for your gallery.
              </p>
            </div>

            <span className="gallery-form-required">Required</span>
          </div>

          {!previewUrl ? (
            <div
              className={`gallery-media-dropzone ${
                isDragging ? "is-dragging" : ""
              }`}
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  fileInputRef.current?.click();
                }
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.webp,.mp4,.webm,.mov"
                onChange={handleFileChange}
                className="gallery-media-input"
              />

              <div className="gallery-media-drop-icon">
                <UploadCloud size={26} strokeWidth={1.8} />
              </div>

              <div className="gallery-media-drop-content">
                <strong>Drop your media here</strong>
                <span>or click to browse from your device</span>
              </div>

              <div className="gallery-media-format-list">
                <span>
                  <FileImage size={14} />
                  JPG / PNG / WEBP
                </span>
                <span>
                  <FileVideo size={14} />
                  MP4 / WEBM / MOV
                </span>
                <span>Max 100 MB</span>
              </div>
            </div>
          ) : (
            <div className="gallery-media-preview-card">
              <div className="gallery-media-preview">
                {previewType === "VIDEO" ? (
                  <video
                    src={previewUrl}
                    controls
                    playsInline
                    preload="metadata"
                  />
                ) : (
                  <img src={previewUrl} alt="Gallery preview" />
                )}

                <div className="gallery-media-preview-badge">
                  {previewType === "VIDEO" ? (
                    <>
                      <Video size={14} />
                      Video
                    </>
                  ) : (
                    <>
                      <ImagePlus size={14} />
                      Image
                    </>
                  )}
                </div>

                <button
                  type="button"
                  className="gallery-media-remove"
                  onClick={removeSelectedFile}
                  aria-label="Remove media"
                  disabled={busy}
                >
                  <X size={17} />
                </button>
              </div>

              <div className="gallery-media-file-info">
                <div className="gallery-media-file-icon">
                  {previewType === "VIDEO" ? (
                    <FileVideo size={19} />
                  ) : (
                    <FileImage size={19} />
                  )}
                </div>

                <div className="gallery-media-file-details">
                  <strong>
                    {selectedFile?.name ||
                      "Existing gallery media"}
                  </strong>

                  <span>
                    {selectedFile
                      ? formatFileSize(selectedFile.size)
                      : "Currently uploaded media"}
                  </span>
                </div>

                <button
                  type="button"
                  className="gallery-media-change"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={busy}
                >
                  Replace
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,.mp4,.webm,.mov"
                  onChange={handleFileChange}
                  className="gallery-media-input"
                />
              </div>
            </div>
          )}
        </section>

        <div className="gallery-form-divider" />

        <section className="gallery-form-details-section">
          <div className="gallery-form-section-heading">
            <div>
              <h3>Gallery details</h3>
              <p>
                Add the information visitors will see with this media.
              </p>
            </div>
          </div>

          <div className="gallery-form-grid">
            <div className="gallery-form-field gallery-form-field-full">
              <label htmlFor="gallery-title">Title</label>
              <input
                id="gallery-title"
                name="title"
                type="text"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Annual Science Exhibition"
                disabled={busy}
              />
            </div>

            <div className="gallery-form-field">
              <label htmlFor="gallery-category">Category</label>
              <input
                id="gallery-category"
                name="category"
                type="text"
                value={form.category}
                onChange={handleChange}
                placeholder="e.g. Events"
                disabled={busy}
              />
            </div>

            <div className="gallery-form-field">
              <label htmlFor="gallery-order">Display order</label>
              <input
                id="gallery-order"
                name="displayOrder"
                type="number"
                min="0"
                value={form.displayOrder}
                onChange={handleChange}
                disabled={busy}
              />
            </div>

            <div className="gallery-form-field gallery-form-field-full">
              <label htmlFor="gallery-description">
                Description
              </label>

              <textarea
                id="gallery-description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Briefly describe this gallery item..."
                rows={4}
                disabled={busy}
              />
            </div>
          </div>

          <label className="gallery-form-active-toggle">
            <input
              type="checkbox"
              name="isActive"
              checked={form.isActive}
              onChange={handleChange}
              disabled={busy}
            />

            <span className="gallery-form-toggle-ui" />

            <span className="gallery-form-toggle-copy">
              <strong>Publish to website</strong>
              <small>
                Active gallery items are visible on the public website.
              </small>
            </span>
          </label>
        </section>
      </div>

      <div className="gallery-form-footer">
        <button
          type="button"
          className="gallery-form-cancel"
          onClick={onClose}
          disabled={busy}
        >
          Cancel
        </button>

        <button
          type="submit"
          className="gallery-form-submit"
          disabled={busy}
        >
          {busy ? (
            <>
              <LoaderCircle
                size={17}
                className="gallery-form-spinner"
              />
              {uploading ? "Uploading..." : "Saving..."}
            </>
          ) : (
            <>
              <Save size={17} />
              {isEditing ? "Save Changes" : "Add to Gallery"}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default GalleryForm;
