import { env } from "$env/dynamic/private";
import OpenAI from "openai";
import { parsePythonFunctions } from "$lib/python/pydoc-parser";
import getLevelCode, { LEVELS } from "$lib/python/get-level-code.js";

const client = new OpenAI({
	apiKey: env.OPENAI_API_KEY
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
	const levelId = body.levelId;

	const levelCode = await getLevelCode(levelId);
	const codeMD = parsePythonFunctions(levelCode);
	const systemPrompt = LEVELS[levelId - 1].additionalPrompt || "";
	const systemMessage = `${systemPrompt}\nYou have these functions to work with. Avoid using time.sleep in your output. Always use await asyncio.sleep(n) as your code will be wrapped in a main async function. The movement functions do not have to be awaited\n${codeMD}`;

	const response = await client.responses.create({
		model: "gpt-4.1",
		input: [
			{
				role: "developer",
				content: systemMessage
			},
			...body.messages
		]
	});

	const { code, explanation } = extractCodeAndExplanation(response.output_text);

	return new Response(JSON.stringify({ code, explanation, completeOutput: response.output_text }), {
		headers: { "Content-Type": "application/json" }
	});
};
