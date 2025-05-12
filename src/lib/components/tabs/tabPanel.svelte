<script lang="ts">
	import { getContext } from "svelte";
	import { derived } from "svelte/store";
	import type { Writable } from "svelte/store";

	interface TabContext {
		selectedTab: Writable<string | null>;
	}

	export let name: string;

	const { selectedTab } = getContext<TabContext>("tabs");
	const isVisible = derived(selectedTab, ($selected) => $selected === name);
</script>

{#if $isVisible}
	<div class="tabs__panel" role="tabpanel">
		<slot />
	</div>
{/if}
