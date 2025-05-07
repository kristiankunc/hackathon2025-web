<script lang="ts">
	import PanelContainer from "$lib/components/panels/panelContainer.svelte";
	import CodeEditor from "$lib/components/panels/codeEditor.svelte";
	import Chat from "$lib/components/panels/chat.svelte";

    let data = $props()

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
	<div slot="left"><button on:click={() => (console.log("Game interactions..."))}>Run Code</button></div>
	<div slot="middle">
		{#key code}
			<CodeEditor {code} />
		{/key}
	</div>
	<div slot="right">
		<Chat onResponse={handleResponse} gameID={data.id} />
	</div>
</PanelContainer>
