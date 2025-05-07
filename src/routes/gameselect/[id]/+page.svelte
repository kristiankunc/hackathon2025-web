<script lang="ts">
	import PanelContainer from "$lib/components/panels/panelContainer.svelte";
	import CodeEditor from "$lib/components/panels/codeEditor.svelte";
	import Chat from "$lib/components/panels/chat.svelte";

	let code = $state("");

	function handleResponse(message: string) {
		// const match = message.match(/```python\n([\s\S]*?)```/);
		// if (match) {
		// code = match[1];
		// }
		code = message;
	}
</script>

<PanelContainer>
	<div slot="left"><button onclick={() => console.log("Game interactions...")}>Run Code</button>
		<iframe src="http://127.0.0.1:3002/index.html" width="100%" height="500px" title="Hra"></iframe>
	</div>
	<div slot="middle">
		{#key code}
			<CodeEditor {code} />
		{/key}
	</div>
	<div slot="right">
		<Chat onResponse={handleResponse} gameID={document.URL.charAt(document.URL.length - 1)} />
	</div>
</PanelContainer>
