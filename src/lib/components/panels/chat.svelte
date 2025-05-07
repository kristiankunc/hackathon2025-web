<script lang="ts">
	import Button from "$lib/components/ui/button.svelte";

	type Message = {
		role: "user" | "assistant";
		content: string;
	};

	const { onResponse, gameID } = $props();

	let messages = $state<Message[]>([
		{
			role: "assistant",
			content: "Hello, how can I assist you today?",
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
		const rawMessage = (await rawResponse.json()).message;
		const { code, explanation } = extractCodeAndExplanation(rawMessage);

		if (code) {
			onResponse(code);
		}

		messages = [...messages, { role: "assistant", content: explanation }];
		loading = false;
	}

	async function chatgptRequest(inputValue: string) {
		let response = await fetch("http://localhost:5173/gameselect/" + gameID, {
			method: "POST",
			headers: {"Content-Type": "application/json"},
			body: JSON.stringify({
				message: inputValue
			}),
		});

		return response;
	}

	function extractCodeAndExplanation(response: string): {
  		code: string | null;
  		explanation: string;
		} 
	{
  		const match = response.match(/```python\n([\s\S]*?)```/);
  		const code = match ? match[1].trim() : null;
  		const explanation = response.replace(/```python\n[\s\S]*?```/, "").trim();
  		return { code, explanation };
	}


</script>

<div class="chat">
	<div class="chat__messages" aria-live="polite">
		{#each messages as m}
			<div class="chat__message {m.role}">
				<strong>{m.role === "user" ? "You" : "AI"}:</strong>
				{m.content}
			</div>
		{/each}

		{#if loading}
			<div class="chat__message assistant">AI is thinking...</div>
		{/if}
	</div>

	<form class="chat__form" onsubmit={send}>
		<input type="text" bind:value={input} placeholder="Ask something..." aria-label="User message" autocomplete="off" required />

		<Button type="submit" {loading} text="Send" />
	</form>
</div>
