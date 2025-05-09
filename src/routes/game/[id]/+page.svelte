<script lang="ts">
	import PanelContainer from "$lib/components/panels/panelContainer.svelte";
	import CodeEditor from "$lib/components/panels/codeEditor.svelte";
	import Chat from "$lib/components/panels/chat.svelte";
	import { PUBLIC_UNITY_INSTANCE_URL } from "$env/static/public";
	import pythonWrapper from "$lib/python/global_wrapper.py?raw";
	import { parsePythonFunctions } from "$lib/python/pydoc-parser";
	import { marked } from "marked";

	let data = $props();

	let code = $state("");

	function handleResponse(message: string) {
		code = message;
	}

	const formattedDocstring = parsePythonFunctions(pythonWrapper);
</script>

<svelte:head>
	<link rel="stylesheet" href="https://pyscript.net/releases/2025.3.1/core.css" />
	<script type="module" src="https://pyscript.net/releases/2025.3.1/core.js"></script>
</svelte:head>

<!-- prettier-ignore -->
<py-script style="display: none;">
{pythonWrapper}
</py-script>

<PanelContainer>
	<div slot="left">
		<button id="run-code-button">Run Code</button>
		<iframe src={PUBLIC_UNITY_INSTANCE_URL} width="100%" height="500px" title="Hra"></iframe>
	</div>
	<div slot="middle">
		<!--
		<div>
			{@html marked(formattedDocstring)}
		</div>
		-->
		{#key code}
			<CodeEditor {code} />
		{/key}
	</div>
	<div slot="right">
		<Chat onResponse={handleResponse} />
	</div>
</PanelContainer>
