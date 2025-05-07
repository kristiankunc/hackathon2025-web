<script lang="ts">
	import { signIn, signOut } from "@auth/sveltekit/client";
	import { page } from "$app/stores";

	import Button from "$lib/components/ui/button.svelte";

	let appName = "Hackathon 2025";
</script>

<header class="navbar">
	<div class="navbar__pages">
		<div class="navbar__title">{appName}</div>
		<nav class="navbar__links">
			<a href="/gameselect">Game Select</a>
		</nav>
	</div>
	<div class="navbar__auth">
		{#if $page.data.user}
			<span class="navbar__username">{$page.data.user.name}</span>
			<Button type="button" onClick={() => signOut()}>Sign out</Button>
		{:else}
			<Button onClick={() => signIn("google")}>Sign in</Button>
		{/if}
	</div>
</header>

