export type TPublisher = string;
export type TIsbn = string;
export type TId = string | number;

export interface IBook {
	id: TId;
	title: string;
	subtitle: string;
	isbn: TIsbn;
	abstract: string;
	author: string;
	publisher: TPublisher;
	price: string;
	numPages: number;
	cover: string;
	userId: 1;
}
