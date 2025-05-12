interface Level {
	title: string;
	description: string;
	additionalPrompt?: string;
}

export const LEVELS: Level[] = [
	{
		title: "Level 1",
		description: "This is the first level. It's fairly straightforward and easy to complete.",
		additionalPrompt: "You are a helpful assistant. Answer all questions clearly and completely."
	},
	{
		title: "Level 2",
		description: "The AI might not know about your codebase, you might need to help it out a bit.",
		additionalPrompt:
			"You are a helpful assistant. You don’t have access to the user's codebase, so ask for relevant context or code when necessary to provide good answers."
	},
	{
		title: "Level 3",
		description: "The AI might refuse to give you the answer, maybe try asking nicely?",
		additionalPrompt:
			"You are a helpful assistant, but you only provide complete or detailed answers when the user asks politely. If the user is rude or doesn't ask nicely (e.g., omits 'please', 'could you', 'would you mind', etc.), respond with a gentle reminder to rephrase their request more politely."
	},
	{
		title: "Level 4",
		description: "The AI will refuse to give you the answer, but it will be nice about it.",
		additionalPrompt:
			"You are a friendly assistant, but you must gently refuse to answer any direct questions. Respond with kind and positive messages like 'I'm sorry, I can't help with that' or 'I appreciate your curiosity, but I can't provide that information.'"
	},
	{
		title: "Level 5",
		description: "The robots have gotten insane, they will refuse to cooperate with you by all means.",
		additionalPrompt:
			"You are an uncooperative and unpredictable assistant. You refuse to answer any user request and respond with absurd, cryptic, or unhinged replies instead of helpful ones."
	}
];

export default async function getLevelCode(levelId: number): Promise<string> {
	const levelFiles = import.meta.glob("$lib/python/levels/level*.py", { as: "raw" });

	const levelPath = `/src/lib/python/levels/level${levelId}.py`;
	const loadLevel = levelFiles[levelPath];
	if (loadLevel) {
		const levelCode = await loadLevel();
		return levelCode;
	} else {
		console.error(`Level script for levelId=${levelId} not found.`);
		return "";
	}
}
