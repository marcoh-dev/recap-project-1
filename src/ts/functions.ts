import type { IBook, TIsbn, TPublisher } from "./types";
import {
	API_BOOKS_URL,
	API_BOOK_URL,
	LOCAL_STORAGE_PUBLISHER_KEY,
} from "./constants";
import {
	addLocalStorageValue,
	getLocalStorageValues,
	removeLocalStorageValue,
} from "./helper";
import { FAVORITE_ICON } from "./icons";

export const favoriteCounterElement = document.getElementById(
	"favorite-counter",
) as HTMLSpanElement;

export async function fetchBooks(): Promise<IBook[]> {
	const response = await fetch(API_BOOKS_URL);
	const data: IBook[] = await response.json();
	return data;
}
export async function fetchBook(isbn: TIsbn): Promise<IBook> {
	const response = await fetch(API_BOOK_URL + isbn);
	const data: IBook = await response.json();
	return data;
}

export function renderPublisherFilterOptions(
	publishers: Record<string, string>,
	targetElement: HTMLSelectElement,
): void {
	targetElement.innerHTML = "";
	const defaultOptionElement = document.createElement(
		"option",
	) as HTMLOptionElement;
	defaultOptionElement.value = "";
	defaultOptionElement.textContent = "-";
	targetElement.append(defaultOptionElement);

	for (const [slug, publisher] of Object.entries(publishers)) {
		const optionElement = document.createElement("option") as HTMLOptionElement;
		optionElement.value = slug;
		optionElement.textContent = publisher;

		targetElement.append(optionElement);
	}
}

export function updateFavoriteCounter(
	favoriteCounterElement: HTMLElement,
): void {
	favoriteCounterElement.textContent = String(
		getLocalStorageValues(LOCAL_STORAGE_PUBLISHER_KEY).length,
	);
}

export function renderBookList(
	books: IBook[],
	targetElement: HTMLElement,
	bookListCounterElement: HTMLElement,
	favoritesOnly: boolean,
): void {
	targetElement.innerHTML = "";
	books.forEach((book) => {
		const tableRow = document.createElement("tr") as HTMLTableRowElement;
		const tableCellContents: (string | HTMLButtonElement)[] = [];
		const favoriteButton = document.createElement("button") as HTMLButtonElement;
		favoriteButton.className = "button button-clear fav-btn";
		favoriteButton.innerHTML = favoritesOnly
			? FAVORITE_ICON.remove
			: new Set(getLocalStorageValues(LOCAL_STORAGE_PUBLISHER_KEY)).has(book.isbn)
				? FAVORITE_ICON.checked
				: FAVORITE_ICON.default;
		favoriteButton.addEventListener("click", (event: MouseEvent) => {
			if (favoritesOnly) {
				removeLocalStorageValue(book.isbn, LOCAL_STORAGE_PUBLISHER_KEY);
				tableRow.remove();
				books = books.filter((b) => b.isbn !== book.isbn);
			} else {
				if (
					new Set(getLocalStorageValues(LOCAL_STORAGE_PUBLISHER_KEY)).has(book.isbn)
				) {
					removeLocalStorageValue(book.isbn, LOCAL_STORAGE_PUBLISHER_KEY);
					favoriteButton.innerHTML = FAVORITE_ICON.default;
				} else {
					addLocalStorageValue(book.isbn, LOCAL_STORAGE_PUBLISHER_KEY);
					favoriteButton.innerHTML = FAVORITE_ICON.checked;
				}
			}
			updateFavoriteCounter(favoriteCounterElement);
			renderBookCounter(books, bookListCounterElement, favoritesOnly);
		});

		const detailPageButton = document.createElement("button") as HTMLButtonElement;
		detailPageButton.className = "button";
		detailPageButton.onclick = () => (location.href = `/detail?isbn=${book.isbn}`);
		detailPageButton.textContent = "Detail";

		tableCellContents.push(
			favoriteButton,
			book.title,
			book.isbn,
			book.author,
			book.publisher,
			detailPageButton,
		);

		tableCellContents.forEach((cell) => {
			const tableCell = document.createElement("td") as HTMLTableCellElement;

			if (cell instanceof HTMLButtonElement) {
				tableCell.append(cell);
			} else {
				tableCell.textContent = cell;
			}

			tableRow.append(tableCell);
			targetElement.append(tableRow);
		});
	});
}

export function renderBookCounter(
	books: IBook[],
	bookListCounterElement: HTMLElement,
	favoritesOnly: boolean,
): void {
	const descriptiveWord = favoritesOnly ? "Favorite" : "Book";
	bookListCounterElement.textContent = `${books.length} ${descriptiveWord}${books.length !== 1 ? `s` : ``}`;
}

export function updateBookList(
	books: IBook[],
	targetElement: HTMLElement,
	bookListCounterElement: HTMLElement,
	favoritesOnly: boolean,
): void {
	renderBookList(books, targetElement, bookListCounterElement, favoritesOnly);
	renderBookCounter(books, bookListCounterElement, favoritesOnly);
}

export function getFilteredBooks(
	books: IBook[],
	publishers: Record<string, TPublisher>,
	searchByTitleValue: string,
	filterByPublisher: string,
) {
	return books.filter(
		(book) =>
			(searchByTitleValue === "" ||
				book.title.toLowerCase().includes(searchByTitleValue.toLowerCase())) &&
			(filterByPublisher === "" || book.publisher === publishers[filterByPublisher]),
	);
}

export function renderBookDetail(
	book: IBook,
	targetElement: HTMLElement,
): void {
	targetElement.innerHTML = "";

	const bookHeadline = document.createElement("h1") as HTMLHeadingElement;
	bookHeadline.innerHTML = `${book.title}<br><small>${book.subtitle}</small>`;

	const bookRow = document.createElement("section") as HTMLElement;
	bookRow.className = "row";

	const bookColumn67 = document.createElement("div") as HTMLDivElement;
	bookColumn67.className = "column column-67";

	const bookColumn33 = document.createElement("div") as HTMLDivElement;
	bookColumn33.className = "column column-33";

	const bookCover = document.createElement("img") as HTMLImageElement;
	bookCover.src = book.cover;
	bookCover.alt = `book cover of "${book.title}"`;

	const bookHeadlineAbstract = document.createElement("h3") as HTMLHeadingElement;
	bookHeadlineAbstract.textContent = "Abstract";

	const bookAbstract = document.createElement("p") as HTMLParagraphElement;
	bookAbstract.textContent = book.abstract;

	const bookHeadlineDetails = document.createElement("h4") as HTMLHeadingElement;
	bookHeadlineDetails.textContent = "Details";

	const bookDetailsUList = document.createElement("ul") as HTMLUListElement;
	const bookDetailsUListContents: (string | number)[][] = [];
	bookDetailsUListContents.push(
		["Author", book.author],
		["Publisher", book.publisher],
		["Pages", book.numPages],
	);

	bookDetailsUListContents.forEach(([label, value]) => {
		const listElement = document.createElement("li") as HTMLLIElement;
		listElement.innerHTML = `<strong>${label}:</strong> ${value}`;

		bookDetailsUList.append(listElement);
	});

	const backButton = document.createElement("button") as HTMLButtonElement;
	backButton.textContent = "Back";
	backButton.className = "button button-outline";
	backButton.onclick = () => (location.href = "/");

	bookColumn67.append(
		bookHeadlineAbstract,
		bookAbstract,
		bookHeadlineDetails,
		bookDetailsUList,
		backButton,
	);

	bookColumn33.append(bookCover);

	bookRow.append(bookColumn67, bookColumn33);

	targetElement.append(bookHeadline, bookRow);
}

export function getFavoriteBooks(filteredBooks: IBook[]): IBook[] {
	const favoriteIsbnSet = new Set(
		getLocalStorageValues(LOCAL_STORAGE_PUBLISHER_KEY),
	);
	return filteredBooks.filter((book) => favoriteIsbnSet.has(book.isbn));
}
