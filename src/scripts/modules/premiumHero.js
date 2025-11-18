// LEGACY – non utilisé dans la version actuelle du site. À supprimer après vérification.
/**
 * PremiumHero - Hero 3D Premium avec objets flottants
 * Concept: "L'Encre Vivante" - Les mots prennent vie
 * Design: Niveau Dribbble/Awwwards
 */

import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Couleurs du design system
const COLORS = {
  gold: 0xd4af37,
  white: 0xffffff,
  primary: 0xb8441e,
  dark: 0x0a0a0a,
};

// Configuration des objets 3D (représentent les valeurs)
const FLOATING_OBJECTS = [
  {
    type: 'crown',
    position: { x: -3, y: 2, z: -1 },
    rotation: { x: 0.2, y: 0, z: 0.1 },
    scale: 0.6,
    floatSpeed: 0.8,
    floatAmplitude: 0.3,
    rotationSpeed: 0.3,
  },
  {
    type: 'heart',
    position: { x: 3, y: 1, z: 0 },
    rotation: { x: 0, y: 0.5, z: 0 },
    scale: 0.5,
    floatSpeed: 1.2,
    floatAmplitude: 0.4,
    rotationSpeed: 0.5,
  },
  {
    type: 'book',
    position: { x: -2, y: -1, z: 1 },
    rotation: { x: -0.3, y: 0.4, z: 0 },
    scale: 0.7,
    floatSpeed: 1.0,
    floatAmplitude: 0.25,
    rotationSpeed: 0.2,
  },
  {
    type: 'music',
    position: { x: 2.5, y: -1.5, z: -0.5 },
    rotation: { x: 0, y: -0.3, z: 0.2 },
    scale: 0.55,
    floatSpeed: 0.9,
    floatAmplitude: 0.35,
    rotationSpeed: 0.4,
  },
  {
    type: 'stage',
    position: { x: 0, y: 0.5, z: -2 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: 0.4,
    floatSpeed: 0.7,
    floatAmplitude: 0.2,
    rotationSpeed: 0.25,
  },
];

export class PremiumHero {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      console.warn('PremiumHero: Container not found');
      return;
    }

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.objects = [];
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.animationId = null;
    this.clock = new THREE.Clock();

    // Détection préférences
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.isMobile = window.innerWidth < 768;

    // Support WebGL check
    if (!this.checkWebGLSupport()) {
      this.showFallback();
      return;
    }

    this.init();
  }

  checkWebGLSupport() {
    try {
      const canvas = document.createElement('canvas');
      return !!(
        window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
      );
    } catch (e) {
      return false;
    }
  }

  showFallback() {
    // Fallback: simple gradient animé
    this.container.style.background =
      'linear-gradient(135deg, #0a0a0a 0%, #1a2332 50%, #0a0a0a 100%)';
    this.container.style.backgroundSize = '200% 200%';
    if (!this.prefersReducedMotion) {
      this.container.style.animation = 'gradientShift 15s ease infinite';
    }

    // Add CSS animation if not exists
    if (!document.querySelector('#premium-hero-fallback-styles')) {
      const style = document.createElement('style');
      style.id = 'premium-hero-fallback-styles';
      style.textContent = `
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `;
      document.head.appendChild(style);
    }

    console.log('⚠️ WebGL not supported, using fallback gradient');
  }

  init() {
    this.setupScene();
    this.setupCamera();
    this.setupRenderer();
    this.setupLights();
    this.createFloatingObjects();
    this.setupMouseTracking();
    this.setupScrollAnimation();
    this.animate();
    this.handleResize();

    console.log('✨ PremiumHero initialized with', this.objects.length, 'objects');
  }

  setupScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(COLORS.dark);
    this.scene.fog = new THREE.Fog(COLORS.dark, 8, 20);
  }

  setupCamera() {
    const aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(50, aspect, 0.1, 100);
    this.camera.position.set(0, 0, 8);
    this.camera.lookAt(0, 0, 0);
  }

  setupRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: !this.isMobile,
      alpha: true,
      powerPreference: this.isMobile ? 'low-power' : 'high-performance',
    });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, this.isMobile ? 1.5 : 2));
    this.renderer.shadowMap.enabled = !this.isMobile;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    this.container.appendChild(this.renderer.domElement);
  }

  setupLights() {
    // Ambient light (base illumination)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    this.scene.add(ambientLight);

    // Main directional light (key light)
    const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
    mainLight.position.set(5, 5, 5);
    mainLight.castShadow = !this.isMobile;
    if (!this.isMobile) {
      mainLight.shadow.mapSize.width = 1024;
      mainLight.shadow.mapSize.height = 1024;
      mainLight.shadow.camera.near = 0.5;
      mainLight.shadow.camera.far = 50;
    }
    this.scene.add(mainLight);

    // Gold accent light (signature touch)
    const goldLight = new THREE.PointLight(COLORS.gold, 1.5, 10);
    goldLight.position.set(-3, 2, 3);
    this.scene.add(goldLight);

    // Secondary accent light
    const accentLight = new THREE.PointLight(0xffffff, 0.8, 12);
    accentLight.position.set(3, -2, 2);
    this.scene.add(accentLight);

    // Rim light (dramatic edge lighting)
    const rimLight = new THREE.DirectionalLight(COLORS.gold, 0.4);
    rimLight.position.set(-5, 0, -5);
    this.scene.add(rimLight);
  }

  createFloatingObjects() {
    // Réduire le nombre d'objets sur mobile
    const objectsToCreate = this.isMobile
      ? FLOATING_OBJECTS.slice(0, 3)
      : FLOATING_OBJECTS;

    objectsToCreate.forEach((config) => {
      const mesh = this.createObject(config.type);
      if (!mesh) return;

      mesh.position.set(config.position.x, config.position.y, config.position.z);
      mesh.rotation.set(config.rotation.x, config.rotation.y, config.rotation.z);
      mesh.scale.setScalar(config.scale);

      // Store config for animation
      mesh.userData = {
        ...config,
        initialPosition: { ...config.position },
        initialRotation: { ...config.rotation },
        floatOffset: Math.random() * Math.PI * 2, // Random starting point for float animation
      };

      this.objects.push(mesh);
      this.scene.add(mesh);
    });
  }

  createObject(type) {
    switch (type) {
      case 'crown':
        return this.createCrown();
      case 'heart':
        return this.createHeart();
      case 'book':
        return this.createBook();
      case 'music':
        return this.createMusicNote();
      case 'stage':
        return this.createStage();
      default:
        return null;
    }
  }

  // Glass morphism material avec gold accents
  createGlassMaterial(color = COLORS.white, emissiveIntensity = 0.1) {
    return new THREE.MeshPhysicalMaterial({
      color: color,
      metalness: 0.2,
      roughness: 0.1,
      transmission: 0.6, // Glass effect
      thickness: 0.5,
      transparent: true,
      opacity: 0.85,
      emissive: COLORS.gold,
      emissiveIntensity: emissiveIntensity,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      envMapIntensity: 1.5,
      side: THREE.DoubleSide,
    });
  }

  createCrown() {
    const group = new THREE.Group();

    // Base de la couronne (cercle)
    const baseGeometry = new THREE.TorusGeometry(0.5, 0.05, 16, 32);
    const baseMaterial = this.createGlassMaterial(COLORS.gold, 0.3);
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.rotation.x = Math.PI / 2;
    group.add(base);

    // Pointes de la couronne (5 pics)
    const peakGeometry = new THREE.ConeGeometry(0.08, 0.4, 8);
    const peakMaterial = this.createGlassMaterial(COLORS.gold, 0.4);

    for (let i = 0; i < 5; i++) {
      const peak = new THREE.Mesh(peakGeometry, peakMaterial);
      const angle = (i / 5) * Math.PI * 2;
      peak.position.set(Math.cos(angle) * 0.5, 0.2, Math.sin(angle) * 0.5);
      peak.castShadow = !this.isMobile;
      group.add(peak);
    }

    return group;
  }

  createHeart() {
    const heartShape = new THREE.Shape();

    // Dessin du coeur
    const x = 0,
      y = 0;
    heartShape.moveTo(x, y);
    heartShape.bezierCurveTo(x, y - 0.3, x - 0.5, y - 0.3, x - 0.5, y);
    heartShape.bezierCurveTo(x - 0.5, y + 0.3, x, y + 0.6, x, y + 1);
    heartShape.bezierCurveTo(x, y + 0.6, x + 0.5, y + 0.3, x + 0.5, y);
    heartShape.bezierCurveTo(x + 0.5, y - 0.3, x, y - 0.3, x, y);

    const extrudeSettings = {
      depth: 0.2,
      bevelEnabled: true,
      bevelThickness: 0.05,
      bevelSize: 0.05,
      bevelSegments: 3,
    };

    const geometry = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
    const material = this.createGlassMaterial(0xff6b9d, 0.2);
    const heart = new THREE.Mesh(geometry, material);
    heart.castShadow = !this.isMobile;
    heart.position.y = -0.5; // Center the heart

    return heart;
  }

  createBook() {
    const group = new THREE.Group();

    // Left cover
    const coverGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.05);
    const coverMaterial = this.createGlassMaterial(0x8b4513, 0.15);
    const leftCover = new THREE.Mesh(coverGeometry, coverMaterial);
    leftCover.position.x = -0.32;
    leftCover.rotation.y = -Math.PI * 0.1;
    leftCover.castShadow = !this.isMobile;
    group.add(leftCover);

    // Right cover
    const rightCover = leftCover.clone();
    rightCover.position.x = 0.32;
    rightCover.rotation.y = Math.PI * 0.1;
    group.add(rightCover);

    // Pages
    const pagesGeometry = new THREE.BoxGeometry(0.58, 0.78, 0.15);
    const pagesMaterial = this.createGlassMaterial(0xf5f5dc, 0.1);
    const pages = new THREE.Mesh(pagesGeometry, pagesMaterial);
    pages.castShadow = !this.isMobile;
    group.add(pages);

    // Golden spine
    const spineGeometry = new THREE.BoxGeometry(0.05, 0.82, 0.16);
    const spineMaterial = this.createGlassMaterial(COLORS.gold, 0.4);
    const spine = new THREE.Mesh(spineGeometry, spineMaterial);
    spine.castShadow = !this.isMobile;
    group.add(spine);

    return group;
  }

  createMusicNote() {
    const group = new THREE.Group();

    // Staff lines (portée)
    const lineMaterial = this.createGlassMaterial(COLORS.gold, 0.3);
    for (let i = 0; i < 5; i++) {
      const lineGeometry = new THREE.BoxGeometry(1, 0.02, 0.02);
      const line = new THREE.Mesh(lineGeometry, lineMaterial);
      line.position.y = (i - 2) * 0.15;
      group.add(line);
    }

    // Note head (ronde)
    const noteHeadGeometry = new THREE.SphereGeometry(0.12, 16, 16);
    const noteHeadMaterial = this.createGlassMaterial(COLORS.white, 0.2);
    const noteHead = new THREE.Mesh(noteHeadGeometry, noteHeadMaterial);
    noteHead.position.set(-0.2, 0.3, 0);
    noteHead.scale.set(1, 0.8, 0.5); // Ellipse
    noteHead.castShadow = !this.isMobile;
    group.add(noteHead);

    // Note stem (hampe)
    const stemGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.6, 8);
    const stemMaterial = this.createGlassMaterial(COLORS.white, 0.2);
    const stem = new THREE.Mesh(stemGeometry, stemMaterial);
    stem.position.set(-0.2, 0.6, 0);
    group.add(stem);

    return group;
  }

  createStage() {
    const group = new THREE.Group();

    // Stage floor
    const floorGeometry = new THREE.BoxGeometry(1.2, 0.05, 0.8);
    const floorMaterial = this.createGlassMaterial(0x3d2817, 0.1);
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.castShadow = !this.isMobile;
    group.add(floor);

    // Curtains (left and right)
    const curtainGeometry = new THREE.PlaneGeometry(0.3, 0.6);
    const curtainMaterial = this.createGlassMaterial(0x8b0000, 0.15);

    const leftCurtain = new THREE.Mesh(curtainGeometry, curtainMaterial);
    leftCurtain.position.set(-0.5, 0.3, 0);
    group.add(leftCurtain);

    const rightCurtain = new THREE.Mesh(curtainGeometry, curtainMaterial);
    rightCurtain.position.set(0.5, 0.3, 0);
    group.add(rightCurtain);

    // Spotlight
    const spotlightGeometry = new THREE.ConeGeometry(0.15, 0.3, 8);
    const spotlightMaterial = this.createGlassMaterial(COLORS.gold, 0.5);
    const spotlight = new THREE.Mesh(spotlightGeometry, spotlightMaterial);
    spotlight.position.set(0, 0.5, 0);
    spotlight.rotation.x = Math.PI;
    group.add(spotlight);

    return group;
  }

  setupMouseTracking() {
    if (this.prefersReducedMotion) return;

    const handleMouseMove = (event) => {
      // Normaliser les coordonnées de la souris entre -1 et 1
      this.mouse.targetX = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouse.targetY = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    // Throttle mouse events for performance
    let lastMoveTime = 0;
    const throttleDelay = 16; // ~60fps

    window.addEventListener('mousemove', (event) => {
      const now = Date.now();
      if (now - lastMoveTime >= throttleDelay) {
        handleMouseMove(event);
        lastMoveTime = now;
      }
    });

    // Reset on mouse leave
    window.addEventListener('mouseleave', () => {
      this.mouse.targetX = 0;
      this.mouse.targetY = 0;
    });
  }

  setupScrollAnimation() {
    if (!window.ScrollTrigger) return;

    // Animate objects on scroll
    ScrollTrigger.create({
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;

        this.objects.forEach((obj) => {
          // Disperser vers le haut quand on scroll
          obj.position.y = obj.userData.initialPosition.y + progress * 5;
          obj.material.opacity = 0.85 * (1 - progress);

          // Rotation additionnelle au scroll
          obj.rotation.z = obj.userData.initialRotation.z + progress * Math.PI * 2;
        });
      },
    });
  }

  animate() {
    this.animationId = requestAnimationFrame(() => this.animate());

    const elapsedTime = this.clock.getElapsedTime();

    // Smooth mouse following (lerp)
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

    // Animate each object
    this.objects.forEach((obj, index) => {
      if (this.prefersReducedMotion) return;

      const config = obj.userData;

      // Float animation (up and down)
      const floatY =
        Math.sin(elapsedTime * config.floatSpeed + config.floatOffset) * config.floatAmplitude;
      obj.position.y = config.initialPosition.y + floatY;

      // Slow rotation
      obj.rotation.y += config.rotationSpeed * 0.01;

      // Parallax inverse: objets s'éloignent du curseur
      if (!this.isMobile) {
        const parallaxStrength = 0.5;
        const offsetX = -this.mouse.x * parallaxStrength * (index % 2 === 0 ? 1 : -1);
        const offsetZ = -this.mouse.y * parallaxStrength;

        obj.position.x = config.initialPosition.x + offsetX;
        obj.position.z = config.initialPosition.z + offsetZ;
      }
    });

    this.renderer.render(this.scene, this.camera);
  }

  handleResize() {
    const resizeHandler = () => {
      if (!this.container || !this.camera || !this.renderer) return;

      const width = this.container.clientWidth;
      const height = this.container.clientHeight;

      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(width, height);

      // Update mobile detection
      const wasMobile = this.isMobile;
      this.isMobile = window.innerWidth < 768;

      // Recreate objects if switching between mobile/desktop
      if (wasMobile !== this.isMobile) {
        this.objects.forEach((obj) => this.scene.remove(obj));
        this.objects = [];
        this.createFloatingObjects();
      }
    };

    // Debounce resize for performance
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resizeHandler, 100);
    });
  }

  dispose() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }

    this.objects.forEach((obj) => {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (Array.isArray(obj.material)) {
          obj.material.forEach((mat) => mat.dispose());
        } else {
          obj.material.dispose();
        }
      }
    });

    if (this.renderer) {
      this.renderer.dispose();
      if (this.renderer.domElement && this.renderer.domElement.parentNode) {
        this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
      }
    }

    if (window.ScrollTrigger) {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === document.getElementById('hero')) {
          st.kill();
        }
      });
    }

    console.log('🧹 PremiumHero disposed');
  }
}

/**
 * Initialize Premium Hero
 */
export function initPremiumHero() {
  const premiumHero = new PremiumHero('premium-hero-canvas');

  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    if (premiumHero) {
      premiumHero.dispose();
    }
  });

  return premiumHero;
}
