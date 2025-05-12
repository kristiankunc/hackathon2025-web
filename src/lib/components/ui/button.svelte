<script lang="ts">
	export let text: string = "";
	export let type: "button" | "submit" | "reset" = "button";
	export let disabled: boolean = false;
	export let loading: boolean = false;
	export let onClick: () => void = () => {};
	export let href: string | null = null;
	export let variant: "primary" | "secondary" | "tertiary" | "simple" = "simple";
</script>

{#if href}
	<a
		{href}
		class="btn btn--{variant} {loading ? 'loading' : ''} {disabled || loading ? 'disabled' : ''}"
		on:click={disabled || loading ? (e) => e.preventDefault() : onClick}
	>
		{#if text}
			{text}
		{:else}
			<slot />
		{/if}

		{#if loading}
			<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
		{/if}
	</a>
{:else}
	<button class="btn btn--{variant} {loading ? 'loading' : ''}" {type} disabled={disabled || loading} on:click={onClick}>
		{#if text}
			{text}
		{:else}
			<slot />
		{/if}

		{#if loading}
			<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
		{/if}
	</button>
{/if}
