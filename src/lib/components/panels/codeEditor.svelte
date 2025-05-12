<script lang="ts">
	import { sendDataToPython } from "$lib/iframe-messanger";
	import Highlight, { LineNumbers } from "svelte-highlight";
	import python from "svelte-highlight/languages/python";
	import snazzy from "svelte-highlight/styles/snazzy";
	import Modal from "../ui/modal.svelte";
	import { parsePythonFunctions } from "$lib/python/pydoc-parser";
	import { marked } from "marked";
	import getLevelCode from "$lib/python/get-level-code";

	let { code, levelId } = $props();

	let messageContent = $state(`{
	"name": "test",
	"type": "string",
	"value": "hi"
}`);

	let messageElement: HTMLElement | undefined = undefined;

	const isLocalhost = false; // typeof window !== "undefined" && window.location.hostname === "localhost";

	function updateCode(event: Event) {
		const target = event.target as HTMLTextAreaElement;
		code = target.value;
	}

	function updateUnityMessage() {
		const parsedMessage = JSON.parse(messageContent);

		sendDataToPython("python-data-exchange", {
			name: parsedMessage.name,
			type: parsedMessage.type,
			value: parsedMessage.value
		});
	}

	// modal logic
	let isModalOpen = $state(false);

	function openModal() {
		isModalOpen = true;
	}

	function closeModal() {
		isModalOpen = false;
	}
</script>

<svelte:head>
	{@html snazzy}
</svelte:head>

{#if !isLocalhost}
	<p>Debug code editor</p>
	<textarea bind:value={code} oninput={updateCode} rows="10" cols="50" style="width: 100%;"></textarea>

	<p>Debug unity message setter (json)</p>
	<textarea id="unity-message" rows="10" cols="50" style="width: 100%;" bind:value={messageContent}></textarea>
	<button id="send-message-button" onclick={updateUnityMessage}>Mock message update</button>
{/if}

<Highlight language={python} {code} let:highlighted>
	<LineNumbers {highlighted} wrapLines />
</Highlight>

<button class="question-btn" onclick={openModal}>?</button>
<Modal isOpen={isModalOpen} {closeModal} title="List of Functions">
	{#await getLevelCode(levelId) then levelCode}
		{@html marked(parsePythonFunctions(levelCode))}
	{/await}
</Modal>

<p id="python-output"></p>
<p id="python-error"></p>

<pre id="python-code" style="display: none;">{code}</pre>
<pre id="python-data-exchange" style="display: none;" bind:this={messageElement}></pre>
