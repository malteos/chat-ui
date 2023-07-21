<script lang="ts">
	import { wikiSearchParameters } from "$lib/stores/wikiSearchParameters";
	import CarbonInformation from "~icons/carbon/information";
	import Switch from "./Switch.svelte";

	const toggle = () => ($wikiSearchParameters.useSearch = !$wikiSearchParameters.useSearch);
</script>

<div
	class="flex h-9 cursor-pointer select-none items-center gap-2 rounded-xl border bg-white p-1.5 shadow-sm hover:shadow-none dark:border-gray-800 dark:bg-gray-900"
	on:click={toggle}
	on:keypress={toggle}
>
	<Switch name="useSearch" bind:checked={$wikiSearchParameters.useSearch} on:click on:keypress />
	<div class="whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">Search Wikipedia</div>
	<div class="group relative w-max">
		<CarbonInformation class="text-xs text-gray-500" />
		<div
			class="pointer-events-none absolute -top-20 left-1/2 w-max -translate-x-1/2 rounded-md bg-gray-100 p-2 opacity-0 transition-opacity group-hover:opacity-100 dark:bg-gray-800"
		>
			<p class="max-w-sm text-sm text-gray-800 dark:text-gray-200">
				When enabled, the model will try to complement its answer with information queried from Wikipedia.
			</p>
		</div>
	</div>
</div>
