import React, { useState, useEffect, useCallback } from "react";
import BookForm from "./components/BookForm";
import BookList from "./components/BookList";
import { getAllBooks } from "./services/api";

/**
 * App — Root component
 * Manages the global state: books array, loading, error, and toast.
 * All API calls flow through here (or are delegated to child components).
 */
function App() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null); // { message, type }

  // ── Fetch all books on mount ──────────────────────────────────────────────────
  const fetchBooks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllBooks();
      setBooks(response.data.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to connect to the server. Make sure the backend is running on port 5000."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  // ── Toast system ──────────────────────────────────────────────────────────────
  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // ── Handlers passed to children ───────────────────────────────────────────────
  const handleBookAdded = useCallback((newBook) => {
    setBooks((prev) => [newBook, ...prev]);
  }, []);

  const handleBookDeleted = useCallback((deletedId) => {
    setBooks((prev) => prev.filter((b) => b._id !== deletedId));
  }, []);

  // ── Derived stats ─────────────────────────────────────────────────────────────
  const uniqueAuthors = new Set(books.map((b) => b.author)).size;
  const uniqueGenres = new Set(books.map((b) => b.genre).filter(Boolean)).size;

  return (
    <div className="app-wrapper">
      <div className="app-container">
        {/* ── Header ── */}
        <header className="app-header">
          <div className="header-badge">
            <span>📚</span> MERN Stack App
          </div>
          <h1 className="app-title">My BookShelf</h1>
          <p className="app-subtitle">
            Curate your personal reading list — add books, track authors, and
            explore your collection.
          </p>
          <div className="header-divider" aria-hidden="true" />
        </header>

        {/* ── Stats Bar ── */}
        {!loading && !error && (
          <div className="stats-bar" role="region" aria-label="Collection statistics">
            <div className="stat-item">
              <div className="stat-value">{books.length}</div>
              <div className="stat-label">Books</div>
            </div>
            <div className="stat-divider" aria-hidden="true" />
            <div className="stat-item">
              <div className="stat-value">{uniqueAuthors}</div>
              <div className="stat-label">Authors</div>
            </div>
            <div className="stat-divider" aria-hidden="true" />
            <div className="stat-item">
              <div className="stat-value">{uniqueGenres}</div>
              <div className="stat-label">Genres</div>
            </div>
          </div>
        )}

        {/* ── Add Book Form ── */}
        <BookForm onBookAdded={handleBookAdded} onToast={showToast} />

        {/* ── Book List ── */}
        <section className="list-section" aria-label="Your book collection">
          <h2 className="section-title">Your Collection</h2>
          <BookList
            books={books}
            loading={loading}
            error={error}
            onDeleted={handleBookDeleted}
            onToast={showToast}
          />
        </section>
      </div>

      {/* ── Toast Notification ── */}
      {toast && (
        <div
          className={`toast ${toast.type}`}
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}

export default App;
