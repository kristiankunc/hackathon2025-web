<script lang="ts">
	export let text: string = "";
	export let type: "button" | "submit" | "reset" = "button";
	export let disabled: boolean = false;
	export let loading: boolean = false;
	export let onClick: () => void = () => {};
</script>

<button class="button {loading ? 'loading' : ''}" {type} disabled={disabled || loading} on:click={onClick}>
	{#if text}
		{text}
	{:else}
		<slot />
	{/if}

	{#if loading}
		<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
	{/if}
</button>
