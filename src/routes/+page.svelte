<script lang="ts">
	import { onMount } from "svelte";
	import * as THREE from "three";
	import { Lensflare, LensflareElement } from "three/examples/jsm/objects/Lensflare.js";
	import Button from "$lib/components/ui/button.svelte";
	import TutorialSection from "$lib/components/tutorial.svelte";

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
			<h2 class="section__title">Master Python by Outsmarting <i>Zayac</i> — With AI as Your Teammate</h2>
			<p class="section__text">
				You have gotten access into the control room of <i>Zayac</i> - an evil robot from the series <i>Well, Just You Wait!</i> The room is modern, in
				2050 there are no developers around and the only way you can write code is my talking to AI which will write the code for you. You have to give
				it the right instructions, otherwise it will not work. The AI is a bit dumb, so you have to be very precise in your instructions. You can use only
				a limited set of functions, but you can combine them in any way you want.
			</p>
			<div class="section__cta">
				<Button href="/gameselect" variant="primary">Play Now</Button>
				<Button href="/about" variant="secondary">Learn More</Button>
			</div>
			<p class="section__tagline">Learn to think like a developer — by learning to prompt like one.</p>
		</div>
	</section>
	<TutorialSection />
</div>
