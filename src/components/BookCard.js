import React, { useState } from "react";
import { deleteBook } from "../services/api";
function BookCard({ book, onDeleted, onToast }) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm(`Remove "${book.title}" from your collection?`)) return;

    setDeleting(true);
    try {
      await deleteBook(book._id);
      onDeleted(book._id);
      onToast(`"${book.title}" was removed.`, "success");
    } catch (err) {
      onToast(" Failed to delete book. Please try again.", "error");
      setDeleting(false);
    }
  };

  return (
    <article className="book-card" aria-label={`Book: ${book.title}`}>
      <div className="book-card-header">
        <div className="book-meta">
          <h3 className="book-title" title={book.title}>
            {book.title}
          </h3>
          <p className="book-author">{book.author}</p>
        </div>
        {book.genre && book.genre !== "Uncategorized" && (
          <span className="book-genre-badge">{book.genre}</span>
        )}
      </div>

      {book.description && (
        <p className="book-description">{book.description}</p>
      )}

      <div className="book-footer">
        <span className="book-year">
          {book.year ? (
            <>{book.year}</>
          ) : (
            <> Year unknown</>
          )}
        </span>
        <button
          id={`delete-btn-${book._id}`}
          className="btn-delete"
          onClick={handleDelete}
          disabled={deleting}
          aria-label={`Delete ${book.title}`}
          aria-busy={deleting}
        >
          {deleting ? (
            <>Removing…</>
          ) : (
            <> Delete</>
          )}
        </button>
      </div>
    </article>
  );
}

export default BookCard;
