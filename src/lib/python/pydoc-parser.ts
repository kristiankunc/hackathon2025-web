type FunctionArg = {
	name: string;
	type: string;
	description: string;
};

type FunctionReturn = {
	type: string;
	description: string;
};

export function parsePythonFunctions(code: string): string {
	const functionBlocks = code.match(/@[\s\S]+?(?=\n@|$)/g) ?? [];
	const markdownSections: string[] = [];

	for (const block of functionBlocks) {
		const funcMatch = block.match(/(?:@(\w+)(?:\("(.+?)"\))?\s*)*?(async\s+)?def\s+(\w+)\(([^)]*)\):/);

		if (!funcMatch) continue;

		const [, , , , funcName, paramStr] = funcMatch;
		const params = paramStr ? paramStr.split(",").map((p) => p.trim()) : [];
		const docMatch = block.match(/""".*?"""|'''.*?'''/s);
		const doc = docMatch ? docMatch[0].replace(/^["']{3}|["']{3}$/g, "").trim() : "";
		const lines = doc.split("\n").map((line) => line.trim());

		const summary = lines[0] || "";
		let mode: "args" | "returns" | null = null;
		const args: FunctionArg[] = [];
		let returns: FunctionReturn | null = null;

		for (const line of lines.slice(1)) {
			if (/^Arguments?:/.test(line)) {
				mode = "args";
				continue;
			} else if (/^Returns?:/.test(line)) {
				mode = "returns";
				continue;
			}

			if (mode === "args") {
				const match = line.match(/^(\w+)\s*\(([^)]+)\):\s*(.+)$/);
				if (match) {
					args.push({ name: match[1], type: match[2], description: match[3] });
				}
			} else if (mode === "returns") {
				const match = line.match(/^([^:]+):\s*(.+)$/);
				if (match) {
					returns = { type: match[1].trim(), description: match[2].trim() };
				}
			}
		}

		// Build Markdown
		const sig = `${funcName}(${params.join(", ")})`;
		let md = `### \`${sig}\`\n\n`;
		md += `**Description:**  \n${summary}\n\n`;

		if (args.length > 0) {
			md += `**Arguments:**\n`;
			for (const arg of args) {
				md += `- \`${arg.name}\` (\`${arg.type}\`): ${arg.description}\n`;
			}
			md += `\n`;
		}

		if (returns) {
			md += `**Returns:**\n- \`${returns.type}\`: ${returns.description}\n\n`;
		}

		markdownSections.push(md.trim());
	}

	return markdownSections.join("\n\n---\n\n");
}
