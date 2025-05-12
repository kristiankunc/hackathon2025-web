<script lang="ts">
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
					<p class="tutorial__title">Welcome to Code Block AI!</p>
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
						Move the cube from the <strong>start</strong> to the <strong>goal</strong> using code. You’ll do this by giving the AI a prompt like:
					</p>
					<pre class="tutorial__code">
<code>
Move the cube forward 3 steps, then turn right and go forward 2 more steps.
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
				</div>
				<div class="tutorial__section">
					<p class="tutorial__title">🧠 Why Prompt-Based?</p>
					<p class="tutorial__paragraph">
						This game teaches you how to think like a developer — not just in code, but in *instructions*. It’s also a gentle introduction to prompt
						engineering, which is a growing skill in AI development.
					</p>
				</div>
				<img src="https://placehold.co/600" alt="Prompt to code conversion illustration" class="tutorial__img" />
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
				<p>These are the predefined Python functions you can use in your prompts.</p>
			</TabPanel>

			<TabPanel name="tips">
				<p>Write effective prompts to help AI generate optimal code solutions.</p>
			</TabPanel>
		</Tabs>
	</div>
</section>
