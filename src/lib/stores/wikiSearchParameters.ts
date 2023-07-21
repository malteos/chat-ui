import { writable } from "svelte/store";
export interface WikiSearchParameters {
	useSearch: boolean;
	nItems: number;
}
export const wikiSearchParameters = writable<WikiSearchParameters>({
	useSearch: false,
	nItems: 5,
});
