<script lang="ts">
	import PanelContainer from "$lib/components/panelContainer.svelte";
	import CodeEditor from "$lib/components/panels/codeEditor.svelte";
	import Chat from "$lib/components/chat.svelte";
	import { env } from "$env/dynamic/public";

	let iframe: HTMLIFrameElement | undefined = undefined;
	let isUnityReady = $state(false);

	let code = `
lower = 900
upper = 1000

print("Prime numbers between", lower, "and", upper, "are:")

for num in range(lower, upper + 1):
   # all prime numbers are greater than 1
   if num > 1:
	   for i in range(2, num):
		   if (num % i) == 0:
			   break
	   else:
		   print(num)
`;
</script>

<svelte:head>
	<link rel="stylesheet" href="https://pyscript.net/releases/2025.3.1/core.css" />
	<script type="module" src="https://pyscript.net/releases/2025.3.1/core.js"></script>
</svelte:head>

<!-- prettier-ignore -->
<py-script src="./src/lib/python_modules/test.py"></py-script>


<PanelContainer>
	<div slot="left"><iframe bind:this={iframe} title="Game window" src={env.PUBLIC_UNITY_INSTANCE_URL} class="h-lvh w-full"></iframe></div>
	<div slot="middle">
		{#key code}
			<CodeEditor {code} />
		{/key}
	</div>
	<div slot="right">
		<Chat />
	</div>
</PanelContainer>
