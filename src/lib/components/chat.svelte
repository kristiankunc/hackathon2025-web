<script lang="ts">
	let messages: { role: string; content: string }[] = [{ role: "system", content: "You are a helpful assistant." }];

	let input = "";
	let loading = false;

	async function send() {
		if (!input.trim()) return;

		messages = [...messages, { role: "user", content: input }];
		loading = true;

		// TODO: API call
		setTimeout(() => {
			messages = [...messages, { role: "assistant", content: "sybau 💔💔🥀🥀😭" }];
			input = "";
			loading = false;
		}, 1000);
	}
</script>

<div class="chat">
	<div class="chat__messages">
		{#each messages as m}
			<div class="chat__message {m.role}">
				<strong>{m.role === "user" ? "You" : "AI"}:</strong>
				{m.content}
			</div>
		{/each}
		{#if loading}
			<div class="chat__message ai">AI is thinking...</div>
		{/if}
	</div>

	<form on:submit|preventDefault={send}>
		<input bind:value={input} placeholder="Ask something..." />
		<button type="submit" disabled={loading}>Send</button>
	</form>
</div>
