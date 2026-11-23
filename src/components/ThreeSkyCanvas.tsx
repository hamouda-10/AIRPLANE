import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

interface ThreeSkyCanvasProps {
  scrollProgressRef: React.MutableRefObject<number>;
  pointerRef: React.MutableRefObject<{ x: number; y: number }>;
}

const _mat4 = new THREE.Matrix4();
const _pos = new THREE.Vector3();
const _quat = new THREE.Quaternion();
const _scale = new THREE.Vector3();
const _euler = new THREE.Euler();

function detectSoftwareWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param) || '');
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return true;
  }
}

export function buildProceduralJetGroup(liveryColor = '#fdf1e1', accentColor = '#c8a464') {
  const jet = new THREE.Group();

  const bodyMat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(liveryColor),
    metalness: 0.25,
    roughness: 0.2,
    clearcoat: 1.0,
    clearcoatRoughness: 0.08,
  });

  const metalMat = new THREE.MeshStandardMaterial({
    color: 0xd0d6de,
    metalness: 0.92,
    roughness: 0.18,
  });

  const accentMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(accentColor),
    metalness: 0.85,
    roughness: 0.22,
  });

  const darkGlassMat = new THREE.MeshPhysicalMaterial({
    color: 0x0b1622,
    metalness: 0.15,
    roughness: 0.06,
    clearcoat: 1.0,
  });

  const engineCoreMat = new THREE.MeshStandardMaterial({
    color: 0xffaa44,
    emissive: 0xff7b22,
    emissiveIntensity: 1.6,
    roughness: 0.3,
  });

  // 1. Sculpted Fuselage via LatheGeometry (aligned along Z axis)
  const profile: THREE.Vector2[] = [
    new THREE.Vector2(0.0, 3.2),
    new THREE.Vector2(0.14, 3.05),
    new THREE.Vector2(0.32, 2.75),
    new THREE.Vector2(0.45, 2.2),
    new THREE.Vector2(0.49, 1.4),
    new THREE.Vector2(0.49, -1.3),
    new THREE.Vector2(0.41, -2.2),
    new THREE.Vector2(0.24, -2.9),
    new THREE.Vector2(0.07, -3.35),
    new THREE.Vector2(0.0, -3.45),
  ];
  const fuselageGeo = new THREE.LatheGeometry(profile, 32);
  fuselageGeo.rotateX(Math.PI / 2);
  const fuselage = new THREE.Mesh(fuselageGeo, bodyMat);
  fuselage.name = 'fuselage';
  fuselage.castShadow = true;
  fuselage.receiveShadow = true;
  jet.add(fuselage);

  // 2. Gold/Accent Livery Stripe Band along mid fuselage
  const stripeGeo = new THREE.CylinderGeometry(0.496, 0.496, 2.9, 28, 1, true);
  stripeGeo.rotateX(Math.PI / 2);
  const stripe = new THREE.Mesh(stripeGeo, accentMat);
  stripe.scale.set(1, 0.14, 1);
  stripe.position.set(0, -0.04, 0.05);
  stripe.name = 'liveryStripe';
  jet.add(stripe);

  // 3. Belly Wing Fairing
  const bellyGeo = new THREE.BoxGeometry(0.62, 0.24, 1.85);
  const belly = new THREE.Mesh(bellyGeo, bodyMat);
  belly.position.set(0, -0.4, -0.05);
  belly.name = 'bellyFairing';
  jet.add(belly);

  // 4. Swept Main Wings (ExtrudeGeometry with bevel)
  const wingShape = new THREE.Shape();
  wingShape.moveTo(0, 0.65);
  wingShape.lineTo(3.3, -1.05);
  wingShape.lineTo(3.35, -1.42);
  wingShape.lineTo(0, -0.82);
  wingShape.closePath();

  const wingExtrude = new THREE.ExtrudeGeometry(wingShape, {
    depth: 0.08,
    bevelEnabled: true,
    bevelThickness: 0.025,
    bevelSize: 0.03,
    bevelSegments: 2,
  });
  wingExtrude.rotateX(Math.PI / 2);

  const rightWing = new THREE.Mesh(wingExtrude, bodyMat);
  rightWing.position.set(0.24, -0.26, 0.18);
  rightWing.rotation.z = 0.045;
  rightWing.name = 'rightWing';
  rightWing.castShadow = true;
  jet.add(rightWing);

  const leftWing = new THREE.Mesh(wingExtrude, bodyMat);
  leftWing.scale.x = -1;
  leftWing.position.set(-0.24, -0.26, 0.18);
  leftWing.rotation.z = -0.045;
  leftWing.name = 'leftWing';
  leftWing.castShadow = true;
  jet.add(leftWing);

  // 5. Upturned Winglets
  const wingletGeo = new THREE.BoxGeometry(0.06, 0.56, 0.36);
  const rightWinglet = new THREE.Mesh(wingletGeo, accentMat);
  rightWinglet.position.set(3.56, -0.02, -1.04);
  rightWinglet.rotation.z = -0.28;
  rightWinglet.rotation.x = -0.22;
  rightWinglet.name = 'rightWinglet';
  jet.add(rightWinglet);

  const leftWinglet = new THREE.Mesh(wingletGeo, accentMat);
  leftWinglet.position.set(-3.56, -0.02, -1.04);
  leftWinglet.rotation.z = 0.28;
  leftWinglet.rotation.x = -0.22;
  leftWinglet.name = 'leftWinglet';
  jet.add(leftWinglet);

  // 6. Vertical T-Tail Stabilizer
  const vTailShape = new THREE.Shape();
  vTailShape.moveTo(0, 0);
  vTailShape.lineTo(1.25, 0);
  vTailShape.lineTo(1.75, 1.38);
  vTailShape.lineTo(1.25, 1.38);
  vTailShape.closePath();

  const vTailGeo = new THREE.ExtrudeGeometry(vTailShape, {
    depth: 0.07,
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.02,
  });
  vTailGeo.rotateY(Math.PI / 2);
  const vTail = new THREE.Mesh(vTailGeo, bodyMat);
  vTail.position.set(-0.035, 0.22, -2.02);
  vTail.name = 'verticalTail';
  vTail.castShadow = true;
  jet.add(vTail);

  // 7. Horizontal T-Tail Stabilizer
  const hTailShape = new THREE.Shape();
  hTailShape.moveTo(0, 0.25);
  hTailShape.lineTo(1.22, -0.4);
  hTailShape.lineTo(1.22, -0.62);
  hTailShape.lineTo(0, -0.35);
  hTailShape.closePath();
  const hTailGeo = new THREE.ExtrudeGeometry(hTailShape, {
    depth: 0.05,
    bevelEnabled: true,
    bevelThickness: 0.015,
    bevelSize: 0.015,
  });
  hTailGeo.rotateX(Math.PI / 2);
  const rightHTail = new THREE.Mesh(hTailGeo, accentMat);
  rightHTail.position.set(0, 1.56, -3.28);
  rightHTail.name = 'rightHTail';
  jet.add(rightHTail);
  const leftHTail = new THREE.Mesh(hTailGeo, accentMat);
  leftHTail.scale.x = -1;
  leftHTail.position.set(0, 1.56, -3.28);
  leftHTail.name = 'leftHTail';
  jet.add(leftHTail);

  // 8. Twin Rear-Mounted Turbofan Nacelles + Intake Cowls + Glowing Exhaust
  const nacelleGeo = new THREE.CylinderGeometry(0.24, 0.21, 1.35, 24);
  nacelleGeo.rotateX(Math.PI / 2);
  const intakeRingGeo = new THREE.TorusGeometry(0.22, 0.035, 14, 28);
  const coreGeo = new THREE.CircleGeometry(0.16, 20);
  const pylonGeo = new THREE.BoxGeometry(0.32, 0.08, 0.65);

  const engineGroup = new THREE.Group();
  engineGroup.name = 'engines';

  [-1, 1].forEach((side) => {
    const pod = new THREE.Group();
    pod.position.set(side * 0.72, 0.14, -1.72);

    const nacelle = new THREE.Mesh(nacelleGeo, bodyMat);
    const ring = new THREE.Mesh(intakeRingGeo, metalMat);
    ring.position.z = 0.67;

    const exhaust = new THREE.Mesh(coreGeo, engineCoreMat);
    exhaust.position.z = -0.68;
    exhaust.rotation.y = Math.PI;

    const pylon = new THREE.Mesh(pylonGeo, metalMat);
    pylon.position.set(-side * 0.22, -0.02, 0.05);

    pod.add(nacelle, ring, exhaust, pylon);
    engineGroup.add(pod);
  });
  jet.add(engineGroup);

  // 9. Cockpit Windscreen & Oval Cabin Windows
  const windshieldGeo = new THREE.CylinderGeometry(0.455, 0.455, 0.44, 24, 1, false, -0.85, 1.7);
  windshieldGeo.rotateX(Math.PI / 2);
  const windshield = new THREE.Mesh(windshieldGeo, darkGlassMat);
  windshield.position.set(0, 0.07, 2.48);
  windshield.scale.set(0.95, 0.85, 1);
  windshield.name = 'windshield';
  jet.add(windshield);

  const windowGeo = new THREE.BoxGeometry(0.03, 0.12, 0.16);
  for (let i = 0; i < 7; i++) {
    const zPos = 1.45 - i * 0.42;
    const wR = new THREE.Mesh(windowGeo, darkGlassMat);
    wR.position.set(0.485, 0.1, zPos);
    const wL = new THREE.Mesh(windowGeo, darkGlassMat);
    wL.position.set(-0.485, 0.1, zPos);
    jet.add(wR, wL);
  }

  return {
    jet,
    materials: { bodyMat, metalMat, accentMat, darkGlassMat, engineCoreMat },
  };
}

export const ThreeSkyCanvas: React.FC<ThreeSkyCanvasProps> = ({
  scrollProgressRef,
  pointerRef,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = detectSoftwareWebGL();
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      52,
      container.clientWidth / Math.max(1, container.clientHeight),
      0.1,
      240
    );
    camera.position.set(0, 1.5, 18);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTex = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    pmremGenerator.dispose();

    // Warm golden key + cool stratosphere hemisphere light
    const hemiLight = new THREE.HemisphereLight(0xbce2ff, 0x162535, 1.15);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xffe7c2, 2.3);
    keyLight.position.set(16, 18, 12);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x5eb2eb, 1.2);
    rimLight.position.set(-14, -6, -12);
    scene.add(rimLight);

    // 1. Distant 3D Private Jet escort flying gracefully high in the sky
    const { jet: escortJet } = buildProceduralJetGroup('#fdf1e1', '#c8a464');
    escortJet.scale.setScalar(0.55);
    escortJet.position.set(7.5, 4.2, -6);
    scene.add(escortJet);

    // 2. Instanced Volumetric Cloud Puffs (42 cloud nodes streaming smoothly)
    const cloudCount = 42;
    const cloudGeo = new THREE.DodecahedronGeometry(1, 1);
    const cloudMat = new THREE.MeshStandardMaterial({
      color: 0xfdf7ee,
      roughness: 0.96,
      metalness: 0.0,
      transparent: true,
      opacity: 0.24,
    });
    const clouds = new THREE.InstancedMesh(cloudGeo, cloudMat, cloudCount);
    clouds.frustumCulled = false;

    const cloudData = Array.from({ length: cloudCount }, (_, i) => ({
      x: Math.sin(i * 12.9898) * 32,
      y: ((i % 7) - 3) * 3.2 - 1.5,
      z: -i * 2.3,
      sx: 2.6 + (i % 5) * 1.05,
      sy: 0.78 + (i % 3) * 0.36,
      sz: 2.1 + (i % 4) * 0.85,
      speed: 3.4 + (i % 6) * 0.65,
    }));

    // 3. High-Altitude Wind / Starlight Streaks (70 instanced streaks)
    const streakCount = 70;
    const streakGeo = new THREE.BoxGeometry(0.032, 0.032, 2.2);
    const streakMat = new THREE.MeshBasicMaterial({
      color: 0xfdf1e1,
      transparent: true,
      opacity: 0.32,
    });
    const streaks = new THREE.InstancedMesh(streakGeo, streakMat, streakCount);
    streaks.frustumCulled = false;
    const streakData = Array.from({ length: streakCount }, (_, i) => ({
      x: (((i * 73) % 100) / 100 - 0.5) * 44,
      y: (((i * 37) % 100) / 100 - 0.5) * 24,
      z: -((i * 1.5) % 90),
      speed: 14 + (i % 8) * 3,
    }));

    scene.add(clouds, streaks);

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = Math.max(1, container.clientHeight);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    const clock = new THREE.Clock();
    let frameId = 0;
    let disposed = false;

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync?.(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      if (!sync) {
        frameId = window.setTimeout(cb, 80);
        return;
      }
      gl.flush();
      const poll = () => {
        if (disposed) return;
        const state = gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    const tick = () => {
      if (disposed) return;
      const dt = Math.min(clock.getDelta(), 0.05);
      const elapsed = clock.getElapsedTime();
      const p = scrollProgressRef.current; // 0 .. 1
      const mx = pointerRef.current.x;
      const my = pointerRef.current.y;

      // Increase 3D cloud and altitude streak presence once climbing past the bridge
      const skyBoost = THREE.MathUtils.smoothstep(p, 0.28, 0.72);
      cloudMat.opacity = 0.08 + skyBoost * 0.24;
      streakMat.opacity = 0.1 + skyBoost * 0.34;

      // Camera responds to pointer + altitude climb
      camera.position.x = THREE.MathUtils.damp(camera.position.x, mx * 3.2, 4, dt);
      camera.position.y = THREE.MathUtils.damp(
        camera.position.y,
        1.2 + p * 3.0 - my * 1.6,
        4,
        dt
      );
      camera.lookAt(0, p * 1.5, -8);

      // Distant 3D private jet banking high above the bridge once past hero
      if (!reduceMotion) {
        const orbitT = elapsed * 0.38;
        escortJet.position.x = THREE.MathUtils.lerp(-14, 14, (elapsed * 0.055) % 1);
        escortJet.position.y = 4.6 + Math.sin(orbitT) * 0.65;
        escortJet.position.z = -10 - Math.cos(orbitT) * 3;
        escortJet.rotation.y = Math.PI * 0.5;
        escortJet.rotation.z = -0.14 + Math.cos(orbitT) * 0.06;
        escortJet.rotation.x = 0.06;
        escortJet.visible = p > 0.22;
      }

      // Stream 3D Clouds
      const speedBoost = 1 + p * 2.2;
      for (let i = 0; i < cloudCount; i++) {
        const c = cloudData[i];
        if (!reduceMotion) {
          c.z += c.speed * speedBoost * dt;
          if (c.z > 22) c.z = -95;
        }
        _pos.set(c.x, c.y - p * 5, c.z);
        _euler.set(0, i * 0.4, 0);
        _quat.setFromEuler(_euler);
        _scale.set(c.sx, c.sy, c.sz);
        _mat4.compose(_pos, _quat, _scale);
        clouds.setMatrixAt(i, _mat4);
      }
      clouds.instanceMatrix.needsUpdate = true;

      // Stream Wind/Star Streaks
      for (let i = 0; i < streakCount; i++) {
        const st = streakData[i];
        if (!reduceMotion) {
          st.z += st.speed * speedBoost * dt;
          if (st.z > 20) st.z = -70;
        }
        _pos.set(st.x, st.y, st.z);
        _quat.identity();
        _scale.set(1, 1, 1 + p * 1.6);
        _mat4.compose(_pos, _quat, _scale);
        streaks.setMatrixAt(i, _mat4);
      }
      streaks.instanceMatrix.needsUpdate = true;

      renderer.render(scene, camera);

      if (!reduceMotion) {
        if (isSoftwareGl) afterDraw(tick);
        else frameId = requestAnimationFrame(tick);
      }
    };

    tick();

    return () => {
      disposed = true;
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      cloudGeo.dispose();
      cloudMat.dispose();
      streakGeo.dispose();
      streakMat.dispose();
      envTex.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [pointerRef, scrollProgressRef]);

  return <div ref={mountRef} className="three-sky-canvas" aria-hidden="true" />;
};
