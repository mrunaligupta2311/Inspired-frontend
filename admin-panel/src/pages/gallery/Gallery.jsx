 import { useEffect, useMemo, useState } from "react";
import {
  Edit3,
  ExternalLink,
  Images,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  X,
} from "lucide-react";

import apiClient from "../../api/client";
import GalleryForm from "./GalleryForm";
import "./Gallery.css";

function Gallery() {
  const [galleryItems, setGalleryItems] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [toast, setToast] = useState(null);

  /* =========================================================
     FETCH GALLERY
     ========================================================= */

  const fetchGallery = async ({
    showLoader = true,
  } = {}) => {
    try {
      if (showLoader) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      setError("");

      const response = await apiClient.get("/gallery");

      const responseData = response?.data?.data;

      let items = [];

      if (Array.isArray(responseData)) {
        items = responseData;
      } else if (Array.isArray(responseData?.items)) {
        items = responseData.items;
      } else if (Array.isArray(responseData?.gallery)) {
        items = responseData.gallery;
      }

      setGalleryItems(items);
    } catch (err) {
      console.error("Failed to load gallery:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load gallery. Please try again."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchGallery();
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
    }, 3500);
  };

  /* =========================================================
     FILTER OPTIONS
     ========================================================= */

  const categories = useMemo(() => {
    const values = galleryItems
      .map((item) => item.category)
      .filter(Boolean)
      .map((category) => String(category).trim());

    return [...new Set(values)].sort((a, b) =>
      a.localeCompare(b)
    );
  }, [galleryItems]);

  /* =========================================================
     FILTERED GALLERY
     ========================================================= */

  const filteredGallery = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return galleryItems
      .filter((item) => {
        if (!query) {
          return true;
        }

        return [
          item.title,
          item.description,
          item.category,
          item.imageUrl,
        ].some((value) =>
          String(value || "")
            .toLowerCase()
            .includes(query)
        );
      })
      .filter((item) => {
        if (categoryFilter === "ALL") {
          return true;
        }

        return (
          String(item.category || "").trim() ===
          categoryFilter
        );
      })
      .filter((item) => {
        if (statusFilter === "ALL") {
          return true;
        }

        if (statusFilter === "ACTIVE") {
          return item.isActive === true;
        }

        if (statusFilter === "INACTIVE") {
          return item.isActive === false;
        }

        return true;
      })
      .sort((a, b) => {
        const orderA = Number(a.displayOrder ?? 0);
        const orderB = Number(b.displayOrder ?? 0);

        return orderA - orderB;
      });
  }, [
    galleryItems,
    searchTerm,
    categoryFilter,
    statusFilter,
  ]);

  /* =========================================================
     COUNTS
     ========================================================= */

  const totalCount = galleryItems.length;

  const activeCount = galleryItems.filter(
    (item) => item.isActive === true
  ).length;

  const inactiveCount = galleryItems.filter(
    (item) => item.isActive === false
  ).length;

  /* =========================================================
     MODAL HANDLERS
     ========================================================= */

  const openAddModal = () => {
    setEditingItem(null);
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setModalOpen(true);
  };

  const closeModal = () => {
    if (deletingId) {
      return;
    }

    setModalOpen(false);
    setEditingItem(null);
  };

  /* =========================================================
     FORM SUCCESS
     ========================================================= */

  const handleFormSuccess = async (message) => {
    setModalOpen(false);
    setEditingItem(null);

    showToast(
      "success",
      message || "Gallery updated successfully."
    );

    await fetchGallery({
      showLoader: false,
    });
  };

  /* =========================================================
     DELETE
     ========================================================= */

  const handleDelete = async (item) => {
    if (!item?.id || deletingId) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${
        item.title || "this gallery item"
      }"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(item.id);

      await apiClient.delete(`/gallery/${item.id}`);

      setGalleryItems((currentItems) =>
        currentItems.filter(
          (galleryItem) =>
            galleryItem.id !== item.id
        )
      );

      showToast(
        "success",
        "Gallery item deleted successfully."
      );
    } catch (err) {
      console.error(
        "Failed to delete gallery item:",
        err
      );

      showToast(
        "error",
        err?.response?.data?.message ||
          err?.message ||
          "Failed to delete gallery item."
      );
    } finally {
      setDeletingId(null);
    }
  };

  /* =========================================================
     CLEAR FILTERS
     ========================================================= */

  const clearFilters = () => {
    setSearchTerm("");
    setCategoryFilter("ALL");
    setStatusFilter("ALL");
  };

  /* =========================================================
     LOADING
     ========================================================= */

  if (loading) {
    return (
      <section className="gallery-page">
        <div className="gallery-page-header">
          <div>
            <span className="gallery-page-kicker">
              CONTENT MANAGEMENT
            </span>

            <h1>Gallery</h1>

            <p>
              Manage institute photos and visual
              content displayed on the website.
            </p>
          </div>

          <div className="gallery-skeleton gallery-skeleton-button" />
        </div>

        <div className="gallery-stats">
          {[1, 2, 3].map((item) => (
            <div
              className="gallery-stat-card gallery-skeleton-card"
              key={item}
            >
              <div className="gallery-skeleton gallery-skeleton-icon" />

              <div className="gallery-skeleton gallery-skeleton-line" />

              <div className="gallery-skeleton gallery-skeleton-value" />
            </div>
          ))}
        </div>

        <div className="gallery-table-card">
          <div className="gallery-loading-list">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                className="gallery-loading-row"
                key={item}
              >
                <div className="gallery-skeleton gallery-loading-image" />

                <div className="gallery-loading-content">
                  <div className="gallery-skeleton gallery-loading-title" />

                  <div className="gallery-skeleton gallery-loading-text" />
                </div>

                <div className="gallery-skeleton gallery-loading-badge" />

                <div className="gallery-skeleton gallery-loading-actions" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  /* =========================================================
     ERROR
     ========================================================= */

  if (error) {
    return (
      <section className="gallery-page">
        <div className="gallery-page-header">
          <div>
            <span className="gallery-page-kicker">
              CONTENT MANAGEMENT
            </span>

            <h1>Gallery</h1>

            <p>
              Manage institute photos and visual
              content displayed on the website.
            </p>
          </div>

          <button
            type="button"
            className="gallery-secondary-button"
            onClick={() => fetchGallery()}
          >
            <RefreshCw size={17} />
            Retry
          </button>
        </div>

        <div className="gallery-error-state">
          <div className="gallery-error-icon">
            <Images size={24} />
          </div>

          <h2>Unable to load gallery</h2>

          <p>{error}</p>

          <button
            type="button"
            className="gallery-primary-button"
            onClick={() => fetchGallery()}
          >
            <RefreshCw size={17} />
            Try Again
          </button>
        </div>
      </section>
    );
  }

  /* =========================================================
     MAIN
     ========================================================= */

  return (
    <section className="gallery-page">
      {/* =====================================================
          PAGE HEADER
          ===================================================== */}

      <div className="gallery-page-header">
        <div>
          <span className="gallery-page-kicker">
            CONTENT MANAGEMENT
          </span>

          <h1>Gallery</h1>

          <p>
            Manage institute photos and visual content
            displayed on the website.
          </p>
        </div>

        <div className="gallery-header-actions">
          <button
            type="button"
            className="gallery-secondary-button"
            onClick={() =>
              fetchGallery({
                showLoader: false,
              })
            }
            disabled={refreshing}
            title="Refresh gallery"
          >
            <RefreshCw
              size={17}
              className={
                refreshing ? "is-spinning" : ""
              }
            />

            <span>
              {refreshing
                ? "Refreshing..."
                : "Refresh"}
            </span>
          </button>

          <button
            type="button"
            className="gallery-primary-button"
            onClick={openAddModal}
            disabled={Boolean(deletingId)}
          >
            <Plus size={18} />
            Add Image
          </button>
        </div>
      </div>

      {/* =====================================================
          STATS
          ===================================================== */}

      <div className="gallery-stats">
        <div className="gallery-stat-card">
          <div className="gallery-stat-icon gallery-stat-icon-blue">
            <Images size={20} />
          </div>

          <div>
            <span>Total Images</span>
            <strong>{totalCount}</strong>
          </div>
        </div>

        <div className="gallery-stat-card">
          <div className="gallery-stat-icon gallery-stat-icon-green">
            <Images size={20} />
          </div>

          <div>
            <span>Active</span>
            <strong>{activeCount}</strong>
          </div>
        </div>

        <div className="gallery-stat-card">
          <div className="gallery-stat-icon gallery-stat-icon-orange">
            <Images size={20} />
          </div>

          <div>
            <span>Inactive</span>
            <strong>{inactiveCount}</strong>
          </div>
        </div>
      </div>

      {/* =====================================================
          FILTERS
          ===================================================== */}

      <div className="gallery-filter-card">
        <div className="gallery-search-wrapper">
          <Search
            size={18}
            className="gallery-search-icon"
          />

          <input
            type="search"
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
            placeholder="Search images, titles, categories..."
            aria-label="Search gallery"
          />

          {searchTerm && (
            <button
              type="button"
              className="gallery-search-clear"
              onClick={() => setSearchTerm("")}
              aria-label="Clear search"
            >
              <X size={15} />
            </button>
          )}
        </div>

        <div className="gallery-filter-group">
          <select
            value={categoryFilter}
            onChange={(event) =>
              setCategoryFilter(event.target.value)
            }
            aria-label="Filter by category"
          >
            <option value="ALL">
              All Categories
            </option>

            {categories.map((category) => (
              <option
                value={category}
                key={category}
              >
                {category}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
            aria-label="Filter by status"
          >
            <option value="ALL">
              All Status
            </option>

            <option value="ACTIVE">Active</option>

            <option value="INACTIVE">
              Inactive
            </option>
          </select>

          {(searchTerm ||
            categoryFilter !== "ALL" ||
            statusFilter !== "ALL") && (
            <button
              type="button"
              className="gallery-clear-filters"
              onClick={clearFilters}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* =====================================================
          TABLE CARD
          ===================================================== */}

      <div className="gallery-table-card">
        <div className="gallery-table-header">
          <div>
            <h2>Gallery Images</h2>

            <span>
              Showing{" "}
              <strong>{filteredGallery.length}</strong>{" "}
              of <strong>{totalCount}</strong> images
            </span>
          </div>
        </div>

        {filteredGallery.length === 0 ? (
          <div className="gallery-empty-state">
            <div className="gallery-empty-icon">
              <Images size={25} />
            </div>

            <h3>
              {galleryItems.length === 0
                ? "No gallery images yet"
                : "No matching images"}
            </h3>

            <p>
              {galleryItems.length === 0
                ? "Add your first institute image to start building the gallery."
                : "Try changing your search or filter criteria."}
            </p>

            {galleryItems.length === 0 ? (
              <button
                type="button"
                className="gallery-primary-button"
                onClick={openAddModal}
              >
                <Plus size={17} />
                Add Image
              </button>
            ) : (
              <button
                type="button"
                className="gallery-secondary-button"
                onClick={clearFilters}
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="gallery-table-wrapper">
            <table className="gallery-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Order</th>
                  <th className="gallery-actions-column">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredGallery.map((item) => (
                  <tr key={item.id}>
                    {/* IMAGE */}

                    <td>
                      <div className="gallery-image-cell">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={
                              item.title ||
                              "Gallery image"
                            }
                            onError={(event) => {
                              event.currentTarget.onerror =
                                null;

                              event.currentTarget.style.display =
                                "none";
                            }}
                          />
                        ) : (
                          <div className="gallery-image-placeholder">
                            <Images size={20} />
                          </div>
                        )}
                      </div>
                    </td>

                    {/* TITLE */}

                    <td>
                      <div className="gallery-title-cell">
                        <strong>
                          {item.title ||
                            "Untitled Image"}
                        </strong>

                        {item.imageUrl && (
                          <a
                            href={item.imageUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="gallery-image-link"
                          >
                            View image
                            <ExternalLink size={13} />
                          </a>
                        )}
                      </div>
                    </td>

                    {/* CATEGORY */}

                    <td>
                      {item.category ? (
                        <span className="gallery-category-badge">
                          {item.category}
                        </span>
                      ) : (
                        <span className="gallery-muted">
                          —
                        </span>
                      )}
                    </td>

                    {/* DESCRIPTION */}

                    <td>
                      <div className="gallery-description-cell">
                        {item.description ? (
                          item.description
                        ) : (
                          <span className="gallery-muted">
                            No description
                          </span>
                        )}
                      </div>
                    </td>

                    {/* STATUS */}

                    <td>
                      <span
                        className={`gallery-status-badge ${
                          item.isActive
                            ? "active"
                            : "inactive"
                        }`}
                      >
                        <span className="gallery-status-dot" />

                        {item.isActive
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </td>

                    {/* ORDER */}

                    <td>
                      <span className="gallery-order">
                        {Number(
                          item.displayOrder ?? 0
                        )}
                      </span>
                    </td>

                    {/* ACTIONS */}

                    <td>
                      <div className="gallery-row-actions">
                        <button
                          type="button"
                          className="gallery-icon-button edit"
                          onClick={() =>
                            openEditModal(item)
                          }
                          disabled={Boolean(deletingId)}
                          aria-label={`Edit ${
                            item.title ||
                            "gallery image"
                          }`}
                          title="Edit"
                        >
                          <Edit3 size={16} />
                        </button>

                        <button
                          type="button"
                          className="gallery-icon-button delete"
                          onClick={() =>
                            handleDelete(item)
                          }
                          disabled={Boolean(
                            deletingId
                          )}
                          aria-label={`Delete ${
                            item.title ||
                            "gallery image"
                          }`}
                          title="Delete"
                        >
                          {deletingId === item.id ? (
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
        )}
      </div>

      {/* =====================================================
          MODAL
          ===================================================== */}

      {modalOpen && (
        <div
          className="gallery-modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeModal();
            }
          }}
        >
          <div
            className="gallery-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="gallery-modal-title"
          >
            <div className="gallery-modal-header">
              <div>
                <span className="gallery-modal-kicker">
                  GALLERY MANAGEMENT
                </span>

                <h2 id="gallery-modal-title">
                  {editingItem
                    ? "Edit Gallery Image"
                    : "Add Gallery Image"}
                </h2>

                <p>
                  {editingItem
                    ? "Update the selected gallery image."
                    : "Add a new image to the institute gallery."}
                </p>
              </div>

              <button
                type="button"
                className="gallery-modal-close"
                onClick={closeModal}
                disabled={Boolean(deletingId)}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <div className="gallery-modal-body">
              <GalleryForm
                item={editingItem}
                onSuccess={handleFormSuccess}
                onCancel={closeModal}
              />
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          TOAST
          ===================================================== */}

      {toast?.message && (
        <div
          className={`gallery-toast ${
            toast.type === "error"
              ? "error"
              : "success"
          }`}
          role="status"
          aria-live="polite"
        >
          <span className="gallery-toast-indicator" />

          <span>{toast.message}</span>
        </div>
      )}
    </section>
  );
}

export default Gallery;