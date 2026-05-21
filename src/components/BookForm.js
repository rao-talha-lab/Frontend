import React, { useState } from "react";
import { addBook } from "../services/api";

const GENRES = [
  "Fiction",
  "Non-Fiction",
  "Science Fiction",
  "Fantasy",
  "Mystery",
  "Thriller",
  "Biography",
  "History",
  "Romance",
  "Self-Help",
  "Horror",
  "Poetry",
  "Uncategorized",
];

const INITIAL_FORM = {
  title: "",
  author: "",
  genre: "Uncategorized",
  year: "",
  description: "",
};

function BookForm({ onBookAdded, onToast }) {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.author.trim()) newErrors.author = "Author is required";
    if (formData.year && (isNaN(formData.year) || formData.year < 1000 || formData.year > new Date().getFullYear())) {
      newErrors.year = `Year must be between 1000 and ${new Date().getFullYear()}`;
    }
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const payload = {
        title: formData.title.trim(),
        author: formData.author.trim(),
        genre: formData.genre,
        year: formData.year ? parseInt(formData.year) : undefined,
        description: formData.description.trim(),
      };

      const response = await addBook(payload);
      onBookAdded(response.data.data);
      setFormData(INITIAL_FORM);
      setErrors({});
      onToast(" Book added to your collection!", "success");
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to add book. Is the server running?";
      onToast(` ${message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="form-section" aria-label="Add a new book">
      <h2 className="section-title">Add New Book</h2>
      <div className="form-card">
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-grid">
            {/* Title */}
            <div className="form-group">
              <label htmlFor="title" className="form-label">
                Title <span>*</span>
              </label>
              <input
                id="title"
                name="title"
                type="text"
                className="form-input"
                placeholder="e.g. The Great Gatsby"
                value={formData.title}
                onChange={handleChange}
                disabled={loading}
                aria-required="true"
                aria-describedby={errors.title ? "title-error" : undefined}
              />
              {errors.title && (
                <span id="title-error" style={{ color: "var(--accent-danger)", fontSize: "0.8rem" }}>
                  {errors.title}
                </span>
              )}
            </div>

            {/* Author */}
            <div className="form-group">
              <label htmlFor="author" className="form-label">
                Author <span>*</span>
              </label>
              <input
                id="author"
                name="author"
                type="text"
                className="form-input"
                placeholder="e.g. F. Scott Fitzgerald"
                value={formData.author}
                onChange={handleChange}
                disabled={loading}
                aria-required="true"
                aria-describedby={errors.author ? "author-error" : undefined}
              />
              {errors.author && (
                <span id="author-error" style={{ color: "var(--accent-danger)", fontSize: "0.8rem" }}>
                  {errors.author}
                </span>
              )}
            </div>

            {/* Genre */}
            <div className="form-group">
              <label htmlFor="genre" className="form-label">
                Genre
              </label>
              <select
                id="genre"
                name="genre"
                className="form-select"
                value={formData.genre}
                onChange={handleChange}
                disabled={loading}
              >
                {GENRES.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            {/* Year */}
            <div className="form-group">
              <label htmlFor="year" className="form-label">
                Publication Year
              </label>
              <input
                id="year"
                name="year"
                type="number"
                className="form-input"
                placeholder={`e.g. ${new Date().getFullYear()}`}
                value={formData.year}
                onChange={handleChange}
                disabled={loading}
                min="1000"
                max={new Date().getFullYear()}
                aria-describedby={errors.year ? "year-error" : undefined}
              />
              {errors.year && (
                <span id="year-error" style={{ color: "var(--accent-danger)", fontSize: "0.8rem" }}>
                  {errors.year}
                </span>
              )}
            </div>

            {/* Description */}
            <div className="form-group full-width">
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                className="form-textarea"
                placeholder="A brief summary or your thoughts about this book..."
                value={formData.description}
                onChange={handleChange}
                disabled={loading}
                maxLength={500}
              />
            </div>
          </div>

          <div className="form-actions">
            <button
              id="submit-book-btn"
              type="submit"
              className="btn-submit"
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? (
                <>
                  <span className="btn-icon">⏳</span> Adding...
                </>
              ) : (
                <>
                  <span className="btn-icon">📖</span> Add to Collection
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default BookForm;
