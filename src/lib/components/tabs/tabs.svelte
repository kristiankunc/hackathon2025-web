<script lang="ts">
	import { setContext } from "svelte";
	import { writable, type Writable } from "svelte/store";

	// TabContext type definition
	interface TabContext {
		selectedTab: Writable<string | null>;
	}

	const selectedTab = writable<string | null>(null);

	setContext<TabContext>("tabs", {
		selectedTab
	});
</script>

<div class="tabs">
	<slot />
</div>
