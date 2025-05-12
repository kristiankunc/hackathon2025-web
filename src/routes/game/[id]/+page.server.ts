import type { PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ params, request }) => {
	const levelId = parseInt(params.id);

	const cookieHeader = request.headers.get("cookie") || "";
	const gamesCookieMatch = cookieHeader.match(/(?:^|;\s*)games=([^;]*)/);

	if (gamesCookieMatch) {
		try {
			const games = JSON.parse(decodeURIComponent(gamesCookieMatch[1]));
			const currentGame = games.find((game: { id: number }) => game.id === levelId);

			if (!currentGame || currentGame.status === "locked") {
				throw redirect(302, "/gameselect");
			}
		} catch (error) {
			throw redirect(302, "/gameselect");
		}
	} else {
		throw redirect(302, "/gameselect");
	}

	return {
		levelId
	};
};
