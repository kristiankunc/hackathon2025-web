<script lang="ts">
	import PanelContainer from "$lib/components/panels/panelContainer.svelte";
	import CodeEditor from "$lib/components/panels/codeEditor.svelte";
	import Chat from "$lib/components/panels/chat.svelte";
	import { PUBLIC_UNITY_INSTANCE_URL } from "$env/static/public";
	import pythonWrapper from "$lib/python/global_wrapper.py?raw";
	import { parsePythonFunctions } from "$lib/python/pydoc-parser";
	import { onMount } from "svelte";
	import { sendMessageToUnity, type UnityMessage } from "$lib/iframe-messanger";

	let data = $props();

	let code = $state("");
	let isUnityReady = $state(false);
	let gameIframe: HTMLIFrameElement | undefined = undefined;

	function handleResponse(message: string) {
		code = message;
	}

	async function onIframeMessage(event: MessageEvent) {
		const message = event.data as { type: string; data: UnityMessage };

		if (!message.type || !message.data) return;

		switch (message.type) {
			case "unityToJs":
				handleUnityMessage(message.data);
				break;
		}
	}

	async function handleUnityMessage(unityData: UnityMessage) {
		switch (data.action) {
			case "ready":
				console.log("Unity is ready");
				isUnityReady = true;
				break;

			case "levelPass":
				handleLevelPass(data.gameId);
				break;

			default:
				console.error("Unknown action from Unity", data);
				break;
		}
	}

	function handleLevelPass(gameId: number) {
		const games = localStorage.getItem("games");
		if (games) {
			const parsedGames = JSON.parse(games);
			const index = parsedGames.findIndex((game: { id: number }) => game.id === gameId);

			if (index !== -1) {
				const currentGame = parsedGames[index];
				currentGame.status = "completed";

				// unlock next level
				const nextGame = parsedGames[index + 1];
				if (nextGame && nextGame.status === "locked") {
					nextGame.status = "unlocked";
				}

				localStorage.setItem("games", JSON.stringify(parsedGames));
			}
		}
	}

	onMount(async () => {
		window.addEventListener("message", onIframeMessage);

		if (!isUnityReady) {
			await new Promise<void>((resolve) => {
				const cleanup = $effect.root(() => {
					$effect(() => {
						if (isUnityReady) {
							cleanup();
							resolve();
						}
					});
				});
			});
		}

		sendMessageToUnity(gameIframe!, {
			action: "setLevel",
			args: {}
		});

		return new Promise(() => {
			window.removeEventListener("message", onIframeMessage);
		});
	});
</script>

<svelte:head>
	<link rel="stylesheet" href="https://pyscript.net/releases/2025.3.1/core.css" />
	<script type="module" src="https://pyscript.net/releases/2025.3.1/core.js"></script>
</svelte:head>

<!-- prettier-ignore -->
<py-script style="display: none;">
{pythonWrapper}
</py-script>

<PanelContainer>
	<div slot="left">
		<button id="run-code-button">Run Code</button>
		<iframe src={PUBLIC_UNITY_INSTANCE_URL} bind:this={gameIframe} width="100%" height="500px" title="Hra"></iframe>
	</div>
	<div slot="middle">
		{#key code}
			<CodeEditor {code} />
			<!-- testovaci tlacitko s ID=6 -->
			<button onclick={() => handleLevelPass(6)}>Level Pass</button>
		{/key}
	</div>
	<div slot="right">
		<Chat onResponse={handleResponse} />
	</div>
</PanelContainer>
