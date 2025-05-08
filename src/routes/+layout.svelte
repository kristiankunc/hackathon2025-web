<script lang="ts">
	import "../styles/styles.scss";
	import Navbar from "$lib/components/navbar.svelte";
	import { onMount } from "svelte";

	const threshold = 1024;
	let isTooSmall = false;

	function checkScreenSize() {
		isTooSmall = window.innerWidth < threshold;
	}

	onMount(() => {
		checkScreenSize();
		window.addEventListener("resize", checkScreenSize);
		return () => window.removeEventListener("resize", checkScreenSize);
	});
</script>

<Navbar />

{#if isTooSmall}
	<div class="screen-warning">This app is best viewed on a larger screen. Please resize your window or use a desktop.</div>
{:else}
	<main class="container">
		<slot />
	</main>
{/if}
