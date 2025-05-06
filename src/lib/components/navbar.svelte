<script lang="ts">
	import { signIn, signOut } from "@auth/sveltekit/client";
	import { page } from "$app/stores";
	let appName = "Hackathon 2025";
</script>

<header class="navbar">
	<div class="navbar__title">{appName}</div>
	{#if $page.data.user}
		<span>{$page.data.user.name}</span>
		<button on:click={() => signOut()}>
			<span>Sign out</span>
		</button>
	{:else}
		<button on:click={() => signIn("google")}>
			<span>Sign in</span>
		</button>
	{/if}
</header>
