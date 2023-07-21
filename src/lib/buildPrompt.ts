import type { BackendModel } from "./server/models";
import type { Message } from "./types/Message";
import { collections } from "$lib/server/database";
import { ObjectId } from "mongodb";
import { searchWiki } from "$lib/server/wikisearch/searchWiki";
/**
 * Convert [{user: "assistant", content: "hi"}, {user: "user", content: "hello"}] to:
 *
 * <|assistant|>hi<|endoftext|><|prompter|>hello<|endoftext|><|assistant|>
 */

export async function buildPrompt(
	messages: Pick<Message, "from" | "content">[],
	model: BackendModel,
	webSearchId?: string,
	useWikiSearch: boolean = false
): Promise<string> {
	const prompt =
		messages
			.map(
				(m) =>
					(m.from === "user"
						? model.userMessageToken + m.content
						: model.assistantMessageToken + m.content) +
					(model.messageEndToken
						? m.content.endsWith(model.messageEndToken)
							? ""
							: model.messageEndToken
						: "")
			)
			.join("") + model.assistantMessageToken;

	let webPrompt = "";

	if (webSearchId) {
		const webSearch = await collections.webSearches.findOne({
			_id: new ObjectId(webSearchId),
		});

		if (!webSearch) throw new Error("Web search not found");

		if (webSearch.summary) {
			webPrompt =
				model.assistantMessageToken +
				`The following context was found while searching the internet: ${webSearch.summary}` +
				model.messageEndToken;
		}
	}

	let wikiPrompt = "";
	if (useWikiSearch) {
		const wikiContent = await searchWiki(messages);

		if(wikiContent) {
			wikiPrompt =
			model.assistantMessageToken +
			`Bei der Suche im Internet wurde folgende Informationen gefunden: ${wikiContent}` +
			model.messageEndToken;
		}
	}

	const finalPrompt =
		model.preprompt +
		webPrompt +
		wikiPrompt +
		prompt
			.split(" ")
			.slice(-(model.parameters?.truncate ?? 0))
			.join(" ");

	if(useWikiSearch) {
		console.log("finalPrompt with use_wiki_search = ", finalPrompt);
	}

	// Not super precise, but it's truncated in the model's backend anyway
	return finalPrompt;
}
