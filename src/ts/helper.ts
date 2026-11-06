import type { TIsbn } from "./types";

export function slugify(value: string): string {
	return value
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9\s-]/g, "")
		.replace(/\s+/g, "-")
		.replace(/-+/g, "-");
}

export function getLocalStorageValues(storageKey: string): TIsbn[] {
	const storedValues = localStorage.getItem(storageKey);
	return storedValues ? JSON.parse(storedValues) : [];
}

export function saveLocalStorageValues(
	values: TIsbn[],
	storageKey: string,
): void {
	localStorage.setItem(storageKey, JSON.stringify(values));
}

export function addLocalStorageValue(value: TIsbn, storageKey: string): void {
	const values = getLocalStorageValues(storageKey);

	if (!values.includes(value)) {
		values.push(value);
		saveLocalStorageValues(values, storageKey);
	}
}

export function removeLocalStorageValue(
	value: TIsbn,
	storageKey: string,
): void {
	const values = getLocalStorageValues(storageKey).filter(
		(existingValue) => existingValue !== value,
	);
	saveLocalStorageValues(values, storageKey);
}
