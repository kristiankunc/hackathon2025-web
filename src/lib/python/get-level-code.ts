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