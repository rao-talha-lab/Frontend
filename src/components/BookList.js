import React from "react";
import BookCard from "./BookCard";

function BookList({ books, loading, error, onDeleted, onToast }) {
  // ── Loading state ──
  if (loading) {
    return (
      <div className="loading-container" role="status" aria-live="polite">
        <div className="spinner" aria-hidden="true" />
        <p className="loading-text">Fetching your book collection…</p>
      </div>
    );
  }

  // ── Error state ──
  if (error) {
    return (
      <div className="error-container" role="alert">
        <span className="error-icon" aria-hidden="true">⚠️</span>
        <div className="error-content">
          <h4>Failed to Load Books</h4>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // ── Empty state ──
  if (books.length === 0) {
    return (
      <div className="empty-state" aria-live="polite">
        <span className="empty-icon" aria-hidden="true">📚</span>
        <p className="empty-title">Your shelf is empty</p>
        <p className="empty-subtitle">
          Add your first book using the form above to start building your collection.
        </p>
      </div>
    );
  }

  // ── Populated state ──
  return (
    <div
      className="book-grid"
      role="list"
      aria-label={`Book collection — ${books.length} book${books.length !== 1 ? "s" : ""}`}
    >
      {books.map((book, index) => (
        <div
          key={book._id}
          role="listitem"
          style={{ animationDelay: `${index * 0.06}s` }}
        >
          <BookCard book={book} onDeleted={onDeleted} onToast={onToast} />
        </div>
      ))}
    </div>
  );
}

export default BookList;
