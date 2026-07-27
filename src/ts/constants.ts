export const API_BASE_URL =
	location.hostname === "localhost"
		? "http://localhost:4730"
		: "https://api5.angular-buch.com";
export const API_BOOKS_URL = API_BASE_URL + "/books";
export const API_BOOK_URL = API_BASE_URL + "/books/";
export const LOCAL_STORAGE_PUBLISHER_KEY = "publishers";
