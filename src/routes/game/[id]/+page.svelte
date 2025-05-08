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
	<link rel="stylesheet" href="https://pyscript.net/releases/2025.3.1/core.css" />
	<script type="module" src="https://pyscript.net/releases/2025.3.1/core.js"></script>
</svelte:head>

<!-- prettier-ignore -->
<py-script>
from pyodide.ffi import create_proxy
import js

CODE_ELEMENT = js.document.getElementById("python-code")
OUTPUT_ELEMENT = js.document.getElementById("python-output")
ERROR_ELEMENT = js.document.getElementById("python-error")

call_stack = []

def forward():
	call_stack.append("forward")

def backward():
	call_stack.append("backward")

def left():
	call_stack.append("left")

def right():
	call_stack.append("right")

def print(content, *args):
	current_output = OUTPUT_ELEMENT.textContent
	if current_output:
		OUTPUT_ELEMENT.textContent = current_output + str(content) + "\n"
	else:
		OUTPUT_ELEMENT.textContent = str(content) + "\n"

def run_code(event):
	OUTPUT_ELEMENT.textContent = ""
	ERROR_ELEMENT.textContent = ""
	try:
		exec(CODE_ELEMENT.textContent)
	except Exception as e:
		js.document.getElementById("python-error").textContent = e


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
	</div>
	<div slot="right">
		<Chat onResponse={handleResponse} />
	</div>
</PanelContainer>
