import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

// ─── Book API Calls ────────────────────────────────────────────────────────────

/** Fetch all books from the API */
export const getAllBooks = () => api.get("/books");

/** Add a new book */
export const addBook = (bookData) => api.post("/books", bookData);

/** Delete a book by ID */
export const deleteBook = (id) => api.delete(`/books/${id}`);

export default api;
