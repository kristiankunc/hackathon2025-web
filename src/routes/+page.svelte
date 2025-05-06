<script>
	import PanelContainer from "$lib/components/PanelContainer.svelte";
	import CodeEditor from "$lib/components/panels/codeEditor.svelte";

	let code = `print("Hello World")`;
</script>

<PanelContainer>
	<div slot="left"><button on:click={() => code = `print("no hello for you")`}>Change Code</button></div>
	<div slot="middle">
		{#key code}
			<CodeEditor {code} />
		{/key}
	</div>
	<div slot="right">
		Right Control
	</div>
</PanelContainer>
