<script lang="ts">
	import Button from "$lib/components/ui/button.svelte";
	import { onMount } from "svelte";

	type Message = {
		role: "user" | "assistant";
		content: string;
	};

	let { onResponse } = $props();

	let messages = $state<Message[]>([
		{
			role: "assistant",
			content: 'Welcome! Type one of these commands to see an example:\n- "loop"\n- "function"\n- "file"\n- "math"\n- "comprehension"'
		}
	]);
	let input = $state("");
	let loading = $state(false);

	async function send(event: Event) {
		event.preventDefault();
		if (!input.trim()) return;

		const content = input.trim();
		messages = [...messages, { role: "user", content }];
		loading = true;
		input = "";

		const rawResponse = await simulateModelResponse(content);
		const { code, explanation } = extractCodeAndExplanation(rawResponse);

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

	async function simulateModelResponse(inputValue: string): Promise<string> {
		const responses: Record<string, string> = {
			loop: `Here is a loop example:\n\`\`\`python\nfor i in range(5):\n    print(f"Iteration {i}")\n\`\`\``,
			function: `Here is a function:\n\`\`\`python\ndef greet(name):\n    return f"Hello, {name}!"\n\`\`\``,
			comprehension: `Here is a list comprehension:\n\`\`\`python\nsquared = [n**2 for n in range(5)]\nprint(squared)\n\`\`\``,
			math: `Here's a math example:\n\`\`\`python\nimport math\nprint(math.sqrt(16))\n\`\`\``,
			file: `This writes to a file:\n\`\`\`python\nwith open("file.txt", "w") as f:\n    f.write("Hello, world!")\n\`\`\``
		};

		return new Promise((resolve) =>
			setTimeout(() => {
				const key = inputValue.trim().toLowerCase();
				const result = responses[key] || `I didn't understand "${inputValue}". Please try again.`;
				resolve(result);
			}, 600)
		);
	}

	function extractCodeAndExplanation(response: string): {
		code: string | null;
		explanation: string;
	} {
		const match = response.match(/```python\n([\s\S]*?)```/);

		const code = match ? match[1].trim() : null;
		const explanation = response.replace(/```python\n[\s\S]*?```\n?/, "").trim();


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
