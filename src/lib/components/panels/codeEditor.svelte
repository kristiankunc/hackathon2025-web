<script lang="ts">
	import Highlight, { LineNumbers } from "svelte-highlight";
	import python from "svelte-highlight/languages/python";
	import snazzy from "svelte-highlight/styles/snazzy";

	let { code } = $props();

	let messageContent = $state(`{
	"name": "test",
	"type": "string",
	"value": "hi"
}`);

	let messageElement: HTMLElement | undefined = undefined;

	// Check if running on localhost
	const isLocalhost = typeof window !== "undefined" && window.location.hostname === "localhost";

	function updateCode(event: Event) {
		const target = event.target as HTMLTextAreaElement;
		code = target.value;
	}

	function updateUnityMessage() {
		const parsedMessage = JSON.parse(messageContent);
		const wrappedMessage = {
			updatedAt: Math.floor(Date.now() / 1000),
			data: parsedMessage
		};
		messageElement!.innerHTML = JSON.stringify(wrappedMessage, null, 2);
	}
</script>

<svelte:head>
	{@html snazzy}
</svelte:head>

{#if isLocalhost}
	<p>Debug code editor</p>
	<textarea bind:value={code} oninput={updateCode} rows="10" cols="50" style="width: 100%;"></textarea>

	<p>Debug unity message setter (json)</p>
	<textarea id="unity-message" rows="10" cols="50" style="width: 100%;" bind:value={messageContent}></textarea>
	<button id="send-message-button" onclick={updateUnityMessage}>Mock message update</button>
{/if}

<Highlight language={python} {code} let:highlighted>
	<LineNumbers {highlighted} wrapLines />
</Highlight>

<p id="python-output"></p>
<p id="python-error"></p>

<pre id="python-code" style="display: none;">{code}</pre>
<pre id="python-data-exchange" style="display: none;" bind:this={messageElement}></pre>
