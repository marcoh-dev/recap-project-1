export const API_BASE_URL =
	typeof process !== "undefined" && process.env?.PUBLIC_API_URL
		? process.env.PUBLIC_API_URL
		: "http://localhost:4730";
export const API_BOOKS_URL = API_BASE_URL + "/books";
export const API_BOOK_URL = API_BASE_URL + "/books/";
export const LOCAL_STORAGE_PUBLISHER_KEY = "publishers";
