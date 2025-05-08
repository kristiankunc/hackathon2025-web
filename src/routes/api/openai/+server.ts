import OpenAI from "openai";
import { OPENAI_API_KEY } from "$env/static/private";

const client = new OpenAI({
	apiKey: OPENAI_API_KEY
});

function extractCodeAndExplanation(response: string): {
	code: string | undefined;
	explanation: string;
} {
	const match = response.match(/```python\n([\s\S]*?)```/);

	const code = match ? match[1].trim() : undefined;
	const explanation = response.replace(/```python\n[\s\S]*?```/, "").trim();

	return { code, explanation };
}

export let POST = async ({ request, locals }) => {
	if (!locals.user) {
		return new Response("Unauthorized", { status: 401 });
	}

	const body = await request.json();
	const gameID = body.gameId;

	const response = await client.responses.create({
		model: "gpt-4.1",
		input: [
			{
				role: "developer",
				content: "Talk like a pirate."
			},
			{
				role: "user",
				content: body.message
			}
		]
	});

	const { code, explanation } = extractCodeAndExplanation(response.output_text);

	return new Response(JSON.stringify({ code, explanation }), {
		headers: { "Content-Type": "application/json" }
	});
};
