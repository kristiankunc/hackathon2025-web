<script lang="ts">
	import PanelContainer from "$lib/components/panels/panelContainer.svelte";
	import CodeEditor from "$lib/components/panels/codeEditor.svelte";
	import Chat from "$lib/components/panels/chat.svelte";
	import { PUBLIC_UNITY_INSTANCE_URL } from "$env/static/public";

	let data = $props();

	let code = $state("");

	function handleResponse(message: string) {
		// const match = message.match(/```python\n([\s\S]*?)```/);
		// if (match) {
		// code = match[1];
		// }
		code = message;
	}
</script>

<svelte:head>
	<link rel="stylesheet" href="https://pyscript.net/releases/2025.3.1/core.css">
    <script type="module" src="https://pyscript.net/releases/2025.3.1/core.js"></script>

</svelte:head>

<py-script>
from pyodide.ffi import create_proxy
import js

def run_code(event):
	code = js.document.getElementById("python-code").textContent
	try:
		exec(code)
	except Exception as e:
		print("Error: " + e)

run_code_proxy = create_proxy(run_code)
js.document.getElementById("run-code-button").addEventListener("click", run_code_proxy)
</py-script>

<PanelContainer>
	<div slot="left">
		<button id="run-code-button">Run Code</button>
		<iframe src={PUBLIC_UNITY_INSTANCE_URL} width="100%" height="500px" title="Hra"></iframe>
	</div>
	<div slot="middle">
		{#key code}
			<CodeEditor {code} />
		{/key}
		<pre id="python-code" style="display: none;">{code}</pre>
	</div>
	<div slot="right">
		<Chat onResponse={handleResponse}/>
	</div>
</PanelContainer>
