<script lang="ts">
	import PanelContainer from "$lib/components/panels/panelContainer.svelte";
	import CodeEditor from "$lib/components/panels/codeEditor.svelte";
	import Chat from "$lib/components/panels/chat.svelte";
	import { PUBLIC_UNITY_INSTANCE_URL } from "$env/static/public";
	import pythonWrapper from "$lib/python/global_wrapper.py?raw";
	import { parsePythonFunctions } from "$lib/python/pydoc-parser";
	import { onMount } from "svelte";
	import { sendDataToPython, sendMessageToUnity, type UnityMessage } from "$lib/iframe-messanger";

	let { data } = $props();
	let code = $state("");
	let isUnityReady = $state(false);
	let gameIframe: HTMLIFrameElement | undefined = undefined;
	let pyodide: any = null;
	let isPyodideReady = $state(false);
	const levelFiles = import.meta.glob("$lib/python/levels/level*.py", { as: "raw" });

	// Asynchronous function to load Pyodide
	async function loadPyodideInstance() {
		try {
			// @ts-ignore
			pyodide = await window.loadPyodide();
			isPyodideReady = true;
			console.log("Pyodide is ready");
		} catch (error) {
			console.error("Error loading Pyodide:", error);
			isPyodideReady = false;
		}
	}

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
		console.log("Unity message received", unityData);

		switch (unityData.action) {
			case "ready":
				console.log("Unity is ready");
				isUnityReady = true;
				break;

			case "levelPass":
				handleLevelPass(data.levelId);
				break;

			case "setData":
				console.log("Setting data in Unity");
				const variableName = unityData.args.variableName;
				const variableValue = unityData.args.variableValue;
				const variableType = unityData.args.variableType;

				if (!variableName || !variableValue || !variableType) {
					console.error("Missing variable name, value or type");
					return;
				}

				sendDataToPython("python-data-exchange", {
					name: variableName,
					type: variableType,
					value: variableValue
				});

				break;

			case "levelPass":
				const gameId = data.levelId;
				handleLevelPass(gameId);
				break;

			default:
				console.error("Unknown action from Unity", unityData);
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

	function sendActionToUnity(message: UnityMessage) {
		console.log("Sending action to Unity", message);
		sendMessageToUnity(gameIframe!, message);
	}

	onMount(async () => {
		// @ts-ignore
		window.sendActionToUnity = sendActionToUnity;
		// @ts-ignore
		globalThis.sendActionToUnity = sendActionToUnity;

		console.log(globalThis);

		window.addEventListener("message", onIframeMessage);

		await loadPyodideInstance();

		if (isPyodideReady) {
			pyodide.runPython(pythonWrapper);

			const levelPath = `/src/lib/python/levels/level${data.levelId}.py`;
			const loadLevel = levelFiles[levelPath];
			console.log("Level files ", levelFiles);
			if (loadLevel) {
				const levelCode = await loadLevel();
				pyodide.runPython(levelCode);
			} else {
				console.error(`Level script for levelId=${data.levelId} not found.`);
			}
		}

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
			args: {
				levelId: data.levelId
			}
		});

		return new Promise(() => {
			window.removeEventListener("message", onIframeMessage);
		});
	});
</script>

<svelte:head>
	<link rel="stylesheet" href="https://pyscript.net/releases/2025.3.1/core.css" />
	<script src="https://cdn.jsdelivr.net/npm/pyodide@0.21.3/pyodide.js"></script>
	<script src="https://pyscript.net/releases/2025.3.1/core.js" type="module"></script>
</svelte:head>

<PanelContainer>
	<div slot="left">
		<button
			id="run-code-button"
			onclick={() =>
				sendMessageToUnity(gameIframe!, {
					action: "restartLevel",
					args: {}
				})}>Run Code</button
		>
		<iframe src={PUBLIC_UNITY_INSTANCE_URL} bind:this={gameIframe} width="100%" height="500px" title="Hra"></iframe>
	</div>
	<div slot="middle">
		{#key code}
			<CodeEditor {code} />
			<!-- Unlock next level button (for testing) -->
			<button onclick={() => handleLevelPass(data.levelId)}>Level Pass</button>
		{/key}
	</div>
	<div slot="right">
		<Chat onResponse={handleResponse} />
	</div>
</PanelContainer>
