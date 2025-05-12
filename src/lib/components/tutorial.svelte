<script lang="ts">
	import getLevelCode from "$lib/python/get-level-code";
	import { parsePythonFunctions } from "$lib/python/pydoc-parser";
	import { marked } from "marked";
	import Tab from "./tabs/tab.svelte";
	import TabList from "./tabs/tabList.svelte";
	import TabPanel from "./tabs/tabPanel.svelte";
	import Tabs from "./tabs/tabs.svelte";
</script>

<section class="section tutorial" id="tutorial">
	<div class="container">
		<h2 class="section__title">Tutorial</h2>
		<Tabs orientation="vertical">
			<TabList>
				<Tab name="overview">Overview</Tab>
				<Tab name="functions">Functions</Tab>
				<Tab name="tips">Prompting Tips</Tab>
			</TabList>

			<TabPanel name="overview">
				<div class="tutorial__section">
					<p class="tutorial__title">Welcome to Prompt or Get Prompted!</p>
					<p class="tutorial__paragraph">
						Code Block AI is a playful, AI-driven way to learn Python through a coding puzzle game. You’ll control a cube that navigates a 2D map
						using predefined Python functions. But here's the twist — you don't write the code yourself. Instead, you guide an AI with smart prompts
						that generate the code for you.
					</p>

					<img src="https://placehold.co/600x400" alt="Game objective screenshot" class="tutorial__img" />
				</div>
				<div class="tutorial__section">
					<p class="tutorial__title">🎯 Your Goal</p>
					<p class="tutorial__paragraph">
						Move <i>Zayac</i> from the <strong>start</strong> to the <strong>finish</strong> using code. You’ll do this by giving the AI a prompt like:
					</p>
					<pre class="tutorial__code">
<code>
Move the character forward 3 steps, then turn right and move forward 2 steps.
</code>
</pre>
					<p class="tutorial__paragraph">The AI will convert your prompt into Python using a restricted set of allowed functions, like:</p>
					<pre class="tutorial__code">
<code class="language-python">
move_forward(3)
turn_right()
move_forward(2)
</code>
</pre>
					<p class="tutorial__paragraph">The AI will get less cooperative as you progress, so be precise in your prompts.</p>
				</div>
				<div class="tutorial__section">
					<p class="tutorial__title">🚀 Tips to Succeed</p>
					<ul class="tutorial__list">
						<li>Use short, clear prompts like "go forward 5 steps" or "turn left, then forward 2".</li>
						<li>You can undo and retry — explore freely!</li>
						<li>Focus on the *goal*, not the syntax. Let AI handle the code.</li>
					</ul>

					<p class="tutorial__paragraph">
						Ready? Go to the <strong>Functions</strong> tab to see all commands, or jump into a level!
					</p>
				</div>
			</TabPanel>

			<TabPanel name="functions">
				<p class="tutorial__paragraph">
					Ready? Go to the <strong>Functions</strong> tab to see all commands, or jump into a level!

					<br />

					{#await getLevelCode(1) then code}
						{@html marked("---\n\n" + parsePythonFunctions(code))}
					{/await}
				</p>
			</TabPanel>

			<TabPanel name="tips">
				<p class="tutorial__paragraph">Here are some resources to learn AI prompting:</p>
				<ul class="tutorial__list">
					<li><a href="https://learnprompting.org/" class="tutorial__link">Learnprompting</a></li>
					<li>
						<a href="https://help.openai.com/en/articles/10032626-prompt-engineering-best-practices-for-chatgpt" class="tutorial__link"
							>OpenAI Prompt Engineering</a
						>
					</li>
					<li>
						<a href="https://cookbook.openai.com/examples/gpt4-1_prompting_guide" class="tutorial__link">OpenAI Cookbook: GPT-4 Prompting Guide</a>
					</li>
				</ul>
			</TabPanel>
		</Tabs>
	</div>
</section>
