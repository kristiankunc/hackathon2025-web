<script lang="ts">
	import Highlight, { LineNumbers } from "svelte-highlight";
	import python from "svelte-highlight/languages/python";
	import snazzy from "svelte-highlight/styles/snazzy";

	export let code = "";
</script>

<svelte:head>
	{@html snazzy}
</svelte:head>

<Highlight language={python} {code} let:highlighted>
	<LineNumbers {highlighted} wrapLines />
</Highlight>
