<script lang="ts">
	import Highlight, { LineNumbers } from "svelte-highlight";
	import python from "svelte-highlight/languages/python";
	import snazzy from "svelte-highlight/styles/snazzy";

	export let code = "";

	// Check if running on localhost
	const isLocalhost = typeof window !== "undefined" && window.location.hostname === "localhost";

	function updateCode(event: Event) {
		const target = event.target as HTMLTextAreaElement;
		code = target.value;
	}
</script>

<svelte:head>
	{@html snazzy}
</svelte:head>

{#if isLocalhost}
	<textarea bind:value={code} on:input={updateCode} rows="10" cols="50" style="width: 100%;"></textarea>
{/if}

<Highlight language={python} {code} let:highlighted>
	<LineNumbers {highlighted} wrapLines />
</Highlight>

<p id="python-output"></p>
<p id="python-error"></p>

<pre id="python-code" style="display: none;">{code}</pre>
