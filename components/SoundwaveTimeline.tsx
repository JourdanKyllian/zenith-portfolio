'use client';

import { useEffect, useRef, type ReactNode } from 'react';

export interface TimelineItem {
  year: string;
  title: string;
  subtitle?: string;
  description: string;
  icon: ReactNode;
}

interface SoundwaveTimelineProps {
  items: TimelineItem[];
}

const VIEW_WIDTH = 120;
const CENTER_X = VIEW_WIDTH / 2;
const BAR_STEP = 7;
const IDLE_SPEED = 0.0014;
const SCROLL_PHASE_COUPLING = 0.028;
const ENERGY_DECAY = 0.93;
const MAX_ENERGY = 1;

/**
 * Composant interactif générant une frise chronologique asymétrique.
 * Modélise une véritable onde sonore symétrique (barres de fréquence audio)
 * animée doucement au repos et amplifiée physiquement par la vélocité du scroll.
 *
 * @param {SoundwaveTimelineProps} props - Liste ordonnée des événements du parcours.
 */
export default function SoundwaveTimeline({ items }: SoundwaveTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const barsPathRef = useRef<SVGPathElement>(null);
  const spineLineRef = useRef<SVGLineElement>(null);
  const heightRef = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    const svg = svgRef.current;
    const barsPath = barsPathRef.current;
    const spineLine = spineLineRef.current;
    if (!container || !svg || !barsPath || !spineLine) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const resizeObserver = new ResizeObserver((entries) => {
      const h = entries[0].contentRect.height;
      heightRef.current = h;
      svg.setAttribute('viewBox', `0 0 ${VIEW_WIDTH} ${h}`);
      spineLine.setAttribute('y2', h.toFixed(1));
      if (prefersReducedMotion) {
        drawAudioWaveform(barsPath, h, 0, 0, 0.15);
      }
    });
    resizeObserver.observe(container);

    if (prefersReducedMotion) {
      return () => resizeObserver.disconnect();
    }

    let isVisible = false;

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) start();
        else stop();
      },
      { rootMargin: '200px 0px' }
    );
    intersectionObserver.observe(container);

    let rafId: number | null = null;
    let lastTimestamp = 0;
    let lastScrollY = window.scrollY;
    let energy = 0;
    let time = 0;
    let scrollPhase = 0;

    const tick = (timestamp: number) => {
      const dt = lastTimestamp ? Math.min(timestamp - lastTimestamp, 50) : 16;
      lastTimestamp = timestamp;

      const scrollY = window.scrollY;
      const scrollDelta = scrollY - lastScrollY;
      lastScrollY = scrollY;
      const rawVelocity = Math.abs(scrollDelta) / Math.max(dt, 1);

      energy = Math.min(
        MAX_ENERGY,
        Math.max(rawVelocity * 0.18, energy * ENERGY_DECAY)
      );

      time += dt * IDLE_SPEED;
      scrollPhase += scrollDelta * SCROLL_PHASE_COUPLING;

      drawAudioWaveform(barsPath, heightRef.current, time, scrollPhase, energy);

      rafId = requestAnimationFrame(tick);
    };

    function start() {
      if (rafId === null) rafId = requestAnimationFrame(tick);
    }

    function stop() {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
        lastTimestamp = 0;
      }
    }

    return () => {
      stop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <svg
        ref={svgRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-full w-24 -translate-x-1/2 sm:w-32"
        viewBox={`0 0 ${VIEW_WIDTH} 100`}
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="wave-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-z-blue)" stopOpacity="0" />
            <stop offset="6%" stopColor="var(--color-z-blue)" stopOpacity="0.9" />
            <stop offset="94%" stopColor="var(--color-z-blue)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="var(--color-z-blue)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <line
          ref={spineLineRef}
          x1={CENTER_X}
          y1="0"
          x2={CENTER_X}
          y2="100"
          stroke="url(#wave-gradient)"
          strokeWidth="1.2"
          strokeOpacity="0.35"
        />
        <path
          ref={barsPathRef}
          fill="none"
          stroke="url(#wave-gradient)"
          strokeWidth="2.6"
          strokeLinecap="round"
          className="drop-shadow-[0_0_10px_rgba(0,123,255,0.4)]"
        />
      </svg>

      <ol className="relative flex flex-col gap-16 sm:gap-24">
        {items.map((item, index) => {
          const contentOnLeft = index % 2 === 0;
          return (
            <li
              key={item.year + item.title}
              className="grid grid-cols-2 items-start gap-6 sm:gap-20 lg:gap-24"
            >
              {contentOnLeft ? (
                <>
                  <div className="flex flex-col items-end gap-4">
                    <IconBadge icon={item.icon} side="left" />
                    <TimelineCard item={item} align="right" />
                  </div>
                  <div className="flex justify-start pt-2">
                    <YearLabel year={item.year} align="left" />
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-end pt-2">
                    <YearLabel year={item.year} align="right" />
                  </div>
                  <div className="flex flex-col items-start gap-4">
                    <IconBadge icon={item.icon} side="right" />
                    <TimelineCard item={item} align="left" />
                  </div>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function IconBadge({ icon, side }: { icon: ReactNode; side: 'left' | 'right' }) {
  const connector = (
    <span className="hidden h-px w-6 border-t border-dashed border-z-blue/40 sm:block sm:w-10" />
  );
  return (
    <div className="flex items-center gap-3">
      {side === 'left' ? (
        <>{icon}{connector}</>
      ) : (
        <>{connector}{icon}</>
      )}
    </div>
  );
}

function TimelineCard({ item, align }: { item: TimelineItem; align: 'left' | 'right' }) {
  return (
    <div className={align === 'right' ? 'text-right' : 'text-left'}>
      <h3 className="font-display text-base font-bold uppercase tracking-wide text-white sm:text-lg">
        {item.title}
      </h3>
      {item.subtitle && (
        <p className="mt-1 font-sub text-[11px] uppercase tracking-[0.15em] text-z-blue/80">
          {item.subtitle}
        </p>
      )}
      <p className="mt-3 font-body text-xs leading-relaxed text-z-muted sm:text-sm">
        {item.description}
      </p>
    </div>
  );
}

function YearLabel({ year, align }: { year: string; align: 'left' | 'right' }) {
  return (
    <span
      className={`font-display text-2xl font-bold uppercase leading-tight text-z-blue sm:text-4xl lg:text-5xl ${
        align === 'right' ? 'text-right' : 'text-left'
      }`}
    >
      {year}
    </span>
  );
}

/**
 * Calcule l'enveloppe d'une onde sonore symétrique (barres horizontales centrées)
 * en combinant plusieurs harmoniques audio et l'énergie issue du scroll.
 */
function drawAudioWaveform(
  path: SVGPathElement,
  height: number,
  time: number,
  scrollPhase: number,
  energy: number
) {
  if (height <= 0) return;

  const count = Math.max(4, Math.floor(height / BAR_STEP));
  const maxHalfWidth = 17 + energy * 27;
  const minHalfWidth = 2.5;
  let d = '';

  for (let i = 1; i < count; i++) {
    const y = i * BAR_STEP;
    const progress = y / height;
    const edgeFade = Math.min(1, progress / 0.06, (1 - progress) / 0.06);

    const h1 = Math.sin(y * 0.032 + time + scrollPhase * 0.4);
    const h2 = Math.sin(y * 0.078 - time * 1.4 + scrollPhase * 0.8);
    const h3 = Math.cos(y * 0.165 + time * 2.1 - scrollPhase * 1.2);
    const envelope = 0.55 + 0.45 * Math.sin(y * 0.011 - time * 0.6);

    const rawNormalized = Math.abs(h1 * 0.5 + h2 * 0.32 + h3 * 0.18);
    const halfWidth =
      (minHalfWidth + rawNormalized * envelope * maxHalfWidth) * edgeFade;

    const x1 = (CENTER_X - halfWidth).toFixed(1);
    const x2 = (CENTER_X + halfWidth).toFixed(1);
    const yStr = y.toFixed(1);

    d += `M${x1} ${yStr}L${x2} ${yStr}`;
  }

  path.setAttribute('d', d);
}
