import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLOBAL_AIRPORTS, Lang } from '../data/charterData';

interface ThreeGlobeRoutesProps {
  lang: Lang;
  originCode: string;
  destinationCode: string;
  onSelectHub: (code: string) => void;
}

const EARTH_RADIUS = 2.2;

function latLonToVec3(lat: number, lon: number, radius = EARTH_RADIUS): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

function createProceduralEarthTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    // Deep ocean gradient
    const grad = ctx.createLinearGradient(0, 0, 0, 512);
    grad.addColorStop(0, '#0c1c2c');
    grad.addColorStop(0.5, '#0b1826');
    grad.addColorStop(1, '#091420');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 512);

    // Subtle graticule lines
    ctx.strokeStyle = 'rgba(253, 241, 225, 0.08)';
    ctx.lineWidth = 1;
    for (let x = 0; x <= 1024; x += 64) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 512);
      ctx.stroke();
    }
    for (let y = 0; y <= 512; y += 64) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(1024, y);
      ctx.stroke();
    }

    // Equirectangular stylized continents
    ctx.fillStyle = '#1b2c3a';
    ctx.strokeStyle = 'rgba(200, 164, 100, 0.35)';
    ctx.lineWidth = 1.5;

    const landPolygons: [number, number][][] = [
      // North America
      [[105, 85], [220, 68], [320, 105], [305, 178], [248, 212], [218, 242], [180, 218], [150, 175]],
      // South America
      [[265, 248], [338, 258], [375, 310], [348, 392], [305, 442], [285, 405], [275, 315]],
      // Europe
      [[472, 85], [562, 76], [595, 120], [568, 158], [516, 160], [478, 136]],
      // Africa
      [[472, 172], [568, 170], [622, 228], [600, 322], [552, 382], [512, 360], [496, 280], [468, 232]],
      // Middle East & Asia
      [[568, 156], [652, 142], [755, 100], [872, 108], [912, 168], [862, 230], [798, 258], [732, 240], [672, 218], [610, 218]],
      // Australia
      [[816, 320], [908, 316], [935, 372], [886, 406], [820, 382]],
    ];

    landPolygons.forEach((poly) => {
      ctx.beginPath();
      poly.forEach(([px, py], i) => {
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    });
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

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

export const ThreeGlobeRoutes: React.FC<ThreeGlobeRoutesProps> = ({
  lang,
  originCode,
  destinationCode,
  onSelectHub,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const routeRef = useRef({ originCode, destinationCode });
  const selectHubRef = useRef(onSelectHub);
  selectHubRef.current = onSelectHub;

  useEffect(() => {
    routeRef.current = { originCode, destinationCode };
  }, [originCode, destinationCode]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = detectSoftwareWebGL();
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#090e13');

    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / Math.max(1, container.clientHeight),
      0.1,
      100
    );
    camera.position.set(0, 1.8, 6.2);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;
    controls.enablePan = false;
    controls.minDistance = 3.8;
    controls.maxDistance = 9.5;
    controls.autoRotate = false;

    const ambient = new THREE.AmbientLight(0xd9e8ff, 0.9);
    scene.add(ambient);
    const sun = new THREE.DirectionalLight(0xffe7bd, 1.8);
    sun.position.set(6, 4, 6);
    scene.add(sun);

    // Globe Group
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    const earthTex = createProceduralEarthTexture();
    earthTex.anisotropy = renderer.capabilities.getMaxAnisotropy();

    const earthGeo = new THREE.SphereGeometry(EARTH_RADIUS, 48, 48);
    const earthMat = new THREE.MeshStandardMaterial({
      map: earthTex,
      roughness: 0.68,
      metalness: 0.15,
    });
    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    globeGroup.add(earthMesh);

    // Atmospheric rim shell
    const atmosGeo = new THREE.SphereGeometry(EARTH_RADIUS * 1.045, 48, 48);
    const atmosMat = new THREE.MeshBasicMaterial({
      color: 0x4ea3e0,
      transparent: true,
      opacity: 0.12,
      side: THREE.BackSide,
    });
    globeGroup.add(new THREE.Mesh(atmosGeo, atmosMat));

    // Airport Beacon Pins
    const pinGeo = new THREE.SphereGeometry(0.055, 16, 16);
    const pinMeshes: THREE.Mesh[] = [];
    const pinMaterials: Record<string, THREE.MeshBasicMaterial> = {};

    GLOBAL_AIRPORTS.forEach((ap) => {
      const mat = new THREE.MeshBasicMaterial({ color: 0xfdf1e1 });
      const pin = new THREE.Mesh(pinGeo, mat);
      pin.position.copy(latLonToVec3(ap.lat, ap.lon, EARTH_RADIUS + 0.03));
      pin.userData.code = ap.code;
      globeGroup.add(pin);
      pinMeshes.push(pin);
      pinMaterials[ap.code] = mat;
    });

    // Dynamic Flight Arc + Animated Miniature 3D Jet
    let arcMesh: THREE.Mesh | null = null;
    let activeCurve: THREE.QuadraticBezierCurve3 | null = null;

    const miniJetGroup = new THREE.Group();
    const miniBody = new THREE.Mesh(
      new THREE.ConeGeometry(0.055, 0.22, 10),
      new THREE.MeshBasicMaterial({ color: 0xfdf1e1 })
    );
    miniBody.rotation.x = Math.PI / 2;
    const miniWing = new THREE.Mesh(
      new THREE.BoxGeometry(0.24, 0.015, 0.06),
      new THREE.MeshBasicMaterial({ color: 0xc8a464 })
    );
    miniJetGroup.add(miniBody, miniWing);
    globeGroup.add(miniJetGroup);

    const rebuildArc = (oCode: string, dCode: string) => {
      if (arcMesh) {
        arcMesh.geometry.dispose();
        (arcMesh.material as THREE.Material).dispose();
        globeGroup.remove(arcMesh);
        arcMesh = null;
      }

      const o = GLOBAL_AIRPORTS.find((a) => a.code === oCode) || GLOBAL_AIRPORTS[0];
      const d = GLOBAL_AIRPORTS.find((a) => a.code === dCode) || GLOBAL_AIRPORTS[1];

      GLOBAL_AIRPORTS.forEach((ap) => {
        const isEnd = ap.code === o.code || ap.code === d.code;
        pinMaterials[ap.code].color.set(isEnd ? 0xc8a464 : 0xfdf1e1);
      });

      const p1 = latLonToVec3(o.lat, o.lon, EARTH_RADIUS + 0.03);
      const p2 = latLonToVec3(d.lat, d.lon, EARTH_RADIUS + 0.03);
      const dist = p1.distanceTo(p2);
      const mid = p1.clone().add(p2).multiplyScalar(0.5);
      const lift = EARTH_RADIUS + Math.min(1.15, Math.max(0.25, dist * 0.32));
      mid.normalize().multiplyScalar(lift);

      activeCurve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
      const tubeGeo = new THREE.TubeGeometry(activeCurve, 52, 0.018, 8, false);
      const tubeMat = new THREE.MeshBasicMaterial({
        color: 0xc8a464,
        transparent: true,
        opacity: 0.92,
      });
      arcMesh = new THREE.Mesh(tubeGeo, tubeMat);
      globeGroup.add(arcMesh);
    };

    let lastPair = '';

    // Raycaster for clicking airports on the 3D globe
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let pointerDownPos = { x: 0, y: 0 };

    const onPointerDown = (e: PointerEvent) => {
      pointerDownPos = { x: e.clientX, y: e.clientY };
    };

    const onPointerUp = (e: PointerEvent) => {
      if (
        Math.hypot(e.clientX - pointerDownPos.x, e.clientY - pointerDownPos.y) > 6
      ) {
        return; // Ignore orbit drags
      }
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(pinMeshes, false);
      if (hits.length > 0) {
        const code = hits[0].object.userData.code as string;
        if (code) selectHubRef.current(code);
      }
    };

    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointerup', onPointerUp);

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
    let flightT = 0;

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

    const _jetPos = new THREE.Vector3();
    const _jetNext = new THREE.Vector3();

    const tick = () => {
      if (disposed) return;
      const dt = Math.min(clock.getDelta(), 0.05);

      const pairKey = `${routeRef.current.originCode}->${routeRef.current.destinationCode}`;
      if (pairKey !== lastPair) {
        lastPair = pairKey;
        rebuildArc(routeRef.current.originCode, routeRef.current.destinationCode);
      }

      if (!reduceMotion) {
        globeGroup.rotation.y += dt * 0.085;
      }

      if (activeCurve) {
        if (!reduceMotion) {
          flightT = (flightT + dt * 0.24) % 1;
        } else {
          flightT = 0.5;
        }
        activeCurve.getPointAt(flightT, _jetPos);
        activeCurve.getPointAt(Math.min(0.999, flightT + 0.015), _jetNext);
        miniJetGroup.position.copy(_jetPos);
        miniJetGroup.lookAt(_jetNext);
      }

      controls.update();
      renderer.render(scene, camera);

      if (isSoftwareGl) afterDraw(tick);
      else frameId = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      disposed = true;
      window.removeEventListener('resize', onResize);
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointerup', onPointerUp);
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      controls.dispose();
      earthGeo.dispose();
      earthMat.dispose();
      earthTex.dispose();
      atmosGeo.dispose();
      atmosMat.dispose();
      pinGeo.dispose();
      Object.values(pinMaterials).forEach((m) => m.dispose());
      if (arcMesh) {
        arcMesh.geometry.dispose();
        (arcMesh.material as THREE.Material).dispose();
      }
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative h-[360px] w-full overflow-hidden rounded-2xl border border-[#fdf1e1]/12 bg-[#090e13] md:h-[420px]">
      <div ref={mountRef} className="h-full w-full cursor-grab active:cursor-grabbing" />
      <div className="pointer-events-none absolute bottom-3 left-3 rounded-lg bg-[#090e13]/85 px-3 py-1.5 text-[11px] font-medium text-[#fdf1e1]/80">
        {lang === 'ar'
          ? 'اسحب لتدوير الكرة الأرضية · اضغط على أي نقطة مطار'
          : 'Drag to spin 3D globe · Click any airport beacon'}
      </div>
    </div>
  );
};
