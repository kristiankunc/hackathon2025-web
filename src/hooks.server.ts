import { sequence } from "@sveltejs/kit/hooks";
import { handle as authHandle } from "$lib/auth";
import type { Handle } from "@sveltejs/kit";

const setLocals: Handle = async ({ event, resolve }) => {
	const authSession = await event.locals.auth();

	const domain = event.url.toString().split("/").at(2);

	if (!authSession && event.url.href != "http://" + domain + "/" && event.url.href != "http://" + domain + "/auth/signin/") {
		return new Response(null, {
			status: 302,
			headers: {
				// Location: '/auth/signin'
				Location: "/"
			}
		});
	}

	if (authSession?.user?.name && authSession?.user?.email && authSession?.user?.image) {
		event.locals.user = {
			name: authSession.user.name,
			email: authSession.user.email,
			image: authSession.user.image
		};
	}

	return resolve(event);
};

export const handle = sequence(authHandle, setLocals);
