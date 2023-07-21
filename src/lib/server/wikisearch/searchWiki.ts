import type { Message } from "../../types/Message";
import { WIKI_SEARCH_API_ENDPOINT } from "$env/static/private";

// Show result as JSON
export async function searchWiki(messages: Pick<Message, "from" | "content">[]) {

	if (WIKI_SEARCH_API_ENDPOINT) {
		return await searcWikipApi(messages);
	}
	throw new Error("No WIKI_SEARCH_API_ENDPOINT found");
}

export async function searcWikipApi(messages: Pick<Message, "from" | "content">[]) {
    // console.log("searcWikipApi ", WIKI_SEARCH_API_ENDPOINT);
	const params = {
		messages: messages,
	};

	const res = await fetch(WIKI_SEARCH_API_ENDPOINT, {
		method: "POST",
		body: JSON.stringify(params),
		headers: {
			"Content-type": "application/json; charset=UTF-8",
		},
	});

	if (!res.ok) {
		console.error("Error while searching Wikipedia: " + (await res.text()));
		return;
	}

	const data = await res.json();

	if (!res.ok) {
		throw new Error(
			data["message"] ??
				`WikiSearch API returned error code ${res.status} - ${res.statusText}`
		);
	}

	return data["content"];
}
