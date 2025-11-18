// LEGACY – non utilisé dans la version actuelle du site. À supprimer après vérification.
/**
 * BookHero - Hero 3D avec livre animé
 * Utilise Three.js pour créer un livre 3D avec mots-clés animés
 */

import * as THREE from 'three';

const KEYWORDS = ['Prestige', 'Émotion', 'Compréhension', 'Narration', 'Performance'];

export class BookHero {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.currentKeywordIndex = 0;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.book = null;
    this.particles = [];
    this.textMesh = null;
    this.animationId = null;

    // Détection de la préférence de mouvement réduit
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Détection mobile
    this.isMobile = window.innerWidth < 768;

    this.init();
  }

  init() {
    this.setupScene();
    this.setupCamera();
    this.setupRenderer();
    this.setupLights();
    this.createBook();
    if (!this.isMobile && !this.prefersReducedMotion) {
      this.createParticles();
    }
    this.createKeywordText();

    this.animate();
    this.handleResize();
    this.startKeywordCycle();
  }

  setupScene() {
    this.scene = new THREE.Scene();
    // Gradient background from black to dark grey
    this.scene.background = new THREE.Color(0x0a0a0a);
    this.scene.fog = new THREE.Fog(0x0a0a0a, 10, 50);
  }

  setupCamera() {
    this.camera = new THREE.PerspectiveCamera(
      45,
      this.container.clientWidth / this.container.clientHeight,
      0.1,
      100
    );
    this.camera.position.set(0, 2, 8);
    this.camera.lookAt(0, 0, 0);
  }

  setupRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: !this.isMobile,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = !this.isMobile;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.container.appendChild(this.renderer.domElement);
  }

  setupLights() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(ambientLight);

    // Main point light (desk lamp effect)
    const pointLight = new THREE.PointLight(0xfff5e6, 1.2, 20);
    pointLight.position.set(0, 4, 3);
    pointLight.castShadow = !this.isMobile;
    if (!this.isMobile) {
      pointLight.shadow.mapSize.width = 1024;
      pointLight.shadow.mapSize.height = 1024;
    }
    this.scene.add(pointLight);

    // Accent light (golden glow)
    const accentLight = new THREE.PointLight(0xd4af37, 0.6, 15);
    accentLight.position.set(-3, 1, 2);
    this.scene.add(accentLight);
  }

  createBook() {
    const bookGroup = new THREE.Group();

    // Book cover (left)
    const coverGeometry = new THREE.BoxGeometry(1.5, 2, 0.05);
    const coverMaterial = new THREE.MeshStandardMaterial({
      color: 0x8b4513,
      roughness: 0.7,
      metalness: 0.2
    });
    const leftCover = new THREE.Mesh(coverGeometry, coverMaterial);
    leftCover.position.set(-0.75, 0, 0);
    leftCover.rotation.y = Math.PI * 0.05;
    leftCover.castShadow = true;
    bookGroup.add(leftCover);

    // Book cover (right)
    const rightCover = leftCover.clone();
    rightCover.position.set(0.75, 0, 0);
    rightCover.rotation.y = -Math.PI * 0.05;
    bookGroup.add(rightCover);

    // Book pages
    const pageGeometry = new THREE.BoxGeometry(1.4, 1.95, 0.3);
    const pageMaterial = new THREE.MeshStandardMaterial({
      color: 0xf5f5dc,
      roughness: 0.9,
      metalness: 0
    });
    const pages = new THREE.Mesh(pageGeometry, pageMaterial);
    pages.castShadow = true;
    pages.receiveShadow = true;
    bookGroup.add(pages);

    // Golden spine detail
    const spineGeometry = new THREE.BoxGeometry(0.1, 2.05, 0.35);
    const spineMaterial = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.3,
      metalness: 0.8,
      emissive: 0xd4af37,
      emissiveIntensity: 0.2
    });
    const spine = new THREE.Mesh(spineGeometry, spineMaterial);
    spine.castShadow = true;
    bookGroup.add(spine);

    bookGroup.rotation.x = -0.1;
    this.book = bookGroup;
    this.scene.add(bookGroup);
  }

  createParticles() {
    const particleCount = 50;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = [];

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 4;
      positions[i * 3 + 1] = Math.random() * 3;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4;

      velocities.push({
        y: 0.01 + Math.random() * 0.02,
        life: Math.random()
      });
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0xd4af37,
      size: 0.05,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });

    const particleSystem = new THREE.Points(geometry, material);
    this.particles = { mesh: particleSystem, velocities, geometry };
    this.scene.add(particleSystem);
  }

  createKeywordText() {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 512;
    canvas.height = 128;

    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity: 0
    });

    const geometry = new THREE.PlaneGeometry(3, 0.75);
    this.textMesh = new THREE.Mesh(geometry, material);
    this.textMesh.position.set(0, 0.5, 1.5);
    this.scene.add(this.textMesh);

    this.textCanvas = canvas;
    this.textContext = context;
    this.textTexture = texture;
  }

  updateKeywordText(keyword, opacity = 1) {
    const ctx = this.textContext;
    const canvas = this.textCanvas;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#d4af37';
    ctx.font = 'bold 80px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(keyword, canvas.width / 2, canvas.height / 2);

    this.textTexture.needsUpdate = true;
    this.textMesh.material.opacity = opacity;
  }

  startKeywordCycle() {
    let fadeIn = true;
    let opacity = 0;

    const updateCycle = () => {
      if (fadeIn) {
        opacity += 0.02;
        if (opacity >= 1) {
          opacity = 1;
          fadeIn = false;
          setTimeout(() => {
            fadeIn = false;
          }, 2000);
        }
      } else {
        opacity -= 0.02;
        if (opacity <= 0) {
          opacity = 0;
          fadeIn = true;
          this.currentKeywordIndex = (this.currentKeywordIndex + 1) % KEYWORDS.length;
        }
      }

      this.updateKeywordText(KEYWORDS[this.currentKeywordIndex], opacity);
      requestAnimationFrame(updateCycle);
    };

    updateCycle();
  }

  animate() {
    this.animationId = requestAnimationFrame(() => this.animate());

    const time = Date.now() * 0.001;

    // Rotate book gently
    if (this.book && !this.prefersReducedMotion) {
      this.book.rotation.y = Math.sin(time * 0.2) * 0.1;
    }

    // Animate particles
    if (this.particles.mesh && !this.isMobile && !this.prefersReducedMotion) {
      const positions = this.particles.geometry.attributes.position.array;

      for (let i = 0; i < this.particles.velocities.length; i++) {
        positions[i * 3 + 1] += this.particles.velocities[i].y;

        if (positions[i * 3 + 1] > 3) {
          positions[i * 3 + 1] = 0;
        }
      }

      this.particles.geometry.attributes.position.needsUpdate = true;
    }

    this.renderer.render(this.scene, this.camera);
  }

  handleResize() {
    window.addEventListener('resize', () => {
      const width = this.container.clientWidth;
      const height = this.container.clientHeight;

      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(width, height);
    });
  }

  dispose() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    if (this.renderer) {
      this.renderer.dispose();
    }
  }
}

export function initBookHero() {
  const bookHero = new BookHero('book-hero-canvas');

  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    if (bookHero) {
      bookHero.dispose();
    }
  });

  console.log('✅ BookHero initialized');
}
