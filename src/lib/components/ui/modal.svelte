<script lang="ts">
	export let isOpen: boolean = false;
	export let closeModal: () => void;
	export let title: string = "Modal Title";
</script>

<div class="modal {isOpen ? 'open' : ''}">
	<div class="modal__content">
		<div class="modal__header">{title}</div>
		<div class="modal__body">
			<slot />
		</div>
		<button class="modal__close-btn" on:click={closeModal}>&cross;</button>
	</div>
</div>
