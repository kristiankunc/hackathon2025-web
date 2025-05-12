<script lang="ts">
	import { setContext } from "svelte";
	import { writable, type Writable } from "svelte/store";

	interface TabContext {
		selectedTab: Writable<string | null>;
	}

	export let orientation: "horizontal" | "vertical" = "horizontal";
	const selectedTab = writable<string | null>(null);

	setContext<TabContext>("tabs", {
		selectedTab
	});
</script>

<div class="tabs tabs--{orientation}">
	<slot />
</div>
