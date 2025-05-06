<script lang="ts">
	import "../styles/styles.scss";
	import Navbar from "$lib/components/navbar.svelte";
</script>

<svelte:head>
	<script type="module" src="https://pyscript.net/releases/2025.3.1/core.js"></script>
</svelte:head>

<Navbar />

<main class="container">
	<slot />
</main>
