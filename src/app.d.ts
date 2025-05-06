// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: {
				name: string;
				email: string;
				image: string;
			} | null;
		}
		interface PageData {
			user: {
				name: string;
				email: string;
				image: string;
			} | null;
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
