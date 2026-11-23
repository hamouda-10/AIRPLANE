import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  AVIATION_ASSETS,
  CHARTER_HIGHLIGHTS,
  COPY,
  HighlightCardData,
  Lang,
  SCENE_LAYERS,
} from '../data/charterData';
import { ThreeSkyCanvas } from './ThreeSkyCanvas';

interface CinemaScrollStageProps {
  lang: Lang;
  onToggleLang: () => void;
  onOpenHighlightModal: (item: HighlightCardData) => void;
  onScrollToSection: (id: string) => void;
}

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const lerp = (start: number, end: number, amount: number) => start + (end - start) * amount;
const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = clamp((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
};

function segmentInOut(scrollY: number, inStart: number, inEnd: number, outStart: number, outEnd: number) {
  const enter = smoothstep(inStart, inEnd, scrollY);
  const exit = smoothstep(outStart, outEnd, scrollY);
  return {
    enter,
    exit,
    active: clamp(enter * (1 - exit)),
  };
}

const BASE_COUNT = CHARTER_HIGHLIGHTS.length;
const SLIDER_SETS = [0, 1, 2];

export const CinemaScrollStage: React.FC<CinemaScrollStageProps> = ({
  lang,
  onToggleLang,
  onOpenHighlightModal,
  onScrollToSection,
}) => {
  const t = COPY[lang];

  const cinemaRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const controlsRef = useRef<HTMLDivElement | null>(null);
  const airbusPanelRef = useRef<HTMLDivElement | null>(null);

  const scrollProgressRef = useRef<number>(0);
  const pointerRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const sliderReadyRef = useRef<boolean>(false);

  const [activeIndex, setActiveIndex] = useState<number>(BASE_COUNT);
  const activeIndexRef = useRef<number>(BASE_COUNT);
  const [isJumping, setIsJumping] = useState<boolean>(false);

  const applyTrackShift = useCallback((index: number) => {
    const track = trackRef.current;
    const cinema = cinemaRef.current;
    if (!track || !cinema) return;
    const firstCard = track.querySelector('.sight-card') as HTMLElement | null;
    if (!firstCard) return;
    const style = window.getComputedStyle(track);
    const gap = parseFloat(style.columnGap || style.gap || '20') || 20;
    const step = firstCard.getBoundingClientRect().width + gap;
    const shift = -(index * step);
    cinema.style.setProperty('--sights-shift', `${shift.toFixed(2)}px`);
  }, []);

  const stepSlider = useCallback(
    (delta: number) => {
      const next = activeIndexRef.current + delta;
      activeIndexRef.current = next;
      setIsJumping(false);
      setActiveIndex(next);
      applyTrackShift(next);
    },
    [applyTrackShift]
  );

  const handleTrackTransitionEnd = useCallback(
    (e: React.TransitionEvent<HTMLDivElement>) => {
      if (e.target !== trackRef.current || e.propertyName !== 'transform') return;
      const cur = activeIndexRef.current;
      if (cur < BASE_COUNT || cur >= BASE_COUNT * 2) {
        const wrapped = ((cur % BASE_COUNT) + BASE_COUNT) % BASE_COUNT + BASE_COUNT;
        activeIndexRef.current = wrapped;
        setIsJumping(true);
        setActiveIndex(wrapped);
        applyTrackShift(wrapped);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setIsJumping(false);
          });
        });
      }
    },
    [applyTrackShift]
  );

  useEffect(() => {
    const raf = requestAnimationFrame(() => applyTrackShift(activeIndexRef.current));
    const onResize = () => applyTrackShift(activeIndexRef.current);
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, [applyTrackShift]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!sliderReadyRef.current) return;
      if (e.key === 'ArrowRight') {
        stepSlider(1);
      } else if (e.key === 'ArrowLeft') {
        stepSlider(-1);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [stepSlider]);

  useEffect(() => {
    const cinema = cinemaRef.current;
    if (!cinema) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let smoothScroll = window.scrollY;
    let targetMx = 0;
    let targetMy = 0;
    let currentMx = 0;
    let currentMy = 0;
    let rafId = 0;

    const onPointerMove = (e: PointerEvent) => {
      if (reduceMotion) return;
      targetMx = (e.clientX / Math.max(1, window.innerWidth) - 0.5) * 2;
      targetMy = (e.clientY / Math.max(1, window.innerHeight) - 0.5) * 2;
    };

    const onPointerLeave = () => {
      targetMx = 0;
      targetMy = 0;
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerleave', onPointerLeave);

    const updateFrame = () => {
      const rect = cinema.getBoundingClientRect();
      const rawScroll = clamp(-rect.top, 0, 5300);

      if (reduceMotion) {
        smoothScroll = rawScroll;
        currentMx = 0;
        currentMy = 0;
      } else {
        smoothScroll += (rawScroll - smoothScroll) * 0.14;
        if (Math.abs(rawScroll - smoothScroll) < 0.15) smoothScroll = rawScroll;
        currentMx += (targetMx - currentMx) * 0.08;
        currentMy += (targetMy - currentMy) * 0.08;
      }

      pointerRef.current.x = currentMx;
      pointerRef.current.y = currentMy;
      scrollProgressRef.current = clamp(smoothScroll / 5300);

      // ================================================================
      // 1. EXACT BRIDGE-TO-SKY PARALLAX CHOREOGRAPHY (0 .. 3700px)
      // ================================================================
      const progress = clamp(smoothScroll / 2700);
      const introExit = smoothstep(90, 650, smoothScroll);
      const frame2 = segmentInOut(smoothScroll, 560, 900, 1300, 1620);
      const frame3 = segmentInOut(smoothScroll, 1760, 2140, 2540, 2700);

      const bridgeLaunch = smoothstep(920, 1520, smoothScroll);
      const splitPull = Math.pow(smoothstep(180, 1180, smoothScroll), 1.04);
      const bazaarReveal = smoothstep(1400, 2400, smoothScroll);
      const blurPhase = Math.max(frame2.active, frame3.active);
      const bazaarClear = smoothstep(1600, 2240, smoothScroll);

      const sightsEnter = Math.pow(smoothstep(2760, 3560, smoothScroll), 1.55);
      const sightsControlsEnter = smoothstep(3360, 3660, smoothScroll);

      // ================================================================
      // 2. POST-BRIDGE OPEN SKY + EMIRATES WIDEBODY FLIGHT (3680 .. 5300px)
      // ================================================================
      const skyClimb = smoothstep(3700, 4420, smoothScroll);
      const emiratesFadeIn = smoothstep(3660, 4080, smoothScroll);
      const emiratesFlight = clamp((smoothScroll - 3660) / (5300 - 3660));
      const skyPanelIn = smoothstep(4120, 4640, smoothScroll);

      // Back stack coordinates
      const backScale = lerp(0.76, 1.04, progress) + skyClimb * 0.14;
      const backX = currentMx * -18;
      const backY = lerp(0, -18, progress) + currentMy * -12 + skyClimb * 460;
      const backOpacity = clamp(1 - skyClimb * 0.96);

      const fourY = lerp(10, -2, progress);
      const fourScale = lerp(0.78, 1.02, progress);
      const bazaarY = lerp(20, 0, bazaarReveal) + skyClimb * 35;

      // Blur & shade tint
      const blurPx = blurPhase * 9 * (1 - skyClimb);
      const backBrightness = lerp(1, 0.86, blurPhase * (1 - skyClimb));
      const bazaarBlurPx = blurPhase * (1 - bazaarClear * 0.72) * 8 * (1 - skyClimb);
      const bazaarBrightness = lerp(1, 0.92, blurPhase * (1 - bazaarClear * 0.65) * (1 - skyClimb));
      const bazaarSaturation = lerp(1, 1.08, bazaarClear);

      const shadeTop = lerp(0, 0.24, blurPhase) * (1 - skyClimb);
      const shadeMid = lerp(0, 0.34, blurPhase) * (1 - skyClimb);
      const shadeBottom = lerp(0, 0.42, blurPhase) * (1 - skyClimb);
      const shadeZ = smoothScroll > 1680 ? 2 : 5;

      // Hero Title
      const titleY = lerp(0, -145, introExit) + currentMy * -10;
      const titleScale = lerp(1, 0.88, introExit);
      const titleOpacity = clamp(1 - introExit * 1.15);

      // Intro Copy
      const introCopyY = lerp(0, 62, introExit);
      const introCopyOpacity = clamp(1 - introExit * 1.25);

      // Bridge foreground
      const bridgeX = -50 + currentMx * 0.9;
      const bridgeY = lerp(0, -135, bridgeLaunch) + currentMy * 0.8;
      const bridgeScale = lerp(1.02, 1.38, smoothstep(0, 1200, smoothScroll));

      // Splitframes parting left & right
      const splitLeftX = -50 - splitPull * 66 + currentMx * 1.6;
      const splitLeftY = splitPull * 18 + currentMy * 1.1;
      const splitLeftScale = lerp(1, 1.28, splitPull);

      const splitRightX = -50 + splitPull * 66 + currentMx * 1.6;
      const splitRightY = splitPull * 18 + currentMy * 1.1;
      const splitRightScale = lerp(1, 1.28, splitPull);

      // Frame 2 close-up
      const frame2Opacity = frame2.active;
      const frame2Scale = lerp(1.06, 1.16, frame2.enter);
      const frame2Y = lerp(-46, -54, frame2.enter) - frame2.exit * 8;

      // Story Panels
      const panel2Y = lerp(58, 0, frame2.enter) - frame2.exit * 46;
      const panel3Y = lerp(58, 0, frame3.enter) - frame3.exit * 46;

      // Sights Slider (horizontal sweep into the open sky)
      const sightsEnterX = lerp(155, 0, sightsEnter);
      const sightsY = skyClimb * 180;
      const sightsControlsOpacity = sightsControlsEnter * (1 - smoothstep(3660, 4020, smoothScroll));
      const sightsVisible = sightsEnter > 0.005 && skyClimb < 0.92;

      // Emirates Transparent PNG flying LEFT -> RIGHT (matching its right-pointing nose)
      const emiratesX = lerp(-44, 20, emiratesFlight) + currentMx * 2.4;
      const emiratesY = lerp(18, -12, emiratesFlight) + currentMy * 1.5;
      const emiratesScale = lerp(0.56, 1.0, smoothstep(0, 0.7, emiratesFlight));
      const emiratesTilt = lerp(-7.2, -1.4, emiratesFlight);

      const style = cinema.style;
      style.setProperty('--mx', currentMx.toFixed(4));
      style.setProperty('--my', currentMy.toFixed(4));
      style.setProperty('--back-opacity', backOpacity.toFixed(4));
      style.setProperty('--back-x', `${backX.toFixed(2)}px`);
      style.setProperty('--back-y', `${backY.toFixed(2)}px`);
      style.setProperty('--back-scale', backScale.toFixed(4));
      style.setProperty('--four-y', `${fourY.toFixed(2)}vh`);
      style.setProperty('--four-scale', fourScale.toFixed(4));
      style.setProperty('--bazaar-y', `${bazaarY.toFixed(2)}vh`);
      style.setProperty('--blur-px', `${blurPx.toFixed(2)}px`);
      style.setProperty('--back-brightness', backBrightness.toFixed(4));
      style.setProperty('--bazaar-blur-px', `${bazaarBlurPx.toFixed(2)}px`);
      style.setProperty('--bazaar-brightness', bazaarBrightness.toFixed(4));
      style.setProperty('--bazaar-saturation', bazaarSaturation.toFixed(4));
      style.setProperty('--shade-z', String(shadeZ));
      style.setProperty('--shade-top-alpha', shadeTop.toFixed(4));
      style.setProperty('--shade-mid-alpha', shadeMid.toFixed(4));
      style.setProperty('--shade-bottom-alpha', shadeBottom.toFixed(4));
      style.setProperty('--title-y', `${titleY.toFixed(2)}px`);
      style.setProperty('--title-scale', titleScale.toFixed(4));
      style.setProperty('--title-opacity', titleOpacity.toFixed(4));
      style.setProperty('--intro-copy-y', `${introCopyY.toFixed(2)}px`);
      style.setProperty('--intro-copy-opacity', introCopyOpacity.toFixed(4));
      style.setProperty('--bridge-x', `${bridgeX.toFixed(2)}%`);
      style.setProperty('--bridge-y', `${bridgeY.toFixed(2)}vh`);
      style.setProperty('--bridge-scale', bridgeScale.toFixed(4));
      style.setProperty('--split-left-x', `${splitLeftX.toFixed(2)}%`);
      style.setProperty('--split-left-y', `${splitLeftY.toFixed(2)}vh`);
      style.setProperty('--split-left-scale', splitLeftScale.toFixed(4));
      style.setProperty('--split-right-x', `${splitRightX.toFixed(2)}%`);
      style.setProperty('--split-right-y', `${splitRightY.toFixed(2)}vh`);
      style.setProperty('--split-right-scale', splitRightScale.toFixed(4));
      style.setProperty('--frame2-opacity', frame2Opacity.toFixed(4));
      style.setProperty('--frame2-y', `${frame2Y.toFixed(2)}%`);
      style.setProperty('--frame2-scale', frame2Scale.toFixed(4));
      style.setProperty('--panel2-opacity', frame2.active.toFixed(4));
      style.setProperty('--panel2-y', `calc(-50% + ${panel2Y.toFixed(2)}px)`);
      style.setProperty('--panel3-opacity', frame3.active.toFixed(4));
      style.setProperty('--panel3-y', `calc(-50% + ${panel3Y.toFixed(2)}px)`);
      style.setProperty('--sights-visibility', sightsVisible ? 'visible' : 'hidden');
      style.setProperty('--sights-enter-x', `${sightsEnterX.toFixed(2)}vw`);
      style.setProperty('--sights-y', `${sightsY.toFixed(2)}px`);
      style.setProperty('--sights-controls-opacity', sightsControlsOpacity.toFixed(4));

      // Emirates sky flight variables
      style.setProperty('--emirates-opacity', emiratesFadeIn.toFixed(4));
      style.setProperty('--emirates-x', `${emiratesX.toFixed(2)}vw`);
      style.setProperty('--emirates-y', `${emiratesY.toFixed(2)}vh`);
      style.setProperty('--emirates-scale', emiratesScale.toFixed(4));
      style.setProperty('--emirates-tilt', `${emiratesTilt.toFixed(2)}deg`);
      style.setProperty('--sky-climb-tint', (skyClimb * 0.84).toFixed(4));
      style.setProperty('--sky-panel-opacity', skyPanelIn.toFixed(4));
      style.setProperty('--sky-panel-y', `${lerp(40, 0, skyPanelIn).toFixed(2)}px`);

      const controlsReady = sightsControlsOpacity > 0.55;
      sliderReadyRef.current = controlsReady;
      if (controlsRef.current) {
        controlsRef.current.classList.toggle('is-ready', controlsReady);
      }
      if (airbusPanelRef.current) {
        airbusPanelRef.current.classList.toggle('is-ready', skyPanelIn > 0.55);
      }

      rafId = requestAnimationFrame(updateFrame);
    };

    rafId = requestAnimationFrame(updateFrame);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerleave', onPointerLeave);
    };
  }, []);

  const scrollToOffset = (offsetPx: number) => {
    window.scrollTo({ top: offsetPx, behavior: 'smooth' });
  };

  const normalizedActiveMod = ((activeIndex % BASE_COUNT) + BASE_COUNT) % BASE_COUNT;

  return (
    <section ref={cinemaRef} id="cinema" className="cinema-scroll" aria-label={t.brandName}>
      <div className="stage">
        <div className="world">
          {/* 1. Sky / farthest background */}
          <img
            className="scene-img sky-img"
            src={SCENE_LAYERS.sky}
            alt=""
            aria-hidden="true"
            decoding="async"
            fetchPriority="high"
          />

          {/* 2. Transparent 3D WebGL Volumetric Clouds & Escort Jet */}
          <ThreeSkyCanvas scrollProgressRef={scrollProgressRef} pointerRef={pointerRef} />

          {/* 3. Site Header */}
          <header className="site-header">
            <a
              href="#cinema"
              className="site-logo"
              onClick={(e) => {
                e.preventDefault();
                scrollToOffset(0);
              }}
            >
              {t.brandName}
            </a>

            <nav className="site-nav" aria-label="Primary">
              <a
                href="#cinema"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToOffset(0);
                }}
              >
                {t.nav.intro}
              </a>
              <a
                href="#sky-flight"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToOffset(4550);
                }}
              >
                {t.nav.bridge}
              </a>
              <a
                href="#hangar-3d"
                onClick={(e) => {
                  e.preventDefault();
                  onScrollToSection('hangar-3d');
                }}
              >
                {t.nav.hangar}
              </a>
              <a
                href="#fleet"
                onClick={(e) => {
                  e.preventDefault();
                  onScrollToSection('fleet');
                }}
              >
                {t.nav.fleet}
              </a>
              <a
                href="#routes"
                onClick={(e) => {
                  e.preventDefault();
                  onScrollToSection('routes');
                }}
              >
                {t.nav.routes}
              </a>
            </nav>

            <button
              type="button"
              className="language-switcher"
              onClick={onToggleLang}
              aria-label="Toggle Arabic / English"
            >
              <span>{lang === 'ar' ? 'EN' : 'عربي'}</span>
            </button>
          </header>

          {/* 4. Back stack: Back-four glow + Charter Highlights Slider + Bazaar mid-back */}
          <div className="back-stack">
            <img
              className="scene-img back-img back-four"
              src={SCENE_LAYERS.backFour}
              alt=""
              aria-hidden="true"
              decoding="async"
            />

            <section className="sights-slider" aria-label={t.charter.sectionKicker}>
              <div
                ref={trackRef}
                className={`sights-track${isJumping ? ' is-jumping' : ''}`}
                onTransitionEnd={handleTrackTransitionEnd}
              >
                {SLIDER_SETS.map((setIdx) =>
                  CHARTER_HIGHLIGHTS.map((item, cardIdx) => {
                    const flatIndex = setIdx * BASE_COUNT + cardIdx;
                    const copy = item[lang];
                    const isActive = cardIdx === normalizedActiveMod;
                    return (
                      <article
                        key={`${setIdx}-${item.id}`}
                        className={`sight-card${isActive ? ' is-active' : ''}`}
                        role="button"
                        tabIndex={setIdx === 1 ? 0 : -1}
                        aria-label={copy.ariaLabel}
                        onClick={() => {
                          activeIndexRef.current = flatIndex;
                          setIsJumping(false);
                          setActiveIndex(flatIndex);
                          applyTrackShift(flatIndex);
                          onOpenHighlightModal(item);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            onOpenHighlightModal(item);
                          }
                        }}
                      >
                        <span className="sight-kicker">{copy.kicker}</span>
                        <img
                          className="sight-pin"
                          src={item.pin}
                          alt=""
                          aria-hidden="true"
                          decoding="async"
                        />
                        <h3>{copy.title}</h3>
                        <p>{copy.description}</p>
                      </article>
                    );
                  })
                )}
              </div>
            </section>

            <img
              className="scene-img back-img back-bazaar"
              src={SCENE_LAYERS.bazaar}
              alt=""
              aria-hidden="true"
              decoding="async"
            />
          </div>

          {/* 5. Slider Arrow Controls */}
          <div ref={controlsRef} className="sights-controls" aria-label="Slider controls">
            <button
              type="button"
              className="sight-nav sight-prev"
              aria-label="Previous aircraft card"
              onClick={() => stepSlider(-1)}
            >
              ←
            </button>
            <button
              type="button"
              className="sight-nav sight-next"
              aria-label="Next aircraft card"
              onClick={() => stepSlider(1)}
            >
              →
            </button>
          </div>

          {/* 6. Hero Display Title */}
          <h1 className="hero-title">{t.heroTitle}</h1>

          {/* 7. Splitframe LEFT & RIGHT */}
          <img
            className="scene-img splitframe-img splitframe-left"
            src={SCENE_LAYERS.splitLeft}
            alt=""
            aria-hidden="true"
            decoding="async"
          />
          <img
            className="scene-img splitframe-img splitframe-right"
            src={SCENE_LAYERS.splitRight}
            alt=""
            aria-hidden="true"
            decoding="async"
          />

          {/* 8. Bridge Foreground */}
          <img
            className="scene-img bridge-img"
            src={SCENE_LAYERS.bridge}
            alt=""
            aria-hidden="true"
            decoding="async"
            fetchPriority="high"
          />

          {/* 9. Frame-two close-up */}
          <img
            className="scene-img frame-two-img"
            src={SCENE_LAYERS.frameTwo}
            alt=""
            aria-hidden="true"
            decoding="async"
          />

          {/* 10. Blue atmospheric tint shade */}
          <div className="shade" aria-hidden="true" />

          {/* 11. POST-BRIDGE EMIRATES AIRCRAFT FLYING IN THE OPEN SKY */}
          <div className="emirates-sky-layer">
            <div className="sky-altitude-veil" aria-hidden="true" />

            <div className="emirates-fly-wrap">
              <div className="emirates-float-bob">
                <div className="emirates-contrails" aria-hidden="true">
                  <span className="emirates-contrail-line" />
                  <span className="emirates-contrail-line" />
                </div>
                <img
                  className="emirates-cutout-img"
                  src={AVIATION_ASSETS.emiratesCutout}
                  alt={
                    lang === 'ar'
                      ? 'طائرة الإمارات تحلّق في السماء المفتوحة بعد الكوبري'
                      : 'Emirates widebody aircraft flying across the open sky above the bridge'
                  }
                  decoding="async"
                />
              </div>
            </div>

            <div ref={airbusPanelRef} className="airbus-sky-panel">
              <p className="airbus-kicker">{t.emiratesSky.kicker}</p>
              <h2 className="airbus-headline">{t.emiratesSky.headline}</h2>
              <p className="airbus-subline">{t.emiratesSky.subline}</p>
              <div className="airbus-telemetry">
                {t.emiratesSky.telemetry.map((item, idx) => (
                  <React.Fragment key={item}>
                    {idx > 0 && <span aria-hidden="true">·</span>}
                    <span>{item}</span>
                  </React.Fragment>
                ))}
              </div>
              <div className="airbus-cta-row">
                <button
                  type="button"
                  className="hero-btn-primary"
                  onClick={() => onScrollToSection('hangar-3d')}
                >
                  {t.emiratesSky.ctaPrimary}
                </button>
                <button
                  type="button"
                  className="hero-btn-secondary"
                  onClick={() => onScrollToSection('fleet')}
                >
                  {t.emiratesSky.ctaSecondary}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Intro Copy */}
        <section className="intro-copy">
          <p>{t.introText}</p>
          <div className="hero-tags">
            {t.heroTags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </section>

        {/* Story Panel 2: Bridge Ascent */}
        <section className="story-panel story-panel-bridge">
          <h2>{t.bridgePanel.title}</h2>
          <p>{t.bridgePanel.body}</p>
          <dl className="facts">
            <div>
              <dt>{t.bridgePanel.fact1Num}</dt>
              <dd>{t.bridgePanel.fact1Desc}</dd>
            </div>
            <div>
              <dt>{t.bridgePanel.fact2Num}</dt>
              <dd>{t.bridgePanel.fact2Desc}</dd>
            </div>
          </dl>
        </section>

        {/* Story Panel 3: Global Capitals */}
        <section className="story-panel story-panel-bazaar">
          <h2>{t.bazaarPanel.title}</h2>
          <p>{t.bazaarPanel.body}</p>
          <button
            type="button"
            className="note-button"
            onClick={() => onScrollToSection('hangar-3d')}
          >
            <span aria-hidden="true">✦</span>
            <span>{t.bazaarPanel.cta}</span>
          </button>
        </section>
      </div>
    </section>
  );
};
