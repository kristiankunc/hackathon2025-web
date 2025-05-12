<script lang="ts">
	import { getContext, onMount } from "svelte";
	import { derived } from "svelte/store";
	import type { Writable } from "svelte/store";

	interface TabContext {
		selectedTab: Writable<string | null>;
	}

	export let name: string;

	const { selectedTab } = getContext<TabContext>("tabs");
	const isSelected = derived(selectedTab, ($selected) => $selected === name);

	const handleClick = (): void => {
		selectedTab.set(name);
	};

	onMount(() => {
		selectedTab.update((current) => current ?? name);
	});
</script>

<button class="tab" role="tab" aria-selected={$isSelected} on:click={handleClick}>
	<slot />
</button>
