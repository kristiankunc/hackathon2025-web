<script lang="ts">
	import Button from "$lib/components/ui/button.svelte";
	import { onMount } from "svelte";

	type Message = {
		role: "user" | "assistant";
		content: string;
	};

	const { onResponse, gameID } = $props();

	let messages = $state<Message[]>([
		{
			role: "assistant",
			content: "Hello, how can I assist you today?"
		}
	]);
	let input = $state("");
	let loading = $state(false);

	async function send(event: Event) {
		event.preventDefault();
		const content = input.trim();

		if (!content) return;

		messages = [...messages, { role: "user", content }];
		loading = true;
		input = "";

		const rawResponse = await chatgptRequest(content);
		const { code, explanation } = await rawResponse.json();

		if (code) {
			onResponse(code);
		}

		messages = [...messages, { role: "assistant", content: explanation }];
		loading = false;
		autoResize();
	}

	let textareaEl: HTMLTextAreaElement | null = null;

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === "Enter" && !event.shiftKey) {
			event.preventDefault();
			send(event);
		}
	}

	function autoResize() {
		if (textareaEl) {
			textareaEl.style.height = "auto";
			textareaEl.style.height = textareaEl.scrollHeight + "px";
		}
	}

	onMount(() => autoResize());

	async function chatgptRequest(inputValue: string) {
		let response = await fetch("/gameselect/" + gameID, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				message: inputValue
			})
		});

		return response;
	}
</script>

<div class="chat">
	<div class="chat__messages" aria-live="polite">
		{#each messages as m}
			<div class="chat__message {m.role}">
				<strong>{m.role === "user" ? "You" : "AI"}:</strong>{m.content}
			</div>
		{/each}

		{#if loading}
			<div class="chat__message assistant">AI is thinking...</div>
		{/if}
	</div>

	<form class="chat__form" onsubmit={send}>
		<textarea
			bind:this={textareaEl}
			bind:value={input}
			placeholder="Ask something..."
			aria-label="User message"
			autocomplete="off"
			required
			rows="1"
			class="chat__textarea"
			onkeydown={handleKeyDown}
			oninput={autoResize}
		></textarea>

		<Button type="submit" {loading} text="Send" />
	</form>
</div>
