import {
	fetchBooks,
	renderPublisherFilterOptions,
	updateBookList,
	getFilteredBooks,
	updateFavoriteCounter,
	favoriteCounterElement,
	getFavoriteBooks,
} from "./functions";
import { slugify } from "./helper";
import type { IBook, TPublisher } from "./types";

let books = await fetchBooks();
const favoritesOnly: boolean =
	document.body.dataset.page === "favorites" ? true : false;
if (favoritesOnly) {
	books = getFavoriteBooks(books);
}

const bookListCounterElement = document.getElementById(
	"book-counter",
) as HTMLHeadingElement;

updateFavoriteCounter(favoriteCounterElement);

const bookListElement = document.getElementById(
	"book-list-body",
) as HTMLElement;

let searchByTitleValue: string = "";
let filterByPublisher: string = "";
let filteredBooks: IBook[] = books;

const publishers: Record<string, TPublisher> = Object.fromEntries(
	[...new Set(filteredBooks.map((book) => book.publisher))]
		.sort()
		.map((publisher) => [slugify(publisher), publisher]),
);

const titleSearchElement = document.getElementById(
	"search",
) as HTMLInputElement;
titleSearchElement.addEventListener("input", (event: InputEvent) => {
	const titleField = event.target as HTMLInputElement;
	searchByTitleValue = titleField.value.toLowerCase();

	filteredBooks = getFilteredBooks(
		books,
		publishers,
		searchByTitleValue,
		filterByPublisher,
	);
	updateBookList(
		filteredBooks,
		bookListElement,
		bookListCounterElement,
		favoritesOnly,
	);
});

const publisherFilterElement = document.getElementById(
	"by-publisher",
) as HTMLSelectElement;
publisherFilterElement.addEventListener("input", (event: InputEvent) => {
	const publisher = event.target as HTMLSelectElement;
	filterByPublisher = publisher.value;

	filteredBooks = getFilteredBooks(
		books,
		publishers,
		searchByTitleValue,
		filterByPublisher,
	);
	updateBookList(
		filteredBooks,
		bookListElement,
		bookListCounterElement,
		favoritesOnly,
	);
});

renderPublisherFilterOptions(publishers, publisherFilterElement);
updateBookList(
	filteredBooks,
	bookListElement,
	bookListCounterElement,
	favoritesOnly,
);
