<script lang="ts">
	import hljs from 'highlight.js/lib/core';
	import python from 'highlight.js/lib/languages/python';
	import 'highlight.js/styles/base16/snazzy.css';

	import { onMount } from 'svelte';

	export let code = '';

	let codeElement: HTMLElement | null = null;

	onMount(() => {
		hljs.registerLanguage('python', python);
		hljs.highlightElement(codeElement!);
	});

	$: if (codeElement && code) {
		hljs.highlightElement(codeElement);
	}
</script>

<pre><code bind:this={codeElement} class="language-python">{code}</code></pre>
