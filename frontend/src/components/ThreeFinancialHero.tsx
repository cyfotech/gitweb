import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function ThreeFinancialHero() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 7);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x49E3D6, 4, 50);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x315F69, 3, 50);
    pointLight2.position.set(-5, -5, -5);
    scene.add(pointLight2);

    // Central Financial Node / Crystal (Icosahedron + Wireframe)
    const geometry = new THREE.IcosahedronGeometry(1.8, 1);
    const material = new THREE.MeshPhysicalMaterial({
      color: 0x0B3C44,
      roughness: 0.2,
      metalness: 0.8,
      transmission: 0.6,
      thickness: 1.2,
      transparent: true,
      opacity: 0.85,
      wireframe: false,
    });
    const centralCore = new THREE.Mesh(geometry, material);
    scene.add(centralCore);

    // Outer wireframe cage
    const wireGeo = new THREE.IcosahedronGeometry(2.2, 1);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x49E3D6,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });
    const wireCage = new THREE.Mesh(wireGeo, wireMat);
    scene.add(wireCage);

    // Floating Financial Panel Nodes (Orbiting data nodes)
    const nodeCount = 6;
    const nodeGroup = new THREE.Group();
    scene.add(nodeGroup);

    const nodes: { mesh: THREE.Mesh; orbitRadius: number; speed: number; angle: number }[] = [];
    for (let i = 0; i < nodeCount; i++) {
      const nodeGeo = new THREE.BoxGeometry(0.8, 0.5, 0.08);
      const nodeMat = new THREE.MeshStandardMaterial({
        color: 0x071C25,
        emissive: 0x2CCFC5,
        emissiveIntensity: 0.3,
        roughness: 0.3,
        metalness: 0.8,
        transparent: true,
        opacity: 0.9,
      });
      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
      
      const orbitRadius = 3.2 + (i * 0.4);
      const angle = (i / nodeCount) * Math.PI * 2;
      
      nodeMesh.position.x = Math.cos(angle) * orbitRadius;
      nodeMesh.position.z = Math.sin(angle) * orbitRadius;
      nodeMesh.position.y = (Math.random() - 0.5) * 2;

      nodeGroup.add(nodeMesh);
      nodes.push({ mesh: nodeMesh, orbitRadius, speed: 0.003 + (i * 0.001), angle });
    }

    // Particle Field representing tax data streams
    const particleCount = 120;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 15;
      particlePositions[i + 1] = (Math.random() - 0.5) * 15;
      particlePositions[i + 2] = (Math.random() - 0.5) * 15;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x49E3D6,
      size: 0.06,
      transparent: true,
      opacity: 0.6,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // Mouse Parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Scroll Parallax & Zoom (Bidirectional scroll reaction)
    let scrollProgress = 0;
    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      scrollProgress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse damping
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      // Rotate central core and wire cage
      centralCore.rotation.x = elapsedTime * 0.2 + targetY * 0.5;
      centralCore.rotation.y = elapsedTime * 0.3 + targetX * 0.5;

      wireCage.rotation.x = -elapsedTime * 0.15;
      wireCage.rotation.y = -elapsedTime * 0.2;

      // Orbit nodes
      nodes.forEach((n) => {
        n.angle += n.speed;
        n.mesh.position.x = Math.cos(n.angle) * (n.orbitRadius + scrollProgress * 2);
        n.mesh.position.z = Math.sin(n.angle) * (n.orbitRadius + scrollProgress * 2);
        n.mesh.rotation.y += 0.01;
      });

      // Particle rotation
      particleSystem.rotation.y = elapsedTime * 0.05;

      // Camera zoom/dolly based on scroll progress (bidirectional)
      camera.position.z = 7 - scrollProgress * 3;
      camera.position.x = targetX * 1.2;
      camera.position.y = targetY * 1.2 + scrollProgress * 1.5;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden opacity-85 dark:opacity-95"
    />
  );
}
