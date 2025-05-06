<script lang="ts">
	import { signIn, signOut } from "@auth/sveltekit/client";
	import { page } from "$app/stores";

	import Button from "$lib/components/button.svelte";

	let appName = "Hackathon 2025";
</script>

<header class="navbar">
	<div class="navbar__title">{appName}</div>
	{#if $page.data.user}
		<span>{$page.data.user.name}</span>
		<Button type="button" onClick={() => signOut()}>Sign out</Button>
	{:else}
		<Button onClick={() => signIn("google")}>Sign in</Button>
	{/if}
</header>
