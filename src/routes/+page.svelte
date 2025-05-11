<script lang="ts">
	import { onMount } from "svelte";
	import * as THREE from "three";
	import { Lensflare, LensflareElement } from "three/examples/jsm/objects/Lensflare.js";

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
		document.body.appendChild(renderer.domElement);

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
		addLight(0.08, 0.8, 0.5, 0, 0, -1000);
		addLight(0.55, 0.9, 0.5, 500, 0, -1000);
		addLight(0.995, 0.5, 0.9, -500, 0, -1000);

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

<section class="section hero">
	<div class="container">
		<h2 class="section__title">Hero</h2>
		<p class="section__text">
			Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa ullam, expedita assumenda maiores quae mollitia repellat maxime illo sapiente
			libero laborum accusantium numquam impedit nisi dolorum, reprehenderit commodi incidunt quaerat suscipit ex harum aperiam! Pariatur, aliquam
			vitae in quisquam eaque sapiente autem. Itaque harum iusto dolorum debitis nam consectetur nemo vel, natus officia expedita consequuntur nisi ab
			aliquid impedit exercitationem qui voluptates molestias dicta. Odio explicabo beatae corrupti, quaerat exercitationem itaque totam quibusdam
			animi amet accusantium doloribus eveniet quidem asperiores quisquam sit minus aliquam, molestias laudantium soluta in a! Aspernatur omnis ut
			voluptatibus. Reprehenderit nisi tempore quia sed blanditiis vitae quae minima fugit, maxime maiores nemo eum rem, neque libero totam quos
			culpa? Vitae assumenda voluptatum beatae velit esse. Aperiam beatae ullam excepturi sed quas sunt tempora non esse voluptatem molestias. Aperiam
			quibusdam mollitia alias dicta doloremque sequi, accusamus dolorum eaque fugiat blanditiis non itaque enim. Quidem dolor magnam deserunt odit
			praesentium nam laudantium hic repellendus quo dignissimos, corporis, suscipit officia reiciendis illo. Dicta quibusdam illo delectus unde
			temporibus corrupti quod sint? Quibusdam, cum, asperiores ab enim nulla a repellat id tenetur quod ducimus necessitatibus laboriosam harum
			deleniti corrupti omnis. Officiis numquam ad ducimus maiores ab corrupti molestiae? Excepturi, odio.
		</p>
	</div>
</section>
<section class="section tutorial">
	<div class="container">
		<h2 class="section__title">Tutorial</h2>
		<p class="section__text">
			Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa ullam, expedita assumenda maiores quae mollitia repellat maxime illo sapiente
			libero laborum accusantium numquam impedit nisi dolorum, reprehenderit commodi incidunt quaerat suscipit ex harum aperiam! Pariatur, aliquam
			vitae in quisquam eaque sapiente autem. Itaque harum iusto dolorum debitis nam consectetur nemo vel, natus officia expedita consequuntur nisi ab
			aliquid impedit exercitationem qui voluptates molestias dicta. Odio explicabo beatae corrupti, quaerat exercitationem itaque totam quibusdam
			animi amet accusantium doloribus eveniet quidem asperiores quisquam sit minus aliquam, molestias laudantium soluta in a! Aspernatur omnis ut
			voluptatibus. Reprehenderit nisi tempore quia sed blanditiis vitae quae minima fugit, maxime maiores nemo eum rem, neque libero totam quos
			culpa? Vitae assumenda voluptatum beatae velit esse. Aperiam beatae ullam excepturi sed quas sunt tempora non esse voluptatem molestias. Aperiam
			quibusdam mollitia alias dicta doloremque sequi, accusamus dolorum eaque fugiat blanditiis non itaque enim. Quidem dolor magnam deserunt odit
			praesentium nam laudantium hic repellendus quo dignissimos, corporis, suscipit officia reiciendis illo. Dicta quibusdam illo delectus unde
			temporibus corrupti quod sint? Quibusdam, cum, asperiores ab enim nulla a repellat id tenetur quod ducimus necessitatibus laboriosam harum
			deleniti corrupti omnis. Officiis numquam ad ducimus maiores ab corrupti molestiae? Excepturi, odio.
		</p>
	</div>
</section>
