import type { TIsbn } from "./types";
import {
	fetchBook,
	renderBookDetail,
	updateFavoriteCounter,
	favoriteCounterElement,
} from "./functions";

const params: URLSearchParams = new URLSearchParams(window.location.search);
const isbn: TIsbn = params.get("isbn") ?? "-";

const book = await fetchBook(isbn);

const bookDetailElement = document.getElementById(
	"book-detail-body",
) as HTMLElement;

renderBookDetail(book, bookDetailElement);

updateFavoriteCounter(favoriteCounterElement);
