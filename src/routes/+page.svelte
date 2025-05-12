<script lang="ts">
	import { onMount } from "svelte";
	import * as THREE from "three";
	import { Lensflare, LensflareElement } from "three/examples/jsm/objects/Lensflare.js";
	import Button from "$lib/components/ui/button.svelte";
	import Tabs from "$lib/components/tabs/tabs.svelte";
	import Tab from "$lib/components/tabs/tab.svelte";
	import TabList from "$lib/components/tabs/tabList.svelte";
	import TabPanel from "$lib/components/tabs/tabPanel.svelte";

	let canvasContainer: HTMLDivElement;
	let camera: THREE.PerspectiveCamera;
	let scene: THREE.Scene;
	let renderer: THREE.WebGLRenderer;
	let container: THREE.Object3D;
	let scrollY = 0;

	onMount(() => {
		scene = new THREE.Scene();
		scene.background = new THREE.Color(0x080808);
		scene.fog = new THREE.Fog(scene.background, 3500, 15000);

		camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 15000);
		camera.position.z = 250;

		renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setSize(window.innerWidth, window.innerHeight);
		canvasContainer.appendChild(renderer.domElement);

		container = new THREE.Object3D();
		scene.add(container);

		// kostky v pozadi
		const s = 250;
		const geometry = new THREE.BoxGeometry(s, s, s);
		const material = new THREE.MeshStandardMaterial({ color: 0xffffff });

		for (let i = 0; i < 3000; i++) {
			const mesh = new THREE.Mesh(geometry, material);
			mesh.position.set(8000 * (2.0 * Math.random() - 1.0), 8000 * (2.0 * Math.random() - 1.0), 8000 * (2.0 * Math.random() - 1.0));
			mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
			mesh.matrixAutoUpdate = false;
			mesh.updateMatrix();
			container.add(mesh);
		}

		const textureLoader = new THREE.TextureLoader();
		const textureFlare0 = textureLoader.load("/lensflare0.png");
		const textureFlare3 = textureLoader.load("/lensflare3.png");

		function addLight(h: number, s: number, l: number, x: number, y: number, z: number) {
			const light = new THREE.PointLight(0xffffff, 1.5, 2000);
			light.color.setHSL(h, s, l);
			light.position.set(x, y, z);
			container.add(light);

			const lensflare = new Lensflare();
			lensflare.addElement(new LensflareElement(textureFlare0, 700, 0, light.color));
			lensflare.addElement(new LensflareElement(textureFlare3, 60, 0.6));
			lensflare.addElement(new LensflareElement(textureFlare3, 70, 0.7));
			lensflare.addElement(new LensflareElement(textureFlare3, 120, 0.9));
			lensflare.addElement(new LensflareElement(textureFlare3, 70, 1));
			light.add(lensflare);
		}

		// svetla
		// addLight(0.08, 0.8, 0.5, 0, 0, -1000);
		addLight(0.1, 0.7, 0.5, 300, 0, -1000);
		addLight(0.995, 0.5, 0.9, -300, 0, -1000);
		addLight(0.1, 0.7, 0.5, 750, -400, -800);
		addLight(0.55, 0.9, 0.5, 1500, -400, -650);

		const dirLight = new THREE.DirectionalLight(0xffffff, 0.15);
		dirLight.position.set(0, -1, 0).normalize();
		dirLight.color.setHSL(0.1, 0.7, 0.5);
		scene.add(dirLight);

		const ambientLight = new THREE.AmbientLight(0x0d8ce0, 0.1);
		scene.add(ambientLight);

		// samotna animace
		function animate() {
			requestAnimationFrame(animate);

			container.rotation.y = scrollY * 0.001;
			container.rotation.x = scrollY * 0.0005;

			renderer.render(scene, camera);
		}

		animate();

		window.addEventListener("resize", onWindowResize);

		window.addEventListener("scroll", () => {
			scrollY = window.scrollY;
		});

		function onWindowResize() {
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(window.innerWidth, window.innerHeight);
		}

		return () => {
			window.removeEventListener("resize", onWindowResize);
			renderer.dispose();
		};
	});
</script>

<div class="wrapper" bind:this={canvasContainer}>
	<section class="section hero">
		<div class="container">
			<h2 class="section__title">Master Python by Outsmarting a Cube — With AI as Your Teammate</h2>
			<p class="section__text">
				Welcome to Code Block AI, a unique game where the only way to win is by guiding a cube through obstacles — using Python code you can't write
				yourself. Instead, you'll craft prompts and collaborate with AI to generate the logic. It's not just coding. It's prompt-powered
				problem-solving.
			</p>
			<div class="section__cta">
				<Button href="/gameselect" variant="primary">Play Now</Button>
				<Button href="/gameselect" variant="secondary">Play Now</Button>
				<Button href="/gameselect" variant="tertiary">Play Now</Button>
				<Button href="/gameselect">Play Now</Button>
				<!-- <Button href="/about">Learn More</Button> -->
			</div>
			<p class="section__tagline">Learn to think like a developer — by learning to prompt like one.</p>
		</div>
	</section>
	<section class="section tutorial">
		<div class="container">
			<h2 class="section__title">Tutorial</h2>

			<Tabs>
				<TabList>
					<Tab name="overview">Overview</Tab>
					<Tab name="functions">Functions</Tab>
					<Tab name="tips">Prompting Tips</Tab>
				</TabList>

				<TabPanel name="overview">
					<p>Welcome to Code Block AI! Learn how it works.</p>
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
</div>
