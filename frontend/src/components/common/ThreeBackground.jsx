import { useEffect, useRef } from 'react';
import * as THREE from 'three';

function ThreeBackground() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) {
      return undefined;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 14;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const material = new THREE.MeshStandardMaterial({
      color: 0xd89f2d,
      metalness: 0.25,
      roughness: 0.5,
      transparent: true,
      opacity: 0.25
    });

    const torus = new THREE.Mesh(new THREE.TorusKnotGeometry(2.2, 0.55, 110, 16), material);
    const sphere = new THREE.Mesh(new THREE.SphereGeometry(1.2, 32, 32), material);
    sphere.position.set(-4.8, -2.2, -2.5);

    const ring = new THREE.Mesh(new THREE.TorusGeometry(3.6, 0.2, 24, 120), material);
    ring.position.set(5.2, 2.6, -4);

    group.add(torus, sphere, ring);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    const pointLight = new THREE.PointLight(0xffcc73, 1.2, 100);
    pointLight.position.set(8, 10, 14);

    scene.add(ambientLight, pointLight);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      group.rotation.x += 0.0018;
      group.rotation.y += 0.0022;
      torus.rotation.z -= 0.0012;
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      material.dispose();
      torus.geometry.dispose();
      sphere.geometry.dispose();
      ring.geometry.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="three-bg" aria-hidden="true" />;
}

export default ThreeBackground;
