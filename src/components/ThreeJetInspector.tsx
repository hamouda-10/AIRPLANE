import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { COPY, Lang } from '../data/charterData';
import { buildProceduralJetGroup } from './ThreeSkyCanvas';

interface ThreeJetInspectorProps {
  lang: Lang;
}

type LiveryKey = 'pearl' | 'obsidian' | 'emirates' | 'silver';
type CameraPreset = 'hero' | 'engine' | 'top' | 'nose';

const LIVERY_PALETTES: Record<LiveryKey, { body: string; accent: string }> = {
  pearl: { body: '#fdf1e1', accent: '#c8a464' },
  obsidian: { body: '#191e24', accent: '#d6ae65' },
  emirates: { body: '#f7f8fa', accent: '#b8292f' },
  silver: { body: '#aeb8c4', accent: '#1f2c3c' },
};

const CAMERA_PRESETS: Record<CameraPreset, { pos: [number, number, number]; target: [number, number, number] }> = {
  hero: { pos: [6.4, 2.5, 6.8], target: [0, 0.1, 0] },
  engine: { pos: [-3.4, 1.35, -4.1], target: [0, 0.25, -1.7] },
  top: { pos: [0.1, 9.2, 0.4], target: [0, 0, -0.2] },
  nose: { pos: [2.6, 1.15, 5.2], target: [0, 0.1, 1.8] },
};

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

export const ThreeJetInspector: React.FC<ThreeJetInspectorProps> = ({ lang }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [livery, setLivery] = useState<LiveryKey>('pearl');
  const [exploded, setExploded] = useState<number>(0);
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('hero');
  const [hudOpen, setHudOpen] = useState<boolean>(true);

  const explodedTargetRef = useRef<number>(0);
  const liveryRef = useRef<LiveryKey>('pearl');
  const presetGoalRef = useRef<{
    active: boolean;
    pos: THREE.Vector3;
    target: THREE.Vector3;
  }>({
    active: false,
    pos: new THREE.Vector3(...CAMERA_PRESETS.hero.pos),
    target: new THREE.Vector3(...CAMERA_PRESETS.hero.target),
  });

  const t = COPY[lang].hangar3d;
  const isRtl = lang === 'ar';

  useEffect(() => {
    explodedTargetRef.current = exploded;
  }, [exploded]);

  useEffect(() => {
    liveryRef.current = livery;
  }, [livery]);

  const selectPreset = (key: CameraPreset) => {
    setCameraPreset(key);
    const p = CAMERA_PRESETS[key];
    presetGoalRef.current.pos.set(...p.pos);
    presetGoalRef.current.target.set(...p.target);
    presetGoalRef.current.active = true;
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = detectSoftwareWebGL();
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#0a1016');
    scene.fog = new THREE.FogExp2(0x0a1016, 0.032);

    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / Math.max(1, container.clientHeight),
      0.1,
      100
    );
    camera.position.set(...CAMERA_PRESETS.hero.pos);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTex = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    pmremGenerator.dispose();

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;
    controls.minDistance = 4.2;
    controls.maxDistance = 14.5;
    controls.maxPolarAngle = Math.PI * 0.56;
    controls.autoRotate = !isSoftwareGl && !reduceMotion;
    controls.autoRotateSpeed = 0.75;
    controls.target.set(0, 0.1, 0);

    controls.addEventListener('start', () => {
      presetGoalRef.current.active = false;
    });

    // Studio Hangar 3-Point Lighting
    const hemi = new THREE.HemisphereLight(0xbbe0ff, 0x161b22, 0.85);
    scene.add(hemi);

    const key = new THREE.DirectionalLight(0xfff0d6, 2.3);
    key.position.set(7, 10, 6);
    key.castShadow = !isSoftwareGl;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.bias = -0.0005;
    scene.add(key);

    const rim = new THREE.DirectionalLight(0x4ea3e0, 1.25);
    rim.position.set(-7, 4, -7);
    scene.add(rim);

    // Hangar Floor Ring + Radial Contact Shadow Disc
    const floorGeo = new THREE.CircleGeometry(14, 64);
    floorGeo.rotateX(-Math.PI / 2);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x0e151d,
      roughness: 0.35,
      metalness: 0.45,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.position.y = -1.12;
    floor.receiveShadow = true;
    scene.add(floor);

    const ringGeo = new THREE.RingGeometry(4.15, 4.22, 64);
    ringGeo.rotateX(-Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xc8a464,
      transparent: true,
      opacity: 0.45,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.y = -1.1;
    scene.add(ring);

    // Composite 11-Part Jet Assembly
    const { jet, materials } = buildProceduralJetGroup(
      LIVERY_PALETTES.pearl.body,
      LIVERY_PALETTES.pearl.accent
    );
    jet.position.y = 0.08;
    scene.add(jet);

    // Capture resting positions for smooth exploded-view interpolation
    const rightWing = jet.getObjectByName('rightWing');
    const leftWing = jet.getObjectByName('leftWing');
    const rightWinglet = jet.getObjectByName('rightWinglet');
    const leftWinglet = jet.getObjectByName('leftWinglet');
    const vTail = jet.getObjectByName('verticalTail');
    const rightHTail = jet.getObjectByName('rightHTail');
    const leftHTail = jet.getObjectByName('leftHTail');
    const engines = jet.getObjectByName('engines');
    const windshield = jet.getObjectByName('windshield');

    const basePos = {
      rw: rightWing?.position.clone() || new THREE.Vector3(),
      lw: leftWing?.position.clone() || new THREE.Vector3(),
      rwl: rightWinglet?.position.clone() || new THREE.Vector3(),
      lwl: leftWinglet?.position.clone() || new THREE.Vector3(),
      vt: vTail?.position.clone() || new THREE.Vector3(),
      rht: rightHTail?.position.clone() || new THREE.Vector3(),
      lht: leftHTail?.position.clone() || new THREE.Vector3(),
      eng: engines?.position.clone() || new THREE.Vector3(),
      ws: windshield?.position.clone() || new THREE.Vector3(),
    };

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
    let currentExploded = 0;
    let activeLivery: LiveryKey = 'pearl';

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

      // Update livery smoothly if changed
      if (activeLivery !== liveryRef.current) {
        activeLivery = liveryRef.current;
        const pal = LIVERY_PALETTES[activeLivery];
        materials.bodyMat.color.set(pal.body);
        materials.accentMat.color.set(pal.accent);
      }

      // Smoothly damp exploded view separation
      currentExploded = THREE.MathUtils.damp(
        currentExploded,
        explodedTargetRef.current,
        6,
        dt
      );
      const ex = currentExploded;
      if (rightWing) rightWing.position.set(basePos.rw.x + ex * 1.1, basePos.rw.y - ex * 0.25, basePos.rw.z);
      if (leftWing) leftWing.position.set(basePos.lw.x - ex * 1.1, basePos.lw.y - ex * 0.25, basePos.lw.z);
      if (rightWinglet) rightWinglet.position.set(basePos.rwl.x + ex * 1.5, basePos.rwl.y + ex * 0.35, basePos.rwl.z);
      if (leftWinglet) leftWinglet.position.set(basePos.lwl.x - ex * 1.5, basePos.lwl.y + ex * 0.35, basePos.lwl.z);
      if (vTail) vTail.position.set(basePos.vt.x, basePos.vt.y + ex * 0.8, basePos.vt.z - ex * 0.45);
      if (rightHTail) rightHTail.position.set(basePos.rht.x + ex * 0.45, basePos.rht.y + ex * 1.05, basePos.rht.z - ex * 0.55);
      if (leftHTail) leftHTail.position.set(basePos.lht.x - ex * 0.45, basePos.lht.y + ex * 1.05, basePos.lht.z - ex * 0.55);
      if (engines) engines.position.set(basePos.eng.x, basePos.eng.y + ex * 0.55, basePos.eng.z - ex * 0.6);
      if (windshield) windshield.position.set(basePos.ws.x, basePos.ws.y + ex * 0.45, basePos.ws.z + ex * 0.55);

      // Gentle hover breathing
      if (!reduceMotion) {
        jet.position.y = 0.08 + Math.sin(elapsed * 1.5) * 0.045;
      }

      // Smooth camera preset transition
      if (presetGoalRef.current.active) {
        camera.position.lerp(presetGoalRef.current.pos, 1 - Math.exp(-5.5 * dt));
        controls.target.lerp(presetGoalRef.current.target, 1 - Math.exp(-5.5 * dt));
        if (camera.position.distanceTo(presetGoalRef.current.pos) < 0.04) {
          presetGoalRef.current.active = false;
        }
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
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      controls.dispose();
      floorGeo.dispose();
      floorMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      envTex.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <section
      id="hangar-3d"
      dir={isRtl ? 'rtl' : 'ltr'}
      className="relative z-20 border-t border-[#fdf1e1]/10 bg-[#0a1016] py-20 md:py-24"
    >
      <div className="mx-auto max-w-[1320px] px-6 md:px-10">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-widest text-[#c8a464] uppercase">
            {t.kicker}
          </p>
          <h2 className="font-editorial-display mt-3 text-4xl font-medium leading-tight text-[#fdf1e1] md:text-5xl">
            {t.title}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-[#fdf1e1]/75">{t.subtitle}</p>
        </div>

        {/* Unobstructed 3D Hangar Viewport + Collapsible Bottom Dock */}
        <div className="relative mt-8 h-[500px] w-full overflow-hidden rounded-3xl border border-[#fdf1e1]/14 bg-[#0a1016] md:h-[580px]">
          <div ref={mountRef} className="h-full w-full cursor-grab active:cursor-grabbing" />

          {/* Unified Collapsible Bottom Dock (solid rgba, NO backdrop-blur over WebGL) */}
          <div className="pointer-events-none absolute inset-x-0 bottom-4 flex flex-col items-center px-4">
            <button
              type="button"
              onClick={() => setHudOpen((v) => !v)}
              className="pointer-events-auto mb-2 inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[#fdf1e1]/20 bg-[#0c131a]/90 px-4 py-1.5 text-xs font-medium text-[#fdf1e1] hover:border-[#c8a464]"
            >
              {hudOpen ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronUp className="h-3.5 w-3.5" />}
              <span>{hudOpen ? t.hideHud : t.showHud}</span>
            </button>

            {hudOpen && (
              <div className="pointer-events-auto flex w-full max-w-[920px] flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#fdf1e1]/16 bg-[#0c131a]/92 px-5 py-3.5 text-xs text-[#fdf1e1] shadow-2xl">
                {/* Livery Selector */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium text-[#fdf1e1]/60">{t.liveryLabel}:</span>
                  {(Object.keys(LIVERY_PALETTES) as LiveryKey[]).map((key) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setLivery(key)}
                      className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 font-medium transition ${
                        livery === key
                          ? 'bg-[#fdf1e1] text-[#111411]'
                          : 'bg-[#fdf1e1]/8 text-[#fdf1e1]/85 hover:bg-[#fdf1e1]/16'
                      }`}
                    >
                      <span
                        className="h-2.5 w-2.5 rounded-full border border-white/30"
                        style={{ backgroundColor: LIVERY_PALETTES[key].body }}
                      />
                      <span>{t.liveries[key]}</span>
                    </button>
                  ))}
                </div>

                {/* Exploded View Range Slider */}
                <label className="flex items-center gap-2.5">
                  <span className="font-medium text-[#fdf1e1]/60 whitespace-nowrap">
                    {t.explodedLabel}:
                  </span>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={exploded}
                    onChange={(e) => setExploded(parseFloat(e.target.value))}
                    className="h-1.5 w-24 cursor-pointer accent-[#c8a464]"
                  />
                </label>

                {/* Camera Viewpoint Presets */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="font-medium text-[#fdf1e1]/60">{t.cameraLabel}:</span>
                  {(Object.keys(CAMERA_PRESETS) as CameraPreset[]).map((key) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => selectPreset(key)}
                      className={`cursor-pointer rounded-lg px-2.5 py-1.5 font-medium transition ${
                        cameraPreset === key
                          ? 'bg-[#c8a464] text-[#111411]'
                          : 'bg-[#fdf1e1]/8 text-[#fdf1e1]/80 hover:bg-[#fdf1e1]/16'
                      }`}
                    >
                      {t.cameras[key]}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
